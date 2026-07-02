"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/health-tracker: Get current patient vitals & mock historical points
router.get('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        if (role !== 'PATIENT') {
            return res.status(403).json({ error: 'Only patient accounts can access vitals tracker' });
        }
        const profile = await db_1.default.patientProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            return res.status(404).json({ error: 'Patient profile not found' });
        }
        // Generate 7 days of mock historical vitals based on current profile values
        // to populate beautiful charts in the dashboard
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const currentWeight = profile.weight || 70;
        const currentSugar = profile.bloodSugar || 95;
        const currentWater = profile.waterIntake || 2.0;
        const currentSleep = profile.sleepHours || 7.0;
        const historicalData = days.map((day, index) => {
            const variance = (index - 3) * 0.2; // simulate slight trend
            const randomOffset = Math.sin(index) * 0.5;
            return {
                name: day,
                weight: parseFloat((currentWeight + variance + randomOffset * 0.2).toFixed(1)),
                bloodSugar: Math.round(currentSugar + variance * 2 + randomOffset * 3),
                waterIntake: parseFloat(Math.max(1, currentWater + randomOffset * 0.3).toFixed(1)),
                sleepHours: parseFloat(Math.max(4, currentSleep + randomOffset * 0.4).toFixed(1)),
            };
        });
        return res.json({
            success: true,
            currentVitals: profile,
            history: historicalData,
        });
    }
    catch (error) {
        console.error('Tracker GET error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/health-tracker: Update patient vitals
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        if (role !== 'PATIENT') {
            return res.status(403).json({ error: 'Only patient accounts can save vitals tracker' });
        }
        const { weight, bloodPressure, bloodSugar, sleepHours, waterIntake, exerciseMinutes, mood, medicalHistory } = req.body;
        const profile = await db_1.default.patientProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            return res.status(404).json({ error: 'Patient profile not found' });
        }
        const updated = await db_1.default.patientProfile.update({
            where: { id: profile.id },
            data: {
                weight: weight !== undefined ? parseFloat(weight) : profile.weight,
                bloodPressure: bloodPressure !== undefined ? bloodPressure : profile.bloodPressure,
                bloodSugar: bloodSugar !== undefined ? parseFloat(bloodSugar) : profile.bloodSugar,
                sleepHours: sleepHours !== undefined ? parseFloat(sleepHours) : profile.sleepHours,
                waterIntake: waterIntake !== undefined ? parseFloat(waterIntake) : profile.waterIntake,
                exerciseMinutes: exerciseMinutes !== undefined ? parseInt(exerciseMinutes) : profile.exerciseMinutes,
                mood: mood !== undefined ? mood : profile.mood,
                medicalHistory: medicalHistory !== undefined ? medicalHistory : profile.medicalHistory,
            },
        });
        return res.json({ success: true, profile: updated });
    }
    catch (error) {
        console.error('Tracker POST error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
