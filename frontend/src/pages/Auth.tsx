import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, UserPlus, Key, Info, ArrowRight, ArrowLeft, Heart, Shield } from 'lucide-react';

export default function AuthPage() {
  const { user, login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  
  // Registration Wizard Step
  const [signupStep, setSignupStep] = useState(1);

  // STEP 1: General Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  // STEP 2: Personal Profile Details
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');

  // STEP 3 (Patient): Medical & Lifestyle
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [surgeries, setSurgeries] = useState('');
  const [medications, setMedications] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [dietType, setDietType] = useState('Vegetarian');
  const [sleepHours, setSleepHours] = useState('7.5');
  const [stressLevel, setStressLevel] = useState('Medium');
  const [exerciseMinutes, setExerciseMinutes] = useState('15');
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [bloodSugar, setBloodSugar] = useState('95');
  const [heartRate, setHeartRate] = useState('72');
  const [symptoms, setSymptoms] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // STEP 3 (Doctor): Professional Details
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('Panchakarma Specialist');
  const [languages, setLanguages] = useState('English, Hindi');
  const [fee, setFee] = useState('500');
  const [clinicName, setClinicName] = useState('');
  const [bio, setBio] = useState('');
  const [consultModes, setConsultModes] = useState('Clinic, Online');
  const [breakTime, setBreakTime] = useState('13:00 - 14:00');

  // STEP 4: OTP Dialog / Terms Checkbox
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTargetEmail, setOtpTargetEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Alert States
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto Calculate Age from DOB
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? String(calculatedAge) : '0');
    }
  }, [dob]);

  // Redirect on load if authenticated
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

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (!acceptTerms) {
      setAuthError('Please accept the Terms and Conditions to proceed');
      return;
    }

    setIsSubmitting(true);

    const payload: any = {
      email,
      password,
      name,
      role,
    };

    if (role === 'PATIENT') {
      payload.patientDetails = {
        age: parseInt(age) || 30,
        gender,
        phone,
        bloodType,
        medicalHistory,
        weight: parseFloat(weight) || 70,
        bloodPressure,
        bloodSugar: parseFloat(bloodSugar) || 95,
        sleepHours: parseFloat(sleepHours) || 7.5,
        waterIntake: 2.5,
        exerciseMinutes: parseInt(exerciseMinutes) || 15,
        mood: 'Calm',
        dob,
        height: parseFloat(height) || 170,
        maritalStatus,
        occupation,
        address,
        city,
        state,
        country,
        pincode,
        emergencyName,
        emergencyPhone,
        allergies,
        surgeries,
        medications,
        familyHistory,
        dietType,
        stressLevel,
        heartRate: parseInt(heartRate) || 72,
        symptoms,
        insuranceDetails
      };
    } else {
      payload.doctorDetails = {
        qualification,
        experience,
        specialization,
        languages,
        fee: parseFloat(fee) || 500,
        clinicName,
        bio,
        consultModes,
        breakTime
      };
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
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpTargetEmail, otp: otpCode }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setAuthSuccess('Verification successful! Entering Kaya Kalp Portal...');
        setTimeout(() => {
          setShowOtpDialog(false);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative font-sans">
      <div className="absolute top-10 left-10 -z-10 w-72 h-72 rounded-full bg-emerald-100/35 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 -z-10 w-72 h-72 rounded-full bg-amber-100/25 blur-3xl"></div>

      <div className="w-full max-w-2xl rounded-3xl glass-card border border-white/50 bg-white/70 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ayur-primary flex items-center justify-center text-white mx-auto shadow-md">
            <Leaf className="w-6 h-6 text-emerald-100" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900">Kaya Kalp Ayurvedic</h2>
          <p className="text-xs text-stone-500">Ancient Wellness for Modern Life</p>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {authError}
          </div>
        )}
        {authSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            {authSuccess}
          </div>
        )}

        {!showOtpDialog && (
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200/50">
            <button
              onClick={() => {
                setActiveTab('login');
                setAuthError('');
              }}
              className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-ayur-primary shadow-sm'
                  : 'text-stone-550 hover:text-stone-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setAuthError('');
              }}
              className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-ayur-primary shadow-sm'
                  : 'text-stone-550 hover:text-stone-700'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {!showOtpDialog ? (
          activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="navya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary transition-all disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="text-center text-[10px] text-stone-500 border-t border-stone-150 pt-3">
                Evaluation Accounts — Patient: <code className="bg-stone-100 px-1 py-0.5 rounded">patient@kayakalp.com / patient123</code> | Doctor: <code className="bg-stone-100 px-1 py-0.5 rounded">panchakarma@kayakalp.com / doctor123</code> | Admin: <code className="bg-stone-100 px-1 py-0.5 rounded">admin@kayakalp.com / admin123</code>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              
              {/* Wizard Steps indicator */}
              <div className="flex justify-between items-center px-4">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                      signupStep === stepNum 
                        ? 'bg-ayur-primary text-white border-transparent' 
                        : signupStep > stepNum 
                        ? 'bg-emerald-50 text-ayur-primary border-emerald-200' 
                        : 'bg-stone-50 text-stone-400 border-stone-200'
                    }`}>
                      {stepNum}
                    </span>
                    <span className="hidden sm:inline text-[9px] font-bold text-stone-400">
                      {stepNum === 1 ? 'Credentials' : stepNum === 2 ? 'Personal' : stepNum === 3 ? 'Health' : 'Verify'}
                    </span>
                  </div>
                ))}
              </div>

              {/* STEP 1: Credentials */}
              {signupStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('PATIENT')}
                      className={`py-2 rounded-xl text-xs font-black border transition-all ${
                        role === 'PATIENT'
                          ? 'bg-emerald-50 border-ayur-primary text-ayur-primary shadow-sm'
                          : 'border-stone-200 text-stone-450'
                      }`}
                    >
                      I am a Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('DOCTOR')}
                      className={`py-2 rounded-xl text-xs font-black border transition-all ${
                        role === 'DOCTOR'
                          ? 'bg-emerald-50 border-ayur-primary text-ayur-primary shadow-sm'
                          : 'border-stone-200 text-stone-450'
                      }`}
                    >
                      I am a Doctor
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Full Name</label>
                    <input
                      type="text"
                      placeholder="Navya reddy"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="navya@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!name || !email || !password || !confirmPassword) {
                        setAuthError('All credentials fields are required');
                        return;
                      }
                      if (password !== confirmPassword) {
                        setAuthError('Passwords do not match');
                        return;
                      }
                      setAuthError('');
                      setSignupStep(2);
                    }}
                    className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold flex items-center justify-center gap-1 hover:bg-ayur-secondary shadow-sm"
                  >
                    <span>Continue to Personal Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Personal Profile */}
              {signupStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Calculated Age</label>
                      <input
                        type="number"
                        disabled
                        value={age}
                        placeholder="30"
                        className="w-full p-2 border border-stone-200 bg-stone-50 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Height (cm)</label>
                      <input
                        type="number"
                        placeholder="175"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Weight (kg)</label>
                      <input
                        type="number"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Marital Status</label>
                      <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs">
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Occupation</label>
                      <input
                        type="text"
                        placeholder="Engineer"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Full Address</label>
                    <input
                      type="text"
                      placeholder="Street address, Apartment #..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">City</label>
                      <input
                        type="text"
                        placeholder="Indore"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">State</label>
                      <input
                        type="text"
                        placeholder="M.P."
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Country</label>
                      <input
                        type="text"
                        placeholder="India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Pincode</label>
                      <input
                        type="text"
                        placeholder="452001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="w-1/2 py-2 rounded-xl border border-stone-200 text-stone-605 text-xs font-bold flex items-center justify-center gap-1 hover:bg-stone-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!dob) {
                          setAuthError('Date of Birth is required for age calculations');
                          return;
                        }
                        setAuthError('');
                        setSignupStep(3);
                      }}
                      className="w-1/2 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-ayur-secondary"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 (Patient Mode): Medical & Lifestyle */}
              {signupStep === 3 && role === 'PATIENT' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Mobile Number</label>
                      <input
                        type="text"
                        placeholder=""
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Blood Group</label>
                      <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs">
                        <option>O+</option>
                        <option>A+</option>
                        <option>B+</option>
                        <option>AB+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-150">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Allergies</label>
                      <input
                        type="text"
                        placeholder="e.g. Pollen, Peanuts..."
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Previous Surgeries</label>
                      <input
                        type="text"
                        placeholder="e.g. Appendectomy..."
                        value={surgeries}
                        onChange={(e) => setSurgeries(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Diet Type</label>
                      <select value={dietType} onChange={(e) => setDietType(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs">
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Eggetarian</option>
                        <option>Non-Vegetarian</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Stress Level</label>
                      <select value={stressLevel} onChange={(e) => setStressLevel(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Emergency Contact Name</label>
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Emergency Phone</label>
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Insurance (Optional)</label>
                      <input
                        type="text"
                        placeholder="Provider & Policy No."
                        value={insuranceDetails}
                        onChange={(e) => setInsuranceDetails(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="w-1/2 py-2 rounded-xl border border-stone-200 text-stone-605 text-xs font-bold flex items-center justify-center gap-1 hover:bg-stone-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError('');
                        setSignupStep(4);
                      }}
                      className="w-1/2 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-ayur-secondary"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 (Doctor Mode): Professional Details */}
              {signupStep === 3 && role === 'DOCTOR' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Doctor Qualification</label>
                      <input
                        type="text"
                        placeholder="BAMS, MD (Ayurveda)"
                        required
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Practice Experience (Years)</label>
                      <input
                        type="number"
                        placeholder="8"
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Specialization</label>
                      <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs">
                        <option>Panchakarma Specialist</option>
                        <option>Dermatology Ayurveda</option>
                        <option>Orthopedic Ayurveda</option>
                        <option>Ayurvedic Psychiatry</option>
                        <option>Gynecology Ayurveda</option>
                        <option>Endocrine Ayurveda</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Consultation modes</label>
                      <input
                        type="text"
                        placeholder="Clinic, Online"
                        value={consultModes}
                        onChange={(e) => setConsultModes(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Languages Spoken</label>
                      <input
                        type="text"
                        placeholder="English, Hindi, Sanskrit"
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Clinic Name & Location</label>
                    <input
                      type="text"
                      placeholder="Kaya Kalp Clinic, Indore"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Professional Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="w-1/2 py-2 rounded-xl border border-stone-200 text-stone-605 text-xs font-bold flex items-center justify-center gap-1 hover:bg-stone-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!qualification || !experience) {
                          setAuthError('Qualification and Experience are required');
                          return;
                        }
                        setAuthError('');
                        setSignupStep(4);
                      }}
                      className="w-1/2 py-2 rounded-xl bg-ayur-primary text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-ayur-secondary"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Accept Terms & Mobile Verification Simulation */}
              {signupStep === 4 && (
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50/20 border border-emerald-200/50 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1">
                      <Shield className="w-4 h-4 text-emerald-800" />
                      <span>Verification & Terms Consent</span>
                    </h4>
                    <p className="text-[10px] text-stone-550 leading-relaxed">
                      By submitting registration, you consent to secure data storage under the health privacy guidelines. A simulated verification OTP will be sent to your email to verify authenticity.
                    </p>

                    <label className="flex items-start gap-2 cursor-pointer mt-3">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 rounded border-stone-300 text-ayur-primary focus:ring-ayur-primary"
                      />
                      <span className="text-[10px] text-stone-600 font-bold select-none">
                        I accept the Terms of Service & Privacy Policy of Kaya Kalp Ayurvedic.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep(3)}
                      className="w-1/2 py-2.5 rounded-xl border border-stone-200 text-stone-605 text-xs font-bold flex items-center justify-center gap-1 hover:bg-stone-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 py-2.5 rounded-xl bg-ayur-primary text-white text-xs font-extrabold hover:bg-ayur-secondary shadow-sm"
                    >
                      {isSubmitting ? 'Registering...' : 'Register Account'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )
        ) : (
          /* OTP verification code form dialog */
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-normal space-y-2">
              <div className="font-bold flex items-center gap-1">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Simulated Secure OTP Verification</span>
              </div>
              <p>An OTP verification code was dispatched to <strong>{otpTargetEmail}</strong>. (For assessment purposes, type code <strong>123456</strong> to verify).</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Enter Verification Code</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-white text-center tracking-widest font-black focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary transition-all shadow-sm"
            >
              {isSubmitting ? 'Validating...' : 'Verify OTP & Enter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
