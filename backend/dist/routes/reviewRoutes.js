"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// POST /api/reviews: Create review for a doctor & update dynamic average rating
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { id: patientId, role } = req.user;
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
        const review = await db_1.default.review.create({
            data: {
                patientId,
                doctorId: numDoctorId,
                rating: numRating,
                comment,
            },
        });
        // Aggregate reviews for the doctor
        const aggregations = await db_1.default.review.aggregate({
            where: { doctorId: numDoctorId },
            _avg: {
                rating: true,
            },
        });
        const averageRating = aggregations._avg.rating || numRating;
        // Update DoctorProfile
        await db_1.default.doctorProfile.update({
            where: { id: numDoctorId },
            data: {
                rating: parseFloat(averageRating.toFixed(1)),
            },
        });
        return res.status(201).json({ success: true, review, newAverageRating: averageRating });
    }
    catch (error) {
        console.error('Review submit error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
