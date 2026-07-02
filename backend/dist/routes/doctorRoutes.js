"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/doctors: Search & Filter doctor listings
router.get('/', async (req, res) => {
    try {
        const { search, specialization, maxFee, minRating, sortBy } = req.query;
        const whereClause = {
            status: 'APPROVED',
        };
        if (specialization) {
            whereClause.specialization = specialization;
        }
        if (maxFee) {
            whereClause.fee = { lte: parseFloat(maxFee) };
        }
        if (minRating) {
            whereClause.rating = { gte: parseFloat(minRating) };
        }
        if (search) {
            whereClause.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { clinicName: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } },
                { specialization: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Sort order definition
        let orderByClause = {};
        if (sortBy === 'rating') {
            orderByClause = { rating: 'desc' };
        }
        else if (sortBy === 'experience') {
            orderByClause = { experience: 'desc' };
        }
        else if (sortBy === 'fee') {
            orderByClause = { fee: 'asc' };
        }
        else {
            orderByClause = { rating: 'desc' };
        }
        const doctors = await db_1.default.doctorProfile.findMany({
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
    }
    catch (error) {
        console.error('Doctors GET error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/doctors/profile: Update doctor specifications (Requires DOCTOR role)
router.post('/profile', authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)(['DOCTOR']), async (req, res) => {
    try {
        const userId = req.user.id;
        const { qualification, experience, specialization, languages, fee, clinicName, bio } = req.body;
        const doctorProfile = await db_1.default.doctorProfile.findUnique({
            where: { userId },
        });
        if (!doctorProfile) {
            return res.status(404).json({ error: 'Doctor profile not found' });
        }
        const updated = await db_1.default.doctorProfile.update({
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/doctors/availability: Update week schedule slots (Requires DOCTOR role)
router.post('/availability', authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)(['DOCTOR']), async (req, res) => {
    try {
        const userId = req.user.id;
        const { availabilities } = req.body; // array of numbers: [1, 2, 3...]
        if (!Array.isArray(availabilities)) {
            return res.status(400).json({ error: 'Availabilities must be an array of day numbers' });
        }
        const doctorProfile = await db_1.default.doctorProfile.findUnique({
            where: { userId },
        });
        if (!doctorProfile) {
            return res.status(404).json({ error: 'Doctor profile not found' });
        }
        // Delete old settings
        await db_1.default.availability.deleteMany({
            where: { doctorId: doctorProfile.id },
        });
        // Write new settings
        for (const day of availabilities) {
            await db_1.default.availability.create({
                data: {
                    doctorId: doctorProfile.id,
                    dayOfWeek: parseInt(day),
                    startTime: '09:00',
                    endTime: '17:00',
                },
            });
        }
        const updatedList = await db_1.default.availability.findMany({
            where: { doctorId: doctorProfile.id },
        });
        return res.json({ success: true, availabilities: updatedList });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
