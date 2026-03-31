import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to appropriate login
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  const role = user.user_metadata?.role || 'learner';

  if (requiredRole && role !== requiredRole) {
    // Wrong role – redirect to their correct home
    return <Navigate to={role === 'admin' ? '/admin' : '/app/learner'} replace />;
  }

  return children;
};

export default ProtectedRoute;
