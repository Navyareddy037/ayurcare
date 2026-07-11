import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Heart, Calendar, Activity, CheckSquare, PlusCircle, FileText, 
  Trash2, Plus, Download, Clock, MapPin, AlertCircle, Sun, Moon, 
  Globe, Compass, Check, HelpCircle, MessageSquare, ShieldAlert, Send, Leaf
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Translation Dictionary for Multi-language Support
const TRANSLATIONS: any = {
  en: {
    welcome: "Welcome",
    sub: "Kaya Kalp Ayurvedic Wellness",
    overview: "Overview",
    appointments: "Appointments",
    records: "Health Records",
    reminders: "Medicine Reminders",
    wellness: "Wellness Hub",
    aiCoach: "AI Coach",
    support: "Support Tickets",
    healthScore: "Ayurvedic Health Score",
    upcoming: "Upcoming Consultations",
    previous: "Past Consultations",
    vitalsLogger: "Daily Vitals Logger",
    vitalsTrend: "Vitals Progress Charts",
    bookBtn: "Book Consultation",
    chat: "Chat with Vaidya",
    remindersTitle: "Active Prescription Dosages",
    wellnessTitle: "Daily Wellness Checklist (Dinacharya)",
    supportTitle: "Raise Support Ticket"
  },
  hi: {
    welcome: "स्वागत है",
    sub: "काया कल्प आयुर्वेदिक वेलनेस",
    overview: "अवलोकन",
    appointments: "नियुक्तियां",
    records: "स्वास्थ्य रिकॉर्ड",
    reminders: "दवा अनुस्मारक",
    wellness: "कल्याण हब",
    aiCoach: "एआई कोच",
    support: "सहायता टिकट",
    healthScore: "आयुर्वेदिक स्वास्थ्य स्कोर",
    upcoming: "आगामी परामर्श",
    previous: "पिछले परामर्श",
    vitalsLogger: "दैनिक महत्वपूर्ण मापदंड",
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

  // Active view tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'reminders' | 'wellness' | 'aiCoach' | 'support'>('overview');
  
  // Customizations
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Dashboard Data
  const [vitals, setVitals] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
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
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Dinacharya Daily Checklist state
  const [wellnessChecklist, setWellnessChecklist] = useState<any[]>([
    { id: 1, task: "Wake early before sunrise (Brahma Muhurta)", done: true },
    { id: 2, task: "Gentle tongue scraping (Jihwa Nirlekhana)", done: true },
    { id: 3, task: "Oil pulling with sesame oil (Gandusha)", done: false },
    { id: 4, task: "Self-massage with warm herbal oil (Abhyanga)", done: false },
    { id: 5, task: "Yoga pranayama breathing & meditation", done: true },
    { id: 6, task: "Consume warm balancing diet stews", done: false }
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
------------------------------------------
       KAYA KALP MEDICAL RECEIPT
------------------------------------------
Receipt ID: ${app.receiptId}
Date: ${app.date} | Time: ${app.timeSlot}
Doctor: ${app.doctor?.user?.name}
Specialization: ${app.doctor?.specialization}
Clinic: ${app.doctor?.clinicName}
Consultation Fee Paid: INR ${app.doctor?.fee}

Patient: ${user?.name}
Consultation Notes: ${app.notes || 'Routine Checkup'}

Prescribed Medicines:
${medicines.length === 0 ? 'No medicines prescribed.' : 
  medicines.map((m: any, i: number) => `${i+1}. ${m.name} - ${m.dosage} | ${m.timing} | Duration: ${m.duration}`).join('\n')}

------------------------------------------
Thank you for choosing Kaya Kalp.
Disclaimer: Please consult your Vaidya before changes.
------------------------------------------
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

  // Submit Support Ticket
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

  // Toggle checklist tasks
  const handleToggleChecklist = (id: number) => {
    setWellnessChecklist(wellnessChecklist.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  // Send simulated chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    const newMsg = { sender: 'patient', text: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    // Simulate auto doctor response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'doctor',
        text: 'Understood. Ensure you are taking your Ashwagandha with warm milk in the evening. Keep monitoring your vitals!'
      }]);
    }, 1000);
  };

  // Run AI Symptoms Checker
  const handleRunAiCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSymptoms) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiResult({
        primaryDosha: 'Vata Imbalance (Aggravated by cold/dry weather)',
        dietRecommendation: 'Consume warm, oily stews, baked sweet potatoes, and organic ghee. Avoid raw salads or cold beverages.',
        yogaAsana: 'Baddha Konasana (Bound Angle Pose) & Balasana (Child Pose) to ground nervous energy.'
      });
    }, 1200);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-500">Loading Kaya Kalp Portal...</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(app => app.status === 'CONFIRMED' || app.status === 'PENDING');
  const pastAppointments = appointments.filter(app => app.status === 'COMPLETED' || app.status === 'CANCELLED');
  
  // Calculate next consultation countdown details
  const getCountdownText = () => {
    const conf = upcomingAppointments.find(a => a.status === 'CONFIRMED');
    if (!conf) return 'No confirmed visits';
    return `${conf.date} at ${conf.timeSlot}`;
  };

  // Localized Labels
  const text = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-850'}`}>
      
      {/* Header Panel with custom toggles */}
      <div className="border-b border-stone-200/50 bg-white/70 dark:bg-stone-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-ayur-primary" />
            <span className="font-extrabold text-sm tracking-wide uppercase">Kaya Kalp</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-language button selector */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark Mode toggle button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            <button
              onClick={() => navigate('/doctors')}
              className="px-4 py-1.5 rounded-xl bg-ayur-primary text-white text-xs font-black hover:bg-ayur-secondary shadow-sm"
            >
              {text.bookBtn}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Dashboard Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Menu Panel */}
          <div className="lg:col-span-3 space-y-3 bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 p-4 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-150 dark:border-stone-800">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-ayur-primary flex items-center justify-center font-bold text-base">
                {user?.name?.charAt(0) || 'N'}
              </div>
              <div>
                <h4 className="font-extrabold text-xs leading-none">{user?.name}</h4>
                <span className="text-[10px] text-stone-400 font-bold block mt-1">{user?.email}</span>
              </div>
            </div>

            <nav className="space-y-1 pt-2">
              {[
                { id: 'overview', label: text.overview, icon: Compass },
                { id: 'appointments', label: text.appointments, icon: Calendar },
                { id: 'records', label: text.records, icon: FileText },
                { id: 'reminders', label: text.reminders, icon: Clock },
                { id: 'wellness', label: text.wellness, icon: Heart },
                { id: 'aiCoach', label: text.aiCoach, icon: Activity },
                { id: 'support', label: text.support, icon: HelpCircle }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-left text-xs font-black transition-all ${
                      isActive 
                        ? 'bg-ayur-primary text-white shadow-sm shadow-emerald-950/10' 
                        : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main workspace section */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* VIEW 1: Overview Dashboard */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Countdown Hero Box */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 to-emerald-900 text-white space-y-4 shadow-md relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-800/10 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-emerald-800 text-emerald-250 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Countdown Timer
                      </span>
                      <h3 className="text-lg font-black">Next Consultation Scheduled</h3>
                      <p className="text-xs text-emerald-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-350" />
                        <span>{getCountdownText()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid analytics layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Visual Health score gauge */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4 flex flex-col justify-between items-center text-center">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block w-full text-left">
                      {text.healthScore}
                    </h3>
                    <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-emerald-50 dark:border-emerald-950/20">
                      <div className="absolute inset-2 rounded-full border-4 border-dashed border-ayur-primary animate-spin" style={{ animationDuration: '20s' }}></div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-stone-905 dark:text-white">84%</div>
                        <div className="text-[9px] font-bold text-emerald-700">EXCELLENT</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-normal">
                      Prakriti imbalances: Vata is minor, diet routines are balancing your core digestive fires nicely!
                    </p>
                  </div>

                  {/* Health summary status indicators */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      Health Vitals logs summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'Weight', value: `${vitals?.weight || 70} kg` },
                        { label: 'Blood Pressure', value: vitals?.bloodPressure || '120/80' },
                        { label: 'Blood Sugar', value: `${vitals?.bloodSugar || 95} mg/dL` },
                        { label: 'Sleep hours', value: `${vitals?.sleepHours || 7.5} hrs` }
                      ].map((v, i) => (
                        <div key={i} className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-150 dark:border-stone-800">
                          <span className="text-[9px] text-stone-450 block font-bold">{v.label}</span>
                          <span className="font-extrabold text-stone-800 dark:text-white">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Vitals Logger */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-3">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      {text.vitalsLogger}
                    </h3>
                    {vitalsSuccess && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-250 text-ayur-primary text-[9px] font-semibold">
                        Vitals logged!
                      </div>
                    )}
                    <form onSubmit={handleUpdateVitals} className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Weight"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="BP (120/80)"
                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(e.target.value)}
                          className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Sugar (mg/dL)"
                          value={bloodSugar}
                          onChange={(e) => setBloodSugar(e.target.value)}
                          className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                        />
                        <select
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                        >
                          <option>Calm</option>
                          <option>Energetic</option>
                          <option>Anxious</option>
                          <option>Stressed</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full py-1.5 bg-ayur-primary text-white rounded-lg font-bold hover:bg-ayur-secondary text-xs shadow-sm">
                        Log Vitals
                      </button>
                    </form>
                  </div>
                </div>

                {/* Vitals Progress line graph chart */}
                {history.length > 0 && (
                  <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider block">
                      {text.vitalsTrend}
                    </h3>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                          <XAxis dataKey="name" stroke="#888" fontSize={9} />
                          <YAxis stroke="#888" fontSize={9} />
                          <Tooltip contentStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="weight" stroke="#2E5A44" strokeWidth={2} name="Weight (kg)" />
                          <Line type="monotone" dataKey="bloodSugar" stroke="#AA7C11" strokeWidth={2} name="Sugar (mg/dL)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: Appointments Management */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                
                {/* Reschedule panel */}
                {rescheduleAppId && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
                    <span className="text-xs font-bold text-amber-800 block">Reschedule Booking Slot</span>
                    <form onSubmit={handleRescheduleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <input
                        type="date"
                        required
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                      <select
                        required
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      >
                        <option value="">Time</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:30">03:30 PM</option>
                      </select>
                      <button type="submit" className="py-2 bg-ayur-primary text-white rounded-lg text-xs font-bold hover:bg-ayur-secondary">
                        Submit
                      </button>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-ayur-primary" />
                    <span>{text.upcoming}</span>
                  </h3>

                  {upcomingAppointments.length === 0 ? (
                    <div className="p-6 text-center bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 rounded-3xl text-xs text-stone-500">
                      No upcoming consults scheduled.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAppointments.map(app => (
                        <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-stone-900 dark:text-white">{app.doctor?.user?.name}</div>
                            <div className="text-[10px] text-stone-400">{app.doctor?.specialization}</div>
                            <div className="text-stone-500 mt-1">{app.date} &bull; {app.timeSlot}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setRescheduleAppId(app.id);
                                setRescheduleDate(app.date);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 font-bold hover:bg-stone-50 text-[10px]"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(app.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-bold hover:bg-red-100 text-[10px]"
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
                    <p className="text-xs text-stone-500">No past bookings.</p>
                  ) : (
                    <div className="space-y-3">
                      {pastAppointments.map(app => (
                        <div key={app.id} className="p-4 rounded-2xl border border-stone-200/50 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-stone-900 dark:text-white">{app.doctor?.user?.name}</div>
                              <span className="text-[10px] text-stone-400">{app.date} &bull; {app.timeSlot}</span>
                            </div>
                            <button
                              onClick={() => handleDownloadPrescription(app)}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 text-[10px] font-bold flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF receipt</span>
                            </button>
                          </div>
                          {app.notes && (
                            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-100 dark:border-stone-800 italic text-stone-600 dark:text-stone-300">
                              Notes: {app.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: Health Records & PDF uploads */}
            {activeTab === 'records' && (
              <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-ayur-primary" />
                  Health Records & Reports Vault
                </h3>
                <form onSubmit={handleAddMedicalRecord} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter file report name (e.g. Lab_Report)..."
                    value={newRecordName}
                    onChange={(e) => setNewRecordName(e.target.value)}
                    className="w-2/3 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none"
                  />
                  <button type="submit" className="w-1/3 py-2 bg-ayur-primary text-white rounded-xl text-xs font-bold hover:bg-ayur-secondary flex items-center justify-center gap-0.5 shadow-sm">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload simulated report</span>
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {uploadedRecords.map(record => (
                    <div key={record.id} className="flex justify-between items-center p-3 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-800 text-xs">
                      <div>
                        <div className="font-bold text-stone-850 dark:text-white">{record.name}</div>
                        <span className="text-[10px] text-stone-400">Uploaded on: {record.uploadedAt}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-650"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 4: Medicine Management */}
            {activeTab === 'reminders' && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-ayur-primary" />
                    <span>{text.remindersTitle}</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Ashwagandha Churna', dosage: '1/2 tsp', timing: 'With warm milk before bed', duration: '30 days', remaining: '12 days left' },
                      { name: 'Triphala Tablets', dosage: '1 tablet', timing: 'After food', duration: '15 days', remaining: '4 days left' }
                    ].map((med, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-950/5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white">{med.name}</div>
                          <div className="text-stone-500">{med.dosage} &bull; {med.timing}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 px-2 py-0.5 rounded font-bold">{med.remaining}</span>
                          <button
                            onClick={() => alert(`Refill requested for: ${med.name}`)}
                            className="text-[10px] text-ayur-primary font-bold block mt-2 hover:underline"
                          >
                            Request Refill
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: Wellness & Habits */}
            {activeTab === 'wellness' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Dinacharya Checklist */}
                <div className="md:col-span-7 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-ayur-primary" />
                    <span>{text.wellnessTitle}</span>
                  </h3>
                  <div className="space-y-2">
                    {wellnessChecklist.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleToggleChecklist(t.id)}
                        className="flex items-start gap-2.5 w-full p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/30 hover:bg-stone-50 dark:hover:bg-stone-800 text-left text-xs transition-all"
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${t.done ? 'bg-ayur-primary border-transparent text-white' : 'border-stone-300 bg-white'}`}>
                          {t.done && <Check className="w-3 h-3" />}
                        </span>
                        <span className={t.done ? 'line-through text-stone-400' : 'text-stone-700 dark:text-stone-200'}>{t.task}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Yoga & Meditation tracker details */}
                <div className="md:col-span-5 space-y-4">
                  <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-3">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white">Yoga & Meditation suggestions</h4>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Based on your Vata constitution, ground your energies with **Balasana** (Child Pose) and **Nadi Shodhana Pranayama** (Alternate Nostril Breathing) for 10 minutes daily.
                    </p>
                    <button
                      onClick={() => alert('Starting a simulated 10-minute meditation session...')}
                      className="w-full py-2 bg-emerald-50 dark:bg-emerald-950 text-ayur-primary font-bold text-xs rounded-xl hover:bg-emerald-100"
                    >
                      Start Meditation timer
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-2.5 text-xs">
                    <span className="font-bold text-stone-450 block uppercase tracking-wider text-[9px]">Activity Trackers logs</span>
                    <div className="flex justify-between items-center">
                      <span>Water Intake today:</span>
                      <strong className="text-ayur-primary">2.5 Liters</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sleep tracked:</span>
                      <strong>7.5 Hours</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 6: AI Coach Symptom Checker */}
            {activeTab === 'aiCoach' && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-ayur-primary" />
                    Ayurvedic AI Symptom Analyzer
                  </h3>
                  <form onSubmit={handleRunAiCheck} className="space-y-3">
                    <textarea
                      placeholder="Enter symptoms or wellness inquiries (e.g. digestive acidity after eating spicy dishes, joint stiffness in mornings)..."
                      required
                      value={aiSymptoms}
                      onChange={(e) => setAiSymptoms(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary shadow-sm flex items-center gap-1">
                      {aiLoading ? 'Analyzing Prakriti...' : 'Analyze Symptoms'}
                    </button>
                  </form>

                  {aiResult && (
                    <div className="p-4 bg-emerald-50/20 border border-emerald-250 rounded-2xl text-xs space-y-3">
                      <div>
                        <strong className="text-emerald-800 text-[10px] uppercase tracking-wider block">AI Diagnosis assessment:</strong>
                        <p className="text-stone-700 dark:text-stone-200">{aiResult.primaryDosha}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800 text-[10px] uppercase tracking-wider block">Ayurvedic Diet advice:</strong>
                        <p className="text-stone-750 dark:text-stone-300 leading-normal">{aiResult.dietRecommendation}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800 text-[10px] uppercase tracking-wider block">Recommended Yoga Asana:</strong>
                        <p className="text-stone-700 dark:text-stone-200">{aiResult.yogaAsana}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Vaidya Chat Box */}
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-ayur-primary" />
                    <span>{text.chat}</span>
                  </h3>
                  <div className="p-4 bg-stone-50 dark:bg-stone-850/50 border border-stone-200/30 rounded-2xl h-48 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2.5 rounded-2xl max-w-[70%] text-xs ${msg.sender === 'patient' ? 'bg-ayur-primary text-white' : 'bg-white dark:bg-stone-800 border border-stone-250/50 text-stone-750 dark:text-stone-200'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type message to doctor..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none"
                    />
                    <button type="submit" className="px-4 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary flex items-center gap-1 shadow-sm">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 7: Support Tickets */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-ayur-primary" />
                    <span>{text.supportTitle}</span>
                  </h3>
                  {ticketSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-ayur-primary text-[10px] font-bold">
                      Ticket raised successfully! Admin has been alerted.
                    </div>
                  )}
                  <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-stone-550 font-bold block">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Reschedule request support, payment issue..."
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-550 font-bold block">Description of Issue</label>
                      <textarea
                        placeholder="Detail your request..."
                        required
                        value={ticketDesc}
                        onChange={(e) => setTicketDesc(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-ayur-primary text-white rounded-xl font-bold hover:bg-ayur-secondary shadow-sm">
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
                        <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-stone-905 dark:text-white">{t.subject}</span>
                            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {t.status}
                            </span>
                          </div>
                          <p className="text-stone-550 dark:text-stone-300">{t.description}</p>
                          {t.response && (
                            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 border-l-2 border-ayur-primary rounded text-stone-605 dark:text-stone-305 mt-2">
                              <strong>Reply:</strong> {t.response}
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
