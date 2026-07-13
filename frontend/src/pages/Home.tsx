import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Sparkles, Activity, ShieldAlert, Compass, Search, 
  MapPin, Phone, HelpCircle, ArrowRight, ArrowUpRight, Award, 
  CheckCircle2, BookOpen, Star, Mail, Clock, MessageSquare, ShieldCheck, Users, Calendar,
  ShoppingCart, Eye, X, ArrowUpDown, ThumbsUp
} from 'lucide-react';

const CONDITIONS = [
  { name: 'Sandhigata Vata (Arthritis & Joint Care)', description: 'Therapeutic warm oil pooling and herbal poultices to rebuild joint lubricating fluids and soothe chronic inflammation.', code: 'Joints' },
  { name: 'Kati Basti (Back & Spine Conditions)', description: 'Warm herbal decoctions retained on the lumbosacral region to treat disc compression, sciatica, and chronic aches.', code: 'Spine' },
  { name: 'Skin Disorders (Psoriasis & Eczema)', description: 'Deep internal purification therapies (Virechana) paired with soothing neem and turmeric topical formulations.', code: 'Skin' },
  { name: 'Obesity & Weight Management', description: 'Dry herbal powder scrub massages (Udvartana) designed to activate lipid metabolism and cleanse skin tissue.', code: 'Weight' }
];

const PANCHAKARMA = [
  { name: 'Vamana (Therapeutic Emesis)', desc: 'Cleansing therapy specifically targeting respiratory and Kapha disorders. Purges accumulated phlegm toxins.', duration: '7 - 14 Days' },
  { name: 'Virechana (Purgation Therapy)', desc: 'Gentle laxative purification targeting gallbladder, liver, and Pitta imbalances. Clears blood and skin impurities.', duration: '5 - 10 Days' },
  { name: 'Basti (Enema Therapy)', desc: 'Warm herbal decoction oils designed to treat chronic nervous system and musculoskeletal Vata disorders.', duration: '8 - 21 Days' },
  { name: 'Nasya (Nasal Cleansing)', desc: 'Administration of herbal drops via nostrils to clear sinuses, eliminate toxins, and boost mental clarity.', duration: '3 - 7 Days' },
  { name: 'Raktamokshana (Blood Purification)', desc: 'Localized purification therapies designed to treat deep-seated eczema, psoriasis, or localized toxicity.', duration: '1 - 3 Days' }
];

const PACKAGES = [
  { title: 'Ayur Detox Program', days: '7 Days', price: '₹14,999', features: ['Prakriti Dosha analysis', 'Daily Abhyanga massage', 'Shirodhara oil flow session', 'Organic balancing herbal meals'] },
  { title: 'Spine & Joint Rejuvenation', days: '14 Days', price: '₹28,500', features: ['Kati Basti spinal treatments', 'Patra Pinda Sweda poultices', 'Physiotherapy consulting', 'Anti-inflammatory herb kit'] },
  { title: 'Stress Buster & Sleep Package', days: '5 Days', price: '₹9,999', features: ['Ayurvedic head massage (Champi)', 'Shirodhara therapies', 'Yoga Pranayama sessions', 'Insomnia balancing advice'] }
];

const BLOGS = [
  { 
    title: 'Benefits of Panchakarma Detoxification', 
    date: 'July 10, 2026', 
    readTime: '5 min read', 
    desc: 'Deep cleansing therapies designed to release fat-soluble metabolic wastes (Ama) and restore perfect humoral balance.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=400&h=250'
  },
  { 
    title: 'Ayurvedic Treatment for Joint & Spine Care', 
    date: 'June 28, 2026', 
    readTime: '4 min read', 
    desc: 'How oil pooling (Kati Basti) and herbal poultices relieve disc compression, sciatica, and chronic joint inflammation.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400&h=250'
  },
  {
    title: 'Natural Care for Chronic Skin Disorders',
    date: 'June 15, 2026',
    readTime: '6 min read',
    desc: 'Understanding psoriasis and eczema flares through blood impurities and purging toxins via herbal formulations.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400&h=250'
  }
];

