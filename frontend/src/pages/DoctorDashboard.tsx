import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Users, Calendar, FileText, Clock, Plus, Award, 
  Trash2, CheckCircle2, ChevronRight, User, Heart,
  Bell, Search, RefreshCw, Send, CheckSquare, Square, 
  Download, Share2, ClipboardList, TrendingUp, Sun, Moon, Globe, MessageSquare
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Translation Dictionary for Doctor Portal
const TRANSLATIONS: any = {
  en: {
    welcome: "Welcome, Vaidya",
    sub: "Doctor Consultation Console",
    practiceSettings: "Manage Practice Settings",
    availDays: "Configure Available Working Days",
    analytics: "Practice Performance Analytics",
    earnings: "Total Monthly Revenue",
    queue: "Patient Bookings Queue",
    recentlySeen: "Recently Seen Patients Registry",
    notesLabel: "Ayurvedic Assessment & Prescription Notes",
    tasksLabel: "Doctor Tasks Checklist",
    saveBtn: "Save Settings"
  },
  hi: {
    welcome: "स्वागत है, वैद्य जी",
    sub: "चिकित्सक परामर्श कंसोल",
    practiceSettings: "अभ्यास सेटिंग्स प्रबंधित करें",
    availDays: "कार्य दिवसों को कॉन्फ़िगर करें",
    analytics: "अभ्यास प्रदर्शन विश्लेषण",
    earnings: "कुल मासिक आय",
    queue: "रोगी बुकिंग कतार",
    recentlySeen: "हाल ही में देखे गए मरीजों की सूची",
    notesLabel: "आयुर्वेदिक मूल्यांकन और नुस्खा नोट्स",
    tasksLabel: "चिकित्सक कार्य चेकलिस्ट",
    saveBtn: "सेटिंग्स सहेजें"
  }
};

