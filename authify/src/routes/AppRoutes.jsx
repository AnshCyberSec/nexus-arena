// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// --- Pages Imports ---
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import MfaVerify from '../pages/auth/MfaVerify';
import Dashboard from '../pages/dashboard/Dashboard';
import Settings from '../pages/dashboard/Settings';
import AdminPanel from '../pages/admin/AdminPanel';
import TicTacToe from '../pages/game/TicTacToe';
import OnlineGame from '../pages/game/OnlineGame'; // <-- YEH NAYA ADD HUA

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/mfa-verify" element={<MfaVerify />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/game" element={<TicTacToe />} />
        <Route path="/game/online" element={<OnlineGame />} /> {/* <-- YEH NAYA ADD HUA */}
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-[#09090B] text-white text-3xl font-bold">
            404 | Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;