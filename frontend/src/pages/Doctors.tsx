import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Search, Star, Calendar, MessageSquare, Globe, MapPin, 
  Clock, CreditCard, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function DoctorDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // "rating" | "experience" | "fee"

  // Booking state
  const [bookingDocId, setBookingDocId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ success: false, error: '' });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState('clinic');

  // Review state
  const [reviewDocId, setReviewDocId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState({ success: false, error: '' });

  // Time slots template
  const MORNING_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const AFTERNOON_SLOTS = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  const EVENING_SLOTS = ['16:00', '16:30', '17:00', '17:30'];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (specialization) params.append('specialization', specialization);
      if (maxFee) params.append('maxFee', maxFee);
      if (minRating) params.append('minRating', minRating);
      params.append('sortBy', sortBy);

      const res = await api.get(`/doctors?${params.toString()}`);
      if (res.data && res.data.success) {
        setDoctors(res.data.doctors || []);
      }
    } catch (err) {
      console.error('Fetch doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, specialization, maxFee, minRating, sortBy]);

  // Fetch booked slots to prevent duplicate scheduling
  useEffect(() => {
    if (bookingDocId && bookingDate) {
      const checkBookedSlots = async () => {
        try {
          const res = await api.get('/appointments');
          if (res.data && res.data.success) {
            const filtered = res.data.appointments
              .filter((app: any) => app.doctorId === bookingDocId && app.date === bookingDate && app.status !== 'CANCELLED')
              .map((app: any) => app.timeSlot);
            setBookedSlots(filtered);
          }
        } catch (err) {
          console.error(err);
        }
      };
      checkBookedSlots();
    }
  }, [bookingDocId, bookingDate]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus({ success: false, error: '' });

    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'PATIENT') {
      setBookingStatus({ success: false, error: 'Only patient accounts can schedule appointments.' });
      return;
    }

    if (!bookingDate || !bookingTime) {
      setBookingStatus({ success: false, error: 'Please choose a date and a time slot.' });
      return;
    }

    try {
      const res = await api.post('/appointments', {
        doctorId: bookingDocId,
        date: bookingDate,
        timeSlot: bookingTime,
        visitType: bookingType,
      });

      if (res.data && res.data.success) {
        setBookingStatus({ success: true, error: '' });
        setBookingDate('');
        setBookingTime('');
        fetchDoctors();
        setTimeout(() => {
          setBookingDocId(null);
          setBookingStatus({ success: false, error: '' });
        }, 1500);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to book appointment.';
      setBookingStatus({ success: false, error: msg });
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus({ success: false, error: '' });

    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'PATIENT') {
      setReviewStatus({ success: false, error: 'Only patients can leave reviews.' });
      return;
    }

    if (!reviewComment) {
      setReviewStatus({ success: false, error: 'Comment cannot be blank.' });
      return;
    }

    try {
      const res = await api.post('/reviews', {
        doctorId: reviewDocId,
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.data && res.data.success) {
        setReviewStatus({ success: true, error: '' });
        setReviewComment('');
        fetchDoctors();
        setTimeout(() => {
          setReviewDocId(null);
          setReviewStatus({ success: false, error: '' });
        }, 1500);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to submit review.';
      setReviewStatus({ success: false, error: msg });
    }
  };

  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-2">
          <span>Find Ayurvedic Doctors</span>
          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Verified Vaidyas
          </span>
        </h1>
        <p className="text-stone-500 text-sm max-w-xl">
          Consult with highly certified practitioners specialized in Panchakarma detox, herbal skincare, joint alignment, and mental rejuvenation.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card border border-stone-200/50 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-5 gap-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search name, clinic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
          />
        </div>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary text-stone-605"
        >
          <option value="">All Specializations</option>
          <option value="Panchakarma Specialist">Panchakarma Specialist</option>
          <option value="Dermatology Ayurveda">Dermatology Ayurveda</option>
          <option value="Orthopedic Ayurveda">Orthopedic Ayurveda</option>
          <option value="Gynecology Ayurveda">Gynecology Ayurveda</option>
          <option value="Ayurvedic Psychiatry">Ayurvedic Psychiatry</option>
          <option value="Endocrine Ayurveda">Endocrine Ayurveda</option>
        </select>

        <select
          value={maxFee}
          onChange={(e) => setMaxFee(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
        >
          <option value="">Any Consultation Fee</option>
          <option value="500">Under ₹500</option>
          <option value="600">Under ₹600</option>
          <option value="700">Under ₹700</option>
        </select>

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
        >
          <option value="">Any Rating</option>
          <option value="4.5">★ 4.5 & Above</option>
          <option value="4.8">★ 4.8 & Above</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
        >
          <option value="rating">Sort by Rating (High-Low)</option>
          <option value="experience">Sort by Experience (High-Low)</option>
          <option value="fee">Sort by Fees (Low-High)</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-stone-200 animate-pulse space-y-4">
              <div className="h-6 w-1/3 bg-stone-200 rounded"></div>
              <div className="h-4 w-2/3 bg-stone-200 rounded"></div>
              <div className="h-20 bg-stone-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-stone-200 border-dashed">
          <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-bold text-stone-700">No Doctors Found</h3>
          <p className="text-xs text-stone-500 mt-1">Try adapting your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded-3xl bg-white border border-stone-200/50 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-stone-900 hover:text-ayur-primary transition-colors flex items-center gap-1.5">
                      <span>{doc.user.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-ayur-primary font-bold uppercase tracking-wider">
                        {doc.experience} Yrs Exp
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {doc.qualification} &bull; <span className="text-ayur-primary font-bold">{doc.specialization}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-stone-605 pt-1">
                      <Globe className="w-3.5 h-3.5 text-stone-400" />
                      <span>Speaks: {doc.languages}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl text-xs font-extrabold border border-amber-200/40">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {doc.bio}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="truncate">{doc.clinicName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>Fee: <strong>₹{doc.fee}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-105 flex gap-3">
                <button
                  onClick={() => {
                    setReviewDocId(reviewDocId === doc.id ? null : doc.id);
                    setBookingDocId(null);
                  }}
                  className="w-1/2 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-705 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Write Review</span>
                </button>
                <button
                  onClick={() => {
                    setBookingDocId(bookingDocId === doc.id ? null : doc.id);
                    setReviewDocId(null);
                  }}
                  className="w-1/2 py-2 rounded-xl bg-ayur-primary text-white font-bold hover:bg-ayur-secondary text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>

              {/* BOOKING PANEL */}
              {bookingDocId === doc.id && (
                <form onSubmit={handleBookAppointment} className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/50 space-y-4">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-ayur-primary" />
                    Select Appointment Slot
                  </h4>

                  {bookingStatus.error && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] font-semibold">
                      {bookingStatus.error}
                    </div>
                  )}

                  {bookingStatus.success && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Booking Successful! Email confirmation simulation triggered.
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Consultation Mode</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingType('clinic')}
                        className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                          bookingType === 'clinic' 
                            ? 'bg-emerald-50 border-ayur-primary text-ayur-primary shadow-inner' 
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        In-Clinic Visit
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingType('online')}
                        className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                          bookingType === 'online' 
                            ? 'bg-emerald-50 border-ayur-primary text-ayur-primary shadow-inner' 
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Video Consult
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Choose Date</label>
                    <input
                      type="date"
                      required
                      min={getTomorrowDate()}
                      value={bookingDate}
                      onChange={(e) => {
                        setBookingDate(e.target.value);
                        setBookingTime('');
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>

                  {bookingDate && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">Morning Session</span>
                        <div className="flex flex-wrap gap-2">
                          {MORNING_SLOTS.map((time) => {
                            const isBooked = bookedSlots.includes(time);
                            const isSelected = bookingTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setBookingTime(time)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  isBooked ? 'bg-stone-200 text-stone-400 border-transparent cursor-not-allowed' :
                                  isSelected ? 'bg-ayur-primary text-white border-transparent shadow' :
                                  'bg-white hover:bg-stone-50 border-stone-200 text-stone-750'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">Afternoon Session</span>
                        <div className="flex flex-wrap gap-2">
                          {AFTERNOON_SLOTS.map((time) => {
                            const isBooked = bookedSlots.includes(time);
                            const isSelected = bookingTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setBookingTime(time)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  isBooked ? 'bg-stone-200 text-stone-400 border-transparent cursor-not-allowed' :
                                  isSelected ? 'bg-ayur-primary text-white border-transparent shadow' :
                                  'bg-white hover:bg-stone-50 border-stone-200 text-stone-750'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">Evening Session</span>
                        <div className="flex flex-wrap gap-2">
                          {EVENING_SLOTS.map((time) => {
                            const isBooked = bookedSlots.includes(time);
                            const isSelected = bookingTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setBookingTime(time)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  isBooked ? 'bg-stone-200 text-stone-400 border-transparent cursor-not-allowed' :
                                  isSelected ? 'bg-ayur-primary text-white border-transparent shadow' :
                                  'bg-white hover:bg-stone-50 border-stone-200 text-stone-750'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setBookingDocId(null)}
                      className="w-1/3 py-2 rounded-xl border border-stone-200 hover:bg-stone-105 text-stone-600 text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!bookingDate || !bookingTime}
                      className="w-2/3 py-2 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary disabled:opacity-50 text-[10px] shadow"
                    >
                      Confirm Booking (₹{doc.fee})
                    </button>
                  </div>
                </form>
              )}

              {/* REVIEW PANEL */}
              {reviewDocId === doc.id && (
                <form onSubmit={handlePostReview} className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/50 space-y-4">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-ayur-primary" />
                    Write Patient Feedback
                  </h4>

                  {reviewStatus.error && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] font-semibold">
                      {reviewStatus.error}
                    </div>
                  )}

                  {reviewStatus.success && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-705 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Feedback Submitted! Doctor average rating updated dynamically.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Select Stars</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white text-amber-500 font-bold"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                      <option value={2}>★★☆☆☆ (2 Stars)</option>
                      <option value={1}>★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Detailed Review</label>
                    <textarea
                      required
                      placeholder="Share details of your consultation..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2.5}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setReviewDocId(null)}
                      className="w-1/3 py-2 rounded-xl border border-stone-200 hover:bg-stone-105 text-stone-605 text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary text-[10px] shadow"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              )}

              {/* REVIEWS LIST */}
              {doc.reviews && doc.reviews.length > 0 && (
                <div className="mt-4 border-t border-stone-100 pt-3 space-y-2 bg-stone-50/40 p-3 rounded-2xl">
                  <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">Recent Patient Reviews</span>
                  {doc.reviews.slice(0, 2).map((rev: any) => (
                    <div key={rev.id} className="text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-stone-700">
                        <span>{rev.patient?.name || 'Verified Patient'}</span>
                        <span className="text-amber-505 font-extrabold font-mono">★ {rev.rating}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
