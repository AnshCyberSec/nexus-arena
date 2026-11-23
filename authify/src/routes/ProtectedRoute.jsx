// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { ROLES } from '../utils/constants';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // 1. Agar app load ho raha hai (token check ho raha hai), toh spinner dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader fullScreen={true} text="Verifying Access..." />
      </div>
    );
  }

  // 2. Agar user logged-in nahi hai, toh login page par bhej do
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Agar Admin route hai, par user ke paas Admin role nahi hai, toh dashboard par bhej do
  if (requireAdmin && user?.roles && !user.roles.includes(ROLES.ADMIN)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Agar sab theek hai, toh andar (Dashboard/Game) jane do
  return <Outlet />;
};

export default ProtectedRoute;