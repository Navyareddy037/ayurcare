import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Leaf, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'DOCTOR') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/50 glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-ayur-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 font-sans">
              Ayur<span className="text-ayur-primary font-extrabold">Care</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-stone-605 hover:text-ayur-primary transition-colors">
              Home
            </Link>
            <Link to="/doctors" className="text-sm font-medium text-stone-605 hover:text-ayur-primary transition-colors">
              Find Doctors
            </Link>
            <Link to="/ai-assessment" className="text-sm font-medium text-stone-605 hover:text-ayur-primary transition-colors flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">AI</span>
              Symptom Check
            </Link>
            <Link to="/knowledge-hub" className="text-sm font-medium text-stone-605 hover:text-ayur-primary transition-colors">
              Knowledge Hub
            </Link>
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all text-sm text-stone-700"
                >
                  <UserIcon className="w-4 h-4 text-ayur-primary" />
                  <span>{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] bg-emerald-50 text-ayur-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
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
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-100 transition-colors"
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
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-650 hover:bg-red-50 transition-colors mt-1"
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
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-ayur-primary text-white hover:bg-ayur-secondary transition-all shadow shadow-emerald-900/10 hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-stone-100 text-stone-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            Find Doctors
          </Link>
          <Link
            to="/ai-assessment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            AI Symptom Check
          </Link>
          <Link
            to="/knowledge-hub"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            Knowledge Hub
          </Link>
          <div className="border-t border-stone-200 pt-2">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-xs text-stone-500 font-bold uppercase">
                  Logged in as {user.name} ({user.role})
                </div>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-650 hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 rounded-lg bg-ayur-primary text-white font-semibold hover:bg-ayur-secondary"
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
