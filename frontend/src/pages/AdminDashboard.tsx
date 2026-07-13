import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, DollarSign, Calendar, Award, Trash2, Search, HelpCircle, 
  BookOpen, Settings, CheckCircle2, Sun, Moon, Globe
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'users' | 'tickets' | 'cms'>('users');

  // Customizations
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Data registers
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Support Tickets reply form
  const [answeringTicketId, setAnsweringTicketId] = useState<number | null>(null);
  const [ticketResponse, setTicketResponse] = useState('');
  const [ticketStatus, setTicketStatus] = useState('RESOLVED');

  // CMS Simulated items state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogList, setBlogList] = useState<any[]>([
    { id: 1, title: 'Understanding Vata Constitution in Monsoon', category: 'Ayurveda', status: 'Published' },
    { id: 2, title: 'Dinacharya: Daily Ayurvedic Routines for Detox', category: 'Lifestyle', status: 'Draft' }
  ]);

  const fetchAdminData = async () => {
    try {
      const appRes = await api.get('/appointments');
      if (appRes.data && appRes.data.success) {
        setAppointments(appRes.data.appointments || []);
        
        // Populate patients registry based on bookings
        const patientList = Array.from(new Set(appRes.data.appointments.map((a: any) => a.patientId)))
          .map(id => {
            const matched = appRes.data.appointments.find((a: any) => a.patientId === id)?.patient;
            return matched || { id, name: 'Sample Patient', email: 'patient@kayakalp.com' };
          });
        setPatients(patientList);
      }

      const docRes = await api.get('/doctors');
      if (docRes.data && docRes.data.success) {
        setDoctors(docRes.data.doctors || []);
      }

      const ticketRes = await api.get('/appointments/tickets/admin');
      if (ticketRes.data && ticketRes.data.success) {
        setTickets(ticketRes.data.tickets || []);
      }
    } catch (err) {
      console.error('Fetch admin details failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      navigate('/auth');
    } else if (user) {
      fetchAdminData();
    }
  }, [user, authLoading, navigate]);

  const handleCancelBooking = async (appId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.put('/appointments', { appointmentId: appId, status: 'CANCELLED' });
      if (res.data && res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDoctorStatus = async (docId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
    if (!confirm(`Are you sure you want to change status to ${nextStatus}?`)) return;

    try {
      // Simulate doctor verification update on state
      setDoctors(doctors.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status: nextStatus };
        }
        return doc;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Answer to Support Ticket
  const handleAnswerTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringTicketId || !ticketResponse) return;
    try {
      const res = await api.put(`/appointments/tickets/admin/${answeringTicketId}`, {
        response: ticketResponse,
        status: ticketStatus
      });
      if (res.data && res.data.success) {
        setTickets(tickets.map(t => t.id === answeringTicketId ? res.data.ticket : t));
        setAnsweringTicketId(null);
        setTicketResponse('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Blog Article simulated
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    setBlogList([{
      id: Date.now(),
      title: blogTitle,
      category: 'Lifestyle',
      status: 'Published'
    }, ...blogList]);
    setBlogTitle('');
    setBlogContent('');
    alert('Simulated Blog article published successfully!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-500">Opening Admin Portal...</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalRevenue = appointments
    .filter(a => a.status === 'COMPLETED')
    .reduce((acc, a) => acc + (a.doctor?.fee || 500), 0);

  // Group bookings by specialization
  const specCounts = appointments.reduce((acc: any, app: any) => {
    const spec = app.doctor?.specialization || 'General Ayurveda';
    acc[spec] = (acc[spec] || 0) + 1;
    return acc;
  }, {});

  const specData = Object.keys(specCounts).map(key => ({
    name: key.split(' ')[0], 
    bookings: specCounts[key]
  }));

  // Revenue per doctor
  const docRevenueCounts = appointments
    .filter(a => a.status === 'COMPLETED')
    .reduce((acc: any, app: any) => {
      const docName = app.doctor?.user?.name || 'Dr. Vaidya';
      acc[docName] = (acc[docName] || 0) + (app.doctor?.fee || 500);
      return acc;
    }, {});

  const COLORS = ['#2E5A44', '#C59B67', '#487A60', '#C08A76', '#8FBC8F'];
  const pieData = Object.keys(docRevenueCounts).map((key, i) => ({
    name: key.split(' ')[1] || key, 
    value: docRevenueCounts[key]
  }));

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-850'}`}>
      
      {/* Header controls toggle */}
      <div className="border-b border-stone-200/50 bg-white/70 dark:bg-stone-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-ayur-primary" />
            <span className="font-extrabold text-xs tracking-wide uppercase">Admin Command Center</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1 bg-white dark:bg-stone-900"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center bg-white dark:bg-stone-900"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-605" />}
            </button>

            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-black hover:bg-stone-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">
            {lang === 'en' ? 'System Overview & Analytics' : 'सिस्टम अवलोकन और विश्लेषिकी'}
          </h1>
          <p className="text-xs text-stone-500">
            Monitor revenue charts, verify registered Ayurvedic doctors, and handle user support requests.
          </p>
        </div>

        {/* Admin stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayur-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Consultation Revenue</span>
              <div className="text-lg font-extrabold text-stone-900 dark:text-white">₹{totalRevenue}</div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayur-primary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Appointments</span>
              <div className="text-lg font-extrabold text-stone-900 dark:text-white">{appointments.length}</div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayur-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Patients Registry</span>
              <div className="text-lg font-extrabold text-stone-900 dark:text-white">{patients.length}</div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayur-primary flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Doctors Profiled</span>
              <div className="text-lg font-extrabold text-stone-900 dark:text-white">{doctors.length}</div>
            </div>
          </div>
        </div>

        {/* Section Tabs switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800">
          {[
            { id: 'users', label: lang === 'en' ? 'User Verification' : 'उपयोगकर्ता सत्यापन' },
            { id: 'tickets', label: lang === 'en' ? 'Support Tickets' : 'सहायता टिकटें' },
            { id: 'cms', label: lang === 'en' ? 'CMS / Blogs Content' : 'सीएमएस / ब्लॉग्स' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 text-xs font-black border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-ayur-primary text-ayur-primary' 
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* VIEW 1: User Directory & Verification Registry */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Doctors Verification List */}
            <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Doctor Credentials Verification</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {doctors.map(doc => (
                  <div key={doc.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-850/30 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">{doc.user?.name}</div>
                      <span className="text-[10px] text-ayur-primary font-bold">{doc.specialization}</span>
                      <div className="text-[9px] text-stone-450 mt-0.5">Certificates: {doc.certificates || 'Pending Review'}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${doc.status === 'APPROVED' ? 'bg-emerald-50 text-ayur-primary' : 'bg-red-50 text-red-650'}`}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => toggleDoctorStatus(doc.id, doc.status)}
                        className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${
                          doc.status === 'APPROVED' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-ayur-primary hover:bg-emerald-50'
                        }`}
                      >
                        {doc.status === 'APPROVED' ? 'Suspend' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Bookings Auditing */}
            <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Active System Bookings Auditing</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {appointments.map(app => (
                  <div key={app.id} className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-850/30 text-xs space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-stone-905 dark:text-white">Patient: {app.patient?.name}</div>
                        <div className="text-[10px] text-stone-450 mt-0.5">Doctor: {app.doctor?.user?.name}</div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-ayur-primary font-bold uppercase">{app.status}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-100 dark:border-stone-800 text-[10px]">
                      <span>{app.date} &bull; {app.timeSlot}</span>
                      {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                        <button onClick={() => handleCancelBooking(app.id)} className="p-1 rounded bg-red-50 text-red-650">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Support Ticket Management */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            
            {/* Reply Modal form */}
            {answeringTicketId && (
              <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3 text-xs">
                <span className="font-bold text-amber-800 block">Submit Answer Response to Ticket #{answeringTicketId}</span>
                <form onSubmit={handleAnswerTicket} className="space-y-3">
                  <textarea
                    placeholder="Enter answer response..."
                    required
                    value={ticketResponse}
                    onChange={(e) => setTicketResponse(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                  />
                  <div className="flex justify-between items-center gap-3">
                    <select
                      value={ticketStatus}
                      onChange={(e) => setTicketStatus(e.target.value)}
                      className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                    >
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAnsweringTicketId(null)} className="px-3 py-1.5 border rounded-lg hover:bg-stone-50 text-stone-605">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-ayur-primary text-white font-bold rounded-lg hover:bg-ayur-secondary">
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-ayur-primary" />
                Active Support Tickets Inbox
              </h3>
              
              {tickets.length === 0 ? (
                <div className="p-6 text-center text-stone-400 italic text-xs">No active support requests from patients.</div>
              ) : (
                <div className="space-y-3">
                  {tickets.map(t => (
                    <div key={t.id} className="p-4 rounded-2xl bg-stone-50/50 dark:bg-stone-850/30 border border-stone-200/50 dark:border-stone-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-900 dark:text-white">Ticket Subject: {t.subject}</span>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300">{t.description}</p>
                      
                      {t.response ? (
                        <div className="p-2.5 bg-white dark:bg-stone-800 border-l-2 border-emerald-600 rounded text-stone-605 mt-2">
                          <strong>Admin Reply:</strong> {t.response}
                        </div>
                      ) : (
                        <button
                          onClick={() => setAnsweringTicketId(t.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-ayur-primary rounded-lg font-bold text-[10px] mt-2 flex items-center gap-1"
                        >
                          Answer Ticket
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: CMS & Blogs Management */}
        {activeTab === 'cms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Blog creation form */}
            <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-ayur-primary" />
                Publish Wellness Article
              </h3>
              <form onSubmit={handleAddBlog} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Blog Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Benefits of Tulsi during Winter..."
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-bold block">Content Body</label>
                  <textarea
                    required
                    placeholder="Enter article contents..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 rounded-lg text-xs"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-ayur-primary text-white font-bold rounded-xl hover:bg-ayur-secondary shadow-sm">
                  Publish Article
                </button>
              </form>
            </div>

            {/* Published articles log */}
            <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Active System Articles</h3>
              <div className="space-y-2">
                {blogList.map(b => (
                  <div key={b.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/20 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">{b.title}</div>
                      <span className="text-[10px] text-stone-400">Category: {b.category}</span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${b.status === 'Published' ? 'bg-emerald-50 text-ayur-primary' : 'bg-stone-100 text-stone-500'}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
