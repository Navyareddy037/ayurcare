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
  console.log(`[GET /api/medical-records] Request received from user ID: ${req.user?.id}`);
  try {
    const { id: patientId } = req.user!;
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { uploadedAt: 'desc' }
    });
    console.log(`[GET /api/medical-records] Retrieved ${records.length} records for patient ID: ${patientId}`);
    return res.json({ success: true, records });
  } catch (error: any) {
    console.error('[GET /api/medical-records] Error fetching records:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/medical-records: Upload a new medical record
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  console.log(`[POST /api/medical-records] Upload request received from user ID: ${req.user?.id}`);
  console.log('[POST /api/medical-records] Upload started...');

  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('[POST /api/medical-records] Multer or upload error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          console.warn('[POST /api/medical-records] Validation failed: File size exceeds 5MB limit');
          return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
        }
        console.warn(`[POST /api/medical-records] Validation failed: Multer error - ${err.message}`);
        return res.status(400).json({ error: err.message });
      }
      console.warn(`[POST /api/medical-records] Validation failed: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id: patientId } = req.user!;
      const { reportName } = req.body;
      const file = req.file;

      console.log(`[POST /api/medical-records] Upload completed. File saved: ${file?.filename}`);

      if (!reportName || reportName.trim() === '') {
        console.warn('[POST /api/medical-records] Validation failed: Missing report name');
        if (file) {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {}
        }
        return res.status(400).json({ error: 'Report name is mandatory.' });
      }

      if (!file) {
        console.warn('[POST /api/medical-records] Validation failed: No file selected');
        return res.status(400).json({ error: 'Please select a file to upload.' });
      }

      // Generate dynamic file URL path
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

      // Create record in DB
      console.log('[POST /api/medical-records] Saving record to database...');
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
      console.log(`[POST /api/medical-records] Database saved successfully. Record ID: ${record.id}`);

      // Create in-app notification for the patient
      await prisma.notification.create({
        data: {
          userId: patientId,
          type: 'LAB_REPORT',
          message: `Medical record "${reportName}" has been successfully uploaded to your vault.`
        }
      });

      console.log('[POST /api/medical-records] Response returned: success=true');
      return res.status(201).json({ success: true, record });
    } catch (error: any) {
      console.error('[POST /api/medical-records] Exception error:', error);
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
  const recordId = parseInt(req.params.id);
  console.log(`[DELETE /api/medical-records/${recordId}] Request received from user ID: ${req.user?.id}`);

  try {
    const { id: patientId } = req.user!;

    if (isNaN(recordId)) {
      console.warn(`[DELETE /api/medical-records/${req.params.id}] Validation failed: Invalid record ID`);
      return res.status(400).json({ error: 'Invalid record ID.' });
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId }
    });

    if (!record) {
      console.warn(`[DELETE /api/medical-records/${recordId}] Validation failed: Record not found`);
      return res.status(404).json({ error: 'Record not found.' });
    }

    if (record.patientId !== patientId) {
      console.warn(`[DELETE /api/medical-records/${recordId}] Validation failed: Unauthorized user`);
      return res.status(403).json({ error: 'Unauthorized to delete this record.' });
    }

    // Delete the file from local storage
    if (record.fileUrl) {
      const filename = record.fileUrl.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
          console.log(`[DELETE /api/medical-records/${recordId}] Deleting file from storage: ${filePath}`);
          try {
            fs.unlinkSync(filePath);
          } catch (e) {}
        }
      }
    }

    // Delete from DB
    console.log(`[DELETE /api/medical-records/${recordId}] Deleting record from database...`);
    await prisma.medicalRecord.delete({
      where: { id: recordId }
    });
    console.log(`[DELETE /api/medical-records/${recordId}] Database deletion complete`);

    console.log(`[DELETE /api/medical-records/${recordId}] Response returned: success=true`);
    return res.json({ success: true, message: 'Medical record deleted successfully.' });
  } catch (error: any) {
    console.error(`[DELETE /api/medical-records/${recordId}] Error deleting record:`, error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
