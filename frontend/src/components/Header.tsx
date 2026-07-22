import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Leaf, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Sparkles, Calendar, ShoppingBag, PhoneCall } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-[#E9E5D9] bg-[#FAF6EF]/90 backdrop-blur-md shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] flex items-center justify-center text-white shadow-md shadow-[#1B4332]/20 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-[#FAF6EF]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1B4332] font-sans">
                Kaya <span className="text-[#D4A373] font-extrabold">Kalp</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#526055] font-semibold -mt-1">Indore Ayurvedic Wellness</span>
            </div>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden xl:flex items-center gap-7">
            <Link to="/" className="text-xs font-semibold text-[#1D241E] hover:text-[#1B4332] transition-colors tracking-wide">
              Home
            </Link>
            
            <button 
              onClick={() => handleAnchorScroll('about')}
              className="text-xs font-semibold text-[#1D241E] hover:text-[#1B4332] transition-colors tracking-wide"
            >
              About Us
            </button>

            {/* Treatments Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="text-xs font-semibold text-[#1D241E] hover:text-[#1B4332] transition-colors flex items-center gap-1 py-2 tracking-wide">
                <span>Treatments</span>
                <ChevronDown className="w-3 h-3 text-[#526055]" />
              </button>

              {megaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[680px] rounded-3xl border border-[#E9E5D9] bg-[#FAF6EF] p-6 shadow-2xl z-50 grid grid-cols-3 gap-6 animate-fadeIn transition-all duration-300">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider block border-b border-[#E9E5D9] pb-1.5">Panchakarma Detox</span>
                    <ul className="space-y-2 text-xs text-[#526055] font-medium">
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Vamana (Therapeutic Emesis)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Virechana (Purgation Therapy)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Basti (Enema Therapy)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Nasya (Nasal Cleansing)</Link></li>
                      <li><Link to="/panchakarma" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Raktamokshana (Bloodletting)</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link 
                      to="/treatments/clinical-therapies" 
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-[10px] font-bold text-[#1B4332] hover:text-[#2D6A4F] uppercase tracking-wider block border-b border-[#E9E5D9] pb-1.5 transition-colors"
                    >
                      Clinical Therapies
                    </Link>
                    <ul className="space-y-2 text-xs text-[#526055] font-medium">
                      <li><Link to="/treatments/joint-pain" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Abhyanga Warm Massage</Link></li>
                      <li><Link to="/treatments/migraine" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Shirodhara Oil Stream</Link></li>
                      <li><Link to="/treatments/weight-loss" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Udvartana Powder Massage</Link></li>
                      <li><Link to="/treatments/arthritis" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Patra Pinda Sweda</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link 
                      to="/treatments/special-care" 
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-[10px] font-bold text-[#1B4332] hover:text-[#2D6A4F] uppercase tracking-wider block border-b border-[#E9E5D9] pb-1.5 transition-colors"
                    >
                      Special Care
                    </Link>
                    <ul className="space-y-2 text-xs text-[#526055] font-medium">
                      <li><Link to="/treatments/arthritis" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Joint & Spine Care</Link></li>
                      <li><Link to="/treatments/migraine" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Stress & Sleep Care</Link></li>
                      <li><Link to="/treatments/weight-loss" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Obesity Management</Link></li>
                      <li><Link to="/doctors" onClick={() => setMegaMenuOpen(false)} className="hover:text-[#1B4332] hover:translate-x-1 block transition-all">Skincare & Haircare</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link to="/doctors" className="text-xs font-semibold text-[#1D241E] hover:text-[#1B4332] transition-colors tracking-wide">
              Doctors
            </Link>

            <Link to="/ai-assessment" className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5 bg-[#2D6A4F]/10 px-3 py-1.5 rounded-full border border-[#2D6A4F]/20 hover:bg-[#1B4332] hover:text-white transition-all">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>AI Health Hub</span>
            </Link>

            <Link to="/gallery" className="text-xs font-semibold text-[#1D241E] hover:text-[#1B4332] transition-colors tracking-wide">
              Gallery
            </Link>
          </nav>

          {/* User Profile & Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E9E5D9] bg-white hover:border-[#1B4332] text-xs font-bold text-[#1D241E] transition-all shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#526055]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#E9E5D9] bg-white p-2 shadow-xl z-50 text-xs font-semibold space-y-1">
                    <Link 
                      to={getDashboardLink()} 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FAF6EF] text-[#1D241E]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#1B4332]" />
                      <span>Dashboard Portal</span>
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth"
                className="text-xs font-bold text-[#1B4332] hover:text-[#2D6A4F] px-4 py-2 rounded-xl border border-[#1B4332]/20 hover:border-[#1B4332] transition-all flex items-center justify-center"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/doctors"
              className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#1B4332]/15"
            >
              <Calendar className="w-4 h-4 text-[#D4A373]" />
              <span>Book Now</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-[#E9E5D9] text-[#1D241E] hover:bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF6EF] border-b border-[#E9E5D9] px-4 pt-3 pb-6 space-y-3 font-semibold text-xs animate-fadeIn">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1D241E]">Home</Link>
          <button onClick={() => handleAnchorScroll('about')} className="block py-2 text-[#1D241E]">About Us</button>
          <Link to="/panchakarma" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1B4332] font-bold">Panchakarma Detox</Link>
          <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1D241E]">Specialist Vaidyas</Link>
          <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1D241E]">Clinic Gallery</Link>
          
          <div className="pt-3 border-t border-[#E9E5D9] flex flex-col gap-2">
            {user ? (
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 bg-[#1B4332] text-white text-center rounded-xl font-bold">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 border border-[#1B4332] text-[#1B4332] text-center rounded-xl font-bold">
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
