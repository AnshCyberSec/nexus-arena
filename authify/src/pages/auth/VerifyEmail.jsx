// src/pages/auth/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Loader from '../../components/common/Loader';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found in the URL.');
        return;
      }

      try {
        // Backend API call to verify email
        // Note: Backend me endpoint ka method GET ya POST check kar lena.
        // Humne controller me POST banaya tha, but GET bhi handle kiya tha.
        const response = await authApi.verifyEmail({ token });

        if (response.data.success) {
          setStatus('success');
          setMessage('Your email has been successfully verified. You can now log in.');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'Invalid or expired verification token. Please try registering again.'
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md z-10 bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-10 text-center">

        {/* --- Loading State --- */}
        {status === 'loading' && (
          <div className="py-8">
            <Loader size="lg" text="Verifying your email..." />
          </div>
        )}

        {/* --- Success State --- */}
        {status === 'success' && (
          <div className="animate-fade-in-up">
            <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <FiCheckCircle className="text-6xl text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Email Verified!</h2>
            <p className="text-slate-400 mb-8">{message}</p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Proceed to Login
            </Link>
          </div>
        )}

        {/* --- Error State --- */}
        {status === 'error' && (
          <div className="animate-fade-in-up">
            <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <FiXCircle className="text-6xl text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Verification Failed</h2>
            <p className="text-slate-400 mb-8">{message}</p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all duration-300"
            >
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;