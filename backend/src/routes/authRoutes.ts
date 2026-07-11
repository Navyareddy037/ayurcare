import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ayurcare-secret-key-for-internship-evaluation-98765';

// GET /api/auth/me: Get current user details from JWT token
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
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
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/auth/signup: Register new user (Patient or Doctor)
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, doctorDetails, patientDetails } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required signup fields' });
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
      },
    });

    // Create profiles
    if (role === 'PATIENT') {
      await prisma.patientProfile.create({
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
    } else if (role === 'DOCTOR') {
      await prisma.doctorProfile.create({
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

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/auth/login: Authenticate user & issue JWT
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/auth/verify-otp: Mock OTP validation
router.post('/verify-otp', (req: Request, res: Response) => {
  const { otp } = req.body;
  if (otp === '123456' || otp === 123456) {
    return res.json({ success: true, message: 'OTP verified successfully!' });
  } else {
    return res.status(400).json({ error: 'Invalid OTP code. Use 123456 for demo verification.' });
  }
});

export default router;
