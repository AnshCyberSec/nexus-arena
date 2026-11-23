// src/pages/dashboard/Settings.jsx
import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import { FiLock, FiMail, FiShield, FiCheckCircle, FiAlertCircle, FiSmartphone } from 'react-icons/fi';

const Settings = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('password');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
  const [emailData, setEmailData] = useState({ password: '', newEmail: '' });
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [mfaCode, setMfaCode] = useState('');

  const handlePassChange = async (e) => {
    e.preventDefault();
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      await userApi.changePassword(passData);
      setMessage({ type: 'success', text: 'Password changed! You will be logged out to re-authenticate.' });
      setTimeout(() => logout(), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally { setIsLoading(false); }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      await userApi.changeEmail(emailData);
      setMessage({ type: 'success', text: 'Email updated! Please check your new inbox to verify.' });
      setEmailData({ password: '', newEmail: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change email.' });
    } finally { setIsLoading(false); }
  };

  const handleMfaSetup = async () => {
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      const res = await userApi.setupMfa();
      setMfaSetupData(res.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initiate MFA setup.' });
    } finally { setIsLoading(false); }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      await userApi.verifyMfa({ code: mfaCode });
      setMessage({ type: 'success', text: 'MFA Enabled Successfully!' });
      setMfaSetupData(null);
      setMfaCode('');
      setTimeout(() => window.location.reload(), 1500); // Reload to update user state
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid MFA code. Try again.' });
    } finally { setIsLoading(false); }
  };

  const handleMfaDisable = async () => {
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      await userApi.disableMfa();
      setMessage({ type: 'success', text: 'MFA Disabled.' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to disable MFA.' });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-nexus-text font-sans">
      <Navbar />

      <div className="flex flex-grow max-w-[1600px] mx-auto w-full">
        <Sidebar />

        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">Account Settings</h1>

          <div className="flex flex-col md:flex-row gap-8">

            {/* Sidebar Tabs */}
            <div className="w-full md:w-1/4 space-y-3">
              <button onClick={() => { setActiveTab('password'); setMessage({type:'',text:''}); }} className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium border ${activeTab === 'password' ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary shadow-[0_0_15px_rgba(217,70,239,0.1)]' : 'border-transparent hover:bg-white/5 text-nexus-muted hover:text-white'}`}>
                <FiLock /> Change Password
              </button>
              <button onClick={() => { setActiveTab('email'); setMessage({type:'',text:''}); }} className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium border ${activeTab === 'email' ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary shadow-[0_0_15px_rgba(217,70,239,0.1)]' : 'border-transparent hover:bg-white/5 text-nexus-muted hover:text-white'}`}>
                <FiMail /> Update Email
              </button>
              <button onClick={() => { setActiveTab('mfa'); setMessage({type:'',text:''}); }} className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium border ${activeTab === 'mfa' ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary shadow-[0_0_15px_rgba(217,70,239,0.1)]' : 'border-transparent hover:bg-white/5 text-nexus-muted hover:text-white'}`}>
                <FiShield /> Security (MFA)
              </button>
            </div>

            {/* Content Area */}
            <div className="w-full md:w-3/4 glass-panel rounded-2xl p-8 relative overflow-hidden min-h-[400px]">

              {/* Background Gradient Blob inside content */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-primary/5 rounded-full blur-3xl"></div>

              {message.text && (
                <div className={`mb-8 p-4 rounded-xl text-sm flex items-start gap-3 border relative z-10 ${message.type === 'success' ? 'bg-nexus-success/10 border-nexus-success/20 text-nexus-success' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <FiCheckCircle className="mt-0.5" /> : <FiAlertCircle className="mt-0.5" />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* --- Tab 1: Password --- */}
              {activeTab === 'password' && (
                <form onSubmit={handlePassChange} className="space-y-6 animate-fade-in relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
                  <p className="text-nexus-muted text-sm mb-6">Ensure your account is using a long, random password to stay secure.</p>
                  <Input label="Current Password" type="password" name="currentPassword" value={passData.currentPassword} onChange={(e) => setPassData({...passData, currentPassword: e.target.value})} icon={<FiLock />} required />
                  <Input label="New Password" type="password" name="newPassword" value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} icon={<FiLock />} required />
                  <Button type="submit" variant="primary" isLoading={isLoading} className="mt-6">Update Password</Button>
                </form>
              )}

              {/* --- Tab 2: Email --- */}
              {activeTab === 'email' && (
                <form onSubmit={handleEmailChange} className="space-y-6 animate-fade-in relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">Update Email</h2>
                  <p className="text-nexus-muted text-sm mb-6">Changing your email requires re-verification. Please enter your password to proceed.</p>
                  <Input label="New Email Address" type="email" name="newEmail" value={emailData.newEmail} onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})} icon={<FiMail />} required />
                  <Input label="Current Password" type="password" name="password" value={emailData.password} onChange={(e) => setEmailData({...emailData, password: e.target.value})} icon={<FiLock />} required />
                  <Button type="submit" variant="primary" isLoading={isLoading} className="mt-6">Update Email</Button>
                </form>
              )}

              {/* --- Tab 3: MFA --- */}
              {activeTab === 'mfa' && (
                <div className="animate-fade-in relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication (2FA)</h2>
                  <p className="text-nexus-muted text-sm mb-8">Add an extra layer of security. Once enabled, you'll need a code from your authenticator app to log in.</p>

                  {user?.mfaEnabled ? (
                    <div className="p-6 bg-nexus-success/10 border border-nexus-success/20 rounded-xl">
                      <p className="text-nexus-success font-medium mb-4 flex items-center gap-2"><FiCheckCircle /> MFA is currently enabled on your account.</p>
                      <Button type="button" variant="danger" onClick={handleMfaDisable} isLoading={isLoading}>Disable MFA</Button>
                    </div>
                  ) : mfaSetupData ? (
                    <div className="flex flex-col md:flex-row gap-8 items-center border border-white/10 p-6 rounded-xl bg-white/5">
                      <div className="bg-white p-3 rounded-2xl shadow-lg">
                        <img src={mfaSetupData.qrCodeImageUri} alt="MFA QR Code" className="w-40 h-40" />
                      </div>
                      <div className="flex-grow space-y-4">
                        <p className="text-sm text-nexus-muted">Scan the QR code with Google Authenticator, then enter the 6-digit code below to verify.</p>
                        <Input label="6-Digit Code" name="mfaCode" type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="000000" icon={<FiSmartphone />} required />
                        <Button type="button" variant="primary" onClick={handleMfaVerify} isLoading={isLoading}>Verify & Enable</Button>
                      </div>
                    </div>
                  ) : (
                    <Button type="button" variant="primary" onClick={handleMfaSetup} isLoading={isLoading} className="group">
                      <FiShield className="group-hover:animate-pulse" /> Setup MFA
                    </Button>
                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;