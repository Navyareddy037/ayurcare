import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Heart, Sparkles, CheckCircle2, Calendar, HelpCircle, 
  ArrowRight, ShieldCheck, Info, Leaf, Activity, Check, Clock, User
} from 'lucide-react';

interface TherapyDetail {
  name: string;
  sanskrit: string;
  target: string;
  procedure: string;
  beforeCare: string;
  afterCare: string;
  diseases: string[];
  benefits: string[];
}

const THERAPIES: TherapyDetail[] = [
  {
    name: 'Vamana',
    sanskrit: 'Therapeutic Emesis (कफ शोधन)',
    target: 'Excess Kapha toxins in the upper respiratory tract and stomach.',
    procedure: 'The patient is administered Kapha-inducing diet foods the night before, followed by oil ingestion (Snehapana) and local sweat steam (Swedana). On the main day, herbal concoctions of liquorice and madanaphala are given to induce controlled emesis, clearing deep-seated mucus blockages.',
    beforeCare: 'Undergo internal oiling (Snehapana) for 3-7 days. Eat warm, light, cooked meals. Avoid all heavy fats or cheese.',
    afterCare: 'Strictly adhere to Samsarjana Krama (step-by-step diet progression starting with thin rice soup (peya), moving to thick gruel, and then cooked mung dal).',
    diseases: ['Chronic Asthma & Bronchitis', 'Psoriasis & Eczema', 'Metabolic obesity', 'Chronic sinusitis'],
    benefits: ['Clears respiratory congestion completely', 'Improves skin health and stops recurring hives', 'Boosts cellular metabolism and digests fat']
  },
  {
    name: 'Virechana',
    sanskrit: 'Therapeutic Purgation (पित्त शोधन)',
    target: 'Excess Pitta toxins in the liver, gallbladder, and small intestine.',
    procedure: 'After initial oiling and sweating therapies, the patient consumes a specific dose of purgative herbs (like castor oil or senna decoctions) in the morning under doctor supervision. This induces controlled bowel movements, expelling acidic Pitta wastes.',
    beforeCare: 'Snehana (internal ghee oiling) and Swedana to loosen toxins. Rest well and avoid mental stress.',
    afterCare: 'Gradually transition back to normal foods using the standard Samsarjana Krama diet. Avoid sun exposure and travel.',
    diseases: ['Acidity, GERD, and ulcers', 'Psoriasis, eczema, and skin allergies', 'Chronic jaundice and liver sluggishness', 'Hormonal acne'],
    benefits: ['Purifies blood tissue (Rakta Dhatu)', 'Resolves chronic skin inflammation and scaling', 'Cools down internal body heat and regulates bile flow']
  },
  {
    name: 'Basti',
    sanskrit: 'Medicated Enema Therapy (वात शोधन)',
    target: 'Excess Vata toxins in the colon, bones, and nervous system.',
    procedure: 'Introduces warm medicated oils (Anuvasana Basti) or herbal decoctions (Niruha Basti) directly into the colon via the rectum. The colon is the main seat of Vata; absorbing oil directly lubricates the nervous system and bone joints.',
    beforeCare: 'Have a light meal prior to oil enemas. Receive a gentle abdominal and lower back oil massage.',
    afterCare: 'Rest comfortably. Do not suppress natural urges. Consume warm ginger water after elimination.',
    diseases: ['Sciatica and slip disc', 'Osteoarthritis and rheumatoid joint pains', 'Chronic constipation and flatulence', 'Neurological disorders and hemiplegia'],
    benefits: ['Lubricates joints and stops cartilage decay', 'Corrects chronic colon flatulence and dry stools', 'Rejuvenates nervous system pathways']
  },
  {
    name: 'Nasya',
    sanskrit: 'Nasal Oil Administration (मनो-मस्तिष्क शोधन)',
    target: 'Toxins in the head, neck, sinuses, and sensory organs.',
    procedure: 'A gentle face and neck massage is performed, followed by localized herbal steam over the forehead and cheeks. Medford herbal oil drops (like Anu Taila) are administered into each nostril while the patient inhales deeply.',
    beforeCare: 'Clean teeth and mouth. Do not take Nasya immediately after food, bathing, or exposure to heavy sun.',
    afterCare: 'Gargle with warm water. Avoid cold water drafts, smoke, dust, and direct cooling fans.',
    diseases: ['Sinusitis, migraine, and tension headaches', 'Premature hair graying and hair loss', 'Cervical spondylosis and frozen shoulder', 'Insomnia and high anxiety'],
    benefits: ['Clears sinuses and prevents recurring cold attacks', 'Improves brain function, memory, and concentration', 'Strengthens hair roots and neck muscles']
  },
  {
    name: 'Raktamokshana',
    sanskrit: 'Therapeutic Bloodletting (रक्त शोधन)',
    target: 'Deep-seated blood toxicity (Rakta Dhatu impurities) and localized eczema.',
    procedure: 'Uses localized methods, most commonly Jalaukavacharana (medically sterile leech therapy) over the affected skin area. The leeches suck out localized toxic blood while releasing saliva containing natural anti-inflammatory enzymes.',
    beforeCare: 'Ensure the skin area is clean and free of chemical creams. Keep blood pressure levels stable.',
    afterCare: 'Dress the area with turmeric paste and sterile gauze. Keep the dressing dry for 24 hours.',
    diseases: ['Chronic eczema and dry psoriasis patches', 'Varicose veins and localized skin ulcers', 'Alopecia areata spots'],
    benefits: ['Immediately reduces localized itching and pain', 'Speeds up ulcer healing and skin repair', 'Reduces varicose vein pressure']
  }
];

