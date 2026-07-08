import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Sparkles, Activity, ShieldAlert, Compass, Search, 
  MapPin, Phone, HelpCircle, ArrowRight, ArrowUpRight 
} from 'lucide-react';

const FEATURED_HERBS = [
  {
    name: 'Ashwagandha',
    scientific: 'Withania somnifera',
    benefit: 'Reduces cortisol, combats anxiety, increases cellular energy, and rejuvenates the nervous system.',
    dosha: 'Balances Vata & Kapha',
    howToUse: 'Take 1/2 tsp of Ashwagandha powder in warm milk or water before bed.'
  },
  {
    name: 'Triphala',
    scientific: 'Amla, Bibhitaki & Haritaki',
    benefit: 'Gently cleanses the colon, aids fat metabolism, improves eyesight, and enhances nutrient absorption.',
    dosha: 'Tridoshic (Balances Vata, Pitta & Kapha)',
    howToUse: 'Mix 1/2 tsp in warm water; steep for 5 minutes and drink on an empty stomach.'
  },
  {
    name: 'Turmeric (Haridra)',
    scientific: 'Curcuma longa',
    benefit: 'Potent anti-inflammatory, detoxifies blood, stimulates skin repair, and enhances joint flexibility.',
    dosha: 'Balances Kapha & Vata; increases Pitta in excess',
    howToUse: 'Mix 1/2 tsp with warm water and a pinch of black pepper, or add to warm golden milk.'
  },
  {
    name: 'Brahmi',
    scientific: 'Bacopa monnieri',
    benefit: 'Soothes mental tension, enhances memory and focus, and stimulates mental clarity and calmness.',
    dosha: 'Balances Pitta & Vata',
    howToUse: 'Consume 1-2 tablets or 1/2 tsp of Brahmi powder with warm ghee or water.'
  }
];

