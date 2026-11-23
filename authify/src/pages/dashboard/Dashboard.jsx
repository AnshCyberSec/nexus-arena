// src/pages/dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import { FiShield, FiCheckCircle, FiUser, FiSettings, FiPlay } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-nexus-text font-sans">
      <Navbar />

      <div className="flex flex-grow max-w-[1600px] mx-auto w-full">
        <Sidebar />

        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 overflow-y-auto">

          <div className="mb-10 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient">{user.fullName}</span>
            </h1>
            <p className="text-nexus-muted mt-2 text-lg">Here is your account overview and quick links.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-primary/10 rounded-full blur-2xl group-hover:bg-nexus-primary/20 transition-all duration-500"></div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nexus-primary to-nexus-secondary p-[2px] shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <div className="w-full h-full bg-[#171717] rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
                    <p className="text-sm text-nexus-muted">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-5 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-muted">Account Status</span>
                    <span className={`px-2.5 py-1 rounded-md font-semibold text-xs ${user.status === 'ACTIVE' ? 'bg-nexus-success/10 text-nexus-success border border-nexus-success/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-muted">Email Verified</span>
                    <span className="flex items-center gap-1.5 text-nexus-success font-medium">
                      <FiCheckCircle /> {user.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-muted">Role</span>
                    <span className="text-nexus-primary font-medium">{user.roles.join(', ').replace('ROLE_', '')}</span>
                  </div>
                </div>

                <Link to="/dashboard/settings" className="mt-6 w-full py-2.5 bg-[#171717] hover:bg-[#262626] text-white rounded-xl font-medium flex items-center justify-center gap-2 border border-white/5 hover:border-nexus-primary/30 transition-all relative z-10">
                  <FiSettings /> Account Settings
                </Link>
              </div>
            </div>

            {/* Right Column: Features & Game */}
            <div className="lg:col-span-2 space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover:border-nexus-primary/30 transition-colors">
                  <div className="p-3 bg-nexus-primary/10 rounded-xl text-nexus-primary text-2xl">
                    <FiShield />
                  </div>
                  <div>
                    <p className="text-sm text-nexus-muted font-medium">Two-Factor Auth</p>
                    <p className="text-lg font-bold text-white">{user.mfaEnabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover:border-nexus-secondary/30 transition-colors">
                  <div className="p-3 bg-nexus-secondary/10 rounded-xl text-nexus-secondary text-2xl">
                    <FiUser />
                  </div>
                  <div>
                    <p className="text-sm text-nexus-muted font-medium">Account Type</p>
                    <p className="text-lg font-bold text-white">Standard</p>
                  </div>
                </div>
              </div>

              {/* GAME CTA CARD - LINK UPDATED TO /game/online */}
              <div className="bg-gradient-to-br from-[#171717] to-[#0A0A0A] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-nexus-primary/30 transition-colors">

                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-nexus-primary/10 rounded-full blur-3xl group-hover:bg-nexus-primary/20 transition-all duration-500"></div>
                <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-nexus-secondary/5 rounded-full blur-3xl group-hover:bg-nexus-secondary/10 transition-all duration-500"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to play?</h3>
                    <p className="text-nexus-muted max-w-sm">Enter the Nexus Arena and challenge your friends online!</p>
                  </div>

                  {/* PLAY NOW BUTTON - NOW GOES TO ONLINE GAME */}
                  <Link
                    to="/game/online"
                    className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#FCD34D] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                  >
                    <FiPlay /> Play Now
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;