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

      const { date } = req.query;
      const whereCondition: any = { doctorId: doctorProfile.id };
      if (date === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        whereCondition.date = todayStr;
      }

      appointments = await prisma.appointment.findMany({
        where: whereCondition,
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
    const { appointmentId, status, date, timeSlot, notes, prescription, medicinesJSON, visitType, nextFollowup, followupDone } = req.body;

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
    if (visitType !== undefined) updateData.visitType = visitType;
    if (nextFollowup !== undefined) updateData.nextFollowup = nextFollowup;
    if (followupDone !== undefined) updateData.followupDone = followupDone;

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

// GET /api/appointments/notifications: list alerts for user
router.get('/notifications', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, notifications });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/appointments/notifications/:id/read: mark alert as read
router.put('/notifications/:id/read', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const notifId = parseInt(req.params.id);
    const notif = await prisma.notification.findUnique({
      where: { id: notifId }
    });
    if (!notif || notif.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updated = await prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true }
    });
    return res.json({ success: true, notification: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/tasks: list doctor tasks
router.get('/tasks', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== 'DOCTOR') return res.status(403).json({ error: 'Unauthorized' });

    const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) return res.status(404).json({ error: 'Doctor not found' });

    const tasks = await prisma.doctorTask.findMany({
      where: { doctorId: doctorProfile.id },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, tasks });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments/tasks: create doctor task
router.post('/tasks', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId, role } = req.user!;
    const { title } = req.body;
    if (role !== 'DOCTOR') return res.status(403).json({ error: 'Unauthorized' });

    const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) return res.status(404).json({ error: 'Doctor not found' });

    const newTask = await prisma.doctorTask.create({
      data: { doctorId: doctorProfile.id, title, isDone: false }
    });
    return res.json({ success: true, task: newTask });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/appointments/tasks/:id: toggle task completion
router.put('/tasks/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId, role } = req.user!;
    const taskId = parseInt(req.params.id);
    const { isDone } = req.body;
    if (role !== 'DOCTOR') return res.status(403).json({ error: 'Unauthorized' });

    const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) return res.status(404).json({ error: 'Doctor not found' });

    const task = await prisma.doctorTask.findUnique({ where: { id: taskId } });
    if (!task || task.doctorId !== doctorProfile.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.doctorTask.update({
      where: { id: taskId },
      data: { isDone }
    });
    return res.json({ success: true, task: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments/tickets: Create a new support ticket
router.post('/tickets', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const { subject, description } = req.body;
    const ticket = await prisma.supportTicket.create({
      data: { userId, subject, description, status: 'OPEN' }
    });
    return res.json({ success: true, ticket });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/tickets: List user support tickets
router.get('/tickets', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, tickets });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/tickets/admin: List all support tickets for administrator
router.get('/tickets/admin', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, tickets });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/appointments/tickets/admin/:id: Answer support ticket
router.put('/tickets/admin/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

    const ticketId = parseInt(req.params.id);
    const { response, status } = req.body;
    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { response, status }
    });
    return res.json({ success: true, ticket: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
