import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, UserPlus, Key, Info } from 'lucide-react';

export default function AuthPage() {
  const { user, login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  
  // General Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Patient Fields
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [sleepHours, setSleepHours] = useState('');

  // Doctor Fields
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('Panchakarma Specialist');
  const [languages, setLanguages] = useState('English, Hindi');
  const [fee, setFee] = useState('500');
  const [clinicName, setClinicName] = useState('');
  const [bio, setBio] = useState('');

  // OTP Dialog
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTargetEmail, setOtpTargetEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect on load if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/dashboard/admin');
      else if (user.role === 'DOCTOR') navigate('/dashboard/doctor');
      else navigate('/dashboard/patient');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-500">Checking active sessions...</p>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setOtpTargetEmail(email);
      setShowOtpDialog(true);
    } else {
      setAuthError(res.error || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmitting(true);

    const payload: any = {
      email,
      password,
      name,
      role,
    };

    if (role === 'PATIENT') {
      payload.patientDetails = { age, gender, phone, bloodType, medicalHistory, weight, bloodPressure, bloodSugar, sleepHours };
    } else {
      payload.doctorDetails = { qualification, experience, specialization, languages, fee, clinicName, bio };
    }

    const res = await signup(payload);
    setIsSubmitting(false);

    if (res.success) {
      setOtpTargetEmail(email);
      setShowOtpDialog(true);
    } else {
      setAuthError(res.error || 'Failed to sign up');
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      // Direct call to Express OTP endpoint
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpTargetEmail, otp: otpCode }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setAuthSuccess('OTP Verified! Entering portal...');
        setTimeout(() => {
          setShowOtpDialog(false);
          // Force navigate to dashboard
          window.location.reload();
        }, 1000);
      } else {
        setAuthError(data.error || 'Invalid OTP');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || 'OTP validation failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-10 left-10 -z-10 w-64 h-64 rounded-full bg-emerald-100/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 -z-10 w-64 h-64 rounded-full bg-amber-100/20 blur-3xl"></div>

      <div className="w-full max-w-xl rounded-3xl glass-card border border-white/50 shadow-2xl p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-ayur-primary flex items-center justify-center text-white mx-auto shadow-md">
            <Leaf className="w-6 h-6 text-emerald-100" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Welcome to Kaya Kalp</h2>
          <p className="text-xs text-stone-500">Secure Ayurvedic Consultation Portal</p>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {authError}
          </div>
        )}
        {authSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            {authSuccess}
          </div>
        )}

        {!showOtpDialog && (
          <div className="flex rounded-xl bg-stone-105 p-1 border border-stone-200/40">
            <button
              onClick={() => {
                setActiveTab('login');
                setAuthError('');
              }}
              className={`w-1/2 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-ayur-primary shadow-sm'
                  : 'text-stone-500 hover:text-stone-750'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setAuthError('');
              }}
              className={`w-1/2 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-ayur-primary shadow-sm'
                  : 'text-stone-500 hover:text-stone-750'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {!showOtpDialog ? (
          activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-750">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-stone-750">Password</label>
                  <span className="text-[10px] text-ayur-primary hover:underline cursor-pointer">Forgot Password?</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-stone-450" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-bold hover:bg-ayur-secondary transition-all disabled:opacity-50 mt-2 shadow"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Sign In'}
              </button>

              <div className="text-center text-[10px] text-stone-500 border-t border-stone-200/50 pt-3">
                Evaluation Accounts — Patient: <code className="bg-stone-100 px-1 py-0.5 rounded">patient@kayakalp.com / patient123</code> | Doctor: <code className="bg-stone-100 px-1 py-0.5 rounded">panchakarma@kayakalp.com / doctor123</code> | Admin: <code className="bg-stone-100 px-1 py-0.5 rounded">admin@kayakalp.com / admin123</code>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === 'PATIENT'
                      ? 'bg-emerald-50 border-ayur-primary text-ayur-primary'
                      : 'border-stone-200 text-stone-500'
                  }`}
                >
                  I am a Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DOCTOR')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === 'DOCTOR'
                      ? 'bg-emerald-50 border-ayur-primary text-ayur-primary'
                      : 'border-stone-200 text-stone-505'
                  }`}
                >
                  I am an Ayurvedic Doctor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-750">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="Rahul Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-750">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-705">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="Create secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                  />
                </div>
              </div>

              {role === 'PATIENT' && (
                <div className="space-y-4 border-t border-stone-200/50 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Age</label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-755">Phone</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-755">Blood Type</label>
                      <select
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white"
                      >
                        <option>O+</option>
                        <option>A+</option>
                        <option>B+</option>
                        <option>AB+</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-755">Medical History / Concerns</label>
                    <textarea
                      placeholder="e.g. Chronic digestion issues, back pain..."
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Blood Pressure</label>
                      <input
                        type="text"
                        placeholder="120/80"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Sugar Level (mg/dL)</label>
                      <input
                        type="number"
                        placeholder="95"
                        value={bloodSugar}
                        onChange={(e) => setBloodSugar(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Sleep Hours (Daily)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="7.5"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === 'DOCTOR' && (
                <div className="space-y-4 border-t border-stone-200/50 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Qualifications</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BAMS, MD (Ayurveda)"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Experience (Years)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-750">Specialization</label>
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white"
                      >
                        <option>Panchakarma Specialist</option>
                        <option>Dermatology Ayurveda</option>
                        <option>Orthopedic Ayurveda</option>
                        <option>Gynecology Ayurveda</option>
                        <option>Ayurvedic Psychiatry</option>
                        <option>Endocrine Ayurveda</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-755">Consultation Fee (INR)</label>
                      <input
                        type="number"
                        required
                        placeholder="500"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-750">Clinic Name & City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhanvantari Holistic Clinic, Bengaluru"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-750">Biography / Core Competency</label>
                    <textarea
                      required
                      placeholder="Brief bio outlining your experience, therapeutic focus, and philosophy..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-bold hover:bg-ayur-secondary transition-all disabled:opacity-50 mt-4 shadow flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Registering Account...' : 'Sign Up'}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-5 py-2">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-800 leading-normal">
              <div className="flex items-center gap-1.5 font-bold">
                <Key className="w-4 h-4" />
                <span>Simulated Secure OTP Verification</span>
              </div>
              <p>
                We have simulated sending a 6-digit confirmation code to <code className="font-bold underline">{otpTargetEmail}</code>.
              </p>
              <div className="flex items-center gap-1 font-bold text-amber-900 mt-1">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Enter 123456 to approve this session.</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full tracking-[0.7em] text-center font-mono font-extrabold text-xl py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOtpDialog(false)}
                className="w-1/3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-2 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary disabled:opacity-50 text-xs shadow"
              >
                {isSubmitting ? 'Verifying OTP...' : 'Submit & Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
