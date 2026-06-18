import axios from 'axios';

// Aapke Swagger documentation ke hisab se base URL configure karein
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for easy error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Yahan aap global error toasts trigger kar sakte hain
    return Promise.reject(error?.response?.data || error.message);
  }
);