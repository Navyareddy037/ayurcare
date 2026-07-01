import { Router, Response } from 'express';
import prisma from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /api/reviews: Create review for a doctor & update dynamic average rating
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: patientId, role } = req.user!;
    const { doctorId, rating, comment } = req.body;

    if (role !== 'PATIENT') {
      return res.status(403).json({ error: 'Only patient accounts can leave reviews' });
    }

    if (!doctorId || rating === undefined || !comment) {
      return res.status(400).json({ error: 'Missing review parameters (doctorId, rating, comment)' });
    }

    const numDoctorId = parseInt(doctorId);
    const numRating = parseFloat(rating);

    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating stars must be between 1 and 5' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        patientId,
        doctorId: numDoctorId,
        rating: numRating,
        comment,
      },
    });

    // Aggregate reviews for the doctor
    const aggregations = await prisma.review.aggregate({
      where: { doctorId: numDoctorId },
      _avg: {
        rating: true,
      },
    });

    const averageRating = aggregations._avg.rating || numRating;

    // Update DoctorProfile
    await prisma.doctorProfile.update({
      where: { id: numDoctorId },
      data: {
        rating: parseFloat(averageRating.toFixed(1)),
      },
    });

    return res.status(201).json({ success: true, review, newAverageRating: averageRating });
  } catch (error: any) {
    console.error('Review submit error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
