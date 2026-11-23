import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { validateEmail, validatePassword, validateConfirmPassword, validateName } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiUser, FiMail, FiLock, FiArrowRight, FiHexagon } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (validateName(formData.fullName)) newErrors.fullName = validateName(formData.fullName);
    if (validateEmail(formData.email)) newErrors.email = validateEmail(formData.email);
    if (validatePassword(formData.password)) newErrors.password = validatePassword(formData.password);
    if (validateConfirmPassword(formData.password, formData.confirmPassword)) newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setIsLoading(true);
    setServerError('');
    setSuccessMsg('');

    try {
      const response = await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setSuccessMsg('Registration successful! Please check your email to verify.');
        setTimeout(() => navigate('/login'), 4000);
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative bg-[#171717] overflow-hidden items-center justify-center border-r border-white/5">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-nexus-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-nexus-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center px-12 animate-fade-in">

          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#171717] border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            <FiHexagon className="text-nexus-primary text-5xl drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
          </div>

          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Join {APP_NAME} Arena.</h1>
          <p className="text-nexus-muted text-lg max-w-md mx-auto">Experience the ultimate secure platform with built-in gaming challenges and bank-level security.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-slide-up">

          <div className="mb-10 lg:hidden text-center">
            <h2 className="text-3xl font-extrabold text-white">{APP_NAME}</h2>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-nexus-muted mb-8">Enter your details to get started.</p>

          {serverError && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{serverError}</div>}
          {successMsg && <div className="mb-6 p-4 rounded-xl bg-nexus-success/10 border border-nexus-success/20 text-nexus-success text-sm">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={<FiUser />} />
            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} icon={<FiMail />} />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} icon={<FiLock />} />
            <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<FiLock />} />

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="mt-6 group !bg-nexus-primary hover:!bg-nexus-secondary !text-black font-bold">
              Create Account <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-nexus-muted mt-8 text-sm">
            Already have an account? <Link to="/login" className="text-nexus-primary font-semibold hover:text-white transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;