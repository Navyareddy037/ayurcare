import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Activity, Sparkles, Compass, ShieldAlert, Download, ArrowRight,
  HelpCircle, MessageSquare, ChevronRight, RefreshCw, Send, CheckCircle2,
  Calendar, Star, AlertCircle, Heart, User, Clock, FileText, Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';

// Symptom checklist helper for text parser
const SYMPTOM_MAPPING = [
  { key: 'joint', val: 'Joint pain' },
  { key: 'back', val: 'Back pain' },
  { key: 'pain', val: 'Joint pain' },
  { key: 'arthritis', val: 'Arthritis' },
  { key: 'stiff', val: 'Joint pain' },
  { key: 'digest', val: 'Digestion issues' },
  { key: 'stomach', val: 'Digestion issues' },
  { key: 'acid', val: 'Digestion issues' },
  { key: 'bloat', val: 'Digestion issues' },
  { key: 'constip', val: 'Digestion issues' },
  { key: 'skin', val: 'Skin problems' },
  { key: 'acne', val: 'Skin problems' },
  { key: 'rash', val: 'Skin problems' },
  { key: 'itch', val: 'Skin problems' },
  { key: 'hair', val: 'Hair loss' },
  { key: 'diabet', val: 'Diabetes' },
  { key: 'sugar', val: 'Diabetes' },
  { key: 'stress', val: 'Stress' },
  { key: 'anxious', val: 'Anxiety' },
  { key: 'panic', val: 'Anxiety' },
  { key: 'weight', val: 'Obesity' },
  { key: 'fat', val: 'Obesity' },
  { key: 'breath', val: 'Respiratory issues' },
  { key: 'cough', val: 'Respiratory issues' }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How would you describe your body frame and stature?",
    options: [
      { text: "Light, thin, slender, or tall/irregular frame (hard to gain weight)", type: "Vata" },
      { text: "Medium, athletic, well-proportioned frame (stable weight)", type: "Pitta" },
      { text: "Broad, heavy, stocky, or stout frame (gains weight easily)", type: "Kapha" }
    ]
  },
  {
    id: 2,
    question: "What is your skin type and general appearance?",
    options: [
      { text: "Dry, rough, thin, cold, prone to cracking, cracks in cold", type: "Vata" },
      { text: "Warm, reddish, sensitive, prone to acne, freckles, or rashes", type: "Pitta" },
      { text: "Oily, thick, smooth, soft, cool, fair or pale complexion", type: "Kapha" }
    ]
  },
  {
    id: 3,
    question: "How does your digestion and appetite behave?",
    options: [
      { text: "Variable, irregular appetite, gets bloated, gassy or constipated easily", type: "Vata" },
      { text: "Intense, strong digestion, gets irritable if meals are delayed", type: "Pitta" },
      { text: "Slow, heavy digestion, steady appetite, feels full for long periods", type: "Kapha" }
    ]
  },
  {
    id: 4,
    question: "What weather/climate conditions do you strongly dislike?",
    options: [
      { text: "Cold, dry, windy, or autumn weather (makes me stiff)", type: "Vata" },
      { text: "Hot sun, summer heat, fire, or bright midday glare (makes me sweat)", type: "Pitta" },
      { text: "Damp, cold, rainy, cloudy, or spring weather (makes me congested)", type: "Kapha" }
    ]
  },
  {
    id: 5,
    question: "What are your sleep patterns and quality?",
    options: [
      { text: "Light, interrupted, restless, prone to insomnia (5-6 hours)", type: "Vata" },
      { text: "Moderate, warm, dreaming of active/intense scenarios (6-7 hours)", type: "Pitta" },
      { text: "Deep, heavy, sleeps long, hard to wake up in mornings (8+ hours)", type: "Kapha" }
    ]
  },
  {
    id: 6,
    question: "How do you react emotionally under stress or pressure?",
    options: [
      { text: "Tends to feel anxious, worried, nervous, or fearful", type: "Vata" },
      { text: "Tends to feel angry, irritable, argumentative, or impatient", type: "Pitta" },
      { text: "Tends to remain calm, steady, quiet, or stubborn and complacent", type: "Kapha" }
    ]
  },
  {
    id: 7,
    question: "How would you describe your speech and communication style?",
    options: [
      { text: "Fast, talkative, high-pitched, skips subjects, highly creative", type: "Vata" },
      { text: "Sharp, precise, logical, convincing, debates or argues easily", type: "Pitta" },
      { text: "Slow, soft, steady, deliberate, polite, excellent listener", type: "Kapha" }
    ]
  },
  {
    id: 8,
    question: "What are your physical activity habits?",
    options: [
      { text: "Active, fast-paced, walks quickly, tires easily (variable stamina)", type: "Vata" },
      { text: "Goal-oriented, competitive, intense workouts, sweats heavily", type: "Pitta" },
      { text: "Steady, slow-paced, high physical endurance but lazy to start", type: "Kapha" }
    ]
  },
  {
    id: 9,
    question: "How does your memory and learning process work?",
    options: [
      { text: "Learns very quickly but forgets soon; restless focus", type: "Vata" },
      { text: "Learns moderately, remembers for a long time, highly logical", type: "Pitta" },
      { text: "Learns slowly but never forgets; deep retention & memory", type: "Kapha" }
    ]
  },
  {
    id: 10,
    question: "What is your typical bowel movements profile?",
    options: [
      { text: "Dry, hard, irregular, frequent mild constipation", type: "Vata" },
      { text: "Loose, soft, regular, frequent burning or urgency", type: "Pitta" },
      { text: "Regular, thick, heavy, slow but steady elimination", type: "Kapha" }
    ]
  }
];

