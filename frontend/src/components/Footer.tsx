import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Heart, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-[#111813] text-[#FAF6EF] border-t border-[#1B4332]/40 relative overflow-hidden font-sans">
      
      {/* Organic Background Leaf Patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B4332]/20 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D6A4F]/10 rounded-full blur-3xl -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 space-y-12">
        
        {/* Top Newsletter & Brand Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800/80 items-center">
          
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1B4332] flex items-center justify-center text-[#FAF6EF] shadow-md">
                <Leaf className="w-5 h-5 text-[#D4A373]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">
                Kaya <span className="text-[#D4A373] font-black">Kalp</span>
              </span>
            </div>
            <p className="text-xs text-[#E9E5D9]/70 max-w-md leading-relaxed font-medium">
              Indore’s premier authentic Ayurvedic hospital and Panchakarma clinic. Restoring mind, body, and soul balance through centuries-old natural healing science.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="font-extrabold text-xs text-[#FAF6EF] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#D4A373]" />
              <span>Join Kaya Kalp Wellness Newsletter</span>
            </h4>
            {subscribed && (
              <span className="text-xs text-[#2D6A4F] font-bold block">Thank you! You have subscribed to weekly wellness notes.</span>
            )}
            <form onSubmit={handleSubscribe} className="flex gap-2 text-xs">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1D241E] border border-stone-800 text-white placeholder-stone-500 focus:outline-none focus:border-[#1B4332]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-xl shrink-0 transition-all shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Middle Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: About & Hours */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#D4A373]">Clinic Operational Hours</h5>
            <ul className="space-y-2 text-[#E9E5D9]/80 font-medium">
              <li className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Monday - Saturday:</span>
                <span className="font-bold text-white">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Sunday:</span>
                <span className="text-[#D4A373] font-bold">Prior Bookings</span>
              </li>
              <li className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
                <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Emergency Desk 24/7 Available</span>
              </li>
            </ul>
          </div>

          {/* Col 2: Treatments */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#D4A373]">Key Treatments</h5>
            <ul className="space-y-2 text-[#E9E5D9]/80 font-medium">
              <li><Link to="/panchakarma" className="hover:text-[#D4A373] transition-colors">Panchakarma Detoxification</Link></li>
              <li><Link to="/treatments/joint-pain" className="hover:text-[#D4A373] transition-colors">Abhyanga Herbal Massage</Link></li>
              <li><Link to="/treatments/migraine" className="hover:text-[#D4A373] transition-colors">Shirodhara Oil Flow Therapy</Link></li>
              <li><Link to="/treatments/arthritis" className="hover:text-[#D4A373] transition-colors">Joint & Spine Kati Basti</Link></li>
              <li><Link to="/treatments/weight-loss" className="hover:text-[#D4A373] transition-colors">Udvartana Weight Management</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#D4A373]">Quick Navigation</h5>
            <ul className="space-y-2 text-[#E9E5D9]/80 font-medium">
              <li><Link to="/doctors" className="hover:text-[#D4A373] transition-colors">Specialist BAMS Vaidyas</Link></li>
              <li><Link to="/ai-assessment" className="hover:text-[#D4A373] transition-colors">AI Symptom Checker Hub</Link></li>
              <li><Link to="/gallery" className="hover:text-[#D4A373] transition-colors">Clinic Photo Gallery</Link></li>
              <li><Link to="/auth" className="hover:text-[#D4A373] transition-colors">Patient Login Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Address & Contact */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#D4A373]">Indore Clinic Contact</h5>
            <ul className="space-y-3 text-[#E9E5D9]/80 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A373] mt-0.5 shrink-0" />
                <span>102, Royal Avenue, 18/2-C, New Palasia, Indore (M.P.) - 452001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>+91 9827775075 / 0731-4045075</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>dr.naveenjadhav@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="border-t border-stone-800/80 pt-8 space-y-4 text-[10.5px] text-stone-500 font-medium">
          <p className="leading-relaxed">
            <strong>Medical Disclaimer:</strong> The information provided on Kaya Kalp website is for educational purposes only. Always consult a qualified Ayurvedic physician (Vaidya) for clinical diagnoses or altering medicinal doses.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[#E9E5D9]/60">
            <span>&copy; 2026 Kaya Kalp Ayurvedic Wellness Center, Indore. All Rights Reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Ayurvedic Guidelines</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
