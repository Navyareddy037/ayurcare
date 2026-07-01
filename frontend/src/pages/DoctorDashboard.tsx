import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Users, Calendar, FileText, Clock, Plus, Award, 
  Trash2, CheckCircle2, ChevronRight, User, Heart 
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Availability days checkboxes (0 = Sunday, 1 = Monday...)
  const [availDays, setAvailDays] = useState<number[]>([]);
  const [availSuccess, setAvailSuccess] = useState(false);

  // Active consultation state
  const [consultingAppId, setConsultingAppId] = useState<number | null>(null);
  const [consultingPatient, setConsultingPatient] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  
  // Dynamic medicine list
  const [medsList, setMedsList] = useState<any[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedTiming, setNewMedTiming] = useState('After food');
  const [newMedDuration, setNewMedDuration] = useState('7 days');

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
        
        const docRes = await api.get('/doctors');
        if (docRes.data && docRes.data.success) {
          const thisDoc = docRes.data.doctors.find((d: any) => d.id === docProf.id);
          if (thisDoc && thisDoc.availabilities) {
            setAvailDays(thisDoc.availabilities.map((a: any) => a.dayOfWeek));
          }
        }
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

  const startConsultation = (app: any) => {
    setConsultingAppId(app.id);
    setConsultingPatient(app.patient);
    setNotes(app.notes || '');
    setPrescriptionText(app.prescription || '');
    setMedsList(JSON.parse(app.medicinesJSON || '[]'));
  };

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

  const submitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultingAppId) return;

    try {
      const res = await api.put('/appointments', {
        appointmentId: consultingAppId,
        status: 'COMPLETED',
        notes,
        prescription: prescriptionText,
        medicinesJSON: JSON.stringify(medsList)
      });
      if (res.data && res.data.success) {
        setConsultingAppId(null);
        setConsultingPatient(null);
        setNotes('');
        setPrescriptionText('');
        setMedsList([]);
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
          <p className="text-sm text-stone-500">Loading Doctor board...</p>
        </div>
      </div>
    );
  }

  const completedVisits = appointments.filter(a => a.status === 'COMPLETED');
  const activeBookings = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/50 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <span>Welcome, {user?.name}</span>
            <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {profile?.specialization || 'Ayurvedic Vaidya'}
            </span>
          </h1>
          <p className="text-xs text-stone-505 mt-0.5 font-sans">
            Configure your available days, view patient charts, and record Ayurvedic formulations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200/40 text-amber-700 font-bold text-xs">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Profile Rating: {profile?.rating} / 5.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Workspace */}
          {consultingAppId && (
            <div className="p-6 rounded-3xl border-2 border-ayur-primary bg-white space-y-6 shadow-md">
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
                      <div>History: <span className="italic">{consultingPatient.patientProfile?.medicalHistory || 'None entered.'}</span></div>
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
                  </div>
                </div>
              )}

              <form onSubmit={submitConsultation} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Clinical Consultation Notes</label>
                  <textarea
                    required
                    placeholder="Enter diagnostic details (e.g. Nadi evaluation, Vata/Pitta assessment, general health concerns)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-705">General Treatment Summary</label>
                  <textarea
                    placeholder="Write general instructions, dietary recommendations, and home remedies..."
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    rows={2.5}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-3 border-t border-stone-100 pt-4">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Add Prescribed Medicines</span>
                  
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
                      className="py-1.5 rounded-lg bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {medsList.map((med, index) => (
                      <div key={index} className="flex justify-between items-center p-2.5 rounded-xl border border-stone-200 text-xs">
                        <div>
                          <strong>{med.name}</strong> &bull; {med.dosage} ({med.timing})
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
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

          {/* Booking Queue */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-ayur-primary" />
              Patient Bookings Queue
            </h2>

            {activeBookings.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-stone-200 border-dashed text-xs text-stone-500">
                No active bookings in queue.
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((app) => (
                  <div key={app.id} className="p-5 rounded-2xl border border-stone-200/50 bg-white space-y-4 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-stone-900">{app.patient?.name}</h4>
                        <span className="text-[10px] text-stone-400">{app.patient?.email}</span>
                        <div className="text-xs text-stone-605 mt-1.5 flex gap-4">
                          <span>Date: <strong>{app.date}</strong></span>
                          <span>Time Slot: <strong>{app.timeSlot}</strong></span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        app.status === 'CONFIRMED' ? 'bg-emerald-50 text-ayur-primary' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {app.status === 'PENDING' ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveAppointment(app.id)}
                          className="w-1/2 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary shadow"
                        >
                          Approve Consultation
                        </button>
                        <button
                          onClick={() => handleRejectAppointment(app.id)}
                          className="w-1/2 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold"
                        >
                          Decline Request
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startConsultation(app)}
                        className="w-full py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold hover:bg-ayur-secondary shadow flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Launch Consultation Workspace</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
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

          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Completed Consultations</h3>
            {completedVisits.length === 0 ? (
              <p className="text-xs text-stone-500">No completed consultations yet.</p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {completedVisits.map(app => (
                  <div key={app.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/40 text-xs">
                    <div className="font-bold text-stone-850">{app.patient?.name}</div>
                    <div className="text-[10px] text-stone-400">{app.date} &bull; {app.timeSlot}</div>
                    <p className="text-[11px] text-stone-550 italic line-clamp-1 mt-1">
                      Notes: {app.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
