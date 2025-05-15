import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect admin-only routes
const RequireAdmin = ({ children }) => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // If user is not logged in or not an admin, redirect to home
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the protected content
  return children;
};

export default RequireAdmin;
