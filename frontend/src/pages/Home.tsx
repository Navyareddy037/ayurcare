import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Sparkles, Activity, ShieldAlert, Compass, Search, 
  MapPin, Phone, HelpCircle, ArrowRight, ArrowUpRight, Award, 
  CheckCircle2, BookOpen, Star, Mail, Clock, MessageSquare, ShieldCheck
} from 'lucide-react';

const CONDITIONS = [
  { name: 'Sandhigata Vata (Arthritis & Joint Care)', description: 'Therapeutic oil pooling and herbal poultices to rebuild joint lubricating fluids.' },
  { name: 'Kati Basti (Back & Spine Conditions)', description: 'Warm herbal decoctions retained on the spine to treat disc compression.' },
  { name: 'Skin Disorders (Psoriasis & Eczema)', description: 'Internal detoxification therapies paired with soothing neem formulations.' },
  { name: 'Obesity & Weight Management', description: 'Dry powder scrub massages (Udvartana) designed to activate lipid metabolism.' }
];

const PANCHAKARMA = [
  { name: 'Vamana (Therapeutic Emesis)', desc: 'Cleansing therapy specifically targeting respiratory and Kapha disorders.' },
  { name: 'Virechana (Purgation Therapy)', desc: 'Gentle laxative purification targeting gallbladder, liver, and Pitta imbalances.' },
  { name: 'Basti (Enema Therapy)', desc: 'Warm herbal decoction oils designed to treat chronic nervous system Vata disorders.' },
  { name: 'Nasya (Nasal Cleaning)', desc: 'Administration of herbal drops via nostrils to clear sinuses and boost mental clarity.' },
  { name: 'Raktamokshana (Blood purification)', desc: 'Localized purification therapies designed to treat deep-seated eczema or toxicity.' }
];

const PACKAGES = [
  { title: 'Ayur Detox Program', days: '7 Days', price: '₹14,999', features: ['Prakriti Dosha analysis', 'Daily Abhyanga massage', 'Shirodhara oil flow session', 'Organic balancing herbal lunch'] },
  { title: 'Spine & Joint Rejuvenation', days: '14 Days', price: '₹28,500', features: ['Kati Basti spinal treatments', 'Patra Pinda Sweda poultices', 'Physiotherapy consulting', 'Anti-inflammatory herb kit'] },
  { title: 'Stress Buster & Sleep Package', days: '5 Days', price: '₹9,999', features: ['Ayurvedic head massage (Champi)', 'Shirodhara therapies', 'Yoga Pranayama sessions', 'Insomnia balancing advice'] }
];

