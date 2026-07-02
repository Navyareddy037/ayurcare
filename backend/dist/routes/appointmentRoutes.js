"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const email_1 = require("../lib/email");
const router = (0, express_1.Router)();
// GET /api/appointments: List appointments for the current user session role
router.get('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        let appointments = [];
        if (role === 'PATIENT') {
            appointments = await db_1.default.appointment.findMany({
                where: { patientId: userId },
                include: {
                    doctor: {
                        include: {
                            user: {
                                select: { name: true, email: true },
                            },
                        },
                    },
                },
                orderBy: { date: 'desc' },
            });
        }
        else if (role === 'DOCTOR') {
            const doctorProfile = await db_1.default.doctorProfile.findUnique({
                where: { userId },
            });
            if (!doctorProfile) {
                return res.status(404).json({ error: 'Doctor profile not found' });
            }
            appointments = await db_1.default.appointment.findMany({
                where: { doctorId: doctorProfile.id },
                include: {
                    patient: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            patientProfile: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
            });
        }
        else if (role === 'ADMIN') {
            appointments = await db_1.default.appointment.findMany({
                include: {
                    patient: {
                        select: { name: true, email: true },
                    },
                    doctor: {
                        include: {
                            user: {
                                select: { name: true },
                            },
                        },
                    },
                },
                orderBy: { date: 'desc' },
            });
        }
        return res.json({ success: true, appointments });
    }
    catch (error) {
        console.error('Appointments GET error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// POST /api/appointments: Book a slot (Requires PATIENT role)
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { id: patientId, role, email: patientEmail, name: patientName } = req.user;
        const { doctorId, date, timeSlot } = req.body;
        if (role !== 'PATIENT') {
            return res.status(403).json({ error: 'Only patient accounts can schedule appointments' });
        }
        if (!doctorId || !date || !timeSlot) {
            return res.status(400).json({ error: 'Missing appointment details (doctorId, date, timeSlot)' });
        }
        const numDoctorId = parseInt(doctorId);
        // Double-booking check
        const doubleBook = await db_1.default.appointment.findFirst({
            where: {
                doctorId: numDoctorId,
                date,
                timeSlot,
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
        });
        if (doubleBook) {
            return res.status(409).json({ error: 'This slot is already booked. Please choose another slot.' });
        }
        const receiptId = 'REC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
        const appointment = await db_1.default.appointment.create({
            data: {
                patientId,
                doctorId: numDoctorId,
                date,
                timeSlot,
                status: 'CONFIRMED',
                receiptId,
            },
            include: {
                doctor: {
                    include: {
                        user: { select: { name: true } }
                    }
                }
            }
        });
        // Send email notification
        const doctorName = appointment.doctor?.user?.name || 'Ayurvedic Specialist';
        await (0, email_1.sendBookingEmail)(patientEmail, patientName, doctorName, date, timeSlot, receiptId);
        return res.status(201).json({ success: true, appointment });
    }
    catch (error) {
        console.error('Book appointment error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// PUT /api/appointments: Reschedule, cancel, or write prescriptions
router.put('/', authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const { appointmentId, status, date, timeSlot, notes, prescription, medicinesJSON } = req.body;
        if (!appointmentId) {
            return res.status(400).json({ error: 'Appointment ID required' });
        }
        const appId = parseInt(appointmentId);
        const appointment = await db_1.default.appointment.findUnique({
            where: { id: appId },
            include: {
                doctor: {
                    include: {
                        user: { select: { name: true } }
                    }
                },
                patient: {
                    select: { name: true, email: true }
                }
            },
        });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        // Role checks
        if (role === 'PATIENT' && appointment.patientId !== userId) {
            return res.status(403).json({ error: 'Forbidden: Unauthorized access to booking' });
        }
        if (role === 'DOCTOR' && appointment.doctor.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden: Unauthorized access to consult' });
        }
        const updateData = {};
        let emailTrigger = null;
        if (status) {
            updateData.status = status;
            if (status === 'CANCELLED' && appointment.status !== 'CANCELLED') {
                emailTrigger = 'CANCEL';
            }
        }
        if (date && timeSlot && (date !== appointment.date || timeSlot !== appointment.timeSlot)) {
            // Check double booking for reschedule
            const doubleBook = await db_1.default.appointment.findFirst({
                where: {
                    id: { not: appId },
                    doctorId: appointment.doctorId,
                    date,
                    timeSlot,
                    status: { in: ['PENDING', 'CONFIRMED'] },
                },
            });
            if (doubleBook) {
                return res.status(409).json({ error: 'The rescheduled slot is already booked.' });
            }
            updateData.date = date;
            updateData.timeSlot = timeSlot;
            emailTrigger = 'RESCHEDULE';
        }
        if (notes !== undefined)
            updateData.notes = notes;
        if (prescription !== undefined)
            updateData.prescription = prescription;
        if (medicinesJSON !== undefined)
            updateData.medicinesJSON = medicinesJSON;
        const updated = await db_1.default.appointment.update({
            where: { id: appId },
            data: updateData,
        });
        // Fire email notifications dynamically
        const patientEmail = appointment.patient.email;
        const patientName = appointment.patient.name;
        const doctorName = appointment.doctor.user.name;
        if (emailTrigger === 'CANCEL') {
            await (0, email_1.sendCancellationEmail)(patientEmail, patientName, doctorName, appointment.date);
        }
        else if (emailTrigger === 'RESCHEDULE' && date && timeSlot) {
            await (0, email_1.sendRescheduleEmail)(patientEmail, patientName, doctorName, date, timeSlot);
        }
        return res.json({ success: true, appointment: updated });
    }
    catch (error) {
        console.error('Update appointment error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
