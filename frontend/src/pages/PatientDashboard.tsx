import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
  Heart, Calendar, Activity, CheckSquare, PlusCircle, FileText, 
  Trash2, Plus, Download, Clock, MapPin, AlertCircle, Sun, Moon, 
  Globe, Compass, Check, HelpCircle, MessageSquare, ShieldAlert, Send, Leaf,
  CreditCard, DollarSign, Bell, User, PlusIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const TRANSLATIONS: any = {
  en: {
    welcome: "Welcome",
    sub: "Kaya Kalp Ayurvedic Wellness Portal",
    overview: "Overview & Vitals",
    appointments: "Appointments",
    records: "Medical Vault & Lab Reports",
    reminders: "Treatment Plans & Meds",
    wellness: "Dinacharya Wellness Tracker",
    aiCoach: "AI Consultation & Chat",
    notifications: "Alerts & Notifications",
    payments: "Payment History",
    support: "Help & Support Tickets",
    healthScore: "Ayurvedic Health Score",
    upcoming: "Upcoming Consultations",
    previous: "Past Consultations",
    vitalsLogger: "Log Today's Vitals",
    vitalsTrend: "Vitals Progress Charts",
    bookBtn: "Book Appointment",
    chat: "Chat with Vaidya",
    remindersTitle: "Active Prescription Dosages",
    wellnessTitle: "Daily Wellness Checklist (Dinacharya)",
    supportTitle: "Raise Support Ticket"
  },
  hi: {
    welcome: "स्वागत है",
    sub: "काया कल्प आयुर्वेदिक वेलनेस पोर्टल",
    overview: "अवलोकन और महत्वपूर्ण मापदंड",
    appointments: "नियुक्तियां",
    records: "मेडिकल वॉल्ट और लैब रिपोर्ट्स",
    reminders: "उपचार योजनाएं और दवाएं",
    wellness: "दिनचर्या कल्याण ट्रैकर",
    aiCoach: "एआई परामर्श और चैट",
    notifications: "अलर्ट और सूचनाएं",
    payments: "भुगतान का इतिहास",
    support: "सहायता और टिकट",
    healthScore: "आयुर्वेदिक स्वास्थ्य स्कोर",
    upcoming: "आगामी परामर्श",
    previous: "पिछले परामर्श",
    vitalsLogger: "आज के मापदंड दर्ज करें",
    vitalsTrend: "स्वास्थ्य प्रगति चार्ट",
    bookBtn: "परामर्श बुक करें",
    chat: "वैद्य से बातचीत",
    remindersTitle: "सक्रिय नुस्खे की खुराक",
    wellnessTitle: "दैनिक दिनचर्या चेकलिस्ट",
    supportTitle: "सहायता टिकट दर्ज करें"
  }
};