export default function AIAssessment() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'symptomChecker' | 'doshaQuiz' | 'dietPlanner' | 'wellnessCoach' | 'progressAnalyzer'>('symptomChecker');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // AI Symptom Checker free-text states
  const [symptomText, setSymptomText] = useState('');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('Male');
  const [painLevel, setPainLevel] = useState(3);
  const [duration, setDuration] = useState('1 week');
  const [lifestyle, setLifestyle] = useState('stressed');
  const [diseases, setDiseases] = useState('');
  const [checkerLoading, setCheckerLoading] = useState(false);
  const [checkerReport, setCheckerReport] = useState<any>(null);

  // AI Dosha Quiz states
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizResult, setQuizResult] = useState<any>(null);

  // AI Diet & Yoga Planner states
  const [plannerDosha, setPlannerDosha] = useState('Vata-Pitta');
  const [plannerDietType, setPlannerDietType] = useState('Vegetarian');
  const [plannerGoal, setPlannerGoal] = useState('Stress Relief');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);

  // AI Wellness Coach (Chat Assistant) states
  const [chatHistory, setChatHistory] = useState<any[]>([
    { sender: 'bot', text: 'Namaste! I am AyuBot, your AI Ayurvedic Wellness Coach. Ask me about daily wellness routines (Dinacharya), seasonal diet regimens (Ritucharya), or herbs balancing.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);

  // AI Health Progress Analyzer states
  const [analyzedVitals, setAnalyzedVitals] = useState<any>({
    systolicBP: 120,
    bloodSugar: 95,
    weight: 70,
    sleepHours: 7.5
  });
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Parse text symptoms to run existing BAMS system backend
  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText) return;

    setCheckerLoading(true);
    setCheckerReport(null);

    // Parse keywords in free text to map to checkboxes array
    const matchedSymptoms: string[] = [];
    const textLower = symptomText.toLowerCase();
    SYMPTOM_MAPPING.forEach(item => {
      if (textLower.includes(item.key) && !matchedSymptoms.includes(item.val)) {
        matchedSymptoms.push(item.val);
      }
    });

    // Fallback if no matching keywords found
    if (matchedSymptoms.length === 0) {
      matchedSymptoms.push('Digestion issues');
    }

    try {
      const res = await api.post('/ai-assessment', {
        symptoms: matchedSymptoms,
        age,
        gender,
        painLevel,
        duration,
        lifestyle,
        diseases
      });

      if (res.data && res.data.success) {
        setCheckerReport(res.data.assessment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckerLoading(false);
    }
  };

  // Submit Dosha Quiz
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check all questions are answered
    if (Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length) {
      alert("Please answer all 10 questions to compute your accurate Dosha balance.");
      return;
    }

    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;

    Object.values(quizAnswers).forEach(val => {
      if (val === 'Vata') vataCount++;
      else if (val === 'Pitta') pittaCount++;
      else if (val === 'Kapha') kaphaCount++;
    });

    const total = vataCount + pittaCount + kaphaCount;
    const vataPct = Math.round((vataCount / total) * 100);
    const pittaPct = Math.round((pittaCount / total) * 100);
    const kaphaPct = Math.round((kaphaCount / total) * 100);

    let dominantDosha = 'Vata';
    let subDominant = 'Pitta';
    if (pittaPct >= vataPct && pittaPct >= kaphaPct) {
      dominantDosha = 'Pitta';
      subDominant = vataPct >= kaphaPct ? 'Vata' : 'Kapha';
    } else if (kaphaPct >= vataPct && kaphaPct >= pittaPct) {
      dominantDosha = 'Kapha';
      subDominant = pittaPct >= vataPct ? 'Pitta' : 'Vata';
    }

    const doshaData = [
      { name: 'Vata (Air & Ether)', value: vataPct, color: '#C59B67' },
      { name: 'Pitta (Fire & Water)', value: pittaPct, color: '#DC2626' },
      { name: 'Kapha (Earth & Water)', value: kaphaPct, color: '#2E5A44' }
    ];

    setQuizResult({
      vata: vataPct,
      pitta: pittaPct,
      kapha: kaphaPct,
      dominant: dominantDosha,
      sub: subDominant,
      data: doshaData
    });
  };

  // Generate personalized plan
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setPlannerLoading(true);
    setGeneratedPlan(null);

    setTimeout(() => {
      setPlannerLoading(false);
      setGeneratedPlan({
        meals: [
          { time: '08:00 AM', meal: 'Warm stewed apples with cloves and cardamom. Warm almond milk.', benefit: 'Kindles digestive fire (Agni) without accumulating Vata gas.' },
          { time: '01:00 PM', meal: 'Steamed basmati rice with organic Mung Dal Kitchari, topped with ghee.', benefit: 'Nourishing, easily absorbable proteins; grounds nervous system.' },
          { time: '05:00 PM', meal: 'Warm ginger tea with raw organic honey.', benefit: 'Acts as a mild thermogenic, dispelling cold dry Vata channels.' },
          { time: '08:00 PM', meal: 'Baked sweet potatoes and steamed spinach with toasted sesame seeds.', benefit: 'Provides heavy grounding complex carbs for deeper night sleep.' }
        ],
        yoga: [
          { pose: 'Balasana (Child Pose)', duration: '5 minutes', benefit: 'Releases lumbar joint tension; grounds anxiety.' },
          { pose: 'Nadi Shodhana Pranayama', duration: '10 minutes', benefit: 'Alternate nostril breathing to balance autonomic nervous channels.' },
          { pose: 'Viparita Karani (Legs up Wall)', duration: '8 minutes', benefit: 'Drains metabolic waste from lower extremities, calming heart rate.' }
        ]
      });
    }, 1000);
  };

  // AyuBot AI Chat Coach response simulation
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;

    const userText = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setBotTyping(true);

    setTimeout(() => {
      setBotTyping(false);
      let reply = "I understand. In Ayurveda, this matches a shift in your internal digestive Agni. Try to drink warm ginger water throughout the day and avoid heavy, cold sweets.";
      const query = userText.toLowerCase();

      if (query.includes('sleep') || query.includes('insomnia')) {
        reply = "To curb light/interrupted sleep, establish a fixed sleep routine before 10 PM. Apply warm sesame oil (Abhyanga) to your soles and drink warm milk infused with nutmeg.";
      } else if (query.includes('constip') || query.includes('digestion') || query.includes('bloat')) {
        reply = "Sluggish digestion and bloating point to Vata imbalances in the colon. Favour soft, moist foods like Kitchari with ghee. Avoid raw cold salads, especially in dry weather.";
      } else if (query.includes('dinacharya') || query.includes('routine')) {
        reply = "Dinacharya is the daily Ayurvedic routine. It includes: waking up before sunrise, scraping your tongue to clear toxins, oil pulling, self-massage, and moderate yoga pranayama.";
      } else if (query.includes('pitta') || query.includes('heat') || query.includes('acidity')) {
        reply = "Pitta represents the heat element. Balance it with sweet fruits (grapes, melons), coconut water, and cooling herbs like Amalaki or coriander tea. Strictly avoid deep-fried foods and hot chilies.";
      }

      setChatHistory(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  // Run Health Progress Analysis
  const handleProgressAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisLoading(true);
    setAnalysisReport(null);

    setTimeout(() => {
      setAnalysisLoading(true);
      const bp = parseInt(analyzedVitals.systolicBP);
      const sugar = parseInt(analyzedVitals.bloodSugar);
      const sleep = parseFloat(analyzedVitals.sleepHours);
      
      let bpStatus = "Balanced (Sama)";
      let sugarStatus = "Sama (Optimal)";
      let sleepStatus = "Balanced";
      let healthScore = 80;

      if (bp > 130) { bpStatus = "High (Vata/Pitta heat)"; healthScore -= 10; }
      if (sugar > 110) { sugarStatus = "Elevated (Kapha congestion)"; healthScore -= 10; }
      if (sleep < 6.5) { sleepStatus = "Insuffient (Vata restlessness)"; healthScore -= 10; }

      setAnalysisReport({
        score: healthScore,
        bpStatus,
        sugarStatus,
        sleepStatus,
        summary: `Your general health score is ${healthScore}%. Your vitals point to healthy digestive metabolism with slight ${bp > 130 ? 'Pitta heat' : 'Sama channels'}. Keep following your customized Dinacharya routine!`
      });
      setAnalysisLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ayur-primary text-xs font-semibold border border-emerald-250">
          <Sparkles className="w-3.5 h-3.5 text-ayur-primary" />
          <span>Kaya Kalp Ayurvedic AI Medical Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">AI Clinical Diagnostic Console</h1>
        <p className="text-stone-500 text-sm max-w-2xl mx-auto leading-relaxed">
          Cross-reference your symptoms against classical Ayurvedic scriptures. Estimate your primary Dosha imbalances, build personalized meal plans, and chat with your AI wellness coach.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 pb-4 text-xs font-bold">
        {[
          { id: 'symptomChecker', label: 'AI Symptom Checker', icon: Activity },
          { id: 'doshaQuiz', label: 'AI Dosha Assessment', icon: Compass },
          { id: 'dietPlanner', label: 'AI Diet & Yoga Planner', icon: FileText },
          { id: 'wellnessCoach', label: 'AI Wellness Coach (Chat)', icon: MessageSquare },
          { id: 'progressAnalyzer', label: 'AI Progress Analysis', icon: Heart }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-ayur-primary text-white shadow shadow-emerald-950/15' 
                  : 'bg-white border border-stone-200 text-stone-605 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* TAB 1: AI Symptom Checker */}
        {activeTab === 'symptomChecker' && (
          <>
            <div className="lg:col-span-5 p-5 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-ayur-primary" />
                Explain Your Symptoms
              </h3>

              <form onSubmit={handleSymptomSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-600">Type Symptoms & Ailments</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. I have severe pain in my lower back, bloating after eating dinner, and I feel dry skin and stress..."
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-[#FBFBF9] text-xs focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600">Age</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none text-stone-605"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-stone-550 font-bold uppercase tracking-wider">
                    <span>Pain Intensity Scale</span>
                    <span className="text-ayur-primary font-bold">{painLevel} / 10</span>
                  </div>
                  <input
                    type="range" min={1} max={10} value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600">Duration</label>
                    <input
                      type="text" required placeholder="e.g. 10 days" value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600">Lifestyle</label>
                    <select
                      value={lifestyle}
                      onChange={(e) => setLifestyle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none text-stone-605"
                    >
                      <option value="active">Active & Balanced</option>
                      <option value="sedentary">Sedentary (Mostly sitting)</option>
                      <option value="stressed">High Mental Stress</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit" disabled={checkerLoading}
                  className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary disabled:opacity-50 text-xs shadow-sm"
                >
                  {checkerLoading ? 'Analyzing script variables...' : 'Run Symptom Check'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {!checkerReport && !checkerLoading && (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 border-dashed text-xs text-stone-550 flex flex-col items-center justify-center min-h-[400px]">
                  <Compass className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
                  <h3 className="font-bold text-stone-750">Awaiting Ailment Data</h3>
                  <p className="mt-1">Fill out your symptoms, severity and pain levels to compile your report.</p>
                </div>
              )}

              {checkerLoading && (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-t-ayur-primary border-stone-200 rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-500">Evaluating systemic blockages against script database...</p>
                </div>
              )}

              {checkerReport && (
                <div className="rounded-[28px] bg-white border border-stone-200 p-6 space-y-6 shadow-sm animate-fadeIn">
                  <div className="flex justify-between items-start gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">AI Doctor Recommendation</span>
                      <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">{checkerReport.recommendedSpecialist}</h2>
                      <p className="text-[10px] text-ayur-primary font-bold uppercase tracking-wider mt-1">{checkerReport.primaryDosha}</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed">
                    <div className="space-y-1">
                      <strong className="text-stone-900 font-bold block">Why this specialist:</strong>
                      <p className="text-stone-605">{checkerReport.specialistReason}</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-stone-900 font-bold block">Dosha Analysis:</strong>
                      <p className="text-stone-605">{checkerReport.doshaExplanation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-150/40 space-y-2">
                      <span className="font-bold text-emerald-800 block">Herbal Formulas</span>
                      <ul className="list-disc pl-4 space-y-1 text-stone-605 text-[11px]">
                        {checkerReport.herbs.map((h: string) => <li key={h}>{h}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100 space-y-2">
                      <span className="font-bold text-amber-800 block">Personal Diet Tips</span>
                      <ul className="list-disc pl-4 space-y-1 text-stone-605 text-[11px]">
                        {checkerReport.dietRecs.map((d: string) => <li key={d}>{d}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200/50 text-[10px] text-red-800 leading-relaxed flex gap-2">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                    <p>{checkerReport.disclaimer}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(checkerReport.recommendedSpecialist)}`)}
                    className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary transition-all shadow flex items-center justify-center gap-1.5 text-xs"
                  >
                    <span>Book Consultation with matched {checkerReport.recommendedSpecialist}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: AI Dosha Assessment Quiz */}
        {activeTab === 'doshaQuiz' && (
          <>
            <div className="lg:col-span-6 p-6 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <Compass className="w-4.5 h-4.5 text-ayur-primary" />
                  Dosha Prakriti Questionnaire
                </h3>
                <span className="text-[10px] text-stone-400 block mt-1">Answer all 10 questions to determine your Vata-Pitta-Kapha percentages.</span>
              </div>

              <form onSubmit={handleQuizSubmit} className="space-y-6 text-xs">
                <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2">
                  {QUIZ_QUESTIONS.map(q => (
                    <div key={q.id} className="space-y-2 border-b border-stone-100 pb-4 last:border-0">
                      <span className="font-extrabold text-stone-800 block">{q.id}. {q.question}</span>
                      <div className="space-y-1.5">
                        {q.options.map((opt, i) => (
                          <label key={i} className="flex items-start gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-150">
                            <input
                              type="radio" name={`question-${q.id}`} required value={opt.type}
                              checked={quizAnswers[q.id] === opt.type}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt.type })}
                              className="mt-0.5 text-ayur-primary focus:ring-ayur-primary"
                            />
                            <span className="text-[11px] text-stone-605 font-medium">{opt.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="w-full py-2.5 bg-ayur-primary text-white font-extrabold rounded-xl hover:bg-ayur-secondary transition-all shadow-sm">
                  Calculate My Dosha Imbalance Profile
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-6">
              {!quizResult ? (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 border-dashed text-xs text-stone-550 flex flex-col items-center justify-center min-h-[400px]">
                  <Compass className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
                  <h3 className="font-bold text-stone-750">Dosha Profile Awaiting Quiz</h3>
                  <p className="mt-1">Answer the questions on the left to review your biological constitution profile.</p>
                </div>
              ) : (
                <div className="p-6 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="font-extrabold text-sm text-stone-900">Your Prakriti Profile Result</h3>
                    <p className="text-[10px] text-stone-400 mt-1">Dominant biological humors constitution: <strong className="text-ayur-primary">{quizResult.dominant}-{quizResult.sub}</strong></p>
                  </div>

                  {/* Recharts Bar chart rendering */}
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quizResult.data} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} stroke="#888" fontSize={9} />
                        <YAxis dataKey="name" type="category" stroke="#888" fontSize={9} width={90} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Percentage (%)">
                          {quizResult.data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs space-y-3.5">
                    <div>
                      <strong className="text-emerald-800 block text-[10px] uppercase tracking-wider mb-1">Primary Dosha Summary:</strong>
                      <p className="text-stone-605 leading-relaxed">
                        Your body frame and traits align mostly with <strong className="text-ayur-primary">{quizResult.dominant}</strong>. This dictates your cellular metabolism, speed of digestion, skin renewal, and response to weather.
                      </p>
                    </div>
                    <div>
                      <strong className="text-emerald-800 block text-[10px] uppercase tracking-wider mb-1">Recommended Action:</strong>
                      <p className="text-stone-605 leading-relaxed">
                        To maintain this equilibrium, establish warm cooked meals (Kitchari), dry self-massage, and regular meditation. Avoid extreme sun exposure or iced drinks.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 3: AI Diet & Yoga Planner */}
        {activeTab === 'dietPlanner' && (
          <>
            <div className="lg:col-span-5 p-5 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-ayur-primary" />
                Customize Diet & Yoga Variables
              </h3>

              <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-600">Select Primary Imbalanced Dosha</label>
                  <select
                    value={plannerDosha} onChange={(e) => setPlannerDosha(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none text-stone-605"
                  >
                    <option>Vata (Dry/Pain/Cold)</option>
                    <option>Pitta (Acidity/Acne/Heat)</option>
                    <option>Kapha (Weight/Sluggish/Congested)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-600">Dietary Preference</label>
                  <select
                    value={plannerDietType} onChange={(e) => setPlannerDietType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none text-stone-605"
                  >
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Non-Vegetarian</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-600">Primary Health Goal</label>
                  <select
                    value={plannerGoal} onChange={(e) => setPlannerGoal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none text-stone-605"
                  >
                    <option>Stress Relief</option>
                    <option>Digestive Agni Boost</option>
                    <option>Healthy Weight Loss</option>
                    <option>Clear Skin Glow</option>
                  </select>
                </div>

                <button type="submit" disabled={plannerLoading} className="w-full py-2.5 bg-ayur-primary text-white font-extrabold rounded-xl hover:bg-ayur-secondary transition-all shadow-sm">
                  {plannerLoading ? 'Compiling recipes database...' : 'Generate Plan'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {!generatedPlan && !plannerLoading && (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 border-dashed text-xs text-stone-550 flex flex-col items-center justify-center min-h-[400px]">
                  <FileText className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
                  <h3 className="font-bold text-stone-750">Planner Awaiting Inputs</h3>
                  <p className="mt-1">Select your biological dosha and diet preference to compile custom routines.</p>
                </div>
              )}

              {plannerLoading && (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-t-ayur-primary border-stone-200 rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-500">Generating balancing recipes and stretching asanas...</p>
                </div>
              )}

              {generatedPlan && (
                <div className="p-6 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="font-extrabold text-sm text-stone-900">Custom Diet Daily Schedule</h3>
                    <p className="text-[10px] text-stone-400 mt-1">Goal: {plannerGoal} &bull; Dosha: {plannerDosha}</p>
                  </div>

                  <div className="space-y-3.5">
                    {generatedPlan.meals.map((m: any, idx: number) => (
                      <div key={idx} className="p-3 bg-stone-50/60 border border-stone-100 rounded-2xl text-xs flex justify-between items-start gap-4">
                        <span className="font-extrabold text-ayur-primary shrink-0 w-16">{m.time}</span>
                        <div className="space-y-1">
                          <strong className="text-stone-900 block font-bold">{m.meal}</strong>
                          <p className="text-[10.5px] text-stone-500 font-medium leading-relaxed">Benefit: {m.benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 pt-5 space-y-3">
                    <h4 className="font-extrabold text-xs text-stone-900">Suggested Yoga Routine</h4>
                    <div className="space-y-2">
                      {generatedPlan.yoga.map((y: any, idx: number) => (
                        <div key={idx} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs flex justify-between">
                          <div className="space-y-0.5">
                            <strong className="text-emerald-800 font-bold block">{y.pose}</strong>
                            <span className="text-[10px] text-stone-550 leading-relaxed block">Focus: {y.benefit}</span>
                          </div>
                          <span className="text-[10px] text-ayur-primary font-bold shrink-0">{y.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 4: AI Wellness Coach (Chat Assistant) */}
        {activeTab === 'wellnessCoach' && (
          <div className="lg:col-span-12 p-6 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4.5 h-4.5 text-ayur-primary" />
                  Ask AyuBot Wellness Assistant
                </h3>
                <span className="text-[10px] text-stone-400 block mt-1">Get instant answers on seasonal diets (Ritucharya) and herbal guidelines.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Preset prompts - span 4 */}
              <div className="md:col-span-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col justify-start gap-2.5 text-xs">
                <span className="font-extrabold text-stone-400 uppercase text-[9px] tracking-wider block mb-1">Common Queries</span>
                {[
                  "What is daily Dinacharya routine?",
                  "How to curb acid reflux using Pitta tips?",
                  "Which herbs nourish deep sleep patterns?",
                  "Why do dry salads aggravate joint stiffness?"
                ].map((prompt, idx) => (
                  <button
                    key={idx} onClick={() => setChatInput(prompt)}
                    className="p-3 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl text-left font-medium text-stone-700 hover:border-emerald-100 transition-all text-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Conversation workspace - span 8 */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div className="p-4 bg-[#FBFBF9] border border-stone-200/50 rounded-2xl h-64 overflow-y-auto space-y-4">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-ayur-primary text-white shadow-sm' : 'bg-white border border-stone-200 text-stone-800'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {botTyping && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-400 text-xs italic">
                        AyuBot is referencing scriptures...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text" placeholder="Ask AyuBot about seasonal diets or wellness tips..." value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                  />
                  <button type="submit" className="px-4.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary flex items-center justify-center shadow-sm">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: AI Health Progress Analysis */}
        {activeTab === 'progressAnalyzer' && (
          <>
            <div className="lg:col-span-5 p-5 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-5">
              <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5 text-ayur-primary" />
                Vitals Progress Variables
              </h3>

              <form onSubmit={handleProgressAnalysis} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-600">Systolic Blood Pressure (mmHg)</label>
                  <input
                    type="number" value={analyzedVitals.systolicBP}
                    onChange={(e) => setAnalyzedVitals({ ...analyzedVitals, systolicBP: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-600">Fasting Blood Sugar (mg/dL)</label>
                  <input
                    type="number" value={analyzedVitals.bloodSugar}
                    onChange={(e) => setAnalyzedVitals({ ...analyzedVitals, bloodSugar: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600">Weight (kg)</label>
                    <input
                      type="number" value={analyzedVitals.weight}
                      onChange={(e) => setAnalyzedVitals({ ...analyzedVitals, weight: e.target.value })}
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600">Daily Sleep (hrs)</label>
                    <input
                      type="number" step="0.5" value={analyzedVitals.sleepHours}
                      onChange={(e) => setAnalyzedVitals({ ...analyzedVitals, sleepHours: e.target.value })}
                      className="w-full p-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" disabled={analysisLoading} className="w-full py-2.5 bg-ayur-primary text-white font-extrabold rounded-xl hover:bg-ayur-secondary transition-all shadow-sm">
                  {analysisLoading ? 'Running Vitals Regression...' : 'Run Progress Check'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {!analysisReport && !analysisLoading && (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 border-dashed text-xs text-stone-550 flex flex-col items-center justify-center min-h-[400px]">
                  <Heart className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
                  <h3 className="font-bold text-stone-750">Analyzer Awaiting Vitals</h3>
                  <p className="mt-1">Input your current body parameters to compile the report card.</p>
                </div>
              )}

              {analysisLoading && (
                <div className="p-12 text-center bg-white rounded-[28px] border border-stone-200 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-t-ayur-primary border-stone-200 rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-500">Correlating daily trackers against historic clinical averages...</p>
                </div>
              )}

              {analysisReport && (
                <div className="p-6 rounded-[28px] bg-white border border-stone-200 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-stone-100 pb-3 flex justify-between items-baseline">
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900">Vitals Progress Score</h3>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Calculated using home metrics logs</span>
                    </div>
                    <span className="text-2xl font-black text-ayur-primary">{analysisReport.score} %</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                      <span className="text-[9px] text-stone-450 block mb-0.5">BP Classification</span>
                      <span className="text-stone-800 text-[11px] block">{analysisReport.bpStatus}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                      <span className="text-[9px] text-stone-450 block mb-0.5">Blood Sugar</span>
                      <span className="text-stone-800 text-[11px] block">{analysisReport.sugarStatus}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                      <span className="text-[9px] text-stone-450 block mb-0.5">Sleep Quality</span>
                      <span className="text-stone-800 text-[11px] block">{analysisReport.sleepStatus}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs space-y-2">
                    <strong className="text-emerald-800 block text-[10px] uppercase tracking-wider">AI Wellness Recommendation Summary:</strong>
                    <p className="text-stone-605 leading-relaxed font-medium">
                      {analysisReport.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
