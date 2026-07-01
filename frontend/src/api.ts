import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically inject JWT tokens into headers of outgoing HTTP calls
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ayurcare_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
