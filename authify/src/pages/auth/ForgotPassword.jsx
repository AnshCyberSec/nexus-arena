// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { validateEmail } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Backend call
      await authApi.forgotPassword({ email });

      // Security best practice: Hum ye nahi batate ki email exist karti hai ya nahi
      setSuccessMsg('If an account exists with this email, a password reset link has been sent.');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md z-10 bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">{APP_NAME.charAt(0)}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Forgot Password?</h2>
          <p className="text-slate-400 mt-2">No worries, we'll send you reset instructions.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {successMsg}
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              icon={<FiMail />}
              required
            />

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;