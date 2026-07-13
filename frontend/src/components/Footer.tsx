import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, PhoneCall, MapPin, Mail, AlertTriangle, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-850 bg-stone-950 text-stone-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand - Span 4 */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-ayur-primary flex items-center justify-center text-white shadow-md">
                <Leaf className="w-5 h-5 text-emerald-100 animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kaya <span className="text-ayur-accent font-black">Kalp</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-400 max-w-sm font-medium">
              Established with the vision of carrying forward the lineage of pure Ayurveda, Kaya Kalp Wellness Center combines time-tested clinical therapies with modern diagnostic verification to restore physiological balance.
            </p>
            {/* Social media icons */}
            <div className="flex gap-3 pt-2 text-stone-400">
              <a href="#" className="p-2 rounded-xl bg-stone-900 hover:bg-ayur-primary hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-stone-900 hover:bg-ayur-primary hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-stone-900 hover:bg-ayur-primary hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Directory Links - Span 3 */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-ayur-accent pl-2">
              Kaya Kalp Directory
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-ayur-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/treatments" className="hover:text-ayur-accent transition-colors">Treatments Catalog</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-ayur-accent transition-colors">Specialist Doctors</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-ayur-accent transition-colors">Wellness Gallery</Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-ayur-accent transition-colors">Health & Wellness Blogs</Link>
              </li>
              <li>
                <Link to="/ai-assessment" className="hover:text-ayur-accent transition-colors">AI Symptom Checker</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details - Span 3 */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-ayur-accent pl-2">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-xs font-medium">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-ayur-accent mt-0.5 shrink-0" />
                <span className="leading-snug">+91 98277-55555</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-ayur-accent mt-0.5 shrink-0" />
                <span className="leading-snug">care@kayakalpindore.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ayur-accent mt-0.5 shrink-0" />
                <span className="leading-snug">102, Royal Avenue, New Palasia, Indore (M.P.) - 452001</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-ayur-accent mt-0.5 shrink-0" />
                <span className="leading-snug text-stone-400">Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer - Span 2 */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-500 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Medical Disclaimer</span>
            </div>
            <p className="text-[10px] text-stone-400 leading-relaxed font-medium">
              Kaya Kalp's digital symptom checkers and herb indexes are for educational guidance only. Please consult certified Vaidyas for medical treatments.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-850 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs">
          <p className="text-stone-500">&copy; {new Date().getFullYear()} Kaya Kalp Ayurvedic Wellness Center. All rights reserved.</p>
          <div className="flex gap-4 text-stone-500 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
