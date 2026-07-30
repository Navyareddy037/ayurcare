const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting Database Cleanup...');

  // 1. Identify official users
  const officialEmails = [
    'admin@kayakalp.com',
    'patient@kayakalp.com',
    'panchakarma@kayakalp.com',
    'dermatology@kayakalp.com',
    'orthopedic@kayakalp.com',
    'psychiatry@kayakalp.com',
    'gynecology@kayakalp.com',
    'endocrine@kayakalp.com'
  ];

  // Get users to delete
  const usersToDelete = await prisma.user.findMany({
    where: {
      NOT: {
        email: { in: officialEmails }
      }
    }
  });

  console.log(`Found ${usersToDelete.length} demo/mock users to delete:`, usersToDelete.map(u => u.email));

  // Delete them
  for (const u of usersToDelete) {
    await prisma.user.delete({
      where: { id: u.id }
    });
  }

  // 2. Clean up appointments
  // Let's get the patient user (Navya Reddy)
  const patient = await prisma.user.findUnique({
    where: { email: 'patient@kayakalp.com' }
  });

  if (!patient) {
    throw new Error('Patient Navya Reddy not found in database.');
  }

  // Delete all appointments for clean slate
  const deleteAppts = await prisma.appointment.deleteMany({});
  console.log(`Cleared ${deleteAppts.count} appointments.`);

  // Get official doctors
  const drMadhavan = await prisma.doctorProfile.findFirst({
    where: { user: { email: 'orthopedic@kayakalp.com' } }
  });
  const drNaveen = await prisma.doctorProfile.findFirst({
    where: { user: { email: 'panchakarma@kayakalp.com' } }
  });
  const drRamesh = await prisma.doctorProfile.findFirst({
    where: { user: { email: 'endocrine@kayakalp.com' } }
  });

  if (!drMadhavan || !drNaveen || !drRamesh) {
    throw new Error('Official doctors not found in database.');
  }

  // Create clean completed appointment 1 (Dr. Madhavan)
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: drMadhavan.id,
      date: '2026-07-27',
      timeSlot: '14:30',
      status: 'COMPLETED',
      visitType: 'clinic',
      notes: 'Lower back stiffness evaluation. Recommended posture corrections and daily stretches.',
      prescription: 'Apply Dhanwantharam Thailam on lower back before bath daily.',
      medicinesJSON: JSON.stringify([
        { name: 'Dhanwantharam Thailam', dosage: 'Apply locally', timing: 'Before bath', duration: '14 days' },
        { name: 'Yogaraj Guggulu', dosage: '1 tablet twice a day', timing: 'After food', duration: '7 days' }
      ]),
      receiptId: 'REC-MAD-9021',
    }
  });

  // Create clean completed appointment 2 (Dr. Naveen)
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: drNaveen.id,
      date: '2026-07-20',
      timeSlot: '11:00',
      status: 'COMPLETED',
      visitType: 'clinic',
      notes: 'Nadi diagnosis and first Panchakarma Basti completed successfully.',
      prescription: 'Abhyanga self-massage with warm sesame oil daily. Drink warm water.',
      medicinesJSON: JSON.stringify([
        { name: 'Sesame Oil', dosage: 'Abhyanga massage', timing: 'Morning', duration: '30 days' }
      ]),
      receiptId: 'REC-NAV-4482',
    }
  });

  // Create clean future appointment 3 (Dr. Ramesh - Metabolic/Thyroid check)
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: drRamesh.id,
      date: '2026-08-05',
      timeSlot: '10:00',
      status: 'CONFIRMED',
      visitType: 'clinic',
      notes: 'Initial checkup for metabolic status and thyroid patterns.',
      receiptId: 'REC-RAM-3382',
    }
  });

  console.log('Clean production appointments successfully created.');
  console.log('Database Cleanup Complete!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