const BLOGS = [
  { title: 'Dinacharya: The Ayurvedic Daily Self-Care Ritual', date: 'July 10, 2026', readTime: '5 min read', desc: 'Step-by-step guide to integrate tongue scraping, oil pulling, and meditation into your early mornings.' },
  { title: 'Top 5 Herbs to Naturally Reduce Cortisol & Stress', date: 'June 28, 2026', readTime: '4 min read', desc: 'Exploring the cortisol-lowering properties of Ashwagandha, Brahmi, and Shankhpushpi.' }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
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
    <div className="space-y-24 pb-20 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden pt-10 md:pt-20 bg-stone-50/50">
        <div className="absolute top-10 left-10 -z-10 w-80 h-80 rounded-full bg-emerald-100/35 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 -z-10 w-96 h-96 rounded-full bg-amber-100/25 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-ayur-primary text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kaya Kalp official website 2026</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.1] dark:text-stone-900">
                Premium Ayurvedic Healthcare for <span className="text-ayur-primary">Modern Vigor</span>
              </h1>
              
              <p className="text-sm sm:text-base text-stone-605 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Modernizing 5,000 years of traditional medicine. Identify your body Doshas, check clinical symptoms with AI, and book consultations with certified Ayurvedic practitioners.
              </p>

              {/* Call-to-action CTAs */}
              <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  to="/doctors"
                  className="px-6 py-3 rounded-xl bg-ayur-primary text-white font-extrabold hover:bg-ayur-secondary transition-all shadow-md shadow-emerald-950/15 flex items-center gap-1 text-xs"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  to="/ai-assessment"
                  className="px-6 py-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-extrabold hover:bg-stone-50 transition-all text-xs flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Online AI Consultation</span>
                </Link>

                <Link
                  to="/doctors"
                  className="px-6 py-3 rounded-xl bg-stone-900 text-white font-extrabold hover:bg-stone-850 text-xs flex items-center gap-1"
                >
                  <span>Find a Doctor</span>
                </Link>
              </div>

              {/* Trusted metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-stone-200/50">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-ayur-primary">25+</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Expert Vaidyas</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-ayur-primary">15,000+</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Healed cases</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-ayur-primary">99.2%</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Satisfied Patients</div>
                </div>
              </div>
            </div>

            {/* Quick Access Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-white border border-stone-200/60 p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-stone-150 pb-3">
                  <h3 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">Kaya Kalp Services</h3>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Symptom Checker', path: '/ai-assessment', desc: 'Identify health imbalances instantly' },
                    { title: 'Consult Certified Vaidyas', path: '/doctors', desc: 'Video and clinic consultations' },
                    { title: 'Ayurvedic Encyclopedia', path: '/knowledge-hub', desc: 'Explore classical medicinal herbs' }
                  ].map((srv, idx) => (
                    <Link
                      key={idx}
                      to={srv.path}
                      className="flex justify-between items-center p-3 rounded-xl border border-stone-100 hover:border-emerald-200 bg-stone-50/30 hover:bg-emerald-50/10 group transition-all text-xs"
                    >
                      <div>
                        <div className="font-bold text-stone-850 group-hover:text-ayur-primary">{srv.title}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{srv.desc}</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-ayur-primary transition-colors" />
                    </Link>
                  ))}
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ayur-primary text-xs font-bold uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Legacy of Healing</span>
            </div>
            <h2 className="text-3xl font-black text-stone-900 leading-tight">Authentic Ayurvedic Vaidya Clinic</h2>
            <p className="text-stone-605 text-xs sm:text-sm leading-relaxed">
              Established with the vision of carrying forward the lineage of pure Ayurveda, Kaya Kalp Wellness combines time-tested therapies with modern diagnostic verification. We treat root imbalances to restore sustained physiological balance.
            </p>
            <div className="space-y-3 text-xs font-bold text-stone-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ayur-primary" />
                <span>NABL Accredited Diagnostic Partnerships</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ayur-primary" />
                <span>GMP-Certified Herbal Formulations</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-emerald-50/35 border border-emerald-200/40 p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">Why Choose Kaya Kalp?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Personalized Care', desc: 'No generic formulas. Treatments are custom tailored to your Prakriti body structure.' },
                { title: 'Verified Vaidyas', desc: 'Our panel of practitioners are highly experienced, BAMS certified doctors.' },
                { title: 'Holistic Dinacharya', desc: 'We combine therapies with personalized daily diet rules and yoga instructions.' },
                { title: 'AI Health Companion', desc: 'Instant AI symptom checker maps concerns to specialized doctors within minutes.' }
              ].map((w, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="font-extrabold text-xs text-stone-850">{w.title}</div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HEALTH CONDITIONS WE TREAT */}
      <section id="conditions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-stone-900">Health Conditions We Treat</h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            Ayurveda focuses on resolving deep-rooted biological imbalances instead of temporary suppression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONDITIONS.map((c, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white border border-stone-200/60 hover:border-emerald-200 shadow-sm space-y-3 hover:-translate-y-0.5 transition-all">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center font-bold text-xs">0{i+1}</span>
              <h4 className="font-extrabold text-xs text-stone-900 leading-snug">{c.name}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. OUR PANCHAKARMA PROGRAMS */}
      <section id="panchakarma" className="bg-emerald-950 text-white py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-emerald-800/40 pb-6">
            <div>
              <span className="text-[10px] text-emerald-350 font-bold uppercase tracking-widest block mb-1">Classical Detoxification</span>
              <h2 className="text-2xl sm:text-3xl font-black">Five Pillars of Panchakarma</h2>
            </div>
            <Link to="/doctors" className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700">
              Schedule Detox consult
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PANCHAKARMA.map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 space-y-3">
                <span className="text-[10px] text-emerald-300 font-bold tracking-widest block uppercase">Pillar 0{idx+1}</span>
                <h4 className="font-extrabold text-xs leading-snug">{p.name}</h4>
                <p className="text-[11px] text-emerald-200 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WELLNESS PROGRAMS & HEALTH PACKAGES */}
      <section id="wellness-programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-2 mb-10" id="packages">
          <h2 className="text-3xl font-black text-stone-900">Customized Health Packages</h2>
          <p className="text-stone-500 text-xs sm:text-sm">Structured clinical stays paired with dietary detox stews.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((p, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-emerald-250 shadow-md flex flex-col justify-between space-y-6 hover:-translate-y-0.5 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-sm text-stone-905">{p.title}</h4>
                    <span className="text-[10px] text-stone-400 font-bold block mt-0.5">{p.days} residential package</span>
                  </div>
                  <span className="text-base font-black text-ayur-primary">{p.price}</span>
                </div>
                
                <ul className="space-y-2 text-[11px] text-stone-600 font-medium">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/doctors" className="w-full py-2 bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-ayur-primary font-bold text-center text-xs rounded-xl border border-stone-200 hover:border-emerald-200 transition-colors">
                Enquire Package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section id="testimonials" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-stone-900">Success Stories</h2>
          <p className="text-stone-500 text-xs">Real patients share their healing journey.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { name: 'Sameer Shah, Indore', disease: 'Chronic Acidity & Migraine', text: 'After 3 years of western pills, a 14-day Virechana detoxification at Kaya Kalp completely resolved my acid reflux. Truly grateful!' },
            { name: 'Kiran Patel, Indore', disease: 'Joint Pain (Osteoarthritis)', text: 'The Janu Basti treatment and organic oils rebuilt my knees flexibility. I can walk long walks now without pain!' }
          ].map((t, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-stone-50/50 border border-stone-200/50 shadow-inner space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">"{t.text}"</p>
              <div>
                <div className="font-extrabold text-[11px] text-stone-900">{t.name}</div>
                <span className="text-[10px] text-ayur-primary font-bold">{t.disease}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BLOGS */}
      <section id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex justify-between items-end border-b border-stone-200/50 pb-5 mb-10">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Health Insights</span>
            <h2 className="text-2xl sm:text-3xl font-black">Official Health Blogs</h2>
          </div>
          <Link to="/knowledge-hub" className="text-xs font-bold text-ayur-primary hover:underline">
            View all articles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOGS.map((b, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
              <span className="text-[9px] text-stone-400 font-bold block">{b.date} &bull; {b.readTime}</span>
              <h4 className="font-extrabold text-sm text-stone-900 leading-snug">{b.title}</h4>
              <p className="text-xs text-stone-550 leading-relaxed">{b.desc}</p>
              <Link to="/knowledge-hub" className="inline-flex items-center gap-1 text-[11px] text-ayur-primary font-bold hover:underline">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-center text-stone-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Is Ayurvedic medicine safe alongside Western drugs?', a: 'Under doctor supervision, yes. Many herbs can interact with Western prescriptions (like blood thinners or diabetes pills). Always list your medicines on your signup sheet.' },
            { q: 'What is the ideal duration for a Panchakarma detox?', a: 'A standard Panchakarma program ranges from 7 to 21 days depending on the severity of the imbalances. The doctor determines the duration during your initial consultation.' }
          ].map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div key={index} className="border border-stone-200/60 rounded-2xl bg-white overflow-hidden">
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="flex justify-between items-center w-full px-6 py-4 text-left font-bold text-stone-900 text-xs sm:text-sm"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-ayur-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CONTACT SECTION & MAPS */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-stone-900">Get in Touch</h2>
              <p className="text-xs text-stone-550 leading-relaxed">
                Have inquiries about clinical stays or packages? Reach our desk.
              </p>

              <div className="space-y-3.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-ayur-primary mt-0.5" />
                  <div>
                    <strong>Kaya Kalp Wellness Center</strong>
                    <div className="text-[11px] text-stone-500">102, Royal Avenue, New Palasia, Indore (M.P.) - 452001</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-ayur-primary" />
                  <span>+91 98277-XXXXX (Consultation Hotline)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-ayur-primary" />
                  <span>care@kayakalpindore.com</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="border-t border-stone-200/50 pt-5 space-y-3">
              <h4 className="font-extrabold text-xs text-stone-850 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-ayur-primary" />
                <span>Subscribe to Wellness Newsletter</span>
              </h4>
              {newsletterSuccess && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-250 text-ayur-primary text-[10px] font-bold">
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
                  className="w-2/3 px-3 py-1.5 rounded-xl border border-stone-205 text-xs bg-white focus:outline-none"
                />
                <button type="submit" className="w-1/3 py-1.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary">
                  Join List
                </button>
              </form>
            </div>
          </div>

          {/* Interactive Google Map Iframe of Indore location */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-stone-200 shadow-sm min-h-[300px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3680.125712217688!2d75.8778051759493!3d22.72355522744747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd375323cb11%3A0xe54e668c2e648835!2sNew%20Palasia%2C%20Indore%2C%20Madhya%20Pradesh%20452001!5e0!3m2!1sen!2sin!4v1719747120401!5m2!1sen!2sin" 
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
