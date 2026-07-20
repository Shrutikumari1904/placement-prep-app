// src/App.jsx
// Defines which page shows for which URL.

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CompanyDetail from './pages/CompanyDetail';
import DsaTopicDetail from './pages/DsaTopicDetail';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/:id"
        element={
          <ProtectedRoute>
            <CompanyDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa/:name"
        element={
          <ProtectedRoute>
            <DsaTopicDetail />
          </ProtectedRoute>
        }
      />
      {/* any unknown URL redirects to dashboard (which redirects to login if not signed in) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