interface SolutionCard {
  name: string;
  category: 'Hair Care' | 'Face Care' | 'Pain Relief' | 'Obesity Care';
  badge1: string; // "100% Herbal"
  badge2: string; // "Doctor Recommended"
  desc: string;
  image: string;
  benefits: string[];
}

const SOLUTIONS_DATA: SolutionCard[] = [
  {
    name: 'Hair Oil',
    category: 'Hair Care',
    badge1: '100% Herbal',
    badge2: 'Doctor Recommended',
    desc: 'Helps control hair fall, stimulates growth, nourishes scalp, and helps relieve tension headaches.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Helps reduce hair fall',
      'Controls dandruff',
      'Strengthens thin hair',
      'Helps relieve headaches',
      'Nourishes scalp naturally'
    ]
  },
  {
    name: 'Herbal Heena',
    category: 'Hair Care',
    badge1: '100% Herbal',
    badge2: 'Natural Shine',
    desc: 'Pure organic henna powder designed to deeply condition hair roots, rendering smooth, silky, and glowing texture.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Makes hair smooth',
      'Gives silky texture',
      'Improves natural shine',
      'Conditions hair naturally'
    ]
  },
  {
    name: 'Herbal Hair Spa Pack',
    category: 'Hair Care',
    badge1: '100% Herbal',
    badge2: 'Doctor Recommended',
    desc: 'Intense spa pack designed to target structural hair dryness, clear dandruff build-up, and deep-condition follicles.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Controls hair fall',
      'Reduces dandruff',
      'Deep nourishes hair',
      'Makes hair smooth, silky, and healthy'
    ]
  },
  {
    name: 'Fairness Face Pack',
    category: 'Face Care',
    badge1: '100% Herbal',
    badge2: 'Glow booster',
    desc: 'Traditional sandalwood mask to reverse facial sun tan, reduce skin dullness, and illuminate blood circulation.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Removes tanning',
      'Reduces skin dullness',
      'Brightens complexion',
      'Gives natural glow'
    ]
  },
  {
    name: 'Neem Face Pack',
    category: 'Face Care',
    badge1: '100% Herbal',
    badge2: 'Doctor Recommended',
    desc: 'Anti-bacterial neem blend that targets active acne nodes, purifies clogged pores, and cleanses oily skin.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Removes pimples',
      'Reduces acne',
      'Cleanses skin',
      'Nourishes skin naturally'
    ]
  },
  {
    name: 'KayaKalp Face Pack',
    category: 'Face Care',
    badge1: '100% Herbal',
    badge2: 'Doctor Recommended',
    desc: 'Anti-aging skin tightening mask that improves facial elasticity and gives a glowing, youthful appearance.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Skin tightening',
      'Anti-aging care',
      'Improves skin elasticity',
      'Gives youthful appearance'
    ]
  },
  {
    name: 'Pain Relief Oil',
    category: 'Pain Relief',
    badge1: '100% Herbal Formula',
    badge2: 'Doctor Recommended',
    desc: 'High absorption massage formulation to alleviate chronic joint arthritis, gout swelling, back, and neck pain.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Joint Pain Support',
      'Arthritis Relief',
      'Gout Management',
      'Muscle Pain Relief',
      'Sports Injury Pain Healing',
      'Back Pain Reduction',
      'Neck Pain Alleviation'
    ]
  },
  {
    name: 'Traditional Herbal Weight Management Pills',
    category: 'Obesity Care',
    badge1: '100% Herbal',
    badge2: 'Doctor Recommended',
    desc: 'Classical Jadi-Buti capsules designed to assist healthy fat reduction, relieve bowel constipation, and boost digestion.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=350&h=250',
    benefits: [
      'Supports healthy weight loss',
      'Relieves constipation',
      'Improves digestion',
      'Made using traditional Ayurvedic herbs (Jadi-Butis)',
      'Supports metabolism naturally'
    ]
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const handleAnchorScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 2500);
  };

  return (
    <div className="space-y-24 pb-20 font-sans selection:bg-emerald-100 selection:text-emerald-950 bg-[#FBFBF9]">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 bg-gradient-to-b from-emerald-50/40 via-[#FBFBF9] to-transparent">
        <div className="absolute top-10 left-10 -z-10 w-96 h-96 rounded-full bg-emerald-150/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 -z-10 w-[500px] h-[500px] rounded-full bg-amber-100/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-150/50 text-ayur-primary text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-ayur-accent animate-spin" style={{ animationDuration: '6s' }} />
                <span>Modernizing Ayurvedic Excellence Since 2018</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1] font-sans">
                Premium Ayurvedic Healthcare for <span className="text-ayur-primary relative">
                  Modern Vigor
                  <span className="absolute bottom-1 left-0 w-full h-1.5 bg-ayur-accent/20 -z-10 rounded"></span>
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Bringing 5,000 years of traditional medicine to the digital age. Calculate your body Doshas, consult BAMS-certified Vaidyas, and track your daily wellness logs.
              </p>

              {/* Call-to-action CTAs */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/doctors"
                  className="px-7 py-3.5 rounded-2xl bg-ayur-primary text-white font-bold hover:bg-ayur-secondary transition-all shadow-lg hover:shadow-emerald-950/20 hover:scale-[1.02] flex items-center gap-1.5 text-xs tracking-wider uppercase"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  to="/ai-assessment"
                  className="px-7 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-750 font-bold hover:bg-stone-50 transition-all hover:scale-[1.02] text-xs flex items-center gap-2 shadow-sm"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Online AI Consultation</span>
                </Link>

                <Link
                  to="/doctors"
                  className="px-7 py-3.5 rounded-2xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all hover:scale-[1.02] text-xs flex items-center gap-1 shadow-sm"
                >
                  <span>Find a Doctor</span>
                </Link>
              </div>

              {/* Trusted metrics */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto lg:mx-0 border-t border-stone-200/60">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-ayur-primary">25+</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Expert Vaidyas</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-ayur-primary">15,000+</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Healed Patients</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-ayur-primary">99.2%</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Quick Access Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md rounded-[32px] bg-white border border-stone-150 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-stone-900">Kaya Kalp Wellness Services</h3>
                    <p className="text-[10px] text-stone-400">Instantly accessible digital workspace</p>
                  </div>
                  <span className="text-[9px] bg-emerald-100/70 text-ayur-primary font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Online
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Symptom Checker', path: '/ai-assessment', desc: 'Identify health imbalances instantly', icon: Activity },
                    { title: 'Consult Certified Vaidyas', path: '/doctors', desc: 'Video and clinic consultations', icon: Users },
                    { title: 'Ayurvedic Encyclopedia', path: '/knowledge-hub', desc: 'Explore classical medicinal herbs', icon: BookOpen }
                  ].map((srv, idx) => {
                    const Icon = srv.icon;
                    return (
                      <Link
                        key={idx}
                        to={srv.path}
                        className="flex justify-between items-center p-4 rounded-2xl border border-stone-100 hover:border-emerald-200 bg-stone-50/30 hover:bg-emerald-50/10 group transition-all text-xs"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 text-ayur-primary flex items-center justify-center transition-colors">
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-800 group-hover:text-ayur-primary transition-colors">{srv.title}</div>
                            <div className="text-[10px] text-stone-400 mt-0.5">{srv.desc}</div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4.5 h-4.5 text-stone-400 group-hover:text-ayur-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT KAYA KALP */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-ayur-primary text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-ayur-accent" />
              <span>Legacy of Authentic Healing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              Indore's Premier Ayurvedic Specialty Clinic
            </h2>
            <p className="text-stone-605 text-sm leading-relaxed font-medium">
              Established with the vision of carrying forward the lineage of pure Ayurveda, Kaya Kalp Wellness combines time-tested therapies with modern diagnostic verification. We treat root imbalances rather than symptoms to restore physiological harmony.
            </p>
            <div className="space-y-3.5 text-xs sm:text-sm font-bold text-stone-850">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ayur-primary shrink-0" />
                <span>NABL Accredited Diagnostic Partnerships</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ayur-primary shrink-0" />
                <span>GMP-Certified Pure Herbal Formulations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ayur-primary shrink-0" />
                <span>Clinically Validated Panchakarma Protocols</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-emerald-950 text-white p-8 sm:p-10 rounded-[32px] space-y-8 relative overflow-hidden shadow-xl">
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-900/40 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-emerald-300">Why Choose Kaya Kalp?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Personalized Prakriti Care', desc: 'No generic formulas. Treatments are tailor-made for your unique physical and mental constitution.' },
                { title: 'BAMS-Certified Vaidyas', desc: 'Our panel contains highly trained, accredited doctors with clinical expertise in internal medicine.' },
                { title: 'Holistic Daily Dinacharya', desc: 'We combine clinical therapies with custom daily schedules, diet charts, and therapeutic yoga instructions.' },
                { title: 'AI-Guided Checkups', desc: 'Instant AI symptom checker tracks clinical concerns and directs you to correct Ayurvedic specialists.' }
              ].map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ayur-accent"></span>
                    <span>{w.title}</span>
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HEALTH CONDITIONS WE TREAT */}
      <section id="conditions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Clinical Specialities</span>
          <h2 className="text-3xl font-extrabold text-stone-900">Health Conditions We Treat</h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto font-medium">
            Ayurveda focuses on resolving deep-rooted biological imbalances instead of temporary symptomatic suppression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONDITIONS.map((c, i) => (
            <div key={i} className="p-6 rounded-[28px] bg-white border border-stone-200/70 hover:border-emerald-350 shadow-sm space-y-4 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center font-bold text-xs group-hover:bg-ayur-primary group-hover:text-white transition-all">
                  0{i+1}
                </span>
                <h4 className="font-bold text-sm text-stone-900 leading-snug">{c.name}</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">{c.description}</p>
              </div>
              <Link to="/doctors" className="pt-2 text-[10px] text-ayur-primary font-bold hover:text-ayur-secondary flex items-center gap-1">
                <span>View Therapies</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. OUR PANCHAKARMA PROGRAMS */}
      <section id="panchakarma" className="bg-emerald-950 text-white py-20 scroll-mt-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-emerald-800/40 pb-6">
            <div>
              <span className="text-[10px] text-ayur-accent font-bold uppercase tracking-widest block mb-2">Classical Detoxification</span>
              <h2 className="text-3xl font-extrabold tracking-tight">The Five Pillars of Panchakarma</h2>
            </div>
            <Link to="/doctors" className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 hover:scale-105 transition-all shadow-md">
              Schedule Detox Consultation
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PANCHAKARMA.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-emerald-300 font-bold tracking-wider block uppercase">Pillar 0{idx+1}</span>
                    <span className="text-[9px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">{p.duration}</span>
                  </div>
                  <h4 className="font-bold text-xs leading-snug">{p.name}</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed font-medium">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WELLNESS PROGRAMS & HEALTH PACKAGES */}
      <section id="wellness-programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-12" id="packages">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Wellness Packages</span>
          <h2 className="text-3xl font-extrabold text-stone-900">Customized Health Packages</h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto font-medium">
            Structured clinical stays paired with dietary cleansing and rejuvenating treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((p, idx) => (
            <div key={idx} className="p-8 rounded-[32px] bg-white border border-stone-200/80 hover:border-emerald-350 shadow-md flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">{p.title}</h4>
                    <span className="text-[10px] text-stone-400 font-bold block mt-1">{p.days} residential package</span>
                  </div>
                  <span className="text-lg font-black text-ayur-primary">{p.price}</span>
                </div>
                
                <ul className="space-y-3.5 text-xs text-stone-605 font-medium border-t border-stone-100 pt-4">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/doctors" className="w-full py-2.5 bg-stone-50 hover:bg-emerald-50 text-stone-850 hover:text-ayur-primary font-bold text-center text-xs rounded-xl border border-stone-200 hover:border-emerald-200 transition-all">
                Enquire Package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. OUR AYURVEDIC SOLUTIONS */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Kaya Kalp Pharmacy</span>
          <h2 className="text-3xl font-extrabold text-stone-900">Our Ayurvedic Solutions</h2>
          <p className="text-stone-550 text-xs sm:text-sm max-w-lg mx-auto font-medium">
            Traditional Ayurvedic formulations designed to naturally improve your health and wellness.
          </p>
        </div>

        {/* Categories Block */}
        {([
          { title: 'Hair Care Solutions', key: 'Hair Care' },
          { title: 'Face Care Solutions', key: 'Face Care' },
          { title: 'Pain Relief Solutions', key: 'Pain Relief' },
          { title: 'Obesity Care Solutions', key: 'Obesity Care' }
        ] as const).map((cat) => {
          const catSolutions = SOLUTIONS_DATA.filter(sol => sol.category === cat.key);
          if (catSolutions.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-6">
              <h3 className="text-lg font-black text-stone-900 border-b border-stone-200/60 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ayur-primary"></span>
                <span>{cat.title}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {catSolutions.map((prod, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-stone-200/80 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-stretch"
                  >
                    {/* Left: Image & Badges */}
                    <div className="w-full sm:w-48 shrink-0 relative bg-stone-50 h-52 sm:h-auto">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      
                      {/* Category Badge */}
                      <span className="absolute bottom-3 left-3 bg-emerald-950 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                    </div>

                    {/* Right: Info details */}
                    <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                      
                      {/* Name & Badges Row */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="bg-emerald-805 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {prod.badge1}
                          </span>
                          <span className="bg-amber-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            {prod.badge2}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-base text-stone-900 leading-tight">{prod.name}</h4>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">{prod.desc}</p>
                      </div>

                      {/* Benefits Checklist */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Benefits:</span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-605 font-semibold">
                          {prod.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-650 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] font-black">
                        <Link 
                          to="/products"
                          className="py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-center flex items-center justify-center"
                        >
                          Learn More
                        </Link>
                        <Link 
                          to="/doctors"
                          className="py-2 bg-ayur-primary hover:bg-ayur-secondary text-white rounded-xl text-center flex items-center justify-center"
                        >
                          Book Consult
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA Banner Section */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-emerald-955 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-900/40 rounded-full blur-2xl"></div>
          <div className="space-y-2 max-w-xl z-10">
            <h3 className="text-lg sm:text-xl font-extrabold">Need Expert Ayurvedic Guidance?</h3>
            <p className="text-xs text-emerald-200 leading-relaxed font-medium">
              Consult our experienced Ayurvedic doctors to receive personalized treatment recommendations based on your health concerns.
            </p>
          </div>
          <div className="flex gap-3 z-10 shrink-0 text-xs font-black">
            <Link 
              to="/doctors"
              className="px-5 py-3 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl transition-all"
            >
              Book Consultation
            </Link>
            <button 
              onClick={() => handleAnchorScroll('contact')}
              className="px-5 py-3 bg-emerald-900/60 hover:bg-emerald-900 text-white rounded-xl border border-emerald-800 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>

      </section>

      {/* 7. PATIENT TESTIMONIALS & SUCCESS STORIES */}
      <section id="testimonials" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="text-center space-y-3">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Success Stories</span>
          <h2 className="text-3xl font-extrabold text-stone-900">Real Healing Testimonials</h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">Hear how our patients resolved chronic conditions using authentic Ayurveda.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { name: 'Sameer Shah, Indore', disease: 'Chronic Acidity & Migraine', text: 'After 3 years of western pills, a 14-day Virechana detoxification at Kaya Kalp completely resolved my acid reflux. Truly grateful!' },
            { name: 'Kiran Patel, Indore', disease: 'Joint Pain (Osteoarthritis)', text: 'The Janu Basti treatment and organic oils rebuilt my knees flexibility. I can walk long distances now without any pain!' }
          ].map((t, idx) => (
            <div key={idx} className="p-8 rounded-[32px] bg-white border border-stone-200/80 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">"{t.text}"</p>
              </div>
              <div className="border-t border-stone-100 pt-4 flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-xs text-ayur-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-extrabold text-xs text-stone-900">{t.name}</div>
                  <span className="text-[10px] text-ayur-primary font-bold">{t.disease}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HEALTH BLOGS */}
      <section id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex justify-between items-end border-b border-stone-200/50 pb-6 mb-12">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Health Insights</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Official Health Blogs</h2>
          </div>
          <Link to="/knowledge-hub" className="text-xs font-bold text-ayur-primary hover:underline flex items-center gap-1">
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOGS.map((b, i) => (
            <div key={i} className="bg-white border border-stone-200/80 rounded-[32px] overflow-hidden shadow-sm hover:border-emerald-350 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] text-stone-400 font-bold block">{b.date} &bull; {b.readTime}</span>
                  <h4 className="font-extrabold text-sm text-stone-900 leading-snug">{b.title}</h4>
                  <p className="text-xs text-stone-555 leading-relaxed font-medium line-clamp-3">{b.desc}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link to="/knowledge-hub" className="inline-flex items-center gap-1 text-xs text-ayur-primary font-bold hover:underline">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-stone-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Ayurvedic medicine safe alongside Western drugs?', a: 'Yes, under certified doctor supervision. Some herbs can interact with Western prescriptions (such as blood thinners or diabetic medication). It is important to disclose all current medications to your Vaidya.' },
            { q: 'What is the ideal duration for a Panchakarma detox?', a: 'A standard Panchakarma program ranges from 7 to 21 days depending on the severity of the body imbalance and the patient\'s capacity. The consult Vaidya determines the duration after a pulse diagnosis.' },
            { q: 'How does the AI Consultation Symptom Checker work?', a: 'Our checker uses a rule-based algorithm matching user symptom strings with classical classification matrices. It identifies your Dosha imbalances and recommends herbs, yoga asanas, and specialty doctors.' }
          ].map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div key={index} className="border border-stone-200/60 rounded-[20px] bg-white overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="flex justify-between items-center w-full px-6 py-5 text-left font-bold text-stone-850 text-xs sm:text-sm"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-4.5 h-4.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-ayur-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-stone-500 leading-relaxed border-t border-stone-50 pt-4 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CONTACT SECTION & MAPS */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-[32px] bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-1">Get in Touch</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Contact Details</h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium">
                Have inquiries about clinical stays, detox packages, or online bookings? Contact our front desk directly.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-stone-750 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-ayur-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>Kaya Kalp Wellness Center</strong>
                    <div className="text-xs text-stone-500 mt-1">102, Royal Avenue, New Palasia, Indore (M.P.) - 452001</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-ayur-primary shrink-0" />
                  <span>+91 98277-XXXXX (Consultation Hotline)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-ayur-primary shrink-0" />
                  <span>care@kayakalpindore.com</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="border-t border-stone-100 pt-6 space-y-4">
              <div>
                <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ayur-primary" />
                  <span>Subscribe to our Newsletter</span>
                </h4>
                <p className="text-[10px] text-stone-400 mt-1">Get weekly wellness tips, herb guidelines, and clinic offers.</p>
              </div>
              {newsletterSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-150 text-ayur-primary text-xs font-semibold">
                  Subscribed successfully! Thank you.
                </div>
              )}
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-2/3 px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-[#FBFBF9] focus:outline-none"
                />
                <button type="submit" className="w-1/3 py-2.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary shadow-sm transition-all">
                  Join List
                </button>
              </form>
            </div>
          </div>

          {/* Indore Google Map Iframe */}
          <div className="lg:col-span-7 rounded-[32px] overflow-hidden border border-stone-200/80 shadow-sm min-h-[350px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3680.125712217688!2d75.8778051759493!3d22.72355522744747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd375323cb11%3A0xe54e668c2e648835!2sNew%20Palasia%2C%20Indore%2C%20Madhya%2520Pradesh%2520452001!5e0!3m2!1sen!2sin!4v1719747120401!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>
    </div>
  );
}
