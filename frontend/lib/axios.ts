import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const TOKEN_KEY = 'recruit_ai_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach Bearer token to every request ──
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 and general errors ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid — clear auth state and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        // Only redirect if not already on login/register page
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error?.response?.data || error.message);
  }
);