export default function PatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'wellness' | 'treatmentPlans' | 'aiCoach' | 'notifications' | 'payments' | 'support'>('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Dashboard Data
  const [vitals, setVitals] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vitals form input
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [mood, setMood] = useState('Calm');
  const [vitalsSuccess, setVitalsSuccess] = useState(false);

  // Reschedule state
  const [rescheduleAppId, setRescheduleAppId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  // Support Tickets state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Dinacharya Daily Checklist state
  const [wellnessChecklist, setWellnessChecklist] = useState<any[]>([
    { id: 1, task: "Wake early before sunrise (Brahma Muhurta)", done: true },
    { id: 2, task: "Gentle tongue scraping (Jihwa Nirlekhana)", done: true },
    { id: 3, task: "Oil pulling with warm sesame oil (Gandusha)", done: false },
    { id: 4, task: "Self-massage with warm herbal oil (Abhyanga)", done: false },
    { id: 5, task: "Yoga pranayama breathing & meditation", done: true },
    { id: 6, task: "Consume warm balancing diet stews (Khichdi)", done: false }
  ]);

  // Simulated Chat
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'doctor', text: 'Namaste! How are your digestive symptoms today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Mock File Upload state
  const [uploadedRecords, setUploadedRecords] = useState<any[]>([
    { id: 1, name: 'Blood_Report_May2026.pdf', type: 'application/pdf', uploadedAt: '2026-05-12' },
    { id: 2, name: 'Chest_XRay_Spine.jpg', type: 'image/jpeg', uploadedAt: '2026-06-02' }
  ]);
  const [newRecordName, setNewRecordName] = useState('');

  // AI Symptom Checker
  const [aiSymptoms, setAiSymptoms] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Vitals logs tracker details
  const [loggedWater, setLoggedWater] = useState(2.0);
  const [loggedSleep, setLoggedSleep] = useState(7.0);

  const fetchDashboardData = async () => {
    try {
      const vitalsRes = await api.get('/health-tracker');
      if (vitalsRes.data && vitalsRes.data.success) {
        setVitals(vitalsRes.data.currentVitals);
        setHistory(vitalsRes.data.history || []);
        if (vitalsRes.data.currentVitals) {
          setWeight(vitalsRes.data.currentVitals.weight?.toString() || '');
          setBloodPressure(vitalsRes.data.currentVitals.bloodPressure || '');
          setBloodSugar(vitalsRes.data.currentVitals.bloodSugar?.toString() || '');
          setSleepHours(vitalsRes.data.currentVitals.sleepHours?.toString() || '');
          setWaterIntake(vitalsRes.data.currentVitals.waterIntake?.toString() || '');
          setExerciseMinutes(vitalsRes.data.currentVitals.exerciseMinutes?.toString() || '');
          setMood(vitalsRes.data.currentVitals.mood || 'Calm');
          setLoggedWater(vitalsRes.data.currentVitals.waterIntake || 2.0);
          setLoggedSleep(vitalsRes.data.currentVitals.sleepHours || 7.0);
        }
      }

      const appRes = await api.get('/appointments');
      if (appRes.data && appRes.data.success) {
        setAppointments(appRes.data.appointments || []);
      }

      const ticketRes = await api.get('/appointments/tickets');
      if (ticketRes.data && ticketRes.data.success) {
        setTickets(ticketRes.data.tickets || []);
      }

      const notifRes = await api.get('/appointments/notifications');
      if (notifRes.data && notifRes.data.success) {
        setNotifications(notifRes.data.notifications || []);
      }
    } catch (err) {
      console.error('Fetch dashboard data failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PATIENT')) {
      navigate('/auth');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const handleUpdateVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setVitalsSuccess(false);

    try {
      const res = await api.post('/health-tracker', {
        weight,
        bloodPressure,
        bloodSugar,
        sleepHours,
        waterIntake,
        exerciseMinutes,
        mood
      });
      if (res.data && res.data.success) {
        setVitalsSuccess(true);
        setLoggedWater(parseFloat(waterIntake) || loggedWater);
        setLoggedSleep(parseFloat(sleepHours) || loggedSleep);
        fetchDashboardData();
        setTimeout(() => setVitalsSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelAppointment = async (appId: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.put('/appointments', { appointmentId: appId, status: 'CANCELLED' });
      if (res.data && res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleError('');

    try {
      const res = await api.put('/appointments', {
        appointmentId: rescheduleAppId,
        date: rescheduleDate,
        timeSlot: rescheduleTime
      });
      if (res.data && res.data.success) {
        setRescheduleAppId(null);
        setRescheduleDate('');
        setRescheduleTime('');
        fetchDashboardData();
      }
    } catch (err: any) {
      setRescheduleError(err.response?.data?.error || 'Reschedule failed');
    }
  };

  const handleDownloadPrescription = (app: any) => {
    const medicines = JSON.parse(app.medicinesJSON || '[]');
    const text = `
-----------------------------------------------------------
          KAYA KALP AYURVEDIC WELLNESS CENTER
    102, Royal Avenue, New Palasia, Indore (M.P.)
-----------------------------------------------------------
Receipt ID: ${app.receiptId}
Date: ${app.date} | Time: ${app.timeSlot}
Doctor: ${app.doctor?.user?.name}
Specialization: ${app.doctor?.specialization}
Clinic: ${app.doctor?.clinicName}
Consultation Fee Paid: INR ${app.doctor?.fee}

Patient Name: ${user?.name}
Patient Age/Gender: ${user?.patientProfile?.age || 'N/A'} / ${user?.patientProfile?.gender || 'N/A'}

Clinical Assessment Notes:
${app.notes || 'Routine Checkup Consultation'}

Prescribed Ayurvedic Medicines:
${medicines.length === 0 ? 'No medicines prescribed.' : 
  medicines.map((m: any, i: number) => `${i+1}. ${m.name} - Dosage: ${m.dosage} | Timing: ${m.timing} | Duration: ${m.duration}`).join('\n')}

Next Scheduled Follow-up Date: ${app.nextFollowup || 'As needed'}

-----------------------------------------------------------
Thank you for choosing Kaya Kalp.
Disclaimer: Please consult your Vaidya before altering doses.
-----------------------------------------------------------
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KayaKalp_Prescription_${app.receiptId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadInvoice = (app: any) => {
    const text = `
===========================================================
               KAYA KALP CLINICAL INVOICE
===========================================================
Invoice ID: INV-${app.receiptId?.split('-')[1] || '12345'}
Date: ${app.date}
Time Slot: ${app.timeSlot}
Status: PAID (SUCCESS)
-----------------------------------------------------------
PROVIDER DETAILS:
Center: Kaya Kalp Wellness Clinic
Address: 102, Royal Avenue, Indore (M.P.)
Vaidya: ${app.doctor?.user?.name} (${app.doctor?.specialization})
-----------------------------------------------------------
PATIENT DETAILS:
Name: ${user?.name}
Email: ${user?.email}
Phone: ${user?.patientProfile?.phone || 'N/A'}
-----------------------------------------------------------
BILLING STATEMENT:
Description                         Amount
Consultation Booking Fee            ₹${app.doctor?.fee || 500}.00
GST (18%)                           ₹${((app.doctor?.fee || 500) * 0.18).toFixed(2)}
-----------------------------------------------------------
Total Paid Amount                   ₹${((app.doctor?.fee || 500) * 1.18).toFixed(2)}
Payment Mode                        UPI / Digital Wallet
===========================================================
This is a computer generated invoice and requires no signature.
===========================================================
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KayaKalp_Invoice_INV_${app.receiptId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAddMedicalRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordName) return;
    const newRecord = {
      id: Date.now(),
      name: newRecordName.endsWith('.pdf') ? newRecordName : `${newRecordName}.pdf`,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setUploadedRecords([...uploadedRecords, newRecord]);
    setNewRecordName('');
  };

  const handleDeleteRecord = (id: number) => {
    setUploadedRecords(uploadedRecords.filter(r => r.id !== id));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    try {
      const res = await api.post('/appointments/tickets', { subject: ticketSubject, description: ticketDesc });
      if (res.data && res.data.success) {
        setTickets([res.data.ticket, ...tickets]);
        setTicketSubject('');
        setTicketDesc('');
        setTicketSuccess(true);
        setTimeout(() => setTicketSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklist = (id: number) => {
    setWellnessChecklist(wellnessChecklist.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    const newMsg = { sender: 'patient', text: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'doctor',
        text: 'Understood. Ensure you are taking your customized herbs with warm water after lunch. Keep monitoring your sleep hours!'
      }]);
    }, 1000);
  };

  const handleRunAiCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSymptoms) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiResult({
        primaryDosha: 'Vata-Pitta Imbalance (Aggravated by dry weather and stress)',
        dietRecommendation: 'Consume warm, sweet, oily foods, baked sweet potatoes, and organic ghee. Avoid raw salads or cold beverages.',
        yogaAsana: 'Baddha Konasana (Bound Angle Pose) & Balasana (Child Pose) to ground nervous energy.',
        herbRemedy: 'Take Ashwagandha powder (1/2 tsp) with warm milk at night and Amalaki churna (1/2 tsp) after meals.'
      });
    }, 1200);
  };

  const handleMarkNotificationRead = async (notifId: number) => {
    try {
      const res = await api.put(`/appointments/notifications/${notifId}/read`);
      if (res.data && res.data.success) {
        setNotifications(notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // BMI calculation
  const getBmiDetails = () => {
    const w = vitals?.weight || user?.patientProfile?.weight || 70;
    const h = user?.patientProfile?.height || 170;
    if (!w || !h) return { score: 'N/A', category: 'Unknown', color: 'text-stone-400', progress: 50 };

    const bmi = w / ((h / 100) * (h / 100));
    let category = 'Normal';
    let color = 'text-emerald-600';
    let progress = 50; // percentage
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; progress = 25; }
    else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; color = 'text-amber-500'; progress = 75; }
    else if (bmi >= 30) { category = 'Obese'; color = 'text-red-500'; progress = 95; }

    return { score: bmi.toFixed(1), category, color, progress };
  };

  // Dynamic Dosha Breakdown calculation based on profile details
  const getDoshaBreakdown = () => {
    const profile = user?.patientProfile || {};
    let vata = 35;
    let pitta = 35;
    let kapha = 30;

    if (profile.stressLevel === 'High') { vata += 15; pitta -= 5; kapha -= 10; }
    if (profile.mood === 'Anxious') { vata += 15; kapha -= 15; }
    if (profile.mood === 'Energetic') { pitta += 10; }
    if ((profile.weight || 70) > 85) { kapha += 20; vata -= 10; pitta -= 10; }
    if ((profile.bloodSugar || 95) > 110) { kapha += 10; }
    if (profile.allergies?.toLowerCase().includes('skin') || profile.medicalHistory?.toLowerCase().includes('acne')) { pitta += 15; vata -= 5; kapha -= 10; }

    const total = vata + pitta + kapha;
    const vataPct = Math.round((vata / total) * 100);
    const pittaPct = Math.round((pitta / total) * 100);
    const kaphaPct = Math.round((kapha / total) * 100);

    let primary = 'Vata';
    if (pittaPct > vataPct && pittaPct > kaphaPct) primary = 'Pitta';
    if (kaphaPct > vataPct && kaphaPct > pittaPct) primary = 'Kapha';

    return {
      vata: vataPct,
      pitta: pittaPct,
      kapha: kaphaPct,
      primary,
      data: [
        { name: 'Vata', value: vataPct, color: '#C59B67' },
        { name: 'Pitta', value: pittaPct, color: '#DC2626' },
        { name: 'Kapha', value: kaphaPct, color: '#2E5A44' }
      ]
    };
  };

  // Diet & Yoga plan definitions by Dosha
  const DIET_YOGA_PLANS: any = {
    Vata: {
      diet: [
        { category: "Recommended Foods", items: "Warm cooked grains (oats, rice), sweet root vegetables, soups, ghee, ripe sweet fruits, hot milk." },
        { category: "Foods to Avoid", items: "Raw vegetables, salads, cold dry foods, cabbage, broccoli, ice cold drinks." },
        { category: "Diet Rule", items: "Maintain strict meal timings. Eat in a quiet, warm environment." }
      ],
      yoga: [
        { posture: "Balasana (Child Pose)", desc: "Relaxes the central nervous system, calms Vata anxiety, and grounds energy." },
        { posture: "Virabhadrasana (Warrior I)", desc: "Builds strength, stability, and concentration." },
        { posture: "Nadi Shodhana Pranayama", desc: "Alternate nostril breathing to balance the right and left brain channels." }
      ]
    },
    Pitta: {
      diet: [
        { category: "Recommended Foods", items: "Sweet, cooling, refreshing foods. Cucumber, coconut water, sweet melons, green leafy vegetables, milk, wheat." },
        { category: "Foods to Avoid", items: "Sour, spicy, hot foods, tomatoes, chili, garlic, red meat, alcohol, coffee." },
        { category: "Diet Rule", items: "Avoid skipping meals. Eat cooling herbs like coriander and fennel." }
      ],
      yoga: [
        { posture: "Chandra Namaskar (Moon Salutation)", desc: "Cooling and soothing flow sequence, calming Pitta competitiveness." },
        { posture: "Bhujangasana (Cobra Pose)", desc: "Stretches chest and regulates liver/gallbladder heat." },
        { posture: "Sitali Pranayama", desc: "Cooling tongue-hissing breath to instantly lower core body temperature." }
      ]
    },
    Kapha: {
      diet: [
        { category: "Recommended Foods", items: "Light, dry, warm, and spicy foods. Bitter greens, beans, apples, hot ginger tea, millets (ragi, bajra)." },
        { category: "Foods to Avoid", items: "Dairy products, cold sweets, heavy oils, avocados, cold water." },
        { category: "Diet Rule", items: "Favour dry and light snacks. Fasting once a week on warm fluids is beneficial." }
      ],
      yoga: [
        { posture: "Surya Namaskar (Sun Salutation)", desc: "Dynamic heating poses to clear Kapha sluggishness and build circulation." },
        { posture: "Dhanurasana (Bow Pose)", desc: "Activates sluggish endocrine glands and kindles digestive Agni." },
        { posture: "Kapalabhati Pranayama", desc: "Skull shining breath to clear chest congestion and stimulate metabolic fires." }
      ]
    }
  };

  const SimulatedLabReports = [
    { test: "Fasting Blood Sugar", result: vitals?.bloodSugar || "95 mg/dL", range: "70-100 mg/dL", status: (vitals?.bloodSugar || 95) > 105 ? "High" : "Normal" },
    { test: "Serum Cholesterol", result: "185 mg/dL", range: "< 200 mg/dL", status: "Normal" },
    { test: "Hemoglobin", result: "14.2 g/dL", range: "12.0-16.0 g/dL", status: "Normal" },
    { test: "TSH (Thyroid)", result: "2.4 mIU/L", range: "0.4-4.5 mIU/L", status: "Normal" }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-550">Loading Kaya Kalp Portal...</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(app => app.status === 'CONFIRMED' || app.status === 'PENDING');
  const pastAppointments = appointments.filter(app => app.status === 'COMPLETED' || app.status === 'CANCELLED');
  
  const getCountdownText = () => {
    const conf = upcomingAppointments.find(a => a.status === 'CONFIRMED');
    if (!conf) return 'No upcoming visits scheduled';
    return `${conf.date} at ${conf.timeSlot}`;
  };

  const text = TRANSLATIONS[lang];
  const bmiInfo = getBmiDetails();
  const doshaInfo = getDoshaBreakdown();
  const activePlan = DIET_YOGA_PLANS[doshaInfo.primary];
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`min-h-screen transition-colors duration-250 ${darkMode ? 'bg-[#0E1310] text-stone-100' : 'bg-[#F6F7F5] text-stone-850'}`}>
      
      {/* Top Banner Bar */}
      <div className="border-b border-stone-200/50 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ayur-primary flex items-center justify-center text-white">
              <Leaf className="w-4 h-4 text-emerald-100" />
            </div>
            <span className="font-extrabold text-xs tracking-wider uppercase">Kaya Kalp Patient Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications badge */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center relative"
            >
              <Bell className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="p-2 px-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            <button
              onClick={() => navigate('/doctors')}
              className="px-4.5 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary shadow-sm"
            >
              {text.bookBtn}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar navigation */}
          <div className="lg:col-span-3 space-y-3 bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 p-5 rounded-[28px] shadow-sm">
            <div className="flex items-center gap-3 pb-5 border-b border-stone-150 dark:border-stone-800">
              <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-ayur-primary flex items-center justify-center font-bold text-lg border border-emerald-150/50">
                {user?.name?.charAt(0) || 'N'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-stone-850 dark:text-white truncate">{user?.name}</h4>
                <span className="text-[10px] text-stone-400 font-bold block mt-1 truncate">{user?.email}</span>
              </div>
            </div>

            <nav className="space-y-1 pt-3">
              {[
                { id: 'overview', label: text.overview, icon: Compass },
                { id: 'appointments', label: text.appointments, icon: Calendar },
                { id: 'records', label: text.records, icon: FileText },
                { id: 'wellness', label: text.wellness, icon: Heart },
                { id: 'treatmentPlans', label: text.reminders, icon: Clock },
                { id: 'aiCoach', label: text.aiCoach, icon: Activity },
                { id: 'notifications', label: `${text.notifications} (${unreadNotifCount})`, icon: Bell },
                { id: 'payments', label: text.payments, icon: CreditCard },
                { id: 'support', label: text.support, icon: HelpCircle }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-ayur-primary text-white shadow-md shadow-emerald-950/15' 
                        : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Workspaces */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* TAB 1: Overview & Vitals */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Hero countdown card */}
                <div className="p-6 rounded-[28px] bg-gradient-to-r from-emerald-950 to-emerald-900 text-white space-y-4 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-800/10 rounded-full blur-2xl"></div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] bg-emerald-800/80 text-emerald-250 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Appointment Alert
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">Next Scheduled consultation with Vaidya</h3>
                    <p className="text-xs sm:text-sm text-emerald-200 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-ayur-accent" />
                      <span>{getCountdownText()}</span>
                    </p>
                  </div>
                </div>

                {/* Vitals summary grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Gauge 1: Ayurvedic health score */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm flex flex-col justify-between items-center text-center">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block w-full text-left">
                      {text.healthScore}
                    </h3>
                    <div className="relative w-28 h-28 my-4 flex items-center justify-center rounded-full border-4 border-emerald-50 dark:border-emerald-950/20">
                      <div className="absolute inset-2 rounded-full border-4 border-dashed border-ayur-primary animate-spin" style={{ animationDuration: '24s' }}></div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-stone-850 dark:text-white">84%</div>
                        <div className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Balanced</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
                      Primary imbalance: {doshaInfo.primary} aggravated. Diet plans are helping digest Ama well!
                    </p>
                  </div>

                  {/* Gauge 2: BMI Calculator */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm flex flex-col justify-between space-y-4">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      BMI Classification
                    </h3>
                    <div className="space-y-2 text-center pt-2">
                      <div className="text-3xl font-black text-stone-850 dark:text-white">{bmiInfo.score}</div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${bmiInfo.color}`}>
                        {bmiInfo.category}
                      </div>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-ayur-primary h-full transition-all duration-500" 
                        style={{ width: `${bmiInfo.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 text-center leading-normal">
                      Based on registered stats: {user?.patientProfile?.height || 170}cm / {vitals?.weight || 70}kg.
                    </p>
                  </div>

                  {/* Vitals Summary logs */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      Logged Vitals Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: 'Weight', value: `${vitals?.weight || 70} kg` },
                        { label: 'Blood Pressure', value: vitals?.bloodPressure || '120/80' },
                        { label: 'Blood Sugar', value: `${vitals?.bloodSugar || 95} mg/dL` },
                        { label: 'Sleep hours', value: `${vitals?.sleepHours || 7.5} hrs` }
                      ].map((v, i) => (
                        <div key={i} className="p-2.5 bg-[#F6F7F5] dark:bg-[#1C241F] rounded-xl border border-stone-150 dark:border-stone-800">
                          <span className="text-[9px] text-stone-450 dark:text-stone-500 block font-bold">{v.label}</span>
                          <span className="font-bold text-stone-800 dark:text-white text-xs">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Dosha pie chart representation */}
                  <div className="md:col-span-4 p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4 flex flex-col justify-between">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      Dosha Assessment Profile
                    </h3>
                    <div className="flex flex-col gap-3 py-2">
                      {doshaInfo.data.map((d, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                              {d.name}
                            </span>
                            <span>{d.value}%</span>
                          </div>
                          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${d.value}%`, backgroundColor: d.color }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-stone-500 text-center font-medium">
                      Primary Imbalance: <strong className="text-ayur-primary">{doshaInfo.primary}</strong>
                    </div>
                  </div>

                  {/* Vitals charts */}
                  <div className="md:col-span-8 p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      {text.vitalsTrend}
                    </h3>
                    {history.length > 0 ? (
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                            <XAxis dataKey="name" stroke="#888" fontSize={9} />
                            <YAxis stroke="#888" fontSize={9} />
                            <Tooltip contentStyle={{ fontSize: '10px' }} />
                            <Line type="monotone" dataKey="weight" stroke="#2E5A44" strokeWidth={2} name="Weight (kg)" />
                            <Line type="monotone" dataKey="bloodSugar" stroke="#C59B67" strokeWidth={2} name="Sugar (mg/dL)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">No vital logs history available.</p>
                    )}
                  </div>
                </div>

                {/* Vitals Logger Form */}
                <div className="p-6 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                    {text.vitalsLogger}
                  </h3>
                  {vitalsSuccess && (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-150 text-ayur-primary text-xs font-semibold">
                      Vitals updated successfully!
                    </div>
                  )}
                  <form onSubmit={handleUpdateVitals} className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Weight (kg)</label>
                      <input
                        type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Blood Pressure</label>
                      <input
                        type="text" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Sugar (mg/dL)</label>
                      <input
                        type="number" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Sleep (hours)</label>
                      <input
                        type="number" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Water Intake (Liters)</label>
                      <input
                        type="number" step="0.1" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Exercise (mins)</label>
                      <input
                        type="number" value={exerciseMinutes} onChange={(e) => setExerciseMinutes(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Daily Mood</label>
                      <select value={mood} onChange={(e) => setMood(e.target.value)}
                        className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      >
                        <option>Calm</option>
                        <option>Energetic</option>
                        <option>Anxious</option>
                        <option>Stressed</option>
                        <option>Sluggish</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button type="submit" className="w-full py-2.5 bg-ayur-primary text-white rounded-lg font-bold hover:bg-ayur-secondary text-xs shadow-sm">
                        Log Vitals
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 2: Appointments */}
            {activeTab === 'appointments' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Reschedule module inline */}
                {rescheduleAppId && (
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-4">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Reschedule Consultation Appointment</span>
                    <form onSubmit={handleRescheduleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 block">Date</label>
                        <input
                          type="date" required value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white dark:bg-stone-850 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 block">Time Slot</label>
                        <select required value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white dark:bg-stone-850 rounded-lg text-xs"
                        >
                          <option value="">Select Time Slot</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:30">11:30 AM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:30">03:30 PM</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="w-1/2 py-2 bg-ayur-primary text-white rounded-lg text-xs font-bold hover:bg-ayur-secondary">
                          Reschedule
                        </button>
                        <button type="button" onClick={() => setRescheduleAppId(null)} className="w-1/2 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-bold bg-white">
                          Cancel
                        </button>
                      </div>
                    </form>
                    {rescheduleError && <span className="text-xs text-red-500">{rescheduleError}</span>}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-ayur-primary" />
                    <span>{text.upcoming}</span>
                  </h3>

                  {upcomingAppointments.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 rounded-[24px] text-xs text-stone-400">
                      No upcoming consults scheduled.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAppointments.map(app => (
                        <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 bg-white dark:bg-[#151B17] flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-stone-905 dark:text-white text-sm">{app.doctor?.user?.name}</div>
                            <div className="text-[10px] text-ayur-primary font-bold mt-0.5">{app.doctor?.specialization}</div>
                            <div className="text-stone-500 dark:text-stone-400 mt-2 font-medium flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{app.date} &bull; {app.timeSlot} ({app.visitType || 'Clinic'})</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setRescheduleAppId(app.id);
                                setRescheduleDate(app.date);
                              }}
                              className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 text-[10px]"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(app.id)}
                              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] dark:bg-red-500/10 dark:text-red-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-ayur-primary" />
                    <span>{text.previous}</span>
                  </h3>
                  {pastAppointments.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">No past appointments logged.</p>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.map(app => (
                        <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800/80 bg-white dark:bg-[#151B17] text-xs space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-stone-900 dark:text-white text-sm">{app.doctor?.user?.name}</div>
                              <div className="text-[10px] text-stone-400 mt-0.5">{app.date} &bull; {app.timeSlot}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadPrescription(app)}
                                className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-[10px] font-bold flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </button>
                              <button
                                onClick={() => handleDownloadInvoice(app)}
                                className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-[10px] font-bold flex items-center gap-1"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                            </div>
                          </div>
                          
                          {app.notes && (
                            <div className="p-3 bg-stone-50 dark:bg-stone-800/30 border border-stone-105 dark:border-stone-800/80 rounded-xl text-stone-650 dark:text-stone-300">
                              <div className="font-bold text-[9px] uppercase tracking-widest text-stone-400 mb-1">Doctor Assessment Notes</div>
                              <p className="italic text-xs">"{app.notes}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: Records & Reports Vault */}
            {activeTab === 'records' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Lab Reports Tables */}
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-ayur-primary" />
                    <span>Clinical Lab Reports</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase text-[9px] tracking-widest">
                          <th className="py-2.5">Diagnostic Test</th>
                          <th className="py-2.5">Your Value</th>
                          <th className="py-2.5">Reference Range</th>
                          <th className="py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                        {SimulatedLabReports.map((row, i) => (
                          <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/10">
                            <td className="py-3 font-bold text-stone-800 dark:text-stone-200">{row.test}</td>
                            <td className="py-3">{row.result}</td>
                            <td className="py-3 text-stone-450 dark:text-stone-500">{row.range}</td>
                            <td className="py-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'High' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Upload vault */}
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-ayur-primary" />
                    <span>Health Records & Uploads Vault</span>
                  </h3>
                  
                  <form onSubmit={handleAddMedicalRecord} className="flex gap-2">
                    <input
                      type="text" required placeholder="Enter report name (e.g. Lipids_June)..." value={newRecordName} onChange={(e) => setNewRecordName(e.target.value)}
                      className="w-2/3 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                    />
                    <button type="submit" className="w-1/3 py-2.5 bg-ayur-primary text-white rounded-xl text-xs font-bold hover:bg-ayur-secondary flex items-center justify-center gap-1 shadow-sm">
                      <Plus className="w-4 h-4" />
                      <span>Upload Report</span>
                    </button>
                  </form>

                  <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                    {uploadedRecords.map(record => (
                      <div key={record.id} className="flex justify-between items-center p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-800 text-xs">
                        <div>
                          <div className="font-bold text-stone-850 dark:text-white flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-stone-400" />
                            <span>{record.name}</span>
                          </div>
                          <span className="text-[10px] text-stone-450 dark:text-stone-500 block mt-0.5">Uploaded on: {record.uploadedAt}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-650 dark:bg-red-500/10 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: Wellness Tracker */}
            {activeTab === 'wellness' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Dinacharya checklist */}
                <div className="md:col-span-7 p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-ayur-primary" />
                    <span>Daily Ayurvedic Habits (Dinacharya)</span>
                  </h3>
                  <div className="space-y-2">
                    {wellnessChecklist.map(t => (
                      <button
                        key={t.id} onClick={() => handleToggleChecklist(t.id)}
                        className="flex items-start gap-3 w-full p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/20 dark:bg-stone-800/10 hover:bg-stone-50 dark:hover:bg-stone-800 text-left text-xs transition-all"
                      >
                        <span className={`w-4.5 h-4.5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${t.done ? 'bg-ayur-primary border-transparent text-white' : 'border-stone-300 bg-white dark:bg-stone-800'}`}>
                          {t.done && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <span className={t.done ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-750 dark:text-stone-200 font-medium'}>
                          {t.task}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vitals logs trackers water/sleep */}
                <div className="md:col-span-5 space-y-6">
                  
                  {/* Water logging details */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-3">
                    <h4 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Water Logging Goal</h4>
                    <div className="flex justify-between items-baseline py-2">
                      <span className="text-3xl font-black text-ayur-primary">{loggedWater} L</span>
                      <span className="text-xs text-stone-400 font-bold">Goal: 2.5 Liters</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setLoggedWater(prev => parseFloat((prev + 0.25).toFixed(2)))} className="w-1/2 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-ayur-primary dark:text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-100">
                        + 250ml
                      </button>
                      <button onClick={() => setLoggedWater(2.0)} className="w-1/2 py-2 border border-stone-200 text-stone-605 text-xs font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-850">
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Sleep tracking details */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-3">
                    <h4 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Sleep Hours Logged</h4>
                    <div className="flex justify-between items-baseline py-2">
                      <span className="text-3xl font-black text-stone-850 dark:text-white">{loggedSleep} hrs</span>
                      <span className="text-xs text-stone-400 font-bold">Goal: 7-8 Hours</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setLoggedSleep(prev => parseFloat((prev + 0.5).toFixed(1)))} className="w-1/2 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-ayur-primary dark:text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-100">
                        + 30 Mins
                      </button>
                      <button onClick={() => setLoggedSleep(7.0)} className="w-1/2 py-2 border border-stone-200 text-stone-605 text-xs font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-850">
                        Reset
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: Treatment Plans */}
            {activeTab === 'treatmentPlans' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Active Prescribed Meds details */}
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-ayur-primary" />
                    <span>Active Herb Reminders</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Ashwagandha Churna', dosage: '1/2 tsp', timing: 'With warm milk before bed', duration: '30 days', remaining: '12 days left' },
                      { name: 'Triphala Tablets', dosage: '1 tablet', timing: 'After dinner with warm water', duration: '15 days', remaining: '4 days left' }
                    ].map((med, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/5 dark:bg-emerald-950/5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white text-sm">{med.name}</div>
                          <div className="text-stone-500 dark:text-stone-400 mt-1 font-medium">{med.dosage} &bull; {med.timing}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-350 px-2.5 py-1 rounded font-bold">{med.remaining}</span>
                          <button
                            onClick={() => alert(`Refill requested successfully for: ${med.name}`)}
                            className="text-[10px] text-ayur-primary font-bold block mt-2 hover:underline"
                          >
                            Request Refill
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diet and Yoga plan custom by Dosha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Diet Plan Card */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-ayur-primary" />
                      <span>Dosha Balancing Diet Plan ({doshaInfo.primary})</span>
                    </h3>
                    <div className="space-y-3.5">
                      {activePlan.diet.map((item: any, i: number) => (
                        <div key={i} className="text-xs space-y-1">
                          <span className="font-bold text-stone-450 dark:text-stone-500 uppercase text-[9px] tracking-wider block">{item.category}</span>
                          <p className="text-stone-750 dark:text-stone-250 leading-relaxed font-medium">{item.items}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yoga Plan Card */}
                  <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-ayur-primary" />
                      <span>Custom Yoga Asanas ({doshaInfo.primary})</span>
                    </h3>
                    <div className="space-y-4">
                      {activePlan.yoga.map((item: any, i: number) => (
                        <div key={i} className="text-xs space-y-1 border-b border-stone-100 dark:border-stone-800 pb-2.5 last:border-0 last:pb-0">
                          <span className="font-bold text-ayur-primary dark:text-emerald-400 block">{item.posture}</span>
                          <p className="text-stone-500 dark:text-stone-400 leading-normal font-medium">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 6: AI Coach Symptom Checker & Chat */}
            {activeTab === 'aiCoach' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* AI Analyzer */}
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-ayur-primary" />
                    Ayurvedic AI Symptom Checker
                  </h3>
                  
                  <form onSubmit={handleRunAiCheck} className="space-y-3">
                    <textarea
                      placeholder="Write your symptoms in detail (e.g. feeling abdominal gas/acidity after eating warm food, or joint ache in cold morning)..."
                      required rows={3} value={aiSymptoms} onChange={(e) => setAiSymptoms(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                    />
                    <button type="submit" className="px-4.5 py-2.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary shadow-sm transition-all">
                      {aiLoading ? 'Running Imbalance Matrix Check...' : 'Analyze Symptoms'}
                    </button>
                  </form>

                  {aiResult && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs space-y-4 animate-fadeIn">
                      <div>
                        <strong className="text-emerald-800 dark:text-emerald-400 text-[10px] uppercase tracking-wider block mb-1">AI Diagnosis Assessment:</strong>
                        <p className="text-stone-700 dark:text-stone-200 font-medium">{aiResult.primaryDosha}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800 dark:text-emerald-400 text-[10px] uppercase tracking-wider block mb-1">Balancing Diet Guidelines:</strong>
                        <p className="text-stone-700 dark:text-stone-200 font-medium leading-relaxed">{aiResult.dietRecommendation}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800 dark:text-emerald-400 text-[10px] uppercase tracking-wider block mb-1">Recommended Balancing Herbs:</strong>
                        <p className="text-stone-700 dark:text-stone-200 font-medium leading-relaxed">{aiResult.herbRemedy}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800 dark:text-emerald-400 text-[10px] uppercase tracking-wider block mb-1">Suggested Yoga Postures:</strong>
                        <p className="text-stone-700 dark:text-stone-200 font-medium">{aiResult.yogaAsana}</p>
                      </div>
                      <div className="border-t border-emerald-500/10 pt-3 flex justify-between items-center text-[10px]">
                        <span className="text-stone-400">Match recommendation with:</span>
                        <Link to="/doctors" className="font-bold text-ayur-primary hover:underline">Consult Panchakarma Specialist</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vaidya Chat Console */}
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-ayur-primary" />
                    <span>{text.chat}</span>
                  </h3>
                  
                  <div className="p-4 bg-stone-50 dark:bg-stone-850/50 border border-stone-200/30 rounded-2xl h-52 overflow-y-auto space-y-3.5">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[75%] text-xs ${msg.sender === 'patient' ? 'bg-ayur-primary text-white shadow-sm' : 'bg-white dark:bg-stone-800 border border-stone-200/40 dark:border-stone-800/80 text-stone-800 dark:text-stone-200'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text" placeholder="Type message or update to Vaidya..." value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                    />
                    <button type="submit" className="px-4.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary flex items-center gap-1 shadow-sm transition-all">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 7: Notifications Drawer */}
            {activeTab === 'notifications' && (
              <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4 animate-fadeIn">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-ayur-primary" />
                  <span>Recent Notifications logs</span>
                </h3>
                
                {notifications.length === 0 ? (
                  <p className="text-xs text-stone-400 italic text-center py-6">No recent alerts or notifications.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 rounded-xl border flex justify-between items-start text-xs transition-all ${notif.isRead ? 'bg-stone-50/50 dark:bg-stone-850/10 border-stone-100 dark:border-stone-900 text-stone-500' : 'bg-emerald-500/5 border-emerald-500/10 text-stone-800 dark:text-stone-200 font-semibold shadow-inner'}`}>
                        <div className="space-y-1">
                          <p className="text-xs">{notif.message}</p>
                          <span className="text-[9px] text-stone-400 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkNotificationRead(notif.id)}
                            className="px-2 py-1 rounded bg-emerald-50 text-[10px] text-ayur-primary font-bold hover:bg-emerald-100"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: Payment History */}
            {activeTab === 'payments' && (
              <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4 animate-fadeIn">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-ayur-primary" />
                  <span>Clinical Consultation Payments</span>
                </h3>

                {appointments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No consult booking records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase text-[9px] tracking-widest">
                          <th className="py-2.5">Receipt ID</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">Consultant Vaidya</th>
                          <th className="py-2.5">Amount paid</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                        {appointments.map((app, i) => (
                          <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/10">
                            <td className="py-3 font-mono">{app.receiptId || 'REC-MOCK'}</td>
                            <td className="py-3">{app.date}</td>
                            <td className="py-3 font-bold text-stone-800 dark:text-stone-200">{app.doctor?.user?.name || 'Ayurvedic Consultant'}</td>
                            <td className="py-3 font-bold">₹{app.doctor?.fee || 500}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 uppercase tracking-wider">
                                SUCCESS
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDownloadInvoice(app)}
                                className="px-2.5 py-1 rounded bg-[#F6F7F5] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 text-[10px] font-bold"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: Support Tickets */}
            {activeTab === 'support' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-ayur-primary" />
                    <span>{text.supportTitle}</span>
                  </h3>
                  {ticketSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-250 text-ayur-primary text-xs font-semibold">
                      Support Ticket raised successfully!
                    </div>
                  )}
                  <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-stone-500 font-bold block">Subject</label>
                      <input
                        type="text" placeholder="e.g. Issues downloading prescription receipt, rescheduling..." required
                        value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-stone-500 font-bold block">Description of Issue</label>
                      <textarea
                        placeholder="Please provide details about your issue..." required rows={3}
                        value={ticketDesc} onChange={(e) => setTicketDesc(e.target.value)}
                        className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded-lg text-xs"
                      />
                    </div>
                    <button type="submit" className="px-4.5 py-2.5 bg-ayur-primary text-white rounded-xl font-bold hover:bg-ayur-secondary shadow-sm transition-all">
                      Submit Ticket
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">Active Support Tickets</h4>
                  {tickets.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No support tickets raised.</p>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map(t => (
                        <div key={t.id} className="p-4 rounded-xl bg-white dark:bg-[#151B17] border border-stone-200/50 dark:border-stone-800/80 text-xs space-y-2.5">
                          <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-850 pb-2">
                            <span className="font-bold text-stone-900 dark:text-white">{t.subject}</span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {t.status}
                            </span>
                          </div>
                          <p className="text-stone-550 dark:text-stone-400">{t.description}</p>
                          {t.response && (
                            <div className="p-3 bg-stone-50 dark:bg-stone-800/20 border-l-2 border-ayur-primary rounded text-stone-605 dark:text-stone-300">
                              <strong>Reply from Admin:</strong> {t.response}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
