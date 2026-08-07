import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://taskmaster-backend-19k7.onrender.com';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to outgoing requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('task_master_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors (e.g. 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        localStorage.removeItem('task_master_token');
        localStorage.removeItem('task_master_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
