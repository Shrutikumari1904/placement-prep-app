// src/components/ProtectedRoute.jsx
// Wraps a page and only shows it if the user is logged in.
// Otherwise, it redirects them to /login.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
