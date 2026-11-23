// src/pages/auth/MfaVerify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiShield, FiLock } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const MfaVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Agar login page se mfaToken aaya hai, toh use yahan utha lo
  const mfaToken = location.state?.mfaToken || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Agar koi direct is page pe aaya bina token ke, toh login pe bhej do
  useEffect(() => {
    if (!mfaToken) {
      navigate('/login');
    }
  }, [mfaToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.verifyMfaLogin({ mfaToken, code });
      const data = response.data.data;

      // Login successful (MFA verified)
      login(data);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid or expired MFA code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md z-10 bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <FiShield className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Two-Factor Auth</h2>
          <p className="text-slate-400 mt-2">Enter the 6-digit code from your authenticator app.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="6-Digit Code"
            name="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            icon={<FiLock />}
            placeholder="000000"
            className="text-center tracking-[1em] text-xl font-bold"
            required
          />

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Verify Code
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MfaVerify;