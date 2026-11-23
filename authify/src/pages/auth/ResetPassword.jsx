// src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { validatePassword, validateConfirmPassword } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Agar URL me token hi nahi hai, toh seedha login pe bhej do
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const passErr = validatePassword(formData.newPassword);
    const confirmErr = validateConfirmPassword(formData.newPassword, formData.confirmPassword);

    if (passErr || confirmErr) {
      setErrors({ newPassword: passErr, confirmPassword: confirmErr });
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      await authApi.resetPassword({ token, newPassword: formData.newPassword });
      setIsSuccess(true);
      // 3 second baad login page pe bhej dega
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md z-10 bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">{APP_NAME.charAt(0)}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Set New Password</h2>
          <p className="text-slate-400 mt-2">Your new password must be different from previous ones.</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
            {serverError}
          </div>
        )}

        {isSuccess ? (
          <div className="text-center space-y-4 py-8 animate-fade-in">
            <FiCheckCircle className="mx-auto text-6xl text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white">Password Reset Successful!</h3>
            <p className="text-slate-400">Redirecting you to login...</p>
            <Link to="/login" className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Click here if not redirected
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              icon={<FiLock />}
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<FiLock />}
              required
            />

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="mt-6">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;