const DOSHAS = {
  vata: {
    title: 'Vata Dosha (Air & Ether)',
    qualities: 'Cold, light, dry, mobile, rough',
    traits: 'Creative, energetic, thin-build, prone to dry skin, cold hands, anxiety, and joint stiffness.',
    tips: 'Consume cooked warm stews, oils, sweet spices (ginger, cinnamon), and follow a structured daily routine.',
    colors: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  pitta: {
    title: 'Pitta Dosha (Fire & Water)',
    qualities: 'Hot, sharp, light, liquid, sour',
    traits: 'Intelligent, passionate, athletic, prone to skin rashes, acid reflux, heart burn, and high body heat.',
    tips: 'Eat cooling sweet foods (cucumbers, melons), favor ghee and coconut, and avoid hot spices and midday sun.',
    colors: 'bg-red-50 text-red-800 border-red-200'
  },
  kapha: {
    title: 'Kapha Dosha (Earth & Water)',
    qualities: 'Heavy, slow, cold, oily, stable',
    traits: 'Calm, loving, sturdy-build, prone to sinus congestion, weight gain, sleepiness, and lethargy.',
    tips: 'Enjoy warm, light, spicy dishes, drink warm ginger tea, and engage in active exercise every day.',
    colors: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  }
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDosha, setSelectedDosha] = useState<'vata' | 'pitta' | 'kapha' | null>(null);
  const [activeHerb, setActiveHerb] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const emergencyHospitals = [
    { name: 'Demo Hospital A', distance: 'To Be Updated', contact: 'Coming Soon', address: 'To Be Updated (Demo Information)' },
    { name: 'Demo Hospital B', distance: 'To Be Updated', contact: 'Coming Soon', address: 'To Be Updated (Demo Information)' },
    { name: 'Demo Hospital C', distance: 'To Be Updated', contact: 'Coming Soon', address: 'To Be Updated (Demo Information)' }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-1/4 left-1/4 -z-10 w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-1/4 -z-10 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Texts */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modernizing 5000 Years of Natural Medicine</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
                Your Health Journey, Guided by <span className="text-ayur-primary">Ayurvedic Wisdom</span>
              </h1>
              <p className="text-lg text-stone-600 max-w-xl mx-auto lg:mx-0">
                Identify your body type (Doshas), check your symptoms with our intelligent assistant, and book consultations with verified Ayurvedic doctors.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/ai-assessment"
                  className="px-6 py-3.5 rounded-xl bg-ayur-primary text-white font-bold hover:bg-ayur-secondary transition-all shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/25 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Start AI Symptom Check
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/doctors"
                  className="px-6 py-3.5 rounded-xl bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-all text-stone-700"
                >
                  Browse Doctor Directory
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-stone-200/60">
                <div>
                  <div className="text-2xl font-bold text-ayur-primary">50+</div>
                  <div className="text-xs text-stone-500">Verified Vaidyas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-ayur-primary">10k+</div>
                  <div className="text-xs text-stone-500">Patient Visits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-ayur-primary">98%</div>
                  <div className="text-xs text-stone-500">Positive Reviews</div>
                </div>
              </div>
            </div>

            {/* Right Teaser Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl glass-card p-6 border border-white/50 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-ayur-primary">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">Kaya Kalp Quick Portal</h3>
                      <p className="text-[10px] text-stone-500">Live Services Available</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/ai-assessment"
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/20 hover:bg-emerald-50 border border-emerald-100 group transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-800">Symptom Classifier</div>
                      <div className="text-[10px] text-stone-500">Analyze & map to specialists</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <Link
                    to="/doctors"
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/20 hover:bg-amber-50 border border-amber-100/50 group transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-800">Live Scheduling</div>
                      <div className="text-[10px] text-stone-500">Select slots and book instantly</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <Link
                    to="/knowledge-hub"
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/50 group transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-800">Knowledge Base</div>
                      <div className="text-[10px] text-stone-500">Browse 100+ medicinal herbs</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="rounded-2xl bg-stone-950 p-4 text-white text-xs border border-stone-800 space-y-1.5 shadow-inner">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Demo Hotline</span>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-normal">
                    Real-world hotlines and emergency contact features are disabled in this prototype.
                  </p>
                  <span className="inline-block font-extrabold text-white bg-stone-700 px-3 py-1 rounded-lg text-[10px]">
                    To Be Updated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Doshas Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-stone-900">Understand Your Ayurvedic Dosha</h2>
          <p className="text-stone-600 text-sm max-w-lg mx-auto">
            Every human body is governed by three active principles (Vata, Pitta, Kapha). Select one to learn your core properties and balancing diet recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(DOSHAS) as Array<keyof typeof DOSHAS>).map((key) => {
            const item = DOSHAS[key];
            const isActive = selectedDosha === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDosha(isActive ? null : key)}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  isActive 
                    ? 'ring-2 ring-ayur-primary border-transparent scale-[1.02] shadow-md shadow-emerald-950/5' 
                    : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50/50'
                } bg-white space-y-4`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-stone-900 capitalize">{key}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    key === 'vata' ? 'bg-amber-100 text-amber-800' :
                    key === 'pitta' ? 'bg-red-100 text-red-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {key === 'vata' ? 'Air & Ether' : key === 'pitta' ? 'Fire & Water' : 'Earth & Water'}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  <strong className="text-stone-700">Qualities:</strong> {item.qualities}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {item.traits}
                </p>

                {isActive && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed mt-4 animate-float ${item.colors}`}>
                    <h4 className="font-bold mb-1">Dosha Balancing Diet Tips:</h4>
                    <p>{item.tips}</p>
                  </div>
                )}

                <div className="text-xs font-semibold text-ayur-primary flex items-center gap-1 mt-2">
                  <span>{isActive ? 'Hide details' : 'Learn balance tips'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Interactive Herb Database */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Ayurvedic Herbs Encyclopedia</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">Search Core Medicinal Herbs</h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Browse profiles, therapeutic targets, and dosage instructions for ancient botanical treatments. Explore how to properly integrate these herbs into your daily cooking or routines.
            </p>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search herbs (e.g. Ashwagandha, Triphala)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
              />
            </div>
            <Link to="/knowledge-hub" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ayur-primary hover:text-ayur-secondary">
              Go to full Knowledge Hub
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Side */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURED_HERBS.filter(herb => 
              herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              herb.scientific.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((herb, index) => (
              <div
                key={herb.name}
                onClick={() => setActiveHerb(activeHerb === index ? null : index)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeHerb === index 
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-sm' 
                    : 'bg-white border-stone-200 hover:border-emerald-250'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-900">{herb.name}</h4>
                    <span className="text-[10px] text-stone-500 italic">{herb.scientific}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                    {herb.dosha}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mt-2 line-clamp-3">
                  {herb.benefit}
                </p>

                {activeHerb === index && (
                  <div className="mt-3 pt-3 border-t border-stone-200/50 text-[11px] text-stone-600 leading-relaxed bg-white/50 p-2.5 rounded-lg">
                    <strong className="text-stone-800 block mb-0.5">How to take:</strong>
                    {herb.howToUse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Emergency Support */}
      <section id="emergency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-red-500/5 border border-red-200/50 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Demo Emergency Info</span>
              </div>
              <h2 className="text-3xl font-extrabold text-stone-900">Emergency Support</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Emergency hotlines, helpline registries, and real-world ambulance dispatch services are disabled in this prototype. Contact and business details will be updated upon final deployment.
              </p>
              <div className="flex gap-4">
                <span className="px-5 py-2.5 rounded-xl bg-stone-500 text-white font-extrabold text-xs">
                  Coming Soon (To Be Updated)
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-bold text-stone-850 text-sm">Nearby Accredited Ayurvedic Hospital Units</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {emergencyHospitals.map(hospital => (
                  <div key={hospital.name} className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs shadow-sm">
                    <div className="font-bold text-stone-900 leading-tight">{hospital.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{hospital.distance}</span>
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      Address: {hospital.address}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-stone-450 font-bold">
                      <Phone className="w-3 h-3" />
                      <span>{hospital.contact}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-stone-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is Panchakarma and why is it recommended?',
              a: 'Panchakarma is a series of five detoxification therapies designed to release deep-seated metabolic waste (Ama) and restore Vata, Pitta, and Kapha to their balanced states. It involves massage (Abhyanga), sweat baths (Swedana), and specialized cleansing methods.'
            },
            {
              q: 'How does the AI assessment choose a doctor specialization?',
              a: 'The AI analyzes your symptoms and looks for physiological keywords: skin eruptions map to Ayurvedic Dermatology, musculoskeletal stiffness maps to Orthopedics, digestive complaints target Panchakarma cleansing, and mental stress routes to Ayurvedic Psychiatry.'
            },
            {
              q: 'Can Ayurvedic treatments be taken alongside Western medications?',
              a: 'Yes, but under strict supervision. Many Ayurvedic herbs might interact with prescription drugs (like blood thinners or diabetes pills). Always share your current medications with your consulting doctor.'
            }
          ].map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div key={index} className="border border-stone-200 rounded-2xl bg-white overflow-hidden">
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="flex justify-between items-center w-full px-6 py-4 text-left font-bold text-stone-900 text-sm"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-ayur-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