export default function DoctorDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Availability & Timings
  const [availDays, setAvailDays] = useState<number[]>([]);
  const [availSuccess, setAvailSuccess] = useState(false);

  // Edit profile form state
  const [editQualification, setEditQualification] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editClinicName, setEditClinicName] = useState('');
  const [editFee, setEditFee] = useState('');
  const [editCertificates, setEditCertificates] = useState('');
  const [editConsultModes, setEditConsultModes] = useState('Clinic, Online');
  const [editBreakTime, setEditBreakTime] = useState('13:00 - 14:00');
  const [editHolidays, setEditHolidays] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Theme & Language
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Simulated Doctor Chat
  const [doctorMessages, setDoctorMessages] = useState<any[]>([
    { sender: 'patient', text: 'Namaste doctor! I wanted to check if I can eat salads at dinner?' },
    { sender: 'doctor', text: 'Namaste! Salads are raw and dry (Ruksha), which aggravates Vata. Please avoid raw foods at dinner; opt for warm cooked stews instead.' }
  ]);
  const [doctorChatInput, setDoctorChatInput] = useState('');

  // Filtering & Search
  const [statusFilter, setStatusFilter] = useState<'TODAY' | 'WEEK' | 'PENDING' | 'CANCELLED' | 'COMPLETED'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');

  // Active consultation state
  const [consultingAppId, setConsultingAppId] = useState<number | null>(null);
  const [consultingPatient, setConsultingPatient] = useState<any>(null);
  
  // Structured visit notes form
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prakriti, setPrakriti] = useState('Vata-Pitta');
  const [vikriti, setVikriti] = useState('Vata Aggravation');
  const [doshaImbalance, setDoshaImbalance] = useState('Apana Vata blocks');
  const [visitPlan, setVisitPlan] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');

  // Prescription builder
  const [medsList, setMedsList] = useState<any[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedTiming, setNewMedTiming] = useState('After food');
  const [newMedDuration, setNewMedDuration] = useState('7 days');

  // Doctor Tasks state
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Inline Reschedule modal state
  const [reschedulingAppId, setReschedulingAppId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('10:00');

  const fetchDoctorData = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data && res.data.success) {
        setAppointments(res.data.appointments || []);
      }

      // Load profile and availability
      const authRes = await api.get('/auth/me');
      if (authRes.data && authRes.data.authenticated) {
        const docProf = authRes.data.user.doctorProfile;
        setProfile(docProf);
        if (docProf) {
          setEditQualification(docProf.qualification || '');
          setEditBio(docProf.bio || '');
          setEditClinicName(docProf.clinicName || '');
          setEditFee(docProf.fee ? String(docProf.fee) : '500');
          setEditCertificates(docProf.certificates || '');
          setEditConsultModes(docProf.consultModes || 'Clinic, Online');
          setEditBreakTime(docProf.breakTime || '13:00 - 14:00');
          setEditHolidays(docProf.holidays || '');
        }
        
        const docRes = await api.get('/doctors');
        if (docRes.data && docRes.data.success) {
          const thisDoc = docRes.data.doctors.find((d: any) => d.id === docProf.id);
          if (thisDoc && thisDoc.availabilities) {
            setAvailDays(thisDoc.availabilities.map((a: any) => a.dayOfWeek));
          }
        }
      }

      // Load Tasks
      const tasksRes = await api.get('/appointments/tasks');
      if (tasksRes.data && tasksRes.data.success) {
        setTasks(tasksRes.data.tasks || []);
      }

      // Load Notifications
      const notifRes = await api.get('/appointments/notifications');
      if (notifRes.data && notifRes.data.success) {
        setNotifications(notifRes.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'DOCTOR')) {
      navigate('/auth');
    } else if (user) {
      fetchDoctorData();
    }
  }, [user, authLoading, navigate]);

  // Profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/doctors/profile', {
        qualification: editQualification,
        bio: editBio,
        clinicName: editClinicName,
        fee: parseFloat(editFee) || 500,
        certificates: editCertificates,
        consultModes: editConsultModes,
        breakTime: editBreakTime,
        holidays: editHolidays
      });
      if (res.data && res.data.success) {
        setProfile(res.data.profile);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Availability checkboxes
  const handleUpdateAvailability = async (day: number) => {
    let nextDays = [...availDays];
    if (nextDays.includes(day)) {
      nextDays = nextDays.filter(d => d !== day);
    } else {
      nextDays.push(day);
    }
    setAvailDays(nextDays);

    try {
      const res = await api.post('/doctors/availability', { availabilities: nextDays });
      if (res.data && res.data.success) {
        setAvailSuccess(true);
        setTimeout(() => setAvailSuccess(false), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reschedule slots
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppId || !rescheduleDate) return;
    try {
      const res = await api.put('/appointments', {
        appointmentId: reschedulingAppId,
        date: rescheduleDate,
        timeSlot: rescheduleSlot
      });
      if (res.data && res.data.success) {
        setReschedulingAppId(null);
        fetchDoctorData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Reschedule error');
    }
  };

  // Approve & Reject
  const handleApproveAppointment = async (appId: number) => {
    try {
      const res = await api.put('/appointments', { appointmentId: appId, status: 'CONFIRMED' });
      if (res.data && res.data.success) {
        fetchDoctorData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectAppointment = async (appId: number) => {
    try {
      const res = await api.put('/appointments', { appointmentId: appId, status: 'CANCELLED' });
      if (res.data && res.data.success) {
        fetchDoctorData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Start consult workspace
  const startConsultation = (app: any) => {
    setConsultingAppId(app.id);
    setConsultingPatient(app.patient);
    setMedsList(JSON.parse(app.medicinesJSON || '[]'));
    setNextFollowupDate(app.nextFollowup || '');
    
    // Parse notes structured
    const notesStr = app.notes || '';
    if (notesStr.includes('Symptoms:')) {
      const syms = notesStr.match(/Symptoms:\s*(.*?)(?=\s*\||$)/);
      const diag = notesStr.match(/Diagnosis:\s*(.*?)(?=\s*\||$)/);
      const prak = notesStr.match(/Prakriti:\s*(.*?)(?=\s*\||$)/);
      const vikr = notesStr.match(/Vikriti:\s*(.*?)(?=\s*\||$)/);
      const imb = notesStr.match(/Imbalance:\s*(.*?)(?=\s*\||$)/);
      const planStr = notesStr.match(/Plan:\s*(.*?)(?=\s*\||$)/);
      setSymptoms(syms ? syms[1] : '');
      setDiagnosis(diag ? diag[1] : '');
      setPrakriti(prak ? prak[1] : 'Vata-Pitta');
      setVikriti(vikr ? vikr[1] : 'Vata Aggravation');
      setDoshaImbalance(imb ? imb[1] : 'Apana Vata blocks');
      setVisitPlan(planStr ? planStr[1] : '');
    } else {
      setSymptoms('');
      setDiagnosis('');
      setVisitPlan(notesStr);
    }
    setPrescriptionText(app.prescription || '');
  };
  const [prescriptionText, setPrescriptionText] = useState('');

  // Prescribed medicines grid
  const addMedicine = () => {
    if (!newMedName) return;
    setMedsList([...medsList, {
      name: newMedName,
      dosage: newMedDosage,
      timing: newMedTiming,
      duration: newMedDuration
    }]);
    setNewMedName('');
  };

  const removeMedicine = (index: number) => {
    setMedsList(medsList.filter((_, i) => i !== index));
  };

  // Submit consultation
  const submitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultingAppId) return;

    const fullNotes = `Symptoms: ${symptoms} | Diagnosis: ${diagnosis} | Prakriti: ${prakriti} | Vikriti: ${vikriti} | Imbalance: ${doshaImbalance} | Plan: ${visitPlan}`;

    try {
      const res = await api.put('/appointments', {
        appointmentId: consultingAppId,
        status: 'COMPLETED',
        notes: fullNotes,
        prescription: prescriptionText,
        medicinesJSON: JSON.stringify(medsList),
        nextFollowup: nextFollowupDate || null
      });
      if (res.data && res.data.success) {
        setConsultingAppId(null);
        setConsultingPatient(null);
        setSymptoms('');
        setDiagnosis('');
        setVisitPlan('');
        setMedsList([]);
        fetchDoctorData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Tasks actions
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      const res = await api.post('/appointments/tasks', { title: newTaskTitle });
      if (res.data && res.data.success) {
        setTasks([res.data.task, ...tasks]);
        setNewTaskTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: number, isDone: boolean) => {
    try {
      const res = await api.put(`/appointments/tasks/${taskId}`, { isDone });
      if (res.data && res.data.success) {
        setTasks(tasks.map(t => t.id === taskId ? res.data.task : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Notifications read
  const handleMarkNotifRead = async (notifId: number) => {
    try {
      const res = await api.put(`/appointments/notifications/${notifId}/read`);
      if (res.data && res.data.success) {
        setNotifications(notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Download local recipe text receipt
  const downloadReceipt = (app: any) => {
    const content = `================================================
KAYA KALP AYURVEDIC WELLNESS CENTER
102, Royal Avenue, New Palasia, Indore (M.P.)
================================================
CLINICAL CONSULTATION RECEIPT & PRESCRIPTION
------------------------------------------------
Receipt ID: ${app.receiptId || 'REC-MOCK-1234'}
Date: ${app.date}
Time: ${app.timeSlot}
------------------------------------------------
PATIENT INFORMATION:
Name: ${app.patient?.name}
Email: ${app.patient?.email}
------------------------------------------------
CLINICAL ASSESSMENT:
Notes: ${app.notes || 'None logged.'}
------------------------------------------------
PRESCRIPTION DETAILS:
General Plan: ${app.prescription || 'None logged.'}

Medicines:
${JSON.parse(app.medicinesJSON || '[]').map((m: any, i: number) => 
  `${i + 1}. ${m.name} - ${m.dosage} (${m.timing}) for ${m.duration}`
).join('\n')}
------------------------------------------------
Thank you for choosing Kaya Kalp Ayurvedic.
For queries, contact support@kayakalp.com.
================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kayakalp_receipt_${app.id}.txt`;
    link.click();
  };

  const shareReceiptWhatsApp = (app: any) => {
    const text = encodeURIComponent(`Kaya Kalp Prescription:\nDate: ${app.date}\nNotes: ${app.notes}\nMedicines: ${app.prescription || 'Ayurvedic formulations prescribed.'}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Filter queue helper
  const getFilteredAppointments = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (statusFilter === 'TODAY') {
      return appointments.filter(a => a.date === todayStr && (a.status === 'CONFIRMED' || a.status === 'PENDING'));
    }
    if (statusFilter === 'WEEK') {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return appointments.filter(a => {
        const d = new Date(a.date);
        return d >= today && d <= nextWeek && (a.status === 'CONFIRMED' || a.status === 'PENDING');
      });
    }
    if (statusFilter === 'PENDING') {
      return appointments.filter(a => a.status === 'PENDING');
    }
    if (statusFilter === 'CANCELLED') {
      return appointments.filter(a => a.status === 'CANCELLED');
    }
    if (statusFilter === 'COMPLETED') {
      return appointments.filter(a => a.status === 'COMPLETED');
    }
    return appointments;
  };

  const filteredAppointments = getFilteredAppointments().filter(a => 
    a.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.patient?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedVisits = appointments.filter(a => a.status === 'COMPLETED');
  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Next Patient Highlight
  const getNextPatient = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayConf = appointments.filter(a => a.date === todayStr && a.status === 'CONFIRMED');
    if (todayConf.length === 0) return null;
    return todayConf.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))[0];
  };
  const nextPatient = getNextPatient();

  // Weekly counts for calendar block
  const getWeeklyCounts = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    appointments.forEach(app => {
      if (app.status === 'CONFIRMED' || app.status === 'PENDING') {
        const d = new Date(app.date);
        const day = d.getDay();
        if (!isNaN(day)) {
          counts[day] += 1;
        }
      }
    });
    return counts;
  };
  const weeklyCounts = getWeeklyCounts();

  // Daily consultations line chart trend data
  const getDailyConsultationTrend = () => {
    const trend: any = {};
    const datesList: string[] = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      trend[str] = 0;
      datesList.push(str);
    }
    appointments.forEach(a => {
      if (a.status === 'COMPLETED' && trend[a.date] !== undefined) {
        trend[a.date]++;
      }
    });
    return datesList.map(dateStr => {
      const parts = dateStr.split('-');
      return {
        dateLabel: `${parts[2]}/${parts[1]}`,
        consultations: trend[dateStr] || 0
      };
    });
  };
  const dailyTrendData = getDailyConsultationTrend();

  // Vitals history helper
  const getPatientHistory = (pat: any) => {
    if (!pat || !pat.patientProfile) return [];
    const baseWeight = pat.patientProfile.weight || 70;
    const baseSugar = pat.patientProfile.bloodSugar || 95;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => ({
      name: day,
      weight: parseFloat((baseWeight + (idx - 2) * 0.15 + Math.sin(idx) * 0.2).toFixed(1)),
      bloodSugar: Math.round(baseSugar + (idx - 2) * 1.5 + Math.sin(idx) * 2)
    }));
  };

  // Auto-herb recommender
  const getHerbRecommendations = () => {
    const spec = profile?.specialization || '';
    if (spec.toLowerCase().includes('panchakarma')) {
      return [
        { name: 'Triphala Churna', dosage: '1/2 tsp', timing: 'After food', duration: '15 days' },
        { name: 'Erand Taila (Castor)', dosage: '10 ml', timing: 'With warm water before bed', duration: '3 days' }
      ];
    }
    if (spec.toLowerCase().includes('dermatology')) {
      return [
        { name: 'Neem Leaf Extract', dosage: '1 tablet', timing: 'After food', duration: '30 days' },
        { name: 'Manjistha Powder', dosage: '1/2 tsp', timing: 'Before food', duration: '30 days' }
      ];
    }
    if (spec.toLowerCase().includes('orthopedic')) {
      return [
        { name: 'Shallaki Capsule', dosage: '1 capsule twice daily', timing: 'After food', duration: '60 days' },
        { name: 'Ashwagandha Powder', dosage: '1/2 tsp', timing: 'With warm milk before bed', duration: '30 days' }
      ];
    }
    if (spec.toLowerCase().includes('psychiatry')) {
      return [
        { name: 'Brahmi Syrup', dosage: '10 ml', timing: 'Before food', duration: '30 days' },
        { name: 'Shankhpushpi Syrup', dosage: '10 ml', timing: 'Before food', duration: '30 days' }
      ];
    }
    if (spec.toLowerCase().includes('gynecology')) {
      return [
        { name: 'Shatavari Churna', dosage: '1/2 tsp', timing: 'With warm milk', duration: '30 days' },
        { name: 'Ashoka Arishta', dosage: '15 ml', timing: 'After food', duration: '30 days' }
      ];
    }
    if (spec.toLowerCase().includes('endocrine')) {
      return [
        { name: 'Kanchnar Guggulu', dosage: '1 tablet twice daily', timing: 'After food', duration: '45 days' },
        { name: 'Guduchi Churna', dosage: '1/2 tsp', timing: 'Before food', duration: '30 days' }
      ];
    }
    return [];
  };
  const herbRecs = getHerbRecommendations();

  // Follow-ups due this week
  const getFollowupsThisWeek = () => {
    return appointments.filter(a => {
      if (!a.nextFollowup) return false;
      const fd = new Date(a.nextFollowup);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return fd >= today && fd <= nextWeek && !a.followupDone;
    });
  };
  const followupsThisWeek = getFollowupsThisWeek();

  const handleMarkFollowupDone = async (appId: number) => {
    try {
      const res = await api.put('/appointments', { appointmentId: appId, followupDone: true });
      if (res.data && res.data.success) {
        fetchDoctorData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-500">Loading Kaya Kalp Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-850'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header Panel with Notifications & Rating */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/50 pb-6 relative">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{lang === 'en' ? 'Welcome, Vaidya' : 'स्वागत है, वैद्य जी'} {user?.name}</span>
              <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {profile?.specialization || 'Ayurvedic Vaidya'}
              </span>
            </h1>
            <p className="text-xs text-stone-550 mt-0.5 font-sans">
              {lang === 'en' ? 'Manage daily appointments, record diagnostic plans, and prescribe classical formulations.' : 'दैनिक नियुक्तियों को प्रबंधित करें, निदान योजनाओं को दर्ज करें और नुस्खे लिखें।'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language switch button */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1 bg-white dark:bg-stone-900"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark Mode toggle button */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center bg-white dark:bg-stone-900"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-605" />}
            </button>
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-all relative flex items-center justify-center"
            >
              <Bell className="w-4 h-4 text-stone-600" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 shadow-xl p-4 z-50 space-y-3">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="text-xs font-bold text-stone-900">Alerts & Notifications</span>
                  <span className="text-[10px] text-stone-400 font-bold">{unreadNotifs.length} Unread</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-xs text-stone-400 text-center py-4 italic">No alerts at the moment.</div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs border transition-all ${n.isRead ? 'bg-stone-50 border-stone-100 opacity-60' : 'bg-amber-50/20 border-amber-200'}`}>
                        <div className="font-semibold text-stone-800">{n.message}</div>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-[9px] text-stone-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {!n.isRead && (
                            <button
                              onClick={() => handleMarkNotifRead(n.id)}
                              className="text-[9px] text-ayur-primary font-bold hover:underline"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200/40 text-amber-700 font-bold text-xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Rating: {profile?.rating || '4.8'} / 5.0</span>
          </div>

          <button
            onClick={logout}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-extrabold text-xs hover:bg-stone-850 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Stats, Schedule Filters, Search, Next Patient) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Inline Reschedule Dialog overlay inside section */}
          {reschedulingAppId && (
            <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-800">Reschedule Consultation Request</span>
                <button onClick={() => setReschedulingAppId(null)} className="text-[10px] text-stone-500 font-bold">Cancel</button>
              </div>
              <form onSubmit={handleRescheduleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-500 block">Select Date</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-500 block">Select Time Slot</label>
                  <select
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                  >
                    <option>09:30</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>14:00</option>
                    <option>15:30</option>
                  </select>
                </div>
                <button type="submit" className="py-2 bg-ayur-primary text-white rounded-lg text-xs font-bold hover:bg-ayur-secondary">
                  Confirm Reschedule
                </button>
              </form>
            </div>
          )}

          {/* Practice Stats Analytics Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm flex items-center justify-between col-span-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Today's Load</span>
                <div className="text-xl font-black text-stone-900 dark:text-white">
                  {appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status !== 'CANCELLED').length} Appointments
                </div>
              </div>
              <Calendar className="w-8 h-8 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-1.5 rounded-lg" />
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm flex items-center justify-between col-span-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Completed (Month)</span>
                <div className="text-xl font-black text-stone-900 dark:text-white">
                  {completedVisits.length} Consults
                </div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-1.5 rounded-lg" />
            </div>

            {/* Practice Daily consults trend chart */}
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-1.5 flex flex-col justify-between col-span-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Daily Trend</span>
                <TrendingUp className="w-3.5 h-3.5 text-ayur-primary" />
              </div>
              <div className="h-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTrendData}>
                    <Line type="monotone" dataKey="consultations" stroke="#2E5A44" strokeWidth={2} dot={{ r: 1.5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Reports BarChart */}
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-1.5 flex flex-col justify-between col-span-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Monthly Distribution</span>
                <BarChart className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="h-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'May', consults: 8 },
                    { name: 'Jun', consults: 14 },
                    { name: 'Jul', consults: 22 }
                  ]}>
                    <Bar dataKey="consults" fill="#AA7C11" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Next Patient Highlight Hero Card */}
          {nextPatient && !consultingAppId && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 to-emerald-900 text-white space-y-4 shadow-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-800/10 rounded-full blur-xl"></div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] bg-emerald-800 text-emerald-200 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Next Consultation Up
                  </span>
                  <h3 className="text-lg font-black">{nextPatient.patient?.name}</h3>
                  <p className="text-xs text-emerald-200">{nextPatient.patient?.email}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black">{nextPatient.timeSlot}</div>
                  <div className="text-[10px] text-emerald-350 capitalize font-semibold">{nextPatient.visitType || 'Clinic visit'}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-emerald-800/40">
                <div className="text-[10px] text-emerald-250">
                  Last Vitals: {nextPatient.patient?.patientProfile?.weight || '70'} kg &bull; BP: {nextPatient.patient?.patientProfile?.bloodPressure || '120/80'}
                </div>
                <button
                  onClick={() => startConsultation(nextPatient)}
                  className="px-4 py-2 bg-white text-emerald-950 text-xs font-black rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-1 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Launch consultation
                </button>
              </div>
            </div>
          )}

          {/* Active Workspace consultation cards */}
          {consultingAppId && (
            <div className="p-6 rounded-3xl border-2 border-ayur-primary bg-white space-y-6 shadow-md animate-float">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Consultation Workspace
                </h2>
                <button
                  onClick={() => {
                    setConsultingAppId(null);
                    setConsultingPatient(null);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-700"
                >
                  Close Workspace
                </button>
              </div>

              {consultingPatient && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-4 rounded-2xl border border-stone-200/30 text-xs">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">Patient Basic Profile</span>
                    <div className="space-y-1">
                      <div>Name: <strong>{consultingPatient.name}</strong></div>
                      <div>Email: <span>{consultingPatient.email}</span></div>
                      <div>Age / Gender: <strong>{consultingPatient.patientProfile?.age || 'N/A'} yrs &bull; {consultingPatient.patientProfile?.gender || 'N/A'}</strong></div>
                      <div>Blood Group: <span>{consultingPatient.patientProfile?.bloodType || 'N/A'}</span></div>
                      <div>History: <span className="italic text-stone-550">{consultingPatient.patientProfile?.medicalHistory || 'None entered.'}</span></div>
                    </div>
                    
                    <div className="space-y-2 mt-4 pt-3 border-t border-stone-200/50">
                      <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">Patient Document Vault</span>
                      {consultingPatient.medicalRecords && consultingPatient.medicalRecords.length > 0 ? (
                        <div className="space-y-1.5 max-h-24 overflow-y-auto">
                          {consultingPatient.medicalRecords.map((rec: any) => (
                            <div key={rec.id} className="flex justify-between items-center p-2 rounded bg-white border border-stone-200">
                              <span className="truncate max-w-[150px] font-medium text-[11px] text-stone-700">{rec.fileName}</span>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`Downloading simulated file: ${rec.fileName}`);
                                }}
                                className="text-[10px] text-ayur-primary font-bold hover:underline"
                              >
                                View File
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-stone-450 italic font-medium">No medical reports uploaded.</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">Logged Health Vitals</span>
                    <div className="space-y-1">
                      <div>Weight: <strong>{consultingPatient.patientProfile?.weight || '70'} kg</strong></div>
                      <div>Blood Pressure: <strong>{consultingPatient.patientProfile?.bloodPressure || '120/80'}</strong></div>
                      <div>Blood Sugar: <strong>{consultingPatient.patientProfile?.bloodSugar || '95'} mg/dL</strong></div>
                      <div>Sleep / Water: <span>{consultingPatient.patientProfile?.sleepHours || '7'} hrs / {consultingPatient.patientProfile?.waterIntake || '2'} L</span></div>
                      <div>Logged Mood: <strong className="text-ayur-primary">{consultingPatient.patientProfile?.mood || 'Calm'}</strong></div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-inner mt-4">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Vitals Trend Line</span>
                      <div className="h-20 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getPatientHistory(consultingPatient)}>
                            <XAxis dataKey="name" stroke="#ccc" fontSize={7} />
                            <YAxis stroke="#ccc" fontSize={7} />
                            <Line type="monotone" dataKey="weight" stroke="#2E5A44" strokeWidth={1.5} name="Weight" dot={false} />
                            <Line type="monotone" dataKey="bloodSugar" stroke="#AA7C11" strokeWidth={1.5} name="Sugar" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Notes Form */}
              <form onSubmit={submitConsultation} className="space-y-4">
                
                {/* Ayurvedic Assessment Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/20 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Prakriti (Dosha constitution)</label>
                    <select value={prakriti} onChange={(e) => setPrakriti(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg">
                      <option>Vata-Pitta</option>
                      <option>Pitta-Kapha</option>
                      <option>Vata-Kapha</option>
                      <option>Tridoshic</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Vikriti (Imbalance state)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vata Aggravation"
                      value={vikriti}
                      onChange={(e) => setVikriti(e.target.value)}
                      className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Specific Imbalance notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Mandagni, Apana block"
                      value={doshaImbalance}
                      onChange={(e) => setDoshaImbalance(e.target.value)}
                      className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Patient Symptoms & Concerns</label>
                    <textarea
                      placeholder="List patient symptoms..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={2.5}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Clinical Diagnosis</label>
                    <textarea
                      placeholder="Diagnosed clinical conditions..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={2.5}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Consultation Notes & Clinical Assessment Summary</label>
                  <textarea
                    required
                    placeholder="Enter diagnostic details (e.g. Nadi evaluation, general health concerns)..."
                    value={visitPlan}
                    onChange={(e) => setVisitPlan(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                  />
                  <div className="space-y-1 mt-1.5">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Clinical Notes Presets</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Nadi: Vata aggravated',
                        'Tongue: Ama coating observed',
                        'Prakriti: Pitta dominant imbalance',
                        'Digestion: Mandagni (low fire) noted',
                        'Recommended: Panchakarma cleansing'
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setVisitPlan(prev => prev ? `${prev}. ${preset}` : preset);
                          }}
                          className="px-2 py-0.5 rounded border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-605 text-[9px] font-bold"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-705">General Treatment Summary (Diet & Yoga instructions)</label>
                  <textarea
                    placeholder="Write general instructions, dietary recommendations, and home remedies..."
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    rows={2.5}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Set Next Follow-Up Date (Optional)</label>
                    <input
                      type="date"
                      value={nextFollowupDate}
                      onChange={(e) => setNextFollowupDate(e.target.value)}
                      className="w-full p-2 border border-stone-200 bg-white rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Add Prescribed Medicines</span>

                  {herbRecs.length > 0 && (
                    <div className="space-y-2 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block font-sans">⭐ Specialization Herb Auto-Suggestions</span>
                      <div className="flex flex-wrap gap-2">
                        {herbRecs.map((rec, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNewMedName(rec.name);
                              setNewMedDosage(rec.dosage);
                              setNewMedTiming(rec.timing);
                              setNewMedDuration(rec.duration);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-100/10 text-emerald-900 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                          >
                            + {rec.name} ({rec.dosage})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200/50">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block font-sans">Quick Prescriptions Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Ashwagandha Churna', dosage: '1/2 tsp', timing: 'With warm milk before bed', duration: '30 days' },
                        { name: 'Triphala Churna', dosage: '1/2 tsp', timing: 'After food', duration: '15 days' },
                        { name: 'Chyawanprash', dosage: '1 tsp', timing: 'Before food', duration: '60 days' },
                        { name: 'Dashmula Arishta', dosage: '15 ml', timing: 'After food', duration: '30 days' },
                        { name: 'Maharasnadi Kwath', dosage: '20 ml', timing: 'Before food', duration: '15 days' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewMedName(preset.name);
                            setNewMedDosage(preset.dosage);
                            setNewMedTiming(preset.timing);
                            setNewMedDuration(preset.duration);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-emerald-250 bg-emerald-50/10 text-emerald-800 text-[10px] font-bold hover:bg-emerald-50 transition-colors"
                        >
                          + {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-400">Medicine Name</label>
                      <input
                        type="text"
                        placeholder="Ashwagandha Churna"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-400">Dosage</label>
                      <input
                        type="text"
                        placeholder="1/2 tsp"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-400">Timing</label>
                      <select
                        value={newMedTiming}
                        onChange={(e) => setNewMedTiming(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                      >
                        <option>Before food</option>
                        <option>After food</option>
                        <option>With warm milk before bed</option>
                        <option>Twice daily</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="py-1.5 rounded-lg bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary flex items-center justify-center gap-1 shadow-sm border border-transparent"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {medsList.map((med, index) => (
                      <div key={index} className="flex justify-between items-center p-2.5 rounded-xl border border-stone-200 text-xs bg-white">
                        <div>
                          <strong>{med.name}</strong> &bull; {med.dosage} ({med.timing})
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="p-1 rounded text-red-650 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary text-xs shadow-md mt-4"
                >
                  Submit Consultation & Complete Visit
                </button>
              </form>
            </div>
          )}

          {/* Booking Queue & Search Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-ayur-primary" />
                Patient Bookings Queue
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Today's Queue", val: 'TODAY' },
                  { label: "This Week", val: 'WEEK' },
                  { label: 'Pending', val: 'PENDING' },
                  { label: 'Completed', val: 'COMPLETED' },
                  { label: 'Cancellations', val: 'CANCELLED' }
                ].map((tab) => {
                  const isActive = statusFilter === tab.val;
                  return (
                    <button
                      key={tab.val}
                      type="button"
                      onClick={() => setStatusFilter(tab.val as any)}
                      className={`px-2.5 py-1.25 rounded-lg text-[10px] font-bold border transition-all ${
                        isActive 
                          ? 'bg-ayur-primary border-transparent text-white shadow-sm' 
                          : 'border-stone-200 bg-white text-stone-605 hover:bg-stone-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Quick search patients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
              />
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-stone-200 border-dashed text-xs text-stone-500">
                No appointments found matching search criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((app) => (
                  <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 bg-white space-y-4 shadow-sm relative overflow-hidden">
                    
                    {/* Visual Next patient highlight helper on row */}
                    {nextPatient?.id === app.id && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                    )}

                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{app.patient?.name}</span>
                          {nextPatient?.id === app.id && (
                            <span className="text-[8px] bg-emerald-50 text-ayur-primary font-bold px-1.5 py-0.5 rounded border border-emerald-250">NEXT</span>
                          )}
                        </h4>
                        <span className="text-[10px] text-stone-400">{app.patient?.email}</span>
                        <div className="text-xs text-stone-600 mt-1.5 flex flex-wrap gap-4">
                          <span>Date: <strong>{app.date}</strong></span>
                          <span>Time: <strong>{app.timeSlot}</strong></span>
                          <span>Type: <strong className="capitalize">{app.visitType || 'clinic'}</strong></span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        app.status === 'CONFIRMED' ? 'bg-emerald-50 text-ayur-primary' :
                        app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800' :
                        app.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveAppointment(app.id)}
                          className="w-1/3 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary shadow"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setReschedulingAppId(app.id);
                            setRescheduleDate(app.date);
                          }}
                          className="w-1/3 py-2 rounded-xl border border-stone-200 text-stone-605 text-xs font-bold hover:bg-stone-50"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleRejectAppointment(app.id)}
                          className="w-1/3 py-2 rounded-xl border border-stone-200 text-red-650 text-xs font-bold"
                        >
                          Decline Request
                        </button>
                      </div>
                    )}
                    
                    {app.status === 'CONFIRMED' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => startConsultation(app)}
                          className="w-1/2 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary shadow flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Launch Consult Workspace</span>
                        </button>
                        <button
                          onClick={() => {
                            setReschedulingAppId(app.id);
                            setRescheduleDate(app.date);
                          }}
                          className="w-1/2 py-2 rounded-xl border border-stone-200 text-stone-605 text-xs font-bold hover:bg-stone-50"
                        >
                          Reschedule / Adjust Slot
                        </button>
                      </div>
                    )}

                    {app.status === 'COMPLETED' && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs leading-relaxed space-y-2">
                        <div>
                          <strong className="text-[10px] text-stone-450 uppercase tracking-wider block">Doctor clinical assessment notes:</strong>
                          <p className="text-stone-600 italic">"{app.notes || 'No notes logged.'}"</p>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-stone-200/50">
                          <button
                            onClick={() => downloadReceipt(app)}
                            className="px-2.5 py-1 rounded bg-white border border-stone-250 hover:bg-stone-50 text-[10px] font-bold text-stone-700 flex items-center gap-1"
                          >
                            <Download className="w-3 h-3 text-stone-500" />
                            Print prescription PDF
                          </button>
                          <button
                            onClick={() => shareReceiptWhatsApp(app)}
                            className="px-2.5 py-1 rounded bg-white border border-stone-250 hover:bg-stone-50 text-[10px] font-bold text-emerald-800 flex items-center gap-1"
                          >
                            <Share2 className="w-3 h-3 text-emerald-600" />
                            Share via WhatsApp
                          </button>
                        </div>
                      </div>
                    )}

                    {app.status === 'CANCELLED' && (
                      <div className="text-xs text-red-650 italic font-medium">This booking request was declined or cancelled.</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access Recently Seen Patients Directory */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-ayur-primary" />
              Recently Seen Patients Registry
            </h3>
            {completedVisits.length === 0 ? (
              <p className="text-xs text-stone-500">No recently completed consultations.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedVisits.slice(0, 4).map(app => (
                  <div key={app.id} className="p-3.5 rounded-xl border border-stone-150 bg-stone-50/20 text-xs space-y-3">
                    <div>
                      <div className="font-bold text-stone-900">{app.patient?.name}</div>
                      <div className="text-[10px] text-stone-400">Last seen: {app.date}</div>
                      <p className="text-[10px] text-stone-550 line-clamp-1 mt-1">Diagnosis: {app.notes?.split('|')[1]?.replace('Diagnosis:', '') || 'General treatment.'}</p>
                    </div>
                    <div className="flex gap-1.5 border-t border-stone-100 pt-2">
                      <button
                        onClick={() => startConsultation(app)}
                        className="px-2 py-1 rounded bg-white border border-stone-200 text-[9px] font-bold text-ayur-primary hover:bg-stone-50"
                      >
                        Open Record
                      </button>
                      <button
                        onClick={() => downloadReceipt(app)}
                        className="px-2 py-1 rounded bg-white border border-stone-200 text-[9px] font-bold text-stone-600 hover:bg-stone-50"
                      >
                        Prescription
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar, Availability Settings, Doctor Tasks, Follow-ups) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Practice Analytics Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-ayur-primary" />
              Practice Analytics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Total Earnings</span>
                <div className="text-base font-extrabold text-stone-850">₹{completedVisits.length * (profile?.fee || 500)}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Completed Visits</span>
                <div className="text-base font-extrabold text-stone-850">{completedVisits.length}</div>
              </div>
            </div>
          </div>

          {/* Follow-up due this week alert widget */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Follow-ups Due This Week
            </h3>
            {followupsThisWeek.length === 0 ? (
              <p className="text-xs text-stone-450 italic">No patient follow-ups due this week.</p>
            ) : (
              <div className="space-y-2">
                {followupsThisWeek.map(app => (
                  <div key={app.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-900">{app.patient?.name}</div>
                      <div className="text-[9px] text-stone-400">Due: {app.nextFollowup}</div>
                    </div>
                    <button
                      onClick={() => handleMarkFollowupDone(app.id)}
                      className="px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-ayur-primary font-bold text-[9px] rounded-lg hover:bg-emerald-100"
                    >
                      Done
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Patient Chat Assistant */}
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-905 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-ayur-primary" />
              Patient Chat Assistant
            </h3>
            <div className="p-3 bg-stone-50 dark:bg-stone-850/50 border border-stone-200/20 rounded-2xl h-36 overflow-y-auto space-y-2">
              {doctorMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-xl max-w-[80%] text-[11px] ${msg.sender === 'doctor' ? 'bg-ayur-primary text-white' : 'bg-white dark:bg-stone-800 border border-stone-200/50 text-stone-800 dark:text-stone-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!doctorChatInput) return;
              setDoctorMessages([...doctorMessages, { sender: 'doctor', text: doctorChatInput }]);
              setDoctorChatInput('');
              setTimeout(() => {
                setDoctorMessages(prev => [...prev, { sender: 'patient', text: 'Thank you doctor, I will follow this advice.' }]);
              }, 1200);
            }} className="flex gap-2">
              <input
                type="text"
                placeholder="Reply to patient..."
                value={doctorChatInput}
                onChange={(e) => setDoctorChatInput(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-850 text-xs focus:outline-none"
              />
              <button type="submit" className="px-3 bg-ayur-primary text-white text-xs font-bold rounded-lg hover:bg-ayur-secondary flex items-center justify-center">
                Send
              </button>
            </form>
          </div>

          {/* Availability Settings days checklist */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-ayur-primary" />
              Active Availability Days
            </h3>

            {availSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Availability updated.
              </div>
            )}

            <div className="space-y-2">
              {[
                { label: 'Monday', val: 1 },
                { label: 'Tuesday', val: 2 },
                { label: 'Wednesday', val: 3 },
                { label: 'Thursday', val: 4 },
                { label: 'Friday', val: 5 },
                { label: 'Saturday', val: 6 },
                { label: 'Sunday', val: 0 }
              ].map((day) => {
                const isSelected = availDays.includes(day.val);
                return (
                  <button
                    key={day.val}
                    onClick={() => handleUpdateAvailability(day.val)}
                    className={`flex justify-between items-center w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-emerald-50 border-ayur-primary text-ayur-primary' 
                        : 'border-stone-200 text-stone-500'
                    }`}
                  >
                    <span>{day.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-ayur-primary' : 'bg-stone-300'}`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctor Checklist Tasks board */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-ayur-primary" />
              Doctor Tasks Checklist
            </h3>
            
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add checklist task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
              />
              <button type="submit" className="px-3 bg-ayur-primary text-white rounded-xl text-xs font-bold hover:bg-ayur-secondary">
                Add
              </button>
            </form>

            {tasks.length === 0 ? (
              <p className="text-xs text-stone-450 italic">No tasks on checklist.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {tasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleToggleTask(t.id, !t.isDone)}
                    className="flex items-center gap-2 text-xs text-left w-full p-1 hover:bg-stone-50 rounded"
                  >
                    {t.isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    )}
                    <span className={t.isDone ? 'line-through text-stone-400' : 'text-stone-700'}>{t.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile specifications settings form */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Manage Practice Settings</h3>
            
            {profileSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                Profile updated successfully.
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Ayurvedic Qualifications</label>
                <input
                  type="text"
                  value={editQualification}
                  onChange={(e) => setEditQualification(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={editFee}
                  onChange={(e) => setEditFee(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Certificates & Awards</label>
                <input
                  type="text"
                  placeholder="e.g. Gold Medalist BAMS, Panchakarma certified..."
                  value={editCertificates}
                  onChange={(e) => setEditCertificates(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Consultation Modes</label>
                <input
                  type="text"
                  placeholder="Clinic, Online"
                  value={editConsultModes}
                  onChange={(e) => setEditConsultModes(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Break Timings</label>
                <input
                  type="text"
                  placeholder="e.g. 13:00 - 14:00"
                  value={editBreakTime}
                  onChange={(e) => setEditBreakTime(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Holiday Calendar (Comma-separated dates)</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-08-15, 2026-10-02"
                  value={editHolidays}
                  onChange={(e) => setEditHolidays(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Clinic Address / Room</label>
                <input
                  type="text"
                  value={editClinicName}
                  onChange={(e) => setEditClinicName(e.target.value)}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-bold block">Professional Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-ayur-primary text-white text-xs font-black rounded-xl hover:bg-ayur-secondary shadow-sm"
              >
                Save Practice Settings
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
