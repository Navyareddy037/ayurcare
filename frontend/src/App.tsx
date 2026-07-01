import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import DoctorDirectory from './pages/Doctors';
import AIAssessment from './pages/AIAssessment';
import KnowledgeHub from './pages/KnowledgeHub';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Route protection wrapper checking authenticated session and matching roles
const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-ayur-primary border-stone-200 animate-spin mx-auto"></div>
          <p className="text-sm text-stone-550">Authenticating Route...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized, redirect to proper dashboard or home
    if (user.role === 'PATIENT') return <Navigate to="/dashboard/patient" replace />;
    if (user.role === 'DOCTOR') return <Navigate to="/dashboard/doctor" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/doctors" element={<DoctorDirectory />} />
              <Route path="/ai-assessment" element={<AIAssessment />} />
              <Route path="/knowledge-hub" element={<KnowledgeHub />} />

              {/* Patient Routes */}
              <Route 
                path="/dashboard/patient" 
                element={
                  <PrivateRoute allowedRoles={['PATIENT']}>
                    <PatientDashboard />
                  </PrivateRoute>
                } 
              />

              {/* Doctor Routes */}
              <Route 
                path="/dashboard/doctor" 
                element={
                  <PrivateRoute allowedRoles={['DOCTOR']}>
                    <DoctorDashboard />
                  </PrivateRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/dashboard/admin" 
                element={
                  <PrivateRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />

              {/* Fallback Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
