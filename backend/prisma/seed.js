const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Kaya Kalp database (PostgreSQL)...');

  // Clean existing tables (Prisma will handle constraints in correct sequence)
  await prisma.doctorTask.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.knowledgeHubItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.availability.deleteMany({});
  await prisma.doctorProfile.deleteMany({});
  await prisma.patientProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Admin
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@kayakalp.com',
      name: 'Dr. Vasudevan (Chief Admin)',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created Admin:', admin.email);

  // 2. Create Doctors
  const doctorPassword = bcrypt.hashSync('doctor123', 10);

  const doctorsData = [
    {
      email: 'panchakarma@kayakalp.com',
      name: 'Dr. Naveen Jadhav',
      qualification: 'BAMS, MD (Ayurveda - Panchakarma)',
      experience: 15,
      specialization: 'Panchakarma Specialist',
      languages: 'English, Hindi, Marathi',
      fee: 600,
      clinicName: 'Kaya Kalp Ayurvedic Wellness Center, New Palasia, Indore',
      bio: 'Chief Vaidya at Kaya Kalp Indore. Expert in detoxification treatments, chronic pain relief, and seasonal wellness balancing through traditional Panchakarma therapies.',
      availabilities: [1, 2, 3, 4, 5], // Mon, Tue, Wed, Thu, Fri
    },
    {
      email: 'dermatology@kayakalp.com',
      name: 'Dr. Shalini Iyer',
      qualification: 'BAMS, MS (Shalakya Tantra - Skin & Eye)',
      experience: 9,
      specialization: 'Dermatology Ayurveda',
      languages: 'English, Hindi, Tamil',
      fee: 500,
      clinicName: 'Kaya Kalp Skin & Eye Clinic, New Palasia, Indore',
      bio: 'Specialist in organic Ayurvedic treatments for psoriasis, eczema, acne, hair loss, and chronic inflammatory skin conditions.',
      availabilities: [2, 4, 6], // Tue, Thu, Sat
    },
    {
      email: 'orthopedic@kayakalp.com',
      name: 'Dr. Madhavan Namboothiri',
      qualification: 'BAMS, MD (Ayurveda - Kayachikitsa)',
      experience: 15,
      specialization: 'Orthopedic Ayurveda',
      languages: 'English, Hindi, Malayalam',
      fee: 700,
      clinicName: 'Kaya Kalp Spine & Joint Clinic, New Palasia, Indore',
      bio: 'Renowned expert in spine disorders, arthritis, joint pains, slip disc, and musculoskeletal rehabilitation using traditional oil therapies.',
      availabilities: [1, 3, 5], // Mon, Wed, Fri
    },
    {
      email: 'psychiatry@kayakalp.com',
      name: 'Dr. Vivek Anand',
      qualification: 'BAMS, PGD (Ayurveda Psychiatry)',
      experience: 8,
      specialization: 'Ayurvedic Psychiatry',
      languages: 'English, Hindi, Bengali',
      fee: 650,
      clinicName: 'Kaya Kalp Mind & Wellness Clinic, New Palasia, Indore',
      bio: 'Focuses on anxiety, stress, insomnia, and psychosomatic disorders using Ayurvedic herbs, Shirodhara, and Yogic meditation techniques.',
      availabilities: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
    },
    {
      email: 'gynecology@kayakalp.com',
      name: 'Dr. Anjali Deshmukh',
      qualification: 'BAMS, MS (Prasuti Tantra & Stri Roga)',
      experience: 10,
      specialization: 'Gynecology Ayurveda',
      languages: 'English, Hindi, Marathi',
      fee: 550,
      clinicName: 'Kaya Kalp Stri Roga Clinic, New Palasia, Indore',
      bio: 'Specialist in Ayurvedic gynecology, maternal health, Stri Roga disorders, and hormonal imbalances using traditional herbal therapies.',
      availabilities: [1, 3, 5], // Mon, Wed, Fri
    },
    {
      email: 'endocrine@kayakalp.com',
      name: 'Dr. Ramesh Joshi',
      qualification: 'BAMS, MD (Ayurveda - Kayachikitsa)',
      experience: 14,
      specialization: 'Endocrine Ayurveda',
      languages: 'English, Hindi, Gujarati',
      fee: 600,
      clinicName: 'Kaya Kalp Metabolic & Thyroid Clinic, New Palasia, Indore',
      bio: 'Expert in managing metabolic disorders, thyroid balance, diabetes control (Madhumeha), and hormonal health through Ayurvedic diet and therapies.',
      availabilities: [2, 4, 6], // Tue, Thu, Sat
    },
  ];

  const doctorsCreated = [];
  for (const doc of doctorsData) {
    const user = await prisma.user.create({
      data: {
        email: doc.email,
        name: doc.name,
        passwordHash: doctorPassword,
        role: 'DOCTOR',
      },
    });

    const doctorProfile = await prisma.doctorProfile.create({
      data: {
        userId: user.id,
        qualification: doc.qualification,
        experience: doc.experience,
        specialization: doc.specialization,
        languages: doc.languages,
        fee: doc.fee,
        clinicName: doc.clinicName,
        bio: doc.bio,
        rating: 4.8,
        status: 'APPROVED',
      },
    });

    // Create availabilities
    for (const day of doc.availabilities) {
      await prisma.availability.create({
        data: {
          doctorId: doctorProfile.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
        },
      });
    }
    doctorsCreated.push(doctorProfile);
    console.log('Created Doctor:', user.email);
  }

  // 3. Create Patient
  const patientPassword = bcrypt.hashSync('patient123', 10);
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@kayakalp.com',
      name: 'Navya Reddy',
      passwordHash: patientPassword,
      role: 'PATIENT',
    },
  });

  const patientProfile = await prisma.patientProfile.create({
    data: {
      userId: patientUser.id,
      age: 29,
      gender: 'Male',
      phone: '+91 9876543210',
      bloodType: 'O+',
      medicalHistory: 'Mild digestive issues, frequent lower back stiffness due to sitting.',
      weight: 74.5,
      bloodPressure: '122/80',
      bloodSugar: 95.0,
      sleepHours: 7.2,
      waterIntake: 2.5,
      exerciseMinutes: 20,
      mood: 'Calm',
    },
  });
  console.log('Created Patient:', patientUser.email);

  // 4. Create some sample reviews
  if (doctorsCreated.length > 0) {
    await prisma.review.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[0].id, // Dr. Aditya Sharma
        rating: 5,
        comment: 'Outstanding Panchakarma detoxification session! My body feels extremely light and energized.',
      },
    });

    await prisma.review.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[1].id, // Dr. Shalini Iyer
        rating: 4,
        comment: 'Very professional. Her herbal paste suggestion helped with my skin eczema within a week.',
      },
    });
  }

  // 5. Populate Knowledge Hub items
  const knowledgeItems = [
    {
      type: 'HERB',
      title: 'Ashwagandha (Withania somnifera)',
      content: 'Ashwagandha is one of the most powerful herbs in Ayurveda, classified as a Rasayana (rejuvenator). It is famous for its adaptogenic properties, helping the body manage stress, reduce anxiety, improve sleep, and boost energy and brain function. It balances Vata and Kapha doshas but can increase Pitta if taken in excess.',
      tags: 'Stress, Energy, Rejuvenation, Vata, Kapha',
      image: 'ashwagandha',
    },
    {
      type: 'HERB',
      title: 'Triphala (The Three Fruits)',
      content: 'Triphala is a traditional formula combining Amla (Emblica officinalis), Bibhitaki (Terminalia bellirica), and Haritaki (Terminalia chebula). It is highly celebrated for promoting healthy digestion, gentle colon detoxification, and supporting nutrient absorption. Triphala is tridoshic, meaning it balances Vata, Pitta, and Kapha.',
      tags: 'Digestion, Detox, Tridoshic, Metabolism',
      image: 'triphala',
    },
    {
      type: 'DOSHA',
      title: 'Vata Dosha (Air & Ether)',
      content: 'Vata is characterized by qualities of dryness, coldness, lightness, and mobility. It governs bodily movements, breathing, and nervous system activity. When out of balance, Vata leads to dry skin, bloating, constipation, insomnia, anxiety, and joint stiffness. To balance Vata, favor warm, cooked, nourishing foods and regular daily routines.',
      tags: 'Vata, Air, Balance, Routine, Nourish',
      image: 'vata',
    },
    {
      type: 'DOSHA',
      title: 'Pitta Dosha (Fire & Water)',
      content: 'Pitta represents heat, sharpness, liquidness, and transformational power. It governs digestion, body temperature, and intellect. Imbalance displays as skin rashes, acid reflux, inflammatory conditions, anger, and irritability. To balance Pitta, prefer cooling, sweet, bitter, and astringent foods, and avoid extreme heat and spicy spices.',
      tags: 'Pitta, Fire, Cooling, Digestion, Anger',
      image: 'pitta',
    },
    {
      type: 'DOSHA',
      title: 'Kapha Dosha (Earth & Water)',
      content: 'Kapha contributes heaviness, coldness, softness, stability, and lubrication to the body. It governs structure, fluid balance, and immunity. Kapha imbalances lead to weight gain, lethargy, congestion, allergies, and possessiveness. To balance Kapha, enjoy light, warm, spicy, and stimulating foods, alongside active exercise.',
      tags: 'Kapha, Earth, Exercise, Stimulating, Weight',
      image: 'kapha',
    },
    {
      type: 'ARTICLE',
      title: 'Dinacharya: The Daily Ayurvedic Routine',
      content: 'Dinacharya is the practice of aligning daily activities with the biological clock of nature. It starts by waking up before sunrise (Brahma Muhurta), scraping the tongue to remove toxins, oil pulling (Gandusha), self-massage with warm sesame oil (Abhyanga), moderate exercise or yoga, and finishing with meditation. This aligns your internal clock, enhances immunity, and keeps your doshas balanced.',
      tags: 'Routine, Daily, Wellness, Immunity',
      image: 'dinacharya',
    },
  ];

  for (const item of knowledgeItems) {
    await prisma.knowledgeHubItem.create({
      data: item,
    });
  }

  // 6. Create sample appointments
  if (doctorsCreated.length > 0) {
    const todayStr = new Date().toISOString().split('T')[0];

    // Today's Confirmed Online Appt
    await prisma.appointment.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[0].id,
        date: todayStr,
        timeSlot: '09:30',
        status: 'CONFIRMED',
        visitType: 'online',
        notes: 'Follow-up on digestive patterns and Vata soothing herbs.',
        receiptId: 'REC-XYZ-0001',
      },
    });

    // Today's Confirmed Clinic Appt
    await prisma.appointment.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[0].id,
        date: todayStr,
        timeSlot: '11:00',
        status: 'CONFIRMED',
        visitType: 'clinic',
        notes: 'Nadi diagnosis and first Panchakarma Basti assessment.',
        receiptId: 'REC-XYZ-0002',
      },
    });

    // Today's Pending Follow-up request
    await prisma.appointment.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[0].id,
        date: todayStr,
        timeSlot: '14:00',
        status: 'PENDING',
        visitType: 'follow-up',
        notes: 'Weekly follow-up on back stiffness.',
      },
    });

    // Future appointment
    await prisma.appointment.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[0].id,
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        timeSlot: '10:00',
        status: 'CONFIRMED',
        visitType: 'clinic',
        notes: 'Initial checkup for digestive issues and scheduling Panchakarma.',
        receiptId: 'REC-XYZ-1234',
      },
    });

    // Past completed appointment
    await prisma.appointment.create({
      data: {
        patientId: patientUser.id,
        doctorId: doctorsCreated[2].id, // Dr. Madhavan Namboothiri
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], // 3 days ago
        timeSlot: '14:30',
        status: 'COMPLETED',
        visitType: 'clinic',
        notes: 'Lower back stiffness evaluation.',
        prescription: 'Apply Dhanwantharam Thailam on lower back before bath daily.',
        medicinesJSON: JSON.stringify([
          { name: 'Dhanwantharam Thailam', dosage: 'Apply locally', timing: 'Before bath', duration: '14 days' },
          { name: 'Yogaraj Guggulu', dosage: '1 tablet twice a day', timing: 'After food', duration: '7 days' }
        ]),
        receiptId: 'REC-XYZ-0987',
      },
    });

    // 7. Seed Doctor Tasks (Dr. Naveen Jadhav)
    await prisma.doctorTask.createMany({
      data: [
        { doctorId: doctorsCreated[0].id, title: 'Review lab reports for Rahul Verma', isDone: false },
        { doctorId: doctorsCreated[0].id, title: 'Verify Panchakarma room readiness', isDone: true },
        { doctorId: doctorsCreated[0].id, title: 'Update follow-up logs from yesterday', isDone: false }
      ]
    });

    // 8. Seed Notifications for Dr. Naveen Jadhav (the doctor user id)
    const docUser = await prisma.user.findFirst({ where: { email: 'panchakarma@kayakalp.com' } });
    if (docUser) {
      await prisma.notification.createMany({
        data: [
          { userId: docUser.id, type: 'BOOKING_REQUEST', message: 'New booking request from Rahul Verma for today at 14:00', isRead: false },
          { userId: docUser.id, type: 'LAB_REPORT', message: 'Medical file/lab report uploaded by Rahul Verma', isRead: false }
        ]
      });
    }
  }

  console.log('PostgreSQL database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
