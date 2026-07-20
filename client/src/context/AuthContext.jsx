// src/context/AuthContext.jsx
// This creates a "global box" that holds the logged-in user's info.
// Any component wrapped inside <AuthProvider> can access it with useAuth().

import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Try to load a saved user from localStorage when the app first loads
  // (so refreshing the page doesn't log you out)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  async function signup(name, email, password) {
    const res = await api.post('/auth/signup', { name, email, password });
    saveSession(res.data);
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  }

  function saveSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so components can just do: const { user, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
