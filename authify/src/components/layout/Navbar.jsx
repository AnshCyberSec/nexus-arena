import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiLogOut, FiUser, FiHexagon } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#171717] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all duration-300">
                <FiHexagon className="text-nexus-primary text-2xl drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight group-hover:text-nexus-primary transition-colors">
                {APP_NAME}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* PROFILE - ROYAL ORANGE ACCENT */}
            <Link to="/dashboard/settings" className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#171717] hover:bg-[#262626] border border-white/5 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexus-primary to-nexus-secondary flex items-center justify-center text-black font-extrabold shadow-inner">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white hidden sm:block">
                {user?.fullName || 'User'}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-nexus-primary bg-[#171717] hover:bg-nexus-primary/10 rounded-full border border-white/5 hover:border-nexus-primary/30 transition-all duration-300 focus:outline-none"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;