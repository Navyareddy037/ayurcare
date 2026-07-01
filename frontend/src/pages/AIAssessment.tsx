import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Activity, Sparkles, Compass, ShieldAlert, Download, ArrowRight 
} from 'lucide-react';

const SYMPTOM_CHECKLIST = [
  'Headache',
  'Joint pain',
  'Digestion issues',
  'Skin problems',
  'Hair loss',
  'Diabetes',
  'Stress',
  'Anxiety',
  'Obesity',
  'Arthritis',
  'Back pain',
  'Infertility',
  'Respiratory issues'
];

export default function AIAssessment() {
  const navigate = useNavigate();

  // Wizard state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('Male');
  const [painLevel, setPainLevel] = useState(3);
  const [duration, setDuration] = useState('1 week');
  const [lifestyle, setLifestyle] = useState('stressed');
  const [diseases, setDiseases] = useState('');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert('Please check at least one symptom.');
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const res = await api.post('/ai-assessment', {
        symptoms: selectedSymptoms,
        age,
        gender,
        painLevel,
        duration,
        lifestyle,
        diseases
      });

      if (res.data && res.data.success) {
        setReport(res.data.assessment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const text = `
==================================================
           AYURCARE AI ASSESSMENT REPORT
==================================================
Age: ${age} | Gender: ${gender}
Pain Severity: ${painLevel} / 10 | Duration: ${duration}
Lifestyle Factor: ${lifestyle}
Existing Diseases: ${diseases || 'None reported'}
Selected Symptoms: ${selectedSymptoms.join(', ')}

--------------------------------------------------
RECOMMENDED SPECIALIST: ${report.recommendedSpecialist}
--------------------------------------------------
Explanation: 
${report.specialistReason}

DOSHA PROFILE INVOLVEMENT:
${report.primaryDosha}
${report.doshaExplanation}

--------------------------------------------------
BOTANICAL THERAPIES (HERBS):
${report.herbs.map((h: string) => `* ${h}`).join('\n')}

DIETARY RECOMMENDATIONS:
${report.dietRecs.map((d: string) => `* ${d}`).join('\n')}

YOGIC THERAPY (POSES):
${report.yogaRecs.map((y: string) => `* ${y}`).join('\n')}

HOME REMEDIES:
${report.homeRemedies.map((hr: string) => `* ${hr}`).join('\n')}

LIFESTYLE GUIDELINES:
${report.lifestyleTips.map((lt: string) => `* ${lt}`).join('\n')}

==================================================
${report.disclaimer}
==================================================
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AyurCare_AI_Assessment_${report.recommendedSpecialist.replace(' ', '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ayur-primary text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Specialist Recommendation Wizard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-sans">AI Health Assessment</h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto">
          Input your current ailments, pain scores, and daily routines. Our engine evaluates systemic blockages and recommends specialized Vaidyas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Wizard */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <Activity className="w-4.5 h-4.5 text-ayur-primary" />
            Select Your Symptoms
          </h3>

          <form onSubmit={handleRunAssessment} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOM_CHECKLIST.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-emerald-50 border-ayur-primary text-ayur-primary' 
                        : 'border-stone-200 text-stone-500 hover:border-emerald-100'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-605 focus:outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-stone-550 font-bold uppercase tracking-wider">
                <span>Pain / Discomfort Intensity</span>
                <span className="text-ayur-primary font-bold">{painLevel} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-605"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-stone-555 font-bold uppercase tracking-wider">Duration of Illness</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 days, 2 months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-stone-555 font-bold uppercase tracking-wider">Lifestyle state</label>
                <select
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-605 focus:outline-none"
                >
                  <option value="active">Active & Balanced</option>
                  <option value="sedentary">Sedentary (mostly sitting)</option>
                  <option value="stressed">High Mental Stress</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider">Existing Chronic Illnesses</label>
              <input
                type="text"
                placeholder="e.g. Thyroid, Hypertension (or leave blank)"
                value={diseases}
                onChange={(e) => setDiseases(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary disabled:opacity-50 text-xs shadow"
            >
              {loading ? 'Analyzing symptoms...' : 'Run Ayurvedic Diagnosis'}
            </button>
          </form>
        </div>

        {/* Report Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!report && !loading && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 border-dashed text-xs text-stone-550 flex flex-col items-center justify-center min-h-[400px]">
              <Compass className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
              <h3 className="font-bold text-stone-750">Awaiting Assessment Variables</h3>
              <p className="mt-1">Fill out the questionnaire and run diagnostic parameters to review the report.</p>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 min-h-[400px] flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-t-ayur-primary border-stone-200 rounded-full animate-spin"></div>
              <p className="text-xs text-stone-500">Cross-referencing symptoms database against ancient scripts...</p>
            </div>
          )}

          {report && (
            <div className="rounded-3xl bg-white border border-stone-200 p-6 space-y-6 shadow-md animate-float">
              <div className="flex justify-between items-start gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">Recommended Specialist</span>
                  <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">{report.recommendedSpecialist}</h2>
                  <p className="text-[10px] text-ayur-primary font-bold uppercase tracking-wider mt-1">{report.primaryDosha}</p>
                </div>
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-[10px] font-bold text-stone-700 hover:bg-stone-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <strong className="text-stone-900 font-bold">Why this specialist is recommended:</strong>
                  <p className="text-stone-650 leading-relaxed">{report.specialistReason}</p>
                </div>

                <div className="space-y-1">
                  <strong className="text-stone-900 font-bold">Dosha Analysis:</strong>
                  <p className="text-stone-650 leading-relaxed">{report.doshaExplanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 space-y-2">
                  <span className="font-bold text-emerald-800 block">Botanical Herbs (Remedies)</span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-605 text-[11px]">
                    {report.herbs.map((h: string) => <li key={h}>{h}</li>)}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100 space-y-2">
                  <span className="font-bold text-amber-800 block">Dietary Adjustments</span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-605 text-[11px]">
                    {report.dietRecs.map((d: string) => <li key={d}>{d}</li>)}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 space-y-2">
                  <span className="font-bold text-emerald-800 block">Yoga & Meditation</span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-605 text-[11px]">
                    {report.yogaRecs.map((y: string) => <li key={y}>{y}</li>)}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100 space-y-2">
                  <span className="font-bold text-amber-800 block">Home Remedies</span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-655 text-[11px]">
                    {report.homeRemedies.map((hr: string) => <li key={hr}>{hr}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200/50 text-[10px] text-red-800 leading-relaxed flex gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <p>{report.disclaimer}</p>
              </div>

              <button
                onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(report.recommendedSpecialist)}`)}
                className="w-full py-2.5 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary transition-all shadow flex items-center justify-center gap-1.5 text-xs"
              >
                <span>Book Consultation with matched {report.recommendedSpecialist}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
