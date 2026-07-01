import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Heart, Calendar, Activity, CheckSquare, PlusCircle, FileText, 
  Trash2, Plus, Download, Clock, MapPin, AlertCircle 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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

  // Mock File Upload state
  const [uploadedRecords, setUploadedRecords] = useState<any[]>([
    { id: 1, name: 'Blood_Report_May2026.pdf', type: 'application/pdf', uploadedAt: '2026-05-12' },
    { id: 2, name: 'Chest_XRay_Spine.jpg', type: 'image/jpeg', uploadedAt: '2026-06-02' }
  ]);
  const [newRecordName, setNewRecordName] = useState('');

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
      const msg = err.response?.data?.error || err.message || 'Reschedule failed';
      setRescheduleError(msg);
    }
  };

  const handleDownloadPrescription = (app: any) => {
    const medicines = JSON.parse(app.medicinesJSON || '[]');
    const text = `
------------------------------------------
         AYURCARE MEDICAL RECEIPT
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
Thank you for choosing AyurCare.
Disclaimer: Please consult your Vaidya before changes.
------------------------------------------
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AyurCare_Prescription_${app.receiptId}.txt`;
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-500">Loading Patient board...</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(app => app.status === 'CONFIRMED' || app.status === 'PENDING');
  const pastAppointments = appointments.filter(app => app.status === 'COMPLETED' || app.status === 'CANCELLED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/50 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <span>Welcome, {user?.name}</span>
            <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Patient Portal
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            View your upcoming consults, upload clinical records, and track daily lifestyle metrics.
          </p>
        </div>
        <button
          onClick={() => navigate('/doctors')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-ayur-primary text-white hover:bg-ayur-secondary transition-all shadow"
        >
          Book Consultation
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Weight', value: `${vitals?.weight || 70} kg`, color: 'border-emerald-200' },
          { label: 'Blood Pressure', value: vitals?.bloodPressure || '120/80', color: 'border-amber-200' },
          { label: 'Blood Sugar', value: `${vitals?.bloodSugar || 95} mg/dL`, color: 'border-emerald-200' },
          { label: 'Water Intake', value: `${vitals?.waterIntake || 2} L`, color: 'border-emerald-200' },
          { label: 'Sleep Hours', value: `${vitals?.sleepHours || 7} Hrs`, color: 'border-amber-200' },
          { label: 'Current Mood', value: vitals?.mood || 'Calm', color: 'border-emerald-200' }
        ].map((item, index) => (
          <div key={index} className={`p-4 rounded-2xl bg-white border ${item.color} shadow-sm space-y-1`}>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">{item.label}</span>
            <div className="text-sm font-extrabold text-stone-850">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ayur-primary" />
              Upcoming Consultations
            </h2>

            {upcomingAppointments.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-stone-200 border-dashed text-xs text-stone-500">
                No upcoming appointments. Schedule one with a certified doctor.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((app) => (
                  <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 bg-white space-y-4 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-stone-900">{app.doctor?.user?.name}</h4>
                        <span className="text-[10px] text-ayur-primary font-bold uppercase tracking-wider">
                          {app.doctor?.specialization}
                        </span>
                        <div className="text-xs text-stone-500 mt-1">
                          Clinic: {app.doctor?.clinicName}
                        </div>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-ayur-primary">
                        {app.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Date: <strong>{app.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Time: <strong>{app.timeSlot}</strong></span>
                      </div>
                    </div>

                    {rescheduleAppId === app.id ? (
                      <form onSubmit={handleRescheduleSubmit} className="p-3 bg-stone-100 rounded-xl space-y-3">
                        <span className="text-[10px] font-bold text-stone-550 block uppercase tracking-wider">Reschedule Appointment</span>
                        {rescheduleError && <p className="text-[10px] text-red-650 font-bold">{rescheduleError}</p>}
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="date"
                            required
                            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                          />
                          <select
                            required
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none"
                          >
                            <option value="">Time</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="14:05">02:00 PM</option>
                            <option value="14:30">02:30 PM</option>
                            <option value="16:00">04:00 PM</option>
                          </select>
                        </div>
                        <div className="flex gap-2 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setRescheduleAppId(null)}
                            className="w-1/2 py-1.5 border rounded-lg hover:bg-stone-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-1/2 py-1.5 bg-ayur-primary text-white rounded-lg font-bold"
                          >
                            Submit Change
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setRescheduleAppId(app.id)}
                          className="w-1/2 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700"
                        >
                          Reschedule Visit
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="w-1/2 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-ayur-primary" />
              Previous Consultations & Prescriptions
            </h2>

            {pastAppointments.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-stone-200 border-dashed text-xs text-stone-500">
                No past consultations recorded.
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((app) => {
                  const medicines = JSON.parse(app.medicinesJSON || '[]');
                  return (
                    <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 bg-white space-y-4 shadow-sm">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-stone-900">{app.doctor?.user?.name}</h4>
                          <span className="text-[10px] text-stone-400">{app.date} &bull; {app.timeSlot}</span>
                        </div>
                        <button
                          onClick={() => handleDownloadPrescription(app)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-[10px] font-bold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Receipt</span>
                        </button>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs leading-relaxed space-y-1">
                        <strong className="text-[10px] text-stone-450 uppercase tracking-wider block">Doctor notes:</strong>
                        <p className="text-stone-700">{app.notes || 'No notes added.'}</p>
                      </div>

                      {medicines.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">Recommended Ayurvedic Medications</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {medicines.map((med: any, i: number) => (
                              <div key={i} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 space-y-1 text-xs">
                                <div className="font-bold text-stone-900">{med.name}</div>
                                <div className="text-[11px] text-stone-550">
                                  Dosage: {med.dosage} &bull; {med.timing}
                                </div>
                                <div className="text-[10px] text-emerald-700 font-medium">
                                  Duration: {med.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-ayur-primary" />
              Daily Vitals Logger
            </h3>

            {vitalsSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Vitals logged and graphed.
              </div>
            )}

            <form onSubmit={handleUpdateVitals} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="72"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold">Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold">Sugar (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="95"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold">Water (Liters)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="2.5"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold">Sleep (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="7.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold">Mood State</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white text-stone-605 focus:outline-none"
                  >
                    <option>Calm</option>
                    <option>Energetic</option>
                    <option>Anxious</option>
                    <option>Lethargic</option>
                    <option>Stressed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary text-xs shadow mt-2"
              >
                Log Vitals
              </button>
            </form>
          </div>

          {history.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-stone-900">Weight Vitals Trend</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                    <XAxis dataKey="name" stroke="#888" fontSize={9} />
                    <YAxis stroke="#888" fontSize={9} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip contentStyle={{ fontSize: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="weight" stroke="#2E5A44" strokeWidth={2} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-ayur-primary" />
              Health Records & Reports
            </h3>

            <form onSubmit={handleAddMedicalRecord} className="flex gap-2">
              <input
                type="text"
                placeholder="Record name (e.g. MRI_Spine)..."
                value={newRecordName}
                onChange={(e) => setNewRecordName(e.target.value)}
                className="w-2/3 px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-1/3 py-1.5 rounded-xl bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary flex items-center justify-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {uploadedRecords.map(record => (
                <div key={record.id} className="flex justify-between items-center p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                  <div>
                    <div className="font-bold text-stone-850 truncate max-w-[140px]">{record.name}</div>
                    <span className="text-[10px] text-stone-400">{record.uploadedAt}</span>
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
        </div>
      </div>
    </div>
  );
}
