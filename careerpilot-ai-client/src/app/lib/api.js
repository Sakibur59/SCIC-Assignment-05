import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.id) {
      // If using JWT from backend
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Resume APIs
export const resumeAPI = {
  upload: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'skills' || key === 'experience') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/resume'),
  getOne: (id) => api.get(`/resume/${id}`),
  update: (id, data) => api.put(`/resume/${id}`, data),
  delete: (id) => api.delete(`/resume/${id}`),
  analyze: (resumeId) => api.post('/resume/analyze', { resumeId }),
};

// Saved Jobs APIs
export const savedJobAPI = {
  getAll: () => api.get('/saved-jobs'),
  save: (data) => api.post('/saved-jobs', data),
  update: (id, data) => api.put(`/saved-jobs/${id}`, data),
  delete: (id) => api.delete(`/saved-jobs/${id}`),
};

export default api;