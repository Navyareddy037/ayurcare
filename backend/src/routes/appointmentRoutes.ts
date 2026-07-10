import { Router, Response } from 'express';
import prisma from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { sendBookingEmail, sendRescheduleEmail, sendCancellationEmail } from '../lib/email';

const router = Router();

// GET /api/appointments: List appointments for the current user session role
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId, role } = req.user!;
    let appointments: any[] = [];

    if (role === 'PATIENT') {
      appointments = await prisma.appointment.findMany({
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
    } else if (role === 'DOCTOR') {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId },
      });
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }

      appointments = await prisma.appointment.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              patientProfile: true,
              medicalRecords: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });
    } else if (role === 'ADMIN') {
      appointments = await prisma.appointment.findMany({
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
  } catch (error: any) {
    console.error('Appointments GET error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/appointments: Book a slot (Requires PATIENT role)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: patientId, role, email: patientEmail, name: patientName } = req.user!;
    const { doctorId, date, timeSlot } = req.body;

    if (role !== 'PATIENT') {
      return res.status(403).json({ error: 'Only patient accounts can schedule appointments' });
    }

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing appointment details (doctorId, date, timeSlot)' });
    }

    const numDoctorId = parseInt(doctorId);

    // Double-booking check
    const doubleBook = await prisma.appointment.findFirst({
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

    const appointment = await prisma.appointment.create({
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
    await sendBookingEmail(patientEmail, patientName, doctorName, date, timeSlot, receiptId);

    return res.status(201).json({ success: true, appointment });
  } catch (error: any) {
    console.error('Book appointment error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// PUT /api/appointments: Reschedule, cancel, or write prescriptions
router.put('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId, role } = req.user!;
    const { appointmentId, status, date, timeSlot, notes, prescription, medicinesJSON } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: 'Appointment ID required' });
    }

    const appId = parseInt(appointmentId);

    const appointment = await prisma.appointment.findUnique({
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

    const updateData: any = {};
    let emailTrigger: 'CANCEL' | 'RESCHEDULE' | null = null;

    if (status) {
      updateData.status = status;
      if (status === 'CANCELLED' && appointment.status !== 'CANCELLED') {
        emailTrigger = 'CANCEL';
      }
    }

    if (date && timeSlot && (date !== appointment.date || timeSlot !== appointment.timeSlot)) {
      // Check double booking for reschedule
      const doubleBook = await prisma.appointment.findFirst({
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

    if (notes !== undefined) updateData.notes = notes;
    if (prescription !== undefined) updateData.prescription = prescription;
    if (medicinesJSON !== undefined) updateData.medicinesJSON = medicinesJSON;

    const updated = await prisma.appointment.update({
      where: { id: appId },
      data: updateData,
    });

    // Fire email notifications dynamically
    const patientEmail = appointment.patient.email;
    const patientName = appointment.patient.name;
    const doctorName = appointment.doctor.user.name;

    if (emailTrigger === 'CANCEL') {
      await sendCancellationEmail(patientEmail, patientName, doctorName, appointment.date);
    } else if (emailTrigger === 'RESCHEDULE' && date && timeSlot) {
      await sendRescheduleEmail(patientEmail, patientName, doctorName, date, timeSlot);
    }

    return res.json({ success: true, appointment: updated });
  } catch (error: any) {
    console.error('Update appointment error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
