import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Ensure local uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Multer File Upload Filter
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeAllowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype);
    if (allowedTypes.includes(ext) && mimeAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, JPG, JPEG, PNG are allowed.'));
    }
  }
});

// GET /api/medical-records: List all medical records for the current patient
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: patientId } = req.user!;
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { uploadedAt: 'desc' }
    });
    return res.json({ success: true, records });
  } catch (error: any) {
    console.error('Fetch records error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/medical-records: Upload a new medical record
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id: patientId } = req.user!;
      const { reportName } = req.body;
      const file = req.file;

      if (!reportName || reportName.trim() === '') {
        if (file) {
          fs.unlinkSync(file.path);
        }
        return res.status(400).json({ error: 'Report name is mandatory.' });
      }

      if (!file) {
        return res.status(400).json({ error: 'Please select a file to upload.' });
      }

      // Generate dynamic file URL path
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

      // Create record in DB
      const record = await prisma.medicalRecord.create({
        data: {
          patientId,
          reportName,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileUrl
        }
      });

      // Create in-app notification for the patient
      await prisma.notification.create({
        data: {
          userId: patientId,
          type: 'LAB_REPORT',
          message: `Medical record "${reportName}" has been successfully uploaded to your vault.`
        }
      });

      return res.status(201).json({ success: true, record });
    } catch (error: any) {
      console.error('Upload records error:', error);
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {}
      }
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
});

// DELETE /api/medical-records/:id: Delete medical record by ID
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: patientId } = req.user!;
    const recordId = parseInt(req.params.id);

    if (isNaN(recordId)) {
      return res.status(400).json({ error: 'Invalid record ID.' });
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId }
    });

    if (!record) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    if (record.patientId !== patientId) {
      return res.status(403).json({ error: 'Unauthorized to delete this record.' });
    }

    // Delete the file from local storage
    if (record.fileUrl) {
      const filename = record.fileUrl.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete from DB
    await prisma.medicalRecord.delete({
      where: { id: recordId }
    });

    return res.json({ success: true, message: 'Medical record deleted successfully.' });
  } catch (error: any) {
    console.error('Delete record error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
