import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Leaf, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'DOCTOR') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  const handleAnchorScroll = (id: string) => {
    setMobileMenuOpen(false);
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-ayur-primary flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <span className="text-xl font-black tracking-tight text-stone-900 font-sans">
              Kaya <span className="text-ayur-primary font-black">Kalp</span>
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden xl:flex items-center gap-6">
            <Link to="/" className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide">
              Home
            </Link>
            
            <button 
              onClick={() => handleAnchorScroll('about')}
              className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide"
            >
              About Kaya Kalp
            </button>

            {/* Treatments Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors flex items-center gap-1 py-2 tracking-wide">
                <span>Treatments</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {megaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[640px] rounded-3xl border border-stone-150 bg-white p-6 shadow-2xl z-50 grid grid-cols-3 gap-6 animate-float transition-all duration-300">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-ayur-primary uppercase tracking-wider block border-b border-stone-100 pb-1">Panchakarma Detox</span>
                    <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Vamana (Emesis)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Virechana (Purgation)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Basti (Enema Therapy)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Nasya (Nasal Cleansing)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Raktamokshana (Blood purification)</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-ayur-primary uppercase tracking-wider block border-b border-stone-100 pb-1">Clinical Therapies</span>
                    <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
                      <li><Link to="/treatments/joint-pain" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Abhyanga (Warm Massage)</Link></li>
                      <li><Link to="/treatments/migraine" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Shirodhara (Oil Flow)</Link></li>
                      <li><Link to="/treatments/weight-loss" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Udvartana (Powder Massage)</Link></li>
                      <li><Link to="/treatments/arthritis" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Patra Pinda Sweda</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-ayur-primary uppercase tracking-wider block border-b border-stone-100 pb-1">Special Programs</span>
                    <ul className="space-y-1.5 text-xs text-stone-600 font-medium">
                      <li><Link to="/treatments/arthritis" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Joint Care (Sandhigata)</Link></li>
                      <li><Link to="/treatments/migraine" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Stress & Insomnia Care</Link></li>
                      <li><Link to="/treatments/joint-pain" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Spine & Back Care (Kati Basti)</Link></li>
                      <li><Link to="/treatments/weight-loss" onClick={() => setMegaMenuOpen(false)} className="hover:text-ayur-accent hover:translate-x-1 block transition-all duration-200">Weight Management</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link to="/doctors" className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide">
              Doctors
            </Link>

            <Link to="/ai-assessment" className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors flex items-center gap-1 tracking-wide">
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-ayur-primary border border-emerald-150">ONLINE</span>
              <span>Online Consultation</span>
            </Link>

            <button 
              onClick={() => handleAnchorScroll('wellness-programs')}
              className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide"
            >
              Wellness Programs
            </button>

            <button 
              onClick={() => handleAnchorScroll('packages')}
              className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide"
            >
              Health Packages
            </button>

            <Link to="/products" className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide">
              Ayurvedic Products
            </Link>

            <button 
              onClick={() => handleAnchorScroll('blogs')}
              className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide"
            >
              Blogs
            </button>

            <button 
              onClick={() => handleAnchorScroll('testimonials')}
              className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide"
            >
              Testimonials
            </button>

            <button 
              onClick={() => handleAnchorScroll('contact')}
              className="text-xs font-semibold text-stone-600 hover:text-ayur-primary transition-colors tracking-wide"
            >
              Contact
            </button>
          </nav>

          {/* User Sign In Actions */}
          <div className="hidden xl:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all text-xs font-bold text-stone-700"
                >
                  <UserIcon className="w-4 h-4 text-ayur-primary" />
                  <span>{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] bg-emerald-50 text-ayur-primary px-1.5 py-0.5 rounded font-extrabold uppercase">
                    {user.role}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-stone-200 bg-white p-2 shadow-lg z-20">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-stone-500" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-red-650 hover:bg-red-50 transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4.5 py-2.25 text-xs font-black rounded-xl bg-ayur-primary text-white hover:bg-ayur-secondary transition-all shadow-sm shadow-emerald-950/15"
              >
                Sign In Portal
              </Link>
            )}
          </div>

          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-100 text-stone-605"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-5 space-y-1 bg-white/95 backdrop-blur shadow-inner">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Home
          </Link>
          <button
            onClick={() => handleAnchorScroll('about')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            About Kaya Kalp
          </button>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Our Doctors
          </Link>
          <Link
            to="/ai-assessment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Online Consultation (AI check)
          </Link>
          <Link
            to="/panchakarma"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Panchakarma Detox
          </Link>
          <Link
            to="/treatments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Clinical Diseases
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Ayurvedic Products
          </Link>
          <button
            onClick={() => handleAnchorScroll('wellness-programs')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Wellness Programs
          </button>
          <button
            onClick={() => handleAnchorScroll('packages')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Health Packages
          </button>
          <button
            onClick={() => handleAnchorScroll('blogs')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Blogs
          </button>
          <button
            onClick={() => handleAnchorScroll('testimonials')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Testimonials
          </button>
          <button
            onClick={() => handleAnchorScroll('contact')}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
          >
            Contact
          </button>
          
          <div className="border-t border-stone-150 mt-3 pt-3">
            {user ? (
              <div className="space-y-1">
                <span className="block px-3 text-[10px] font-bold text-stone-400 uppercase">Logged in as {user.name}</span>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-750 hover:bg-stone-50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-650 hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-xl bg-ayur-primary text-white font-extrabold text-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
