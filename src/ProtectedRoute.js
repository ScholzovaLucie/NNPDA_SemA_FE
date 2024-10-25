// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth();

  return token ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
