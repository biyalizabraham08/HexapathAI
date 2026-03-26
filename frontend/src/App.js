import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Learner from './pages/Learner';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Login from './pages/Login';
import Register from './pages/Register';
import Analyzer from './components/Analyzer';
import Assessment from './components/Assessment';
import Support from './pages/Support';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CourseProgressProvider } from './context/CourseProgressContext';

function App() {
  return (
    <AuthProvider>
      <CourseProgressProvider>
      <Router>
        <Routes>
          {/* ── Public Routes ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Admin Auth (standalone, no layout wrapper) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* ── Admin Dashboard ── */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } />

          {/* ── Learner App Routes ── */}
          <Route path="/app" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Learner />} />
            <Route path="learner" element={<Learner />} />
            <Route path="analyzer" element={<Analyzer />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </CourseProgressProvider>
    </AuthProvider>
  );
}

export default App;