export default function PanchakarmaDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const activeTherapy = THERAPIES[activeTab];

  // Booking states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [visitType, setVisitType] = useState('clinic');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        if (res.data && res.data.success) {
          // Filter doctors that have Panchakarma or general specializations
          setDoctors(res.data.doctors || []);
          if (res.data.doctors && res.data.doctors.length > 0) {
            setSelectedDoctorId(res.data.doctors[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setSubmitting(true);

    try {
      const res = await api.post('/appointments', {
        doctorId: selectedDoctorId,
        date: bookingDate,
        timeSlot: bookingTime,
        visitType: visitType
      });
      if (res.data && res.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingSuccess(false);
          setBookingDate('');
          navigate('/dashboard/patient');
        }, 2000);
      }
    } catch (err: any) {
      setBookingError(err.response?.data?.error || 'Booking failed. Ensure you are logged in as a patient.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] pb-20 font-sans">
      
      {/* Hero Header */}
      <div className="bg-emerald-950 text-white py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 text-emerald-350 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kaya Kalp Panchakarma Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Classical Five-Fold Detoxification</h1>
        <p className="text-xs text-emerald-250 max-w-xl mx-auto font-medium">
          Panchakarma is the ultimate Ayurvedic process to extract deep-seated metabolic wastes (Ama) and restore perfect Dosha balance.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Overview & Selector tabs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overview Box */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-ayur-primary" />
                <span>Panchakarma Overview</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Panchakarma is not a luxury spa treatment. It is a highly scientific medical procedure designed to flush toxins out of cellular tissues, resetting your body's self-healing systems.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-[11px] text-stone-500 leading-relaxed font-medium">
                <strong>Three Phases:</strong> Purvakarma (oiling & sweating), Pradhanakarma (detox extraction), and Paschatkarma (restorative diet).
              </div>
            </div>

            {/* Selector list */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider block mb-1">Select Therapy</h3>
              <div className="space-y-1.5 text-xs font-bold text-stone-755">
                {THERAPIES.map((t, idx) => (
                  <button
                    key={t.name}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex justify-between items-center ${
                      activeTab === idx 
                        ? 'bg-emerald-50 text-ayur-primary border border-emerald-250' 
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] text-stone-400 font-normal italic">Pillar {idx+1}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Therapy Details */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-8 animate-fadeIn">
            
            {/* Header info */}
            <div className="border-b border-stone-100 pb-4 space-y-1.5">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-stone-905">{activeTherapy.name}</h2>
                <span className="text-[10px] bg-emerald-50 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeTherapy.sanskrit}
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                <strong>Primary Target:</strong> {activeTherapy.target}
              </p>
            </div>

            {/* Procedure Description */}
            <div className="space-y-2">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block">How it is done (Procedure)</span>
              <p className="text-xs sm:text-sm text-stone-605 leading-relaxed font-medium">{activeTherapy.procedure}</p>
            </div>

            {/* Before & After Care panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div className="space-y-2.5">
                <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block">Before Care (Purvakarma)</span>
                <p className="text-xs text-stone-550 leading-relaxed font-medium bg-stone-50 p-4 rounded-2xl border border-stone-200/50">
                  {activeTherapy.beforeCare}
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block">After Care (Paschatkarma)</span>
                <p className="text-xs text-stone-550 leading-relaxed font-medium bg-stone-550/5 p-4 rounded-2xl border border-stone-200/50">
                  {activeTherapy.afterCare}
                </p>
              </div>
            </div>

            {/* Diseases and Benefits checklists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div className="space-y-3">
                <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block">Diseases Treated</span>
                <ul className="space-y-2 text-xs text-stone-600 font-medium">
                  {activeTherapy.diseases.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block">Treatment Benefits</span>
                <ul className="space-y-2 text-xs text-stone-600 font-medium">
                  {activeTherapy.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Booking call to action */}
            <div className="p-6 rounded-3xl bg-emerald-950 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm">Ready for a complete body cleanse?</h4>
                <p className="text-[10px] text-emerald-250 font-medium">Schedule a custom {activeTherapy.name} session directly with a senior consultant.</p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <Calendar className="w-4 h-4 text-emerald-900" />
                <span>Book {activeTherapy.name} Session</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] border border-stone-200 shadow-xl max-w-md w-full p-6 relative text-xs">
            
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-extrabold text-sm border border-stone-200 p-1 px-2.5 rounded-lg"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-ayur-primary border border-emerald-200 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">Detox Session Booked!</h3>
                  <p className="text-xs text-stone-550 mt-1">
                    Your {activeTherapy.name} appointment has been successfully scheduled.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <Leaf className="w-4.5 h-4.5 text-ayur-primary" />
                    Book Panchakarma Session
                  </h3>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Therapy: {activeTherapy.name} ({activeTherapy.sanskrit})</span>
                </div>

                {bookingError && (
                  <div className="p-2 bg-red-50 border border-red-150 text-red-750 font-semibold rounded-lg text-[10.5px]">
                    {bookingError}
                  </div>
                )}

                <div className="space-y-3.5">
                  
                  {/* Select Doctor */}
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 block">Select Consultant Vaidya</label>
                    <select
                      value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 bg-white rounded-xl text-stone-605"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.user?.name} ({d.specialization || 'Ayurveda'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choose Date */}
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 block">Appointment Date</label>
                    <input
                      type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 bg-white rounded-xl"
                    />
                  </div>

                  {/* Choose Time slot */}
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 block">Preferred Time Slot</label>
                    <select
                      value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 bg-white rounded-xl text-stone-605"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:30">03:30 PM</option>
                    </select>
                  </div>

                  {/* Consultation Mode */}
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 block">Consultation Mode</label>
                    <select
                      value={visitType} onChange={(e) => setVisitType(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 bg-white rounded-xl text-stone-605"
                    >
                      <option value="clinic">In-Clinic Session</option>
                      <option value="online">Online Assessment / Video Call</option>
                    </select>
                  </div>

                </div>

                <button
                  type="submit" disabled={submitting}
                  className="w-full py-2.5 bg-ayur-primary hover:bg-ayur-secondary text-white font-extrabold rounded-xl transition-all shadow-sm"
                >
                  {submitting ? 'Creating schedule booking...' : 'Confirm Panchakarma Booking'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
      
    </div>
  );
}
