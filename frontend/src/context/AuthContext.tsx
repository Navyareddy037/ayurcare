import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  patientProfile?: any;
  doctorProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (payload: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    const token = localStorage.getItem('kayakalp_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.authenticated) {
        setUser(res.data.user);
      } else {
        localStorage.removeItem('kayakalp_token');
        setUser(null);
      }
    } catch (err) {
      console.error('Session validation failed:', err);
      localStorage.removeItem('kayakalp_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('kayakalp_token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred';
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (payload: any) => {
    try {
      const res = await api.post('/auth/signup', payload);
      if (res.data && res.data.success) {
        localStorage.setItem('kayakalp_token', res.data.token);
        setUser(res.data.user);
        await refreshSession();
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('kayakalp_token');
    if (api.defaults.headers.common) {
      delete api.defaults.headers.common['Authorization'];
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};
