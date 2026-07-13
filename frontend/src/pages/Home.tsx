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

const FEATURED_DOCTORS = [
  { name: 'Vaidya Dr. Rajesh Sharma', qualification: 'BAMS, MD (Ayurveda)', specialization: 'Panchakarma & Joint Care Specialist', experience: 15, rating: 4.9, reviews: 240, fee: '₹500', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Vaidya Dr. Anjali Nair', qualification: 'BAMS, MS (Ayurveda)', specialization: 'Ayurvedic Dermatology & Skin Care', experience: 10, rating: 4.8, reviews: 185, fee: '₹500', image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Vaidya Dr. Sunil Gupta', qualification: 'BAMS', specialization: 'Digestive Disorders & Wellness expert', experience: 8, rating: 4.9, reviews: 140, fee: '₹400', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300' }
];

interface Product {
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  stock: string;
  image: string;
  desc: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  size: string;
  isHerbal: boolean;
  discount?: number;
}

const PRODUCT_REGISTRY: Product[] = [
  {
    name: 'Kaya Kalp Bhringraj Taila',
    category: 'Hair Care',
    price: 420,
    rating: 5.0,
    reviews: 124,
    badge: 'Bestseller',
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Traditional hair oil prepared with fresh herbs to rebuild follicle strength, check hair fall, and soothe stress.',
    ingredients: ['Bhringraj extract', 'Amla', 'Sesame oil base', 'Jatamansi'],
    benefits: ['Controls chronic hair fall', 'Combats premature hair graying', 'Eliminates dandruff and cools scalp'],
    usage: 'Massage warm oil into hair roots; wash off with mild shampoo after 2 hours.',
    size: '200 ml',
    isHerbal: true,
    discount: 10
  },
  {
    name: 'Kumkumadi Radiance Glow Serum',
    category: 'Skin Care',
    price: 899,
    rating: 4.9,
    reviews: 98,
    badge: 'Organic',
    stock: 'Only 4 Left',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Luxurious face serum infused with pure Kashmiri Saffron to even skin tone, clear dark circles, and restore natural glow.',
    ingredients: ['Kashmiri Saffron (Kesar)', 'Sandalwood', 'Manjistha', 'Licorice extract'],
    benefits: ['Clarifies dark spots & blemishes', 'Evens out skin pigmentation', 'Imparts natural golden radiance'],
    usage: 'Apply 3-4 drops on clean face before bed. Massage in soft upward circular strokes.',
    size: '30 ml',
    isHerbal: true,
    discount: 15
  },
  {
    name: 'Prana Chyawanprash Gold',
    category: 'Immunity',
    price: 399,
    rating: 4.8,
    reviews: 160,
    badge: 'Doctor Recommended',
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Classic immunity support paste prepared with wild Amla pulp, organic forest honey, and Saffron.',
    ingredients: ['Amla pulp', 'Dashmula roots', 'Forest honey', 'Kesar', 'Pippali'],
    benefits: ['Defends against seasonal flu and colds', 'Boosts respiratory health & lung capacity', 'Ignites metabolic fire & vitality'],
    usage: 'Consume 1 tablespoon daily in the morning, followed by warm milk or water.',
    size: '500 g',
    isHerbal: true
  },
  {
    name: 'Triphala Digestive Care Tablets',
    category: 'Digestive Care',
    price: 280,
    rating: 4.7,
    reviews: 75,
    badge: 'New',
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Gently cleanses and detoxifies the colon, regulating daily bowel habits and promoting healthy digestion.',
    ingredients: ['Amalaki', 'Bibhitaki', 'Haritaki'],
    benefits: ['Cleanses digestive wastes (Ama)', 'Relieves chronic bloating and gas', 'Maintains colon regular health'],
    usage: 'Take 1-2 tablets before sleep with warm water.',
    size: '60 Tablets',
    isHerbal: true
  },
  {
    name: 'Shatavari Vitality Capsules',
    category: "Women's Health",
    price: 350,
    rating: 4.9,
    reviews: 112,
    badge: 'Bestseller',
    stock: 'Only 8 Left',
    image: 'https://images.unsplash.com/photo-1611070973770-b1a60c2661f8?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Shatavari root formulation designed to balance female hormones, alleviate menstrual cramps, and boost strength.',
    ingredients: ['Shatavari root extract'],
    benefits: ['Regulates irregular menstrual cycles', 'Reduces menopausal hot flashes', 'Supports natural lactation & vitality'],
    usage: 'Take 1 capsule twice daily with milk after meals.',
    size: '60 Capsules',
    isHerbal: true
  },
  {
    name: 'Sandhi Joint Resilient Oil',
    category: 'Joint Care',
    price: 360,
    rating: 4.8,
    reviews: 142,
    badge: 'Doctor Recommended',
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Highly penetrative medicated massage oil formulated to reduce joint swelling and rebuild cartilage fluid.',
    ingredients: ['Mahanarayan Taila', 'Eucalyptus oil', 'Shallaki', 'Guggulu'],
    benefits: ['Relieves stiffness in knees and lower back', 'Soothes arthritic swelling & joint aches', 'Improves active range of motion'],
    usage: 'Massage warm oil gently over affected joints. Apply hot compress afterward.',
    size: '100 ml',
    isHerbal: true,
    discount: 5
  },
  {
    name: 'Ashwagandha Stress Relief Capsules',
    category: "Men's Health",
    price: 320,
    rating: 4.9,
    reviews: 190,
    badge: 'Organic',
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Standardized root extract capsules containing high withanolides to alleviate stress, anxiety, and increase stamina.',
    ingredients: ['Pure Ashwagandha root extract'],
    benefits: ['Lowers cortisol stress hormones', 'Increases energy, stamina & vigor', 'Improves deep sleep patterns'],
    usage: 'Take 1 capsule twice daily with warm milk or water.',
    size: '60 Capsules',
    isHerbal: true
  },
  {
    name: 'Madhumeha Diabetes Support',
    category: 'Diabetes Care',
    price: 450,
    rating: 4.8,
    reviews: 64,
    badge: 'New',
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=250&h=250',
    desc: 'Synergistic herbal blend designed to support healthy pancreatic secretion and minimize blood sugar spikes.',
    ingredients: ['Jamun seed extract', 'Karela extract', 'Gurmar (Gymnema)', 'Vijaysar'],
    benefits: ['Controls postprandial blood sugar spikes', 'Supports insulin production pathways', 'Decreases sweet cravings naturally'],
    usage: 'Take 1 tablet twice daily, 30 minutes before meals.',
    size: '90 Tablets',
    isHerbal: true
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  // E-commerce Products Showcase States
  const [productSearch, setProductSearch] = useState('');
  const [productCat, setProductCat] = useState('All');
  const [productSort, setProductSort] = useState('Popular');
  const [quickViewProd, setQuickViewProd] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [visibleProductsCount, setVisibleProductsCount] = useState(3);
  const [addedToCartToast, setAddedToCartToast] = useState<string | null>(null);

  const toggleWishlist = (name: string) => {
    if (wishlist.includes(name)) {
      setWishlist(wishlist.filter(item => item !== name));
    } else {
      setWishlist([...wishlist, name]);
    }
  };

  const handleAddToCart = (name: string) => {
    setAddedToCartToast(`"${name}" added to cart!`);
    setTimeout(() => setAddedToCartToast(null), 3000);
  };

  const handleBuyNow = (name: string) => {
    setAddedToCartToast(`Redirecting to checkout with "${name}"...`);
    setTimeout(() => setAddedToCartToast(null), 3000);
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

      {/* 6. FEATURED DOCTORS */}
      <section id="featured-doctors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Our Specialists</span>
          <h2 className="text-3xl font-extrabold text-stone-900">Featured Ayurvedic Doctors</h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto font-medium">
            Consult BAMS-certified practitioners with years of experience in clinical disease management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_DOCTORS.map((doc, idx) => (
            <div key={idx} className="bg-white border border-stone-200/80 rounded-[32px] overflow-hidden shadow-sm hover:border-emerald-350 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-56 w-full bg-stone-100 overflow-hidden relative">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-500" />
                  <span className="absolute bottom-4 left-4 bg-emerald-950 text-white text-[10px] font-bold px-3 py-1 rounded-lg">
                    {doc.qualification}
                  </span>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">{doc.name}</h4>
                    <span className="text-[11px] text-ayur-primary font-bold block mt-0.5">{doc.specialization}</span>
                  </div>

                  <p className="text-xs text-stone-500 font-medium">
                    Specialized clinical care with {doc.experience} years of experience.
                  </p>

                  <div className="flex justify-between items-center text-xs border-t border-stone-100 pt-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-bold">{doc.rating}</span>
                      <span className="text-stone-400 text-[10px]">({doc.reviews} reviews)</span>
                    </div>
                    <div>
                      <span className="text-stone-400">Fee:</span> <strong className="text-stone-800">{doc.fee}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link to="/doctors" className="w-full py-2.5 bg-ayur-primary hover:bg-ayur-secondary text-white font-bold text-center text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                  <Calendar className="w-4 h-4" />
                  <span>Book Consult</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.5. TOP PRODUCTS SHOWCASE */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-200/50 pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Kaya Kalp Pharmacy</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Featured Organic Products</h2>
            <p className="text-xs text-stone-500 font-medium max-w-xl">
              Authentic Ayurvedic formulations prepared using traditional methods and premium natural ingredients.
            </p>
          </div>
          <Link to="/products" className="text-xs font-black text-ayur-primary hover:underline flex items-center gap-1 shrink-0 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-150">
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white border border-stone-200 p-4.5 rounded-[24px] shadow-sm text-xs font-bold">
          
          {/* Categories list */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {['All', 'Hair Care', 'Skin Care', 'Immunity', 'Digestive Care', "Women's Health", "Men's Health", 'Diabetes Care', 'Joint Care'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setProductCat(cat);
                  setVisibleProductsCount(3);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  productCat === cat
                    ? 'bg-ayur-primary text-white'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort inputs */}
          <div className="flex gap-3 w-full lg:w-auto shrink-0">
            <div className="relative flex-grow lg:w-48">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-ayur-primary font-medium"
              />
            </div>
            
            <div className="relative">
              <select
                value={productSort}
                onChange={(e) => setProductSort(e.target.value)}
                className="pl-3 pr-8 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none font-bold"
              >
                <option value="Popular">Popularity</option>
                <option value="LowToHigh">Price: Low to High</option>
                <option value="HighToLow">Price: High to Low</option>
                <option value="NewArrivals">New Arrivals</option>
              </select>
            </div>
          </div>

        </div>

        {/* Adding To Cart Toast Notification */}
        {addedToCartToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-950 text-white rounded-xl border border-emerald-800 shadow-xl text-xs font-bold animate-float flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{addedToCartToast}</span>
          </div>
        )}

        {/* Product Cards Grid */}
        {(() => {
          let filtered = PRODUCT_REGISTRY.filter(prod => {
            const matchesCat = productCat === 'All' || prod.category === productCat;
            const matchesSearch = prod.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                                  prod.desc.toLowerCase().includes(productSearch.toLowerCase());
            return matchesCat && matchesSearch;
          });

          if (productSort === 'LowToHigh') {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
          } else if (productSort === 'HighToLow') {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
          } else if (productSort === 'NewArrivals') {
            filtered = filtered.filter(p => p.badge === 'New');
          }

          const visibleList = filtered.slice(0, visibleProductsCount);

          if (filtered.length === 0) {
            return (
              <div className="text-center py-12 bg-white rounded-[32px] border border-stone-200 border-dashed text-xs text-stone-500 font-bold">
                No organic products found matching the criteria.
              </div>
            );
          }

          return (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleList.map((prod, idx) => {
                  const finalPrice = prod.discount ? Math.round(prod.price * (1 - prod.discount/100)) : prod.price;
                  const isWishlisted = wishlist.includes(prod.name);

                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-stone-200/80 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative"
                    >
                      {/* Product Image and Badges */}
                      <div className="h-52 w-full overflow-hidden relative bg-stone-50">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* 100% Herbal badge */}
                        {prod.isHerbal && (
                          <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            100% Herbal
                          </span>
                        )}

                        {/* Top corner badge */}
                        {prod.badge && (
                          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                            {prod.badge}
                          </span>
                        )}

                        {/* Category badge */}
                        <span className="absolute bottom-3 left-3 bg-emerald-950 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                          {prod.category}
                        </span>

                        {/* Quick View trigger */}
                        <button
                          onClick={() => setQuickViewProd(prod)}
                          className="absolute inset-0 bg-stone-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <span className="px-3.5 py-1.5 bg-white text-stone-900 rounded-lg text-[10px] font-bold shadow flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick View</span>
                          </span>
                        </button>
                      </div>

                      {/* Info Panel */}
                      <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                        <div className="space-y-1.5">
                          {/* Name and Rating */}
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-extrabold text-sm text-stone-900 leading-snug group-hover:text-ayur-primary transition-colors">{prod.name}</h4>
                            <button 
                              onClick={() => toggleWishlist(prod.name)}
                              className={`p-1 rounded-full shrink-0 ${isWishlisted ? 'text-rose-500' : 'text-stone-300 hover:text-rose-500'}`}
                            >
                              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500" />)}
                            </div>
                            <span className="text-[10px] text-stone-400 font-bold">({prod.reviews} reviews)</span>
                          </div>

                          <p className="text-xs text-stone-500 font-medium leading-relaxed line-clamp-2">{prod.desc}</p>
                        </div>

                        {/* Stock & Price Row */}
                        <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[10px] text-stone-400 block">Stock Status</span>
                            <span className={`font-bold ${prod.stock.includes('Only') ? 'text-amber-600' : 'text-emerald-700'}`}>
                              {prod.stock}
                            </span>
                          </div>

                          <div className="text-right">
                            {prod.discount ? (
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-stone-400 line-through mr-1">₹{prod.price}</span>
                                <strong className="text-stone-900">₹{finalPrice}</strong>
                              </div>
                            ) : (
                              <strong className="text-stone-900">₹{prod.price}</strong>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-5 pt-0 grid grid-cols-2 gap-2 text-xs font-bold">
                        <button
                          onClick={() => handleAddToCart(prod.name)}
                          className="py-2 border border-stone-200 rounded-xl text-stone-770 hover:bg-stone-50 flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => handleBuyNow(prod.name)}
                          className="py-2 bg-ayur-primary text-white rounded-xl hover:bg-ayur-secondary text-center"
                        >
                          Buy Now
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {filtered.length > visibleProductsCount && (
                <div className="text-center">
                  <button
                    onClick={() => setVisibleProductsCount(visibleProductsCount + 3)}
                    className="px-6 py-2.5 border border-stone-250 hover:border-ayur-primary text-stone-650 hover:text-ayur-primary text-xs font-black rounded-xl transition-all"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          );
        })()}

      </section>

      {/* QUICK VIEW MODAL COMPONENT */}
      {quickViewProd && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 relative animate-float">
            
            {/* Close Button */}
            <button 
              onClick={() => setQuickViewProd(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-55/60 text-stone-500 hover:text-stone-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Info Header Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              <div className="sm:col-span-5 h-48 w-full rounded-2xl overflow-hidden bg-stone-50">
                <img src={quickViewProd.image} alt={quickViewProd.name} className="w-full h-full object-cover" />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-emerald-50 text-ayur-primary font-bold px-2.5 py-0.5 rounded-full border border-emerald-150">
                      {quickViewProd.category}
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mt-1.5 leading-snug">{quickViewProd.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />)}
                  </div>
                  <span className="text-xs text-stone-400 font-bold">({quickViewProd.reviews} reviews) &bull; Size: {quickViewProd.size}</span>
                </div>

                <div className="text-sm font-black text-stone-900">
                  {quickViewProd.discount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-stone-400 line-through">₹{quickViewProd.price}</span>
                      <span>₹{Math.round(quickViewProd.price * (1 - quickViewProd.discount/100))}</span>
                      <span className="text-[10px] text-emerald-700">({quickViewProd.discount}% OFF)</span>
                    </div>
                  ) : (
                    <span>₹{quickViewProd.price}</span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">{quickViewProd.desc}</p>
              </div>
            </div>

            {/* Mid Tabbed Information columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-stone-100 pt-4 text-xs leading-relaxed">
              <div className="space-y-3">
                <div className="space-y-1">
                  <strong className="text-[10px] text-stone-450 font-bold uppercase tracking-wider block">Key Ingredients:</strong>
                  <p className="text-stone-550 font-medium">{quickViewProd.ingredients.join(', ')}</p>
                </div>

                <div className="space-y-1">
                  <strong className="text-[10px] text-stone-450 font-bold uppercase tracking-wider block">Usage Guidelines:</strong>
                  <p className="text-stone-550 font-medium">{quickViewProd.usage}</p>
                </div>
              </div>

              <div className="space-y-1">
                <strong className="text-[10px] text-stone-450 font-bold uppercase tracking-wider block">Formulation Benefits:</strong>
                <ul className="space-y-1 pl-3 text-stone-550 font-medium list-disc">
                  {quickViewProd.benefits.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                onClick={() => {
                  handleAddToCart(quickViewProd.name);
                  setQuickViewProd(null);
                }}
                className="py-2.5 border border-stone-250 rounded-xl text-stone-750 hover:bg-stone-50 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>
              <button
                onClick={() => {
                  handleBuyNow(quickViewProd.name);
                  setQuickViewProd(null);
                }}
                className="py-2.5 bg-ayur-primary text-white rounded-xl hover:bg-ayur-secondary text-center"
              >
                Buy Formulation Now
              </button>
            </div>

          </div>
        </div>
      )}

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
