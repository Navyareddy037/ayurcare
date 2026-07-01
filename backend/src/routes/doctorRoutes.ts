import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/authMiddleware';

const router = Router();

// GET /api/doctors: Search & Filter doctor listings
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, specialization, maxFee, minRating, sortBy } = req.query;

    const whereClause: any = {
      status: 'APPROVED',
    };

    if (specialization) {
      whereClause.specialization = specialization as string;
    }

    if (maxFee) {
      whereClause.fee = { lte: parseFloat(maxFee as string) };
    }

    if (minRating) {
      whereClause.rating = { gte: parseFloat(minRating as string) };
    }

    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
        { clinicName: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } },
        { specialization: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Sort order definition
    let orderByClause: any = {};
    if (sortBy === 'rating') {
      orderByClause = { rating: 'desc' };
    } else if (sortBy === 'experience') {
      orderByClause = { experience: 'desc' };
    } else if (sortBy === 'fee') {
      orderByClause = { fee: 'asc' };
    } else {
      orderByClause = { rating: 'desc' };
    }

    const doctors = await prisma.doctorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        availabilities: true,
        reviews: {
          include: {
            patient: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: orderByClause,
    });

    return res.json({ success: true, doctors });
  } catch (error: any) {
    console.error('Doctors GET error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/doctors/profile: Update doctor specifications (Requires DOCTOR role)
router.post('/profile', authMiddleware, requireRole(['DOCTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { qualification, experience, specialization, languages, fee, clinicName, bio } = req.body;

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const updated = await prisma.doctorProfile.update({
      where: { id: doctorProfile.id },
      data: {
        qualification: qualification ?? doctorProfile.qualification,
        experience: experience ? parseInt(experience) : doctorProfile.experience,
        specialization: specialization ?? doctorProfile.specialization,
        languages: languages ?? doctorProfile.languages,
        fee: fee ? parseFloat(fee) : doctorProfile.fee,
        clinicName: clinicName ?? doctorProfile.clinicName,
        bio: bio ?? doctorProfile.bio,
      },
    });

    return res.json({ success: true, profile: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/doctors/availability: Update week schedule slots (Requires DOCTOR role)
router.post('/availability', authMiddleware, requireRole(['DOCTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { availabilities } = req.body; // array of numbers: [1, 2, 3...]

    if (!Array.isArray(availabilities)) {
      return res.status(400).json({ error: 'Availabilities must be an array of day numbers' });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    // Delete old settings
    await prisma.availability.deleteMany({
      where: { doctorId: doctorProfile.id },
    });

    // Write new settings
    for (const day of availabilities) {
      await prisma.availability.create({
        data: {
          doctorId: doctorProfile.id,
          dayOfWeek: parseInt(day),
          startTime: '09:00',
          endTime: '17:00',
        },
      });
    }

    const updatedList = await prisma.availability.findMany({
      where: { doctorId: doctorProfile.id },
    });

    return res.json({ success: true, availabilities: updatedList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
