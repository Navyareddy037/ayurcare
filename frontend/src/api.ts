/// <reference types="vite/client" />
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically inject JWT tokens into headers of outgoing HTTP calls
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kayakalp_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers) {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
