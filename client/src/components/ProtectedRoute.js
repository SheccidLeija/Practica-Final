import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute; 