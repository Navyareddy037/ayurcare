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
                    weight: patientDetails?.weight ? parseFloat(patientDetails.weight) : 70.0,
                    bloodPressure: patientDetails?.bloodPressure || '120/80',
                    bloodSugar: patientDetails?.bloodSugar ? parseFloat(patientDetails.bloodSugar) : 95.0,
                    sleepHours: patientDetails?.sleepHours ? parseFloat(patientDetails.sleepHours) : 7.5,
                    waterIntake: patientDetails?.waterIntake ? parseFloat(patientDetails.waterIntake) : 2.5,
                    exerciseMinutes: patientDetails?.exerciseMinutes ? parseInt(patientDetails.exerciseMinutes) : 15,
                    mood: patientDetails?.mood || 'Calm',
                    profilePhoto: patientDetails?.profilePhoto || null,
                    dob: patientDetails?.dob || null,
                    height: patientDetails?.height ? parseFloat(patientDetails.height) : null,
                    maritalStatus: patientDetails?.maritalStatus || null,
                    occupation: patientDetails?.occupation || null,
                    address: patientDetails?.address || null,
                    city: patientDetails?.city || null,
                    state: patientDetails?.state || null,
                    country: patientDetails?.country || null,
                    pincode: patientDetails?.pincode || null,
                    emergencyName: patientDetails?.emergencyName || null,
                    emergencyPhone: patientDetails?.emergencyPhone || null,
                    allergies: patientDetails?.allergies || null,
                    surgeries: patientDetails?.surgeries || null,
                    medications: patientDetails?.medications || null,
                    familyHistory: patientDetails?.familyHistory || null,
                    dietType: patientDetails?.dietType || 'Vegetarian',
                    stressLevel: patientDetails?.stressLevel || 'Medium',
                    heartRate: patientDetails?.heartRate ? parseInt(patientDetails.heartRate) : null,
                    symptoms: patientDetails?.symptoms || null,
                    insuranceDetails: patientDetails?.insuranceDetails || null,
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
                    certificates: doctorDetails?.certificates || null,
                    consultModes: doctorDetails?.consultModes || 'Clinic, Online',
                    breakTime: doctorDetails?.breakTime || '13:00 - 14:00',
                    holidays: doctorDetails?.holidays || null,
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
// PUT /api/auth/profile: Update user profile details
router.put('/profile', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const { name, email, patientDetails, doctorDetails } = req.body;
        // Update User Name/Email if provided
        const userUpdate = {};
        if (name)
            userUpdate.name = name;
        if (email)
            userUpdate.email = email;
        if (Object.keys(userUpdate).length > 0) {
            await db_1.default.user.update({
                where: { id: userId },
                data: userUpdate,
            });
        }
        if (role === 'PATIENT' && patientDetails) {
            const patientProfile = await db_1.default.patientProfile.findUnique({
                where: { userId },
            });
            if (patientProfile) {
                const updateData = {};
                const fields = [
                    'age', 'gender', 'phone', 'bloodType', 'medicalHistory', 'weight',
                    'bloodPressure', 'bloodSugar', 'sleepHours', 'waterIntake', 'exerciseMinutes',
                    'mood', 'dob', 'height', 'maritalStatus', 'occupation', 'address', 'city',
                    'state', 'country', 'pincode', 'emergencyName', 'emergencyPhone', 'allergies',
                    'surgeries', 'medications', 'familyHistory', 'dietType', 'stressLevel',
                    'heartRate', 'symptoms', 'insuranceDetails'
                ];
                for (const field of fields) {
                    if (patientDetails[field] !== undefined) {
                        if (['age', 'exerciseMinutes', 'heartRate'].includes(field)) {
                            updateData[field] = patientDetails[field] ? parseInt(patientDetails[field]) : null;
                        }
                        else if (['weight', 'bloodSugar', 'sleepHours', 'waterIntake', 'height'].includes(field)) {
                            updateData[field] = patientDetails[field] ? parseFloat(patientDetails[field]) : null;
                        }
                        else {
                            updateData[field] = patientDetails[field];
                        }
                    }
                }
                await db_1.default.patientProfile.update({
                    where: { id: patientProfile.id },
                    data: updateData,
                });
            }
        }
        else if (role === 'DOCTOR' && doctorDetails) {
            const doctorProfile = await db_1.default.doctorProfile.findUnique({
                where: { userId },
            });
            if (doctorProfile) {
                const updateData = {};
                const fields = [
                    'qualification', 'experience', 'specialization', 'languages', 'fee',
                    'clinicName', 'bio', 'certificates', 'consultModes', 'breakTime', 'holidays'
                ];
                for (const field of fields) {
                    if (doctorDetails[field] !== undefined) {
                        if (field === 'experience') {
                            updateData[field] = doctorDetails[field] ? parseInt(doctorDetails[field]) : doctorProfile.experience;
                        }
                        else if (field === 'fee') {
                            updateData[field] = doctorDetails[field] ? parseFloat(doctorDetails[field]) : doctorProfile.fee;
                        }
                        else {
                            updateData[field] = doctorDetails[field];
                        }
                    }
                }
                await db_1.default.doctorProfile.update({
                    where: { id: doctorProfile.id },
                    data: updateData,
                });
            }
        }
        const updatedUser = await db_1.default.user.findUnique({
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
        return res.json({ success: true, user: updatedUser });
    }
    catch (error) {
        console.error('Profile update error:', error);
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
