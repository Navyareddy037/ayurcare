import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Users, Calendar as CalendarIcon, FileText, Clock, Plus, Award, 
  Trash2, CheckCircle2, ChevronRight, User, Heart,
  Bell, Search, RefreshCw, Send, CheckSquare, Square, 
  Download, Share2, ClipboardList, TrendingUp, Sun, Moon, Globe, MessageSquare,
  Video, VideoOff, Mic, MicOff, PhoneOff, DollarSign, Activity, Check, Leaf
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, CartesianGrid } from 'recharts';

const TRANSLATIONS: any = {
  en: {
    welcome: "Welcome, Vaidya",
    sub: "Kaya Kalp Doctor Consultation Console",
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
    sub: "काया कल्प चिकित्सक परामर्श कंसोल",
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

  // Active view tab state
  const [activeTab, setActiveTab] = useState<'queue' | 'calendar' | 'patients' | 'video' | 'chat' | 'analytics' | 'availability' | 'tasks'>('queue');
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Availability & Timings states
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active consultation workspace state
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

  // Prescription builder states
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

  // Inline Reschedule state
  const [reschedulingAppId, setReschedulingAppId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('10:00');

  // Interactive Calendar state
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(new Date().getDate());

  // Patient Registry Search state
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [patientRegistrySearch, setPatientRegistrySearch] = useState('');

  // Video Consultation Simulator state
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [videoCallAppId, setVideoCallAppId] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (callActive) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

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

      const tasksRes = await api.get('/appointments/tasks');
      if (tasksRes.data && tasksRes.data.success) {
        setTasks(tasksRes.data.tasks || []);
      }

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
    } catch (err: any) {
      alert(err.response?.data?.error || 'Reschedule error');
    }
  };

  // Approve & Cancel
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

  const handleCancelAppointment = async (appId: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
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
  };

  // Prescribed medicines list builder
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

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorChatInput) return;
    setDoctorMessages([...doctorMessages, { sender: 'doctor', text: doctorChatInput }]);
    setDoctorChatInput('');
  };

  // Format call timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Filtered Queue
  const filteredQueue = appointments.filter(app => {
    const matchesSearch = app.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (statusFilter === 'PENDING') matchesFilter = app.status === 'PENDING';
    else if (statusFilter === 'CONFIRMED') matchesFilter = app.status === 'CONFIRMED';
    else if (statusFilter === 'COMPLETED') matchesFilter = app.status === 'COMPLETED';
    else if (statusFilter === 'CANCELLED') matchesFilter = app.status === 'CANCELLED';

    return matchesSearch && matchesFilter;
  });

  // Unique list of patients for Patient Registry
  const patientMap = new Map();
  appointments.forEach(app => {
    if (app.patient) {
      patientMap.set(app.patient.id, {
        id: app.patient.id,
        name: app.patient.name,
        email: app.patient.email,
        profile: app.patient.patientProfile,
        appointments: []
      });
    }
  });
  const patientsRegistry = Array.from(patientMap.values());
  patientsRegistry.forEach(p => {
    p.appointments = appointments.filter(app => app.patientId === p.id);
  });

  const filteredPatientsRegistry = patientsRegistry.filter(p => 
    p.name.toLowerCase().includes(patientRegistrySearch.toLowerCase())
  );

  const selectedPatient = patientsRegistry.find(p => p.id === selectedPatientId);

  // Month days builder for Calendar
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay(); // 0 for Sunday
  };

  const daysInMonth = getDaysInMonth(currentCalendarMonth, currentCalendarYear);
  const firstDayIndex = getFirstDayOfMonth(currentCalendarMonth, currentCalendarYear);
  
  const calendarDays = [];
  // padding empty days before first day of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getCalendarDayAppointments = (day: number) => {
    const dateStr = `${currentCalendarYear}-${(currentCalendarMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return appointments.filter(app => app.date === dateStr);
  };

  const selectedDayAppointments = selectedCalendarDay ? getCalendarDayAppointments(selectedCalendarDay) : [];

  // Recharts Analytics calculations
  const getRevenueAnalytics = () => {
    // Group monthly earnings
    const monthlyMap = new Map();
    appointments.forEach(app => {
      if (app.status === 'COMPLETED') {
        const monthName = new Date(app.date).toLocaleString('default', { month: 'short' });
        const amount = app.doctor?.fee || 500;
        monthlyMap.set(monthName, (monthlyMap.get(monthName) || 0) + amount);
      }
    });

    const data = Array.from(monthlyMap.entries()).map(([month, val]) => ({
      month,
      revenue: val
    }));

    if (data.length === 0) {
      data.push({ month: 'May', revenue: 4500 });
      data.push({ month: 'Jun', revenue: 9500 });
      data.push({ month: 'Jul', revenue: 16000 });
    }

    return data;
  };

  const getVisitTypesAnalytics = () => {
    let clinicCount = 0;
    let onlineCount = 0;
    let followupCount = 0;

    appointments.forEach(app => {
      if (app.visitType === 'online') onlineCount++;
      else if (app.visitType === 'follow-up') followupCount++;
      else clinicCount++;
    });

    return [
      { name: 'Clinic Visit', value: clinicCount || 5, color: '#2E5A44' },
      { name: 'Online Consult', value: onlineCount || 8, color: '#C59B67' },
      { name: 'Follow-up', value: followupCount || 3, color: '#487A60' }
    ];
  };

  const revenueData = getRevenueAnalytics();
  const visitTypesData = getVisitTypesAnalytics();
  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);

  const text = TRANSLATIONS[lang];

  if (authLoading) return null;

  return (
    <div className={`min-h-screen transition-colors duration-250 ${darkMode ? 'bg-[#0A0F0C] text-stone-100' : 'bg-[#F6F7F5] text-stone-850'}`}>
      
      {/* Top navbar */}
      <div className="border-b border-stone-200/50 dark:border-stone-850 bg-white/70 dark:bg-[#111613]/85 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ayur-primary flex items-center justify-center text-white">
              <Leaf className="w-4 h-4 text-emerald-100" />
            </div>
            <span className="font-extrabold text-xs tracking-wider uppercase">{text.sub}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="p-2 px-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-105 text-xs font-bold flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-105 flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold dark:bg-red-500/10 dark:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-3 space-y-3 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 p-5 rounded-[28px] shadow-sm">
            <div className="flex items-center gap-3 pb-5 border-b border-stone-150 dark:border-stone-800">
              <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-ayur-primary flex items-center justify-center font-bold text-lg border border-emerald-150/50">
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-stone-850 dark:text-white truncate">{user?.name}</h4>
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-ayur-primary dark:text-emerald-400 px-2 py-0.5 rounded font-black tracking-wider uppercase inline-block mt-1">
                  {user?.role}
                </span>
              </div>
            </div>

            <nav className="space-y-1 pt-3">
              {[
                { id: 'queue', label: text.queue, icon: ClipboardList },
                { id: 'calendar', label: 'Calendar Schedule', icon: CalendarIcon },
                { id: 'patients', label: 'Patient Registry', icon: Users },
                { id: 'video', label: 'Video Consult room', icon: Video },
                { id: 'chat', label: 'Vaidya Chat', icon: MessageSquare },
                { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
                { id: 'availability', label: 'Availability & Clinics', icon: Clock },
                { id: 'tasks', label: text.tasksLabel, icon: CheckSquare }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-ayur-primary text-white shadow-md' 
                        : 'text-stone-500 dark:text-stone-400 hover:bg-stone-55 dark:hover:bg-stone-800/40'
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
            
            {/* CONSULTATION ACTIVE WORKSPACE MODAL OVERLAY */}
            {consultingAppId && (
              <div className="p-6 rounded-[28px] bg-white dark:bg-[#121814] border-2 border-ayur-primary shadow-xl space-y-6 animate-fadeIn">
                <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900 dark:text-white">Active Patient Consultation Workspace</h3>
                    <p className="text-xs text-stone-500 mt-1">Patient: <strong className="text-stone-800 dark:text-stone-300">{consultingPatient?.name}</strong> ({consultingPatient?.patientProfile?.age || '30'} Y / {consultingPatient?.patientProfile?.gender || 'Male'})</p>
                  </div>
                  <button 
                    onClick={() => {
                      setConsultingAppId(null);
                      setConsultingPatient(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-[10px] font-bold hover:bg-stone-50 bg-white"
                  >
                    Close Console
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left column: patient history & reports */}
                  <div className="space-y-4">
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/20 border border-stone-200/50 dark:border-stone-800 rounded-xl space-y-3.5 text-xs text-stone-750 dark:text-stone-305">
                      <h4 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Patient Vitals & Medical Background</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-stone-200/40 pb-2">
                        <div><strong>Blood Group:</strong> {consultingPatient?.patientProfile?.bloodType || 'O+'}</div>
                        <div><strong>Blood Sugar:</strong> {consultingPatient?.patientProfile?.bloodSugar || 95} mg/dL</div>
                        <div><strong>Weight/Height:</strong> {consultingPatient?.patientProfile?.weight || 70} kg / {consultingPatient?.patientProfile?.height || 170} cm</div>
                        <div><strong>Blood Pressure:</strong> {consultingPatient?.patientProfile?.bloodPressure || '120/80'}</div>
                      </div>
                      <div className="space-y-1">
                        <strong>Allergies:</strong>
                        <p className="text-[11px] text-stone-500 italic">{consultingPatient?.patientProfile?.allergies || 'No known allergies'}</p>
                      </div>
                      <div className="space-y-1">
                        <strong>Current Medications:</strong>
                        <p className="text-[11px] text-stone-500 italic">{consultingPatient?.patientProfile?.medications || 'None'}</p>
                      </div>
                      <div className="space-y-1">
                        <strong>Previous medical conditions & history:</strong>
                        <p className="text-[11px] text-stone-500">{consultingPatient?.patientProfile?.medicalHistory || 'No historical cases logged.'}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-stone-800/20 border border-stone-200/50 dark:border-stone-800 rounded-xl space-y-3 text-xs">
                      <h4 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Patient Diagnostic Reports Vault</h4>
                      {consultingPatient?.medicalRecords && consultingPatient.medicalRecords.length > 0 ? (
                        <div className="space-y-2">
                          {consultingPatient.medicalRecords.map((rec: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-800">
                              <span className="font-medium text-[11px] text-stone-800 dark:text-stone-200">{rec.fileName}</span>
                              <a href={rec.fileUrl} download className="text-[9px] font-bold text-ayur-primary flex items-center gap-0.5 hover:underline">
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-500 italic">No reports uploaded by patient.</p>
                      )}
                    </div>
                  </div>

                  {/* Right column: Digital Prescription Builder */}
                  <form onSubmit={submitConsultation} className="space-y-4">
                    <div className="p-4 bg-[#FBFBF9] dark:bg-stone-900/35 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3 text-xs">
                      <h4 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Ayurvedic Prescription Builder</h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-500">Prakriti (Constitution)</label>
                          <input type="text" value={prakriti} onChange={(e) => setPrakriti(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-stone-500">Vikriti (Imbalance)</label>
                          <input type="text" value={vikriti} onChange={(e) => setVikriti(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-500">Symptoms</label>
                          <input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" placeholder="acidity, gas..." />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-stone-500">Diagnosis</label>
                          <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" placeholder="Pitta aggravation..." />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-500">Dosha Block details</label>
                        <input type="text" value={doshaImbalance} onChange={(e) => setDoshaImbalance(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-500">Diet & Lifestyle Guidelines</label>
                        <textarea value={visitPlan} onChange={(e) => setVisitPlan(e.target.value)} rows={2} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" placeholder="Eat warm stew, avoid cold salad..." />
                      </div>

                      {/* Add Medicines JSON builder */}
                      <div className="border-t border-stone-100 dark:border-stone-800 pt-3 space-y-2">
                        <span className="font-bold text-stone-500 block">Prescribe Medicines</span>
                        <div className="grid grid-cols-4 gap-1.5">
                          <input type="text" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} placeholder="Herb (Ashwagandha)" className="col-span-2 p-1.5 border border-stone-200 bg-white text-xs rounded dark:bg-stone-800" />
                          <input type="text" value={newMedDosage} onChange={(e) => setNewMedDosage(e.target.value)} placeholder="Dosage" className="p-1.5 border border-stone-200 bg-white text-xs rounded dark:bg-stone-800" />
                          <button type="button" onClick={addMedicine} className="bg-ayur-primary text-white text-[10px] font-bold rounded hover:bg-ayur-secondary">Add</button>
                        </div>

                        {medsList.length > 0 && (
                          <div className="space-y-1 bg-stone-50 dark:bg-stone-850 p-2 rounded border border-stone-150 dark:border-stone-800 max-h-24 overflow-y-auto mt-1">
                            {medsList.map((m, i) => (
                              <div key={i} className="flex justify-between items-center text-[10px] py-1 border-b border-stone-100 last:border-0">
                                <span><strong>{m.name}</strong> - {m.dosage}</span>
                                <button type="button" onClick={() => removeMedicine(i)} className="text-red-500 font-bold hover:underline">Remove</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-stone-100 dark:border-stone-800 pt-3">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-500">Next Follow-up date</label>
                          <input type="date" value={nextFollowupDate} onChange={(e) => setNextFollowupDate(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 rounded" />
                        </div>
                        <div className="flex items-end">
                          <button type="submit" className="w-full py-2.5 bg-ayur-primary text-white font-bold rounded-lg hover:bg-ayur-secondary shadow-sm">
                            Submit Consultation notes
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 1: Queue list */}
            {activeTab === 'queue' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Search / Filter header */}
                <div className="p-5 rounded-[24px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text" placeholder="Search patient name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/20 text-xs focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                    />
                  </div>

                  <div className="flex rounded-xl bg-stone-105 dark:bg-stone-800 p-1 border border-stone-200/50 dark:border-stone-800">
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map((filter) => (
                      <button
                        key={filter} onClick={() => setStatusFilter(filter as any)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                          statusFilter === filter 
                            ? 'bg-white dark:bg-stone-900 text-ayur-primary dark:text-emerald-450 shadow-sm' 
                            : 'text-stone-500 hover:text-stone-750'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Queue list representation */}
                <div className="space-y-3">
                  {filteredQueue.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-[24px] text-xs text-stone-400">
                      No appointments matching current filters in queue.
                    </div>
                  ) : (
                    filteredQueue.map(app => (
                      <div key={app.id} className="p-5 rounded-[24px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-stone-900 dark:text-white text-sm">{app.patient?.name}</span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              app.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                              app.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                              app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-stone-100 text-stone-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-450 dark:text-stone-500 mt-1">
                            Age/Gender: {app.patient?.patientProfile?.age || 'N/A'} Y &bull; {app.patient?.patientProfile?.gender || 'N/A'}
                          </div>
                          <div className="text-stone-500 dark:text-stone-400 mt-2 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-ayur-primary shrink-0" />
                            <span>{app.date} &bull; {app.timeSlot} ({app.visitType || 'Clinic'})</span>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          {app.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleApproveAppointment(app.id)} className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-ayur-primary text-white font-bold text-[10px] hover:bg-ayur-secondary shadow-sm">
                                Approve
                              </button>
                              <button onClick={() => handleCancelAppointment(app.id)} className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px]">
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === 'CONFIRMED' && (
                            <>
                              <button onClick={() => startConsultation(app)} className="w-1/3 sm:w-auto px-4.5 py-2 rounded-xl bg-ayur-primary text-white font-bold text-[10px] hover:bg-ayur-secondary shadow-sm">
                                Start Consult
                              </button>
                              {app.visitType === 'online' && (
                                <button 
                                  onClick={() => {
                                    setVideoCallAppId(app.id);
                                    setCallActive(true);
                                    setActiveTab('video');
                                  }}
                                  className="w-1/3 sm:w-auto px-4 py-2 rounded-xl bg-amber-550 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-amber-600 shadow-sm"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Video consult</span>
                                </button>
                              )}
                              <button onClick={() => setReschedulingAppId(app.id)} className="w-1/3 sm:w-auto px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 font-bold hover:bg-stone-50 text-[10px] bg-white">
                                Reschedule
                              </button>
                            </>
                          )}
                          {app.status === 'COMPLETED' && (
                            <button
                              onClick={() => {
                                // simulated receipt download
                                alert(`Simulated receipt file compiled successfully. Patient prescriptions are logged.`);
                              }}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 font-bold text-[10px] flex items-center gap-1 bg-white text-stone-750"
                            >
                              <Download className="w-3 h-3 text-stone-400" />
                              <span>Prescription receipt</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Inline reschedule modal */}
                {reschedulingAppId && (
                  <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 text-xs">
                    <span className="font-bold block text-stone-850">Quick Reschedule Booking</span>
                    <form onSubmit={handleRescheduleSubmit} className="flex flex-wrap gap-3 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 block font-bold">New Date</label>
                        <input type="date" required value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="p-1.5 border border-stone-200 rounded" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 block font-bold">Time Slot</label>
                        <select value={rescheduleSlot} onChange={(e) => setRescheduleSlot(e.target.value)} className="p-1.5 border border-stone-200 rounded">
                          <option value="09:00">09:00 AM</option>
                          <option value="10:30">10:30 AM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:30">03:30 PM</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="px-3 py-1.5 bg-ayur-primary text-white rounded font-bold">Update</button>
                        <button type="button" onClick={() => setReschedulingAppId(null)} className="px-3 py-1.5 border border-stone-250 rounded bg-stone-50">Close</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Calendar Schedule */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                
                {/* Calendar grid widget - span 7 */}
                <div className="lg:col-span-7 p-6 rounded-[28px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
                    <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">Practice Schedule Calendar</h3>
                    <div className="flex gap-2 text-xs font-bold">
                      <button 
                        onClick={() => {
                          if (currentCalendarMonth === 0) {
                            setCurrentCalendarMonth(11);
                            setCurrentCalendarYear(prev => prev - 1);
                          } else {
                            setCurrentCalendarMonth(prev => prev - 1);
                          }
                        }}
                        className="px-2 py-1 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-50 bg-white"
                      >
                        Prev
                      </button>
                      <span className="py-1">
                        {new Date(currentCalendarYear, currentCalendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button 
                        onClick={() => {
                          if (currentCalendarMonth === 11) {
                            setCurrentCalendarMonth(0);
                            setCurrentCalendarYear(prev => prev + 1);
                          } else {
                            setCurrentCalendarMonth(prev => prev + 1);
                          }
                        }}
                        className="px-2 py-1 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-50 bg-white"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-400">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="py-1 uppercase text-[9px] tracking-wider">{d}</div>
                    ))}

                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="p-3"></div>;
                      }

                      const appts = getCalendarDayAppointments(day);
                      const isSelected = selectedCalendarDay === day;
                      const hasAppts = appts.length > 0;

                      return (
                        <button
                          key={`day-${day}`}
                          onClick={() => setSelectedCalendarDay(day)}
                          className={`p-2.5 rounded-xl text-xs font-bold relative flex flex-col items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-ayur-primary text-white shadow-sm' 
                              : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-750 dark:text-stone-300 bg-stone-50/20 dark:bg-stone-850/50'
                          }`}
                        >
                          <span>{day}</span>
                          {hasAppts && (
                            <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : 'bg-ayur-accent animate-ping'}`}></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Day Details list - span 5 */}
                <div className="lg:col-span-5 p-6 rounded-[28px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">Appointments List</h3>
                    <span className="text-[10px] text-stone-400 block mt-1">Date: {currentCalendarYear}-{(currentCalendarMonth+1).toString().padStart(2,'0')}-{selectedCalendarDay?.toString().padStart(2,'0')}</span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {selectedDayAppointments.length === 0 ? (
                      <p className="text-xs text-stone-450 dark:text-stone-500 italic py-4">No appointments scheduled for selected day.</p>
                    ) : (
                      selectedDayAppointments.map(app => (
                        <div key={app.id} className="p-3.5 rounded-xl border border-stone-150 dark:border-stone-800 bg-[#F6F7F5]/50 dark:bg-[#1A211D]/30 text-xs space-y-2">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-stone-850 dark:text-stone-200">{app.patient?.name}</span>
                            <span className="text-[10px] text-ayur-primary">{app.timeSlot}</span>
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-450 flex justify-between">
                            <span>Mode: {app.visitType || 'Clinic'}</span>
                            <span className="uppercase text-[9px] font-black">{app.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: Patient Registry */}
            {activeTab === 'patients' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                
                {/* Registry list - span 5 */}
                <div className="lg:col-span-5 p-6 rounded-[28px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text" placeholder="Search registry..." value={patientRegistrySearch} onChange={(e) => setPatientRegistrySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 pt-1">
                    {filteredPatientsRegistry.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No patients matching search query.</p>
                    ) : (
                      filteredPatientsRegistry.map(p => (
                        <button
                          key={p.id} onClick={() => setSelectedPatientId(p.id)}
                          className={`w-full p-4.5 rounded-xl border text-left text-xs transition-all ${
                            selectedPatientId === p.id 
                              ? 'bg-emerald-500/5 border-ayur-primary text-stone-850 dark:text-white shadow-sm' 
                              : 'border-stone-100 dark:border-stone-800 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="font-bold text-stone-900 dark:text-white">{p.name}</div>
                          <div className="text-[10px] text-stone-400 mt-1">{p.email}</div>
                          <div className="text-[10px] text-ayur-primary font-bold mt-2">{p.appointments.length} Consultations</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Patient Case History - span 7 */}
                <div className="lg:col-span-7 p-6 rounded-[28px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-6">
                  {selectedPatient ? (
                    <div className="space-y-6">
                      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                        <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">Patient Clinical Case History</h3>
                        <p className="text-xs text-stone-450 mt-1">Name: <strong>{selectedPatient.name}</strong> | Email: {selectedPatient.email}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50/50 dark:bg-stone-850/50 p-4 rounded-2xl border border-stone-150 dark:border-stone-800">
                        <div><strong>Age/Gender:</strong> {selectedPatient.profile?.age || '30'} Y / {selectedPatient.profile?.gender || 'Male'}</div>
                        <div><strong>Blood Group:</strong> {selectedPatient.profile?.bloodType || 'O+'}</div>
                        <div><strong>Emergency Contact:</strong> {selectedPatient.profile?.emergencyName || 'N/A'} ({selectedPatient.profile?.emergencyPhone || 'N/A'})</div>
                        <div><strong>Diet/Lifestyle:</strong> {selectedPatient.profile?.dietType || 'Vegetarian'} / Stress: {selectedPatient.profile?.stressLevel || 'Medium'}</div>
                      </div>

                      <div className="text-xs space-y-3.5">
                        <div className="space-y-1">
                          <span className="font-bold text-stone-450 block uppercase text-[9px] tracking-wider">Allergies Profile</span>
                          <p className="p-2.5 bg-red-500/5 rounded-xl border border-red-500/10 italic text-[11px] text-stone-600 dark:text-stone-300">
                            {selectedPatient.profile?.allergies || 'No allergies recorded.'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-stone-450 block uppercase text-[9px] tracking-wider">Current Prescribed Medications</span>
                          <p className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-150 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300">
                            {selectedPatient.profile?.medications || 'None recorded.'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-stone-450 block uppercase text-[9px] tracking-wider">Systemic Medical History & Previous Treatments</span>
                          <p className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-150 dark:border-stone-800 text-[11px] text-stone-605 dark:text-stone-305">
                            {selectedPatient.profile?.medicalHistory || 'No previous cases logged.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-stone-900 dark:text-white">Past Prescriptions & Visits</h4>
                        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                          {selectedPatient.appointments.filter(a => a.status === 'COMPLETED').map(app => (
                            <div key={app.id} className="p-3.5 bg-stone-50 dark:bg-stone-855 rounded-xl border border-stone-200/50 dark:border-stone-800 text-xs">
                              <div className="flex justify-between items-baseline font-bold">
                                <span className="text-stone-800 dark:text-stone-200">Consultation Date: {app.date}</span>
                                <span className="text-[10px] text-stone-450">Vaidya consult fee paid: ₹{app.doctor?.fee}</span>
                              </div>
                              {app.notes && (
                                <p className="mt-2 text-stone-500 italic text-[11px]">Notes: "{app.notes}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-450 dark:text-stone-500 italic text-center py-10">Select a patient from the registry to view case history details.</p>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: Video consult simulator room */}
            {activeTab === 'video' && (
              <div className="p-6 rounded-[28px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-850 pb-3">
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">Online Video Consultation room</h3>
                  {callActive && (
                    <span className="px-3 py-1 rounded bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      Live Call - {formatTime(callTimer)}
                    </span>
                  )}
                </div>

                {callActive ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Video streams grids - span 8 */}
                    <div className="md:col-span-8 bg-stone-900 rounded-[24px] overflow-hidden min-h-[350px] relative shadow-lg">
                      
                      {/* Remote streams (Patient) */}
                      {!videoMuted ? (
                        <div className="absolute inset-0 bg-stone-950 flex items-center justify-center">
                          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=400" alt="Patient Remote Video Stream" className="w-full h-full object-cover filter brightness-90" />
                          <span className="absolute top-4 left-4 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded">Remote Patient feed</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-stone-950 flex items-center justify-center text-stone-500">
                          <VideoOff className="w-10 h-10" />
                        </div>
                      )}

                      {/* Local stream overlay (Doctor BAMS) */}
                      <div className="absolute bottom-4 right-4 w-32 h-44 rounded-xl border-2 border-white/60 bg-stone-950 overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=300" alt="Doctor feed" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded">Vaidya (You)</span>
                      </div>

                      {/* Media controls overlay */}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <button
                          onClick={() => setAudioMuted(!audioMuted)}
                          className={`p-2.5 rounded-full text-white transition-all shadow-md ${audioMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-black/60 hover:bg-black/80'}`}
                        >
                          {audioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setVideoMuted(!videoMuted)}
                          className={`p-2.5 rounded-full text-white transition-all shadow-md ${videoMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-black/60 hover:bg-black/80'}`}
                        >
                          {videoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setCallActive(false);
                            setVideoCallAppId(null);
                          }}
                          className="p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md"
                        >
                          <PhoneOff className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* Quick Consultation widget - span 4 */}
                    <div className="md:col-span-4 p-5 rounded-[24px] bg-stone-50 dark:bg-stone-850/50 border border-stone-200 dark:border-stone-800 flex flex-col justify-between text-xs space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-stone-900 dark:text-white border-b border-stone-200 pb-2">Active Consultation details</h4>
                        <div className="space-y-1 text-[11px] text-stone-500">
                          <div><strong>Patient Name:</strong> Navya</div>
                          <div><strong>Vitals logged today:</strong></div>
                          <div className="pl-2 mt-0.5">&bull; BP: 120/80 mmHg</div>
                          <div className="pl-2">&bull; Sugar: 95 mg/dL</div>
                          <div className="pl-2">&bull; Sleep hours: 7.5 hrs</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const thisApp = appointments.find(a => a.id === videoCallAppId);
                          if (thisApp) startConsultation(thisApp);
                        }}
                        className="w-full py-2.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <ClipboardList className="w-4 h-4" />
                        <span>Open Prescription Workspace</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center bg-stone-50 dark:bg-stone-850/50 border border-dashed border-stone-250 dark:border-stone-800 rounded-3xl space-y-3.5">
                    <Video className="w-10 h-10 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-500">No active video consult running. Launch consultations via "Start Video consult" in the booking queue.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Vaidya Chat Console */}
            {activeTab === 'chat' && (
              <div className="p-6 rounded-[28px] bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 shadow-sm space-y-4 animate-fadeIn">
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-ayur-primary" />
                  <span>Vaidya Chat Console</span>
                </h3>

                <div className="p-4 bg-stone-50 dark:bg-stone-850/50 border border-stone-200/30 rounded-2xl h-60 overflow-y-auto space-y-3.5">
                  {doctorMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[75%] text-xs ${msg.sender === 'doctor' ? 'bg-ayur-primary text-white shadow-sm' : 'bg-white dark:bg-stone-800 border border-stone-200/40 dark:border-stone-800/80 text-stone-800 dark:text-stone-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text" placeholder="Type message to patient..." value={doctorChatInput} onChange={(e) => setDoctorChatInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-xs focus:outline-none"
                  />
                  <button type="submit" className="px-4.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary flex items-center gap-1 shadow-sm">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Statistics counts cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm text-xs space-y-1">
                    <span className="font-bold text-stone-400 uppercase text-[9px] tracking-wider block">Monthly Total Earnings</span>
                    <h3 className="text-2xl font-black text-ayur-primary">₹{totalRevenue}</h3>
                    <span className="text-[10px] text-stone-500 block">Based on completed consults</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm text-xs space-y-1">
                    <span className="font-bold text-stone-400 uppercase text-[9px] tracking-wider block">Consultation queue bookings</span>
                    <h3 className="text-2xl font-black text-stone-850 dark:text-white">{appointments.length}</h3>
                    <span className="text-[10px] text-stone-500 block">Total registered patients</span>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm text-xs space-y-1">
                    <span className="font-bold text-stone-400 uppercase text-[9px] tracking-wider block">Approval Rating</span>
                    <h3 className="text-2xl font-black text-amber-500">4.9 / 5.0</h3>
                    <span className="text-[10px] text-stone-500 block">Based on patient reviews</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Earnings line chart */}
                  <div className="p-5 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm space-y-4">
                    <h4 className="font-extrabold text-xs text-stone-900 dark:text-white flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-ayur-primary" />
                      Practice revenue monthly trend
                    </h4>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#888" fontSize={9} />
                          <YAxis stroke="#888" fontSize={9} />
                          <Tooltip contentStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="revenue" stroke="#2E5A44" strokeWidth={2.5} name="Revenue (₹)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Visit Mode distribution bar chart */}
                  <div className="p-5 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm space-y-4">
                    <h4 className="font-extrabold text-xs text-stone-900 dark:text-white flex items-center gap-1">
                      <Users className="w-4 h-4 text-ayur-primary" />
                      Consultation Visit Modes Distribution
                    </h4>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visitTypesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#888" fontSize={9} />
                          <YAxis stroke="#888" fontSize={9} />
                          <Tooltip contentStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="value" name="Appointments count">
                            {visitTypesData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 7: Availability & practice settings */}
            {activeTab === 'availability' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                
                {/* Availability calendar weekdays check - span 5 */}
                <div className="lg:col-span-5 p-5 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">Availability Settings</h3>
                    <span className="text-[10px] text-stone-400 block mt-1">{text.availDays}</span>
                  </div>

                  {availSuccess && (
                    <div className="p-2 rounded bg-emerald-50 text-ayur-primary text-[10px] font-bold border border-emerald-150">
                      Availability updated successfully!
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2">
                    {['Sunday (Holidays)', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                      <button
                        key={idx} onClick={() => handleUpdateAvailability(idx)}
                        className="flex items-center gap-3 w-full p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/20 dark:bg-stone-850/50 text-left text-xs font-semibold"
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${availDays.includes(idx) ? 'bg-ayur-primary border-transparent text-white' : 'border-stone-300 bg-white'}`}>
                          {availDays.includes(idx) && <Check className="w-3 h-3" />}
                        </span>
                        <span className={availDays.includes(idx) ? 'text-stone-900 dark:text-white font-bold' : 'text-stone-400 font-medium'}>
                          {day}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit profile form details - span 7 */}
                <div className="lg:col-span-7 p-6 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm space-y-6">
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">{text.practiceSettings}</h3>
                    <span className="text-[10px] text-stone-400 block mt-1">Configure clinic addresses and fees</span>
                  </div>

                  {profileSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-150 text-ayur-primary text-xs font-semibold">
                      Profile details saved successfully!
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-500">Qualifications</label>
                        <input type="text" value={editQualification} onChange={(e) => setEditQualification(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-stone-500">Consultation Fee (₹)</label>
                        <input type="number" value={editFee} onChange={(e) => setEditFee(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-500">Break Timings slot</label>
                        <input type="text" value={editBreakTime} onChange={(e) => setEditBreakTime(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-stone-500">Holiday Schedules (e.g. 2026-08-15)</label>
                        <input type="text" value={editHolidays} onChange={(e) => setEditHolidays(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded" placeholder="Comma separated dates" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Clinic Name & Location</label>
                      <input type="text" value={editClinicName} onChange={(e) => setEditClinicName(e.target.value)} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded" />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-500">Practice Bio</label>
                      <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={3} className="w-full p-2 border border-stone-200 dark:border-stone-800 bg-[#FBFBF9] dark:bg-stone-800 rounded" />
                    </div>

                    <button type="submit" className="w-full py-2.5 bg-ayur-primary text-white rounded-lg font-bold hover:bg-ayur-secondary transition-all shadow-sm">
                      {text.saveBtn}
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 8: Doctor tasks checklist */}
            {activeTab === 'tasks' && (
              <div className="p-6 bg-white dark:bg-[#121814] border border-stone-200/50 dark:border-stone-800/80 rounded-3xl shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">{text.tasksLabel}</h3>
                  <span className="text-[10px] text-stone-400 block mt-1">Manage private practice actions</span>
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2 text-xs">
                  <input
                    type="text" required placeholder="Add doctor task (e.g. Review blood report of patient Kiran)..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-2/3 p-2.5 border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-850 rounded-xl focus:outline-none"
                  />
                  <button type="submit" className="w-1/3 py-2.5 bg-ayur-primary text-white rounded-xl font-bold hover:bg-ayur-secondary shadow-sm flex items-center justify-center gap-0.5">
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                </form>

                <div className="space-y-2 pt-2">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No tasks created.</p>
                  ) : (
                    tasks.map(t => (
                      <button
                        key={t.id} onClick={() => handleToggleTask(t.id, !t.isDone)}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/20 dark:bg-stone-800/10 hover:bg-stone-50 text-left text-xs transition-all"
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${t.isDone ? 'bg-ayur-primary border-transparent text-white' : 'border-stone-300 bg-white'}`}>
                          {t.isDone && <Check className="w-3 h-3" />}
                        </span>
                        <span className={t.isDone ? 'line-through text-stone-400' : 'text-stone-750 dark:text-stone-200 font-semibold'}>
                          {t.title}
                        </span>
                      </button>
                    ))
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
