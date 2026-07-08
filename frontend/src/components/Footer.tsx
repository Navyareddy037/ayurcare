import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, PhoneCall, MapPin, Mail, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/50 bg-stone-50 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ayur-primary flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="text-lg font-bold text-stone-900">
                Kaya <span className="text-ayur-primary">Kalp</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed font-sans">
              Bridging ancient Vedic wisdom with modern technology. Book consultations, analyze symptoms, and find qualified Ayurvedic practitioners (Vaidyas) close to you.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-stone-950 uppercase tracking-wider mb-4 font-sans">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <Link to="/doctors" className="hover:text-ayur-primary transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/ai-assessment" className="hover:text-ayur-primary transition-colors">
                  AI Symptom Assessment
                </Link>
              </li>
              <li>
                <Link to="/knowledge-hub" className="hover:text-ayur-primary transition-colors">
                  Knowledge Hub & Herb DB
                </Link>
              </li>
              <li>
                <a href="/#emergency" className="hover:text-red-500 transition-colors font-medium">
                  Emergency Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h3 className="text-sm font-semibold text-stone-955 uppercase tracking-wider mb-4 font-sans">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-sm font-sans">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-ayur-primary mt-0.5 shrink-0" />
                <span>To Be Updated (Demo Information)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-ayur-primary mt-0.5 shrink-0" />
                <span>Coming Soon (To Be Updated)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ayur-primary mt-0.5 shrink-0" />
                <span>To Be Updated (Demo Information)</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200/50 space-y-2 font-sans">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Medical Disclaimer</span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              Kaya Kalp's AI diagnostics are for informational guidance only and do not replace a medical practitioner's evaluation. In case of acute conditions, please seek immediate emergency care.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
          <p>&copy; {new Date().getFullYear()} Kaya Kalp Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Disclaimer Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
