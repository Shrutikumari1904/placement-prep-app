// src/api/axios.js
// A pre-configured "phone line" to our backend.
// Instead of writing the full URL every time, we just import `api` and use api.get(...) etc.

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // our Express server
});

// This runs before EVERY request — it automatically attaches the login token
// (if the user is logged in) so protected routes work.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
