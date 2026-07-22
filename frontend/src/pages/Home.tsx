import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Sparkles, Activity, ShieldAlert, Compass, Search, 
  MapPin, Phone, HelpCircle, ArrowRight, ArrowUpRight, Award, 
  CheckCircle2, BookOpen, Star, Mail, Clock, MessageSquare, ShieldCheck, Users, Calendar,
  ShoppingCart, Eye, X, ArrowUpDown, ThumbsUp
} from 'lucide-react';

const CONDITIONS = [
  { name: 'Sandhigata Vata (Arthritis & Joint Care)', description: 'Therapeutic warm oil pooling and herbal poultices to rebuild joint lubricating fluids and soothe chronic inflammation.', id: 'arthritis' },
  { name: 'Kati Basti (Back & Spine Conditions)', description: 'Warm herbal decoctions retained on the lumbosacral region to treat disc compression, sciatica, and chronic aches.', id: 'joint-pain' },
  { name: 'Skin Disorders (Psoriasis & Eczema)', description: 'Deep internal purification therapies (Virechana) paired with soothing neem and turmeric topical formulations.', id: 'skin-disorders' },
  { name: 'Obesity & Weight Management', description: 'Dry herbal powder scrub massages (Udvartana) designed to activate lipid metabolism and cleanse skin tissue.', id: 'weight-loss' }
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
    desc: 'Traditional Bhringraj and Amla infused oil formulation designed to nourish scalp follicles, control hair fall, and stimulate hair growth.',
    image: '/images/hair_oil_product.png',
    benefits: [
      'Helps reduce hair fall',
      'Nourishes scalp follicles',
      'Promotes healthy hair growth',
      'Improves hair strength & shine'
    ]
  },
  {
    name: 'Herbal Heena',
    category: 'Hair Care',
    badge1: '100% Herbal',
    badge2: 'Natural Shine',
    desc: 'Pure organic henna powder designed to deeply condition hair roots, rendering smooth, silky, and glowing texture.',
    image: '/images/herbal_heena_product.png',
    benefits: [
      'Makes hair smooth & silky',
      'Deeply conditions hair roots',
      'Improves natural shine',
      'Conditions scalp naturally'
    ]
  },
  {
    name: 'Herbal Hair Spa Pack',
    category: 'Hair Care',
    badge1: '100% Herbal',
    badge2: 'Doctor Recommended',
    desc: 'Intense herbal hair mask pack formulated to target structural hair dryness, eliminate scalp dandruff, and deeply condition follicles.',
    image: '/images/hair_spa_pack_product.png',
    benefits: [
      'Deep conditioning treatment',
      'Reduces scalp dandruff',
      'Improves hair texture',
      'Makes hair smooth & healthy'
    ]
  },
  {
    name: 'Fairness Face Pack',
    category: 'Face Care',
    badge1: '100% Herbal',
    badge2: 'Glow booster',
    desc: 'Traditional sandalwood mask to reverse facial sun tan, reduce skin dullness, and illuminate blood circulation.',
    image: '/images/fairness_face_pack.png',
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
    image: '/images/neem_face_pack.png',
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
    image: '/images/kayakalp_face_pack.png',
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
    image: '/images/pain_relief_oil_product.png',
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
    image: '/images/weight_mgmt_pills_product.png',
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

  const [counters, setCounters] = useState({ patients: 0, years: 0, families: 0, doctors: 0, treatments: 0 });
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        patients: Math.floor((12500 / steps) * currentStep),
        years: Math.min(15, Math.floor((15 / steps) * currentStep)),
        families: Math.floor((8400 / steps) * currentStep),
        doctors: Math.min(25, Math.floor((25 / steps) * currentStep)),
        treatments: Math.min(40, Math.floor((40 / steps) * currentStep))
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters({ patients: 12500, years: 15, families: 8400, doctors: 25, treatments: 40 });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [testimonialFilter, setTestimonialFilter] = useState('All');
  const [activeSuccessTab, setActiveSuccessTab] = useState<'reviews' | 'cases'>('reviews');
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 3000);
  };

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
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 bg-[#FAF6EF]">
        
        {/* Background Image & Nature Gradient Overlays */}
        <div className="absolute inset-0 z-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('/images/ayurveda_hero_bg.png')" }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B4332]/10 rounded-full blur-3xl -z-0 animate-pulseGlow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4A373]/15 rounded-full blur-3xl -z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B4332]/10 border border-[#1B4332]/20 text-[#1B4332] text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-[#D4A373] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Authentic Ayurvedic Care & Panchakarma Center</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B4332] tracking-tight leading-[1.15] font-serif">
                Reclaim Your Vitality Through <span className="text-[#D4A373]">Ancient Wisdom</span> & Natural Healing
              </h1>

              <p className="text-sm sm:text-base text-[#526055] max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Experience 100% authentic Panchakarma detoxification, specialized joint and skin therapies, and personalized Ayurvedic doctor consultations in Indore.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/doctors"
                  className="px-7 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#1B4332]/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4 text-[#D4A373]" />
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/ai-assessment"
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#FAF6EF] text-[#1B4332] font-extrabold text-xs sm:text-sm border border-[#1B4332]/30 flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <span>AI Symptom Checker</span>
                </Link>
              </div>

              {/* Animated Statistics Counters */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E9E5D9] max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-[#1B4332] font-serif">{counters.patients.toLocaleString()}+</div>
                  <div className="text-[11px] text-[#526055] font-bold uppercase tracking-wider">Patients Healed</div>
                </div>
                <div className="text-center lg:text-left space-y-1 border-x border-[#E9E5D9] px-2">
                  <div className="text-2xl sm:text-3xl font-black text-[#1B4332] font-serif">{counters.years}+ Years</div>
                  <div className="text-[11px] text-[#526055] font-bold uppercase tracking-wider">Indore Heritage</div>
                </div>
                <div className="text-center lg:text-left space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-[#1B4332] font-serif">{counters.treatments}+</div>
                  <div className="text-[11px] text-[#526055] font-bold uppercase tracking-wider">Herbal Therapies</div>
                </div>
              </div>

            </div>

            {/* Right Overlapping Images Grid Montage */}
            <div className="lg:col-span-5 relative w-full h-[450px] hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#1B4332]/10 rounded-full blur-3xl -z-10"></div>
              
              {/* Collage Image 1: Doctor Consultation */}
              <div className="absolute top-0 left-0 w-48 h-48 rounded-[24px] overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:z-40 transition-all duration-500 z-20 group">
                <img 
                  src="/images/hero_doctor_consult.png" 
                  alt="Ayurvedic Doctor Consultation" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-[10px] text-white font-bold">Vaidya Nadi Consultation</span>
                </div>
              </div>

              {/* Collage Image 2: Panchakarma Detox Therapy */}
              <div className="absolute top-10 right-0 w-44 h-44 rounded-[24px] overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:z-40 transition-all duration-500 z-10 group">
                <img 
                  src="/images/hero_panchakarma_therapy.png" 
                  alt="Panchakarma Detox Therapy" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-[10px] text-white font-bold">Abhyanga Oil Therapy</span>
                </div>
              </div>

              {/* Collage Image 3: Herbal Medicine Preparation */}
              <div className="absolute bottom-2 left-6 w-44 h-44 rounded-[24px] overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:z-40 transition-all duration-500 z-30 group">
                <img 
                  src="/images/hero_herbal_prep.png" 
                  alt="Herbal Medicine Preparation" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-[10px] text-white font-bold">Jadi-Buti Formulation</span>
                </div>
              </div>

              {/* Collage Image 4: Fresh Medicinal Herbs */}
              <div className="absolute bottom-12 right-2 w-36 h-36 rounded-[24px] overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:z-40 transition-all duration-500 z-20 group">
                <img 
                  src="/images/hero_ayurvedic_plants.png" 
                  alt="Fresh Medicinal Herbs & Plants" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-[10px] text-white font-bold">Pure Organic Herbs</span>
                </div>
              </div>

              {/* Floating Leaf 1 */}
              <div className="absolute -top-6 left-1/3 text-emerald-600 animate-float opacity-70 z-30" style={{ animationDelay: '0.5s' }}>
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7.33,18C13,19 19,16 22,8C20,8 19,9 17,8M12.44,12.5C10.74,13 8.35,14 6.74,15.5C8.35,13.5 10.74,11.5 12.44,12.5Z" />
                </svg>
              </div>

              {/* Floating Lotus Flower */}
              <div className="absolute top-1/2 right-1/4 text-emerald-700 animate-float opacity-40 z-30" style={{ animationDelay: '1.5s', animationDuration: '6s' }}>
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4M12,18A2,2 0 0,1 10,16A2,2 0 0,1 12,14A2,2 0 0,1 14,16A2,2 0 0,1 12,18Z" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT KAYA KALP */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-16">
        
        {/* Upper Grid Layout: Portrait Collage & Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Overlapping visual collage */}
          <div className="lg:col-span-6 relative h-[380px] w-full">
            {/* Background Sage Green decoration block */}
            <div className="absolute top-8 left-8 bottom-0 right-0 bg-emerald-50/50 rounded-[32px] -z-10"></div>
            
            {/* Doctor Portrait */}
            <div className="absolute top-0 left-0 w-60 h-64 rounded-3xl overflow-hidden shadow border-4 border-white hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/images/hero_doctor_consult.png" 
                alt="Ayurvedic Doctor Portrait" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Ayurvedic Herbs Preparation */}
            <div className="absolute bottom-4 right-4 w-52 h-48 rounded-3xl overflow-hidden shadow border-4 border-white hover:scale-[1.02] transition-transform duration-300 z-10">
              <img 
                src="/images/hero_herbal_prep.png" 
                alt="Ayurvedic Herbs" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Right Side: Copywriting details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-ayur-primary text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-ayur-accent" />
              <span>Legacy of Authentic Healing</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight font-serif">
              Indore's Premier Ayurvedic Specialty Clinic
            </h2>
            
            <p className="text-stone-605 text-sm leading-relaxed font-medium">
              Established with the vision of carrying forward the lineage of pure Ayurveda, Kaya Kalp Wellness combines time-tested therapies with modern diagnostic verification. We treat root imbalances rather than symptoms to restore physiological harmony.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-bold text-stone-850">
              <div className="p-4 bg-white border border-stone-200/60 rounded-2xl space-y-1">
                <span className="text-[10px] text-ayur-primary font-black uppercase tracking-wider block">Our Mission</span>
                <p className="text-stone-500 font-medium leading-relaxed">To cleanse body systems, restore primary metabolic Agni, and coach patients on life dinacharya.</p>
              </div>
              <div className="p-4 bg-white border border-stone-200/60 rounded-2xl space-y-1">
                <span className="text-[10px] text-ayur-primary font-black uppercase tracking-wider block">Our Vision</span>
                <p className="text-stone-500 font-medium leading-relaxed">To be India's most trusted, clinically-validated classical Ayurveda healing center.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Banner: Live Animated Counters Row */}
        <div className="bg-emerald-950 text-white rounded-[32px] p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-900/40 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/60">
            <div className="pt-4 sm:pt-0">
              <strong className="text-3xl sm:text-4xl font-extrabold block text-emerald-300">
                {counters.patients.toLocaleString()}+
              </strong>
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-black block mt-2">Patients Treated</span>
            </div>
            
            <div className="pt-4 sm:pt-0">
              <strong className="text-3xl sm:text-4xl font-extrabold block text-emerald-300">
                {counters.years}+
              </strong>
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-black block mt-2">Years Experience</span>
            </div>

            <div className="pt-4 sm:pt-0">
              <strong className="text-3xl sm:text-4xl font-extrabold block text-emerald-300">
                {counters.families.toLocaleString()}+
              </strong>
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-black block mt-2">Happy Families</span>
            </div>

            <div className="pt-4 sm:pt-0">
              <strong className="text-3xl sm:text-4xl font-extrabold block text-emerald-300">
                {counters.doctors}+
              </strong>
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-black block mt-2">Specialist Vaidyas</span>
            </div>

            <div className="pt-4 sm:pt-0">
              <strong className="text-3xl sm:text-4xl font-extrabold block text-emerald-300">
                {counters.treatments}+
              </strong>
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-black block mt-2">Clinical Therapies</span>
            </div>
          </div>
        </div>

      </section>

      {/* 3. HEALTH CONDITIONS WE TREAT */}
      <section id="conditions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Clinical Specialities</span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif">Health Conditions We Treat</h2>
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
              <Link to={`/treatments/${c.id}`} className="pt-2 text-[10px] text-ayur-primary font-bold hover:text-ayur-secondary flex items-center gap-1">
                <span>View Treatment Details</span>
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



      {/* 7. PATIENT TESTIMONIALS & SUCCESS STORIES */}
      <section id="testimonials" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Patient Trust</span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif">Clinical Success & Patient Reviews</h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">Explore verified Google reviews or browse actual clinical before-and-after recovery cases.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-b border-stone-200 pb-2 max-w-sm mx-auto text-xs font-bold gap-6">
          <button
            onClick={() => setActiveSuccessTab('reviews')}
            className={`pb-2 border-b-2 transition-all ${activeSuccessTab === 'reviews' ? 'border-ayur-primary text-ayur-primary' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
          >
            Google Patient Reviews
          </button>
          <button
            onClick={() => setActiveSuccessTab('cases')}
            className={`pb-2 border-b-2 transition-all ${activeSuccessTab === 'cases' ? 'border-ayur-primary text-ayur-primary' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
          >
            Clinical Recovery Cases
          </button>
        </div>

        {activeSuccessTab === 'reviews' ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Google Rating Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-3 text-xs font-semibold text-stone-750">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-amber-600">Google 4.9 ★</span>
                <span className="text-stone-400 font-bold">|</span>
                <span>450+ Verified Clinical Reviews in Indore</span>
              </div>
              <a href="https://www.google.com/maps/place/Kaya+Kalp+Ayurvedic+Clinic/@22.723658,75.882676,15z/data=!4m2!3m1!1s0x3962fd370c99fcfb:0x6b44747719602fba" target="_blank" rel="noopener noreferrer" className="text-ayur-primary font-bold hover:underline flex items-center gap-0.5">
                <span>View Google Listing</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Filter categories pill bar */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {['All', 'Musculoskeletal', 'Skin & Hair', 'Digestive & Neurological', "Women's Health & Obesity"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTestimonialFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    testimonialFilter === cat 
                      ? 'bg-ayur-primary border-transparent text-white shadow-sm font-black' 
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Testimonials list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { name: 'Sameer Shah, Indore', disease: 'Chronic Acidity & Migraine', text: 'After 3 years of western pills, a 14-day Virechana detoxification at Kaya Kalp completely resolved my acid reflux. Truly grateful!', cat: 'Digestive & Neurological' },
                { name: 'Kiran Patel, Indore', disease: 'Joint Pain (Osteoarthritis)', text: 'The Janu Basti treatment and organic oils rebuilt my knees flexibility. I can walk long distances now without any pain!', cat: 'Musculoskeletal' },
                { name: 'Ananya Sharma, Indore', disease: 'Severe Hair Fall & Dandruff', text: 'Hair Care Solutions and the Spa Pack stopped my hair fall within 3 weeks. My hair feels thicker and healthier.', cat: 'Skin & Hair' },
                { name: 'Rajesh Verma, Indore', disease: 'Obesity & High Cholesterol', text: "The Udvartana dry powder scrub massage combined with diet suggestions helped me lose 8 kg in 2 months. My cholesterol levels are now normal.", cat: "Women's Health & Obesity" },
                { name: 'Neha Gupta, Indore', disease: 'Psoriasis flare-ups', text: 'The deep internal purification therapies paired with soothing neem oils cleared up my scaling patches completely.', cat: 'Skin & Hair' },
                { name: 'Rahul Mehta, Indore', disease: 'Stress & Chronic Insomnia', text: 'Shirodhara warm oil stream flow on the forehead calmed my hyperactive nerves. I sleep peacefully every single night now.', cat: 'Digestive & Neurological' }
              ]
                .filter((t) => testimonialFilter === 'All' || t.cat === testimonialFilter)
                .map((t, idx) => (
                  <div key={idx} className="p-8 rounded-[32px] bg-white border border-stone-200/80 shadow-sm space-y-5 flex flex-col justify-between hover:border-emerald-350 transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                        </div>
                        <span className="text-[8px] bg-emerald-50 text-ayur-primary border border-emerald-150 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {t.cat.split(' & ')[0]}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic font-medium">"{t.text}"</p>
                    </div>
                    <div className="border-t border-stone-100 pt-4 flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-xs text-ayur-primary">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-stone-900">{t.name}</div>
                        <span className="text-[10px] text-ayur-primary font-bold flex items-center gap-1">
                          <span>{t.disease}</span>
                          <span className="text-[9px] bg-amber-50 text-amber-800 px-1 py-0.2 rounded font-black tracking-wider uppercase">Google Verified</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Before-and-after Success Cases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Chronic Psoriasis Flare-ups',
                  patient: 'Neha Gupta, 29 (Indore)',
                  before: 'Extensive scaling and dry patches across knees and elbows; persistent skin itching.',
                  after: '100% skin clearance and texture rejuvenation; restored normal epidermal elasticity.',
                  duration: '3 Months Program',
                  treatment: 'Virechana (Purgation) + Neem blood purifier kit'
                },
                {
                  title: 'Lumbar Herniation & Sciatica',
                  patient: 'Kiran Patel, 54 (Indore)',
                  before: 'Severe compression pain radiating to lower left leg; unable to sit/stand for 10 minutes.',
                  after: 'Zero pain spikes; restored complete flexibility and joint mobility.',
                  duration: '21 Days Session',
                  treatment: 'Kati Basti (spinal oil pooling) + Patra Sweda poultices'
                },
                {
                  title: 'Obesity & Sluggish Metabolism',
                  patient: 'Rajesh Verma, 41 (Indore)',
                  before: 'Weight 95kg; chronic lethargy, heavy breathing, elevated cholesterol (LDL 160).',
                  after: 'Weight 87kg (-8kg); high daily energy levels, healthy lipid profiles.',
                  duration: '2 Months Program',
                  treatment: 'Udvartana (dry powder scrub massage) + Kapha diet'
                }
              ].map((c, i) => (
                <div key={i} className="p-6 rounded-[28px] bg-white border border-stone-200/80 shadow-sm hover:border-emerald-350 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[9px] bg-emerald-50 text-ayur-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1">{c.duration}</span>
                      <h4 className="font-extrabold text-sm text-stone-900 leading-snug">{c.title}</h4>
                      <span className="text-[10px] text-stone-400 block font-semibold mt-0.5">Patient: {c.patient}</span>
                    </div>

                    <div className="text-[11px] space-y-2 border-t border-stone-100 pt-3">
                      <div className="p-2 bg-red-500/5 rounded-xl border border-red-500/10 text-stone-700">
                        <strong className="text-red-800 text-[10px] uppercase block mb-0.5">Before Treatment:</strong>
                        <span className="italic font-medium">"{c.before}"</span>
                      </div>
                      <div className="p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-stone-700">
                        <strong className="text-emerald-800 text-[10px] uppercase block mb-0.5">After Treatment:</strong>
                        <span className="font-bold">"{c.after}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-150 rounded-xl text-[10px] text-stone-500 font-medium">
                    <strong>Therapy used:</strong> {c.treatment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 8. HEALTH BLOGS */}
      <section id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex justify-between items-end border-b border-stone-200/50 pb-6 mb-12">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Health Insights</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">Official Health Blogs</h2>
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-stone-900 font-serif">Frequently Asked Questions</h2>
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
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Get In Touch</span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif">Contact Kaya Kalp</h2>
          <p className="text-stone-550 text-xs sm:text-sm max-w-lg mx-auto font-medium">
            Reach out for clinical queries, Panchakarma stays, or quick appointment assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Contact Details & Hours (Span 5) */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-[32px] bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Address details */}
              <div className="space-y-4 text-xs sm:text-sm text-stone-750 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-ayur-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>Kaya Kalp Wellness Center</strong>
                    <div className="text-xs text-stone-500 mt-1">102, Royal Avenue, 18/2-C, New Palasia, Indore (M.P.) - 452001</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-ayur-primary shrink-0" />
                  <div>
                    <strong>Helpline Desks</strong>
                    <div className="text-xs text-stone-500 mt-1">+91 9827775075 / 0731-4045075</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-ayur-primary shrink-0" />
                  <div>
                    <strong>Official Email</strong>
                    <div className="text-xs text-stone-500 mt-1">dr.naveenjadhav@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">Business Hours</h4>
                <div className="grid grid-cols-2 text-xs font-semibold text-stone-605 gap-2">
                  <div>Monday - Saturday:</div>
                  <div className="text-right text-stone-900 font-extrabold">9:00 AM - 6:00 PM</div>
                  <div>Sunday:</div>
                  <div className="text-right text-amber-600 font-extrabold">Closed (Prior Bookings Only)</div>
                </div>
              </div>

              {/* Emergency Hotline */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3 items-center text-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <strong className="text-amber-805 block">Emergency Patient Desk:</strong>
                  <span className="text-stone-605 font-bold">+91 9827775075</span>
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
                <p className="text-[10px] text-stone-400 mt-1 font-medium">Get weekly wellness tips, herb guidelines, and clinic offers.</p>
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
                  className="w-2/3 px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-[#FBFBF9] focus:outline-none font-medium"
                />
                <button type="submit" className="w-1/3 py-2.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary shadow-sm transition-all font-black">
                  Join List
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Appointment Request Form (Span 4) */}
          <div className="lg:col-span-4 p-8 sm:p-10 rounded-[32px] bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider block">Quick Inquiry Form</h4>
              <p className="text-[11px] text-stone-500 font-medium">Submit a request and our doctors will coordinate within 2 hours.</p>

              {contactSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-155 text-ayur-primary text-[11px] font-bold leading-normal">
                  Inquiry submitted! Our clinical assistant will contact you shortly.
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                <input 
                  type="text" 
                  required 
                  placeholder="Your Full Name" 
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-ayur-primary font-medium" 
                />
                <input 
                  type="tel" 
                  required 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-ayur-primary font-medium" 
                />
                <select 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FBFBF9] focus:outline-none font-bold text-stone-605"
                >
                  <option value="">Preferred Category</option>
                  <option value="Hair Care">Hair Care Solutions</option>
                  <option value="Face Care">Face Care Solutions</option>
                  <option value="Pain Relief">Pain Relief Treatment</option>
                  <option value="Weight Management">Obesity Care</option>
                  <option value="Panchakarma">Panchakarma Detox</option>
                </select>
                <textarea 
                  rows={3} 
                  required 
                  placeholder="How can we help you?" 
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-ayur-primary font-medium"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-ayur-primary hover:bg-ayur-secondary text-white font-extrabold rounded-xl transition-all shadow-sm font-black"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Google Map Frame (Span 3) */}
          <div className="lg:col-span-3 rounded-[32px] overflow-hidden border border-stone-200/80 shadow-sm min-h-[300px] relative">
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

      {/* Google Maps Section */}
      <section className="py-14 bg-[#FAF9F5] border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">Visit Our Clinic</h3>
            <p className="text-xs text-stone-500 max-w-lg mx-auto font-medium">
              102, Royal Avenue, 18/2-C, Lala Banarasilal Dawar Marg, New Palasia, Indore (M.P.) - 452001 (Near Curewell Hospital)
            </p>
          </div>
          <div className="rounded-[32px] overflow-hidden border border-stone-200/80 shadow-md h-[400px] relative bg-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.122894331448!2d75.882676!3d22.723657999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd370c99fcfb%3A0x6b44747719602fba!2sKaya%20Kalp%20Ayurvedic%20Clinic!5e0!3m2!1sen!2sin!4v1719747120401!5m2!1sen!2sin" 
              className="w-full h-full border-0" 
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
