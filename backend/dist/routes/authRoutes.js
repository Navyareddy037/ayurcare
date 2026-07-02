"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../lib/db"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'ayurcare-secret-key-for-internship-evaluation-98765';
// GET /api/auth/me: Get current user details from JWT token
router.get('/me', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                patientProfile: true,
                doctorProfile: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ authenticated: true, user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/auth/signup: Register new user (Patient or Doctor)
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, role, doctorDetails, patientDetails } = req.body;
        if (!email || !password || !name || !role) {
            return res.status(400).json({ error: 'Missing required signup fields' });
        }
        // Check email uniqueness
        const existing = await db_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        // Create user
        const user = await db_1.default.user.create({
            data: {
                email,
                name,
                passwordHash,
                role,
            },
        });
        // Create profiles
        if (role === 'PATIENT') {
            await db_1.default.patientProfile.create({
                data: {
                    userId: user.id,
                    age: patientDetails?.age ? parseInt(patientDetails.age) : null,
                    gender: patientDetails?.gender || null,
                    phone: patientDetails?.phone || null,
                    bloodType: patientDetails?.bloodType || null,
                    medicalHistory: patientDetails?.medicalHistory || '',
                    weight: 70.0,
                    bloodPressure: '120/80',
                    bloodSugar: 95.0,
                    sleepHours: 7.5,
                    waterIntake: 2.5,
                    exerciseMinutes: 15,
                    mood: 'Good',
                },
            });
        }
        else if (role === 'DOCTOR') {
            await db_1.default.doctorProfile.create({
                data: {
                    userId: user.id,
                    qualification: doctorDetails?.qualification || 'BAMS',
                    experience: doctorDetails?.experience ? parseInt(doctorDetails.experience) : 3,
                    specialization: doctorDetails?.specialization || 'Panchakarma Specialist',
                    languages: doctorDetails?.languages || 'English, Hindi',
                    fee: doctorDetails?.fee ? parseFloat(doctorDetails.fee) : 500,
                    clinicName: doctorDetails?.clinicName || 'AyurCare Wellness Clinic',
                    bio: doctorDetails?.bio || 'Experienced Ayurvedic Vaidya.',
                    status: 'APPROVED', // Auto approved for development demo
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            success: true,
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/auth/login: Authenticate user & issue JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        const user = await db_1.default.user.findUnique({
            where: { email },
            include: {
                patientProfile: true,
                doctorProfile: true,
            },
        });
        if (!user || !bcryptjs_1.default.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                patientProfile: user.patientProfile,
                doctorProfile: user.doctorProfile,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/auth/verify-otp: Mock OTP validation
router.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    if (otp === '123456' || otp === 123456) {
        return res.json({ success: true, message: 'OTP verified successfully!' });
    }
    else {
        return res.status(400).json({ error: 'Invalid OTP code. Use 123456 for demo verification.' });
    }
});
exports.default = router;
