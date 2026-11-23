import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiShield, FiArrowRight, FiHexagon } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (serverError) setServerError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(formData.email);
    if (!formData.password || emailErr) {
      setErrors({ email: emailErr, password: !formData.password ? 'Required' : '' });
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const response = await authApi.login(formData);
      const data = response.data.data;

      if (data.mfaRequired) {
        setMfaRequired(true);
        setMfaToken(data.mfaToken);
      } else {
        login(data);
        navigate('/dashboard');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (mfaCode.length !== 6) return setServerError('Please enter a valid 6-digit code.');

    setIsLoading(true);
    setServerError('');

    try {
      const response = await authApi.verifyMfaLogin({ mfaToken, code: mfaCode });
      login(response.data.data);
      navigate('/dashboard');
    } catch (error) {
      setServerError('Invalid or expired MFA code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-[#171717] overflow-hidden items-center justify-center border-r border-white/5">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-nexus-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-nexus-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center px-12 animate-fade-in">

          {/* FIXED LOGO */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#171717] border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            <FiHexagon className="text-nexus-primary text-5xl drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
          </div>

          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Welcome Back.</h1>
          <p className="text-nexus-muted text-lg max-w-md mx-auto">Securely access your dashboard and jump right back into the action.</p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-slide-up">

          <div className="mb-10 lg:hidden text-center">
            <h2 className="text-3xl font-extrabold text-white">{APP_NAME}</h2>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">{mfaRequired ? 'Two-Factor Auth' : 'Sign In'}</h2>
          <p className="text-nexus-muted mb-8">{mfaRequired ? 'Enter the code from your app.' : 'Enter your credentials to access your account.'}</p>

          {serverError && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{serverError}</div>}

          {!mfaRequired ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} icon={<FiMail />} />
              <div>
                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} icon={<FiLock />} />
                <div className="text-right mt-2">
                  <Link to="/forgot-password" className="text-xs text-nexus-primary hover:text-white transition-colors">Forgot password?</Link>
                </div>
              </div>
              {/* ROYAL ORANGE BUTTON */}
              <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="mt-4 group !bg-nexus-primary hover:!bg-nexus-secondary !text-black font-bold">
                Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <FiShield className="mx-auto text-5xl text-nexus-primary mb-2" />
              </div>
              <Input label="6-Digit Code" name="mfaCode" type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} icon={<FiLock />} placeholder="000000" className="text-center tracking-[1em] text-xl font-bold" />
              <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="!bg-nexus-primary hover:!bg-nexus-secondary !text-black font-bold">Verify & Login</Button>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setMfaRequired(false)} className="text-sm text-nexus-muted hover:text-white transition-colors">Back to Login</button>
              </div>
            </form>
          )}

          {!mfaRequired && (
            <p className="text-center text-nexus-muted mt-8 text-sm">
              Don't have an account? <Link to="/register" className="text-nexus-primary font-semibold hover:text-white transition-colors">Register here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;