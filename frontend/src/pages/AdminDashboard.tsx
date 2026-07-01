import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, DollarSign, Calendar, Award, Trash2, Search 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    try {
      const appRes = await api.get('/appointments');
      if (appRes.data && appRes.data.success) {
        setAppointments(appRes.data.appointments || []);
        
        // Populate patients registry based on bookings
        const patientList = Array.from(new Set(appRes.data.appointments.map((a: any) => a.patientId)))
          .map(id => {
            const matched = appRes.data.appointments.find((a: any) => a.patientId === id)?.patient;
            return matched || { id, name: 'Sample Patient', email: 'patient@ayurcare.com' };
          });
        setPatients(patientList);
      }

      const docRes = await api.get('/doctors');
      if (docRes.data && docRes.data.success) {
        setDoctors(docRes.data.doctors || []);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="border-b border-stone-200/50 pb-6">
        <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
          <span>Admin Command Center</span>
          <span className="text-[10px] bg-emerald-50 border border-emerald-250 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            System Overseer
          </span>
        </h1>
        <p className="text-xs text-stone-500 mt-0.5 font-sans">
          Monitor revenue graphs, audit patient consultations, and control doctor verified statuses.
        </p>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-450 uppercase font-bold block">Consultation Revenue</span>
            <div className="text-lg font-extrabold text-stone-850">₹{totalRevenue}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-450 uppercase font-bold block">Total Appointments</span>
            <div className="text-lg font-extrabold text-stone-850">{appointments.length}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-450 uppercase font-bold block">Active Patients</span>
            <div className="text-lg font-extrabold text-stone-850">{patients.length}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-450 uppercase font-bold block">Registered Doctors</span>
            <div className="text-lg font-extrabold text-stone-850">{doctors.length}</div>
          </div>
        </div>
      </div>

      {/* Recharts Charts */}
      {appointments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Appointments per Specialization</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={specData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                  <XAxis dataKey="name" fontSize={10} stroke="#888" />
                  <YAxis fontSize={10} stroke="#888" allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="bookings" fill="#2E5A44" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Completed Consultation Fee Shares</h3>
            {pieData.length === 0 ? (
              <div className="text-center text-xs text-stone-500 pt-16">No completed revenue share recorded yet.</div>
            ) : (
              <div className="h-56 w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="flex flex-wrap gap-3 justify-center text-[10px] text-stone-550 pt-2">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span>Dr. {entry.name} (₹{entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Doctors panel */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-900">Doctor Verification Registry</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {doctors.map(doc => (
              <div key={doc.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/30 text-xs flex justify-between items-center gap-4">
                <div>
                  <div className="font-bold text-stone-900">{doc.user?.name}</div>
                  <span className="text-[10px] text-ayur-primary font-bold">{doc.specialization}</span>
                  <div className="text-[9px] text-stone-450 mt-0.5">Clinic: {doc.clinicName}</div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    doc.status === 'APPROVED' ? 'bg-emerald-50 text-ayur-primary' : 'bg-red-50 text-red-650'
                  }`}>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => toggleDoctorStatus(doc.id, doc.status)}
                    className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${
                      doc.status === 'APPROVED' 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-emerald-200 text-ayur-primary hover:bg-emerald-50'
                    }`}
                  >
                    {doc.status === 'APPROVED' ? 'Suspend' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings panel */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-sm text-stone-900">Active System Bookings</h3>
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search patient, doc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-lg border border-stone-200 bg-stone-50/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {appointments.filter(app => 
              app.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              app.doctor?.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(app => (
              <div key={app.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/30 text-xs space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold text-stone-900">
                      Patient: {app.patient?.name} &bull; <span className="text-stone-500 font-normal">{app.patient?.email}</span>
                    </div>
                    <div className="text-[10px] text-stone-605 mt-0.5">
                      Doctor: <strong>{app.doctor?.user?.name}</strong> ({app.doctor?.specialization})
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    app.status === 'COMPLETED' ? 'bg-emerald-50 text-ayur-primary' :
                    app.status === 'CANCELLED' ? 'bg-red-50 text-red-650' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-stone-100 text-[10px] text-stone-600">
                  <div>Date: <strong>{app.date}</strong> &bull; Time: <strong>{app.timeSlot}</strong></div>
                  
                  {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancelBooking(app.id)}
                      className="p-1 rounded bg-red-50 text-red-650 hover:bg-red-150"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
