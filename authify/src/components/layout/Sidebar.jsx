// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiHome, FiSettings, FiPlay, FiShield, FiGlobe } from 'react-icons/fi'; // FiGlobe add kiya online ke liye
import { ROLES } from '../../utils/constants';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes(ROLES.ADMIN);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Play Local', path: '/game', icon: <FiPlay /> }, // Purana Local Game
    { name: 'Play Online Arena', path: '/game/online', icon: <FiGlobe /> }, // Naya Online Game
    { name: 'Settings', path: '/dashboard/settings', icon: <FiSettings /> },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: <FiShield /> });
  }

  return (
    <aside className="w-72 bg-[#0A0A0A] border-r border-white/5 h-[calc(100vh-5rem)] sticky top-20 flex flex-col hidden md:flex">
      <div className="p-6 flex-grow space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard' || item.path === '/game'} // Exact match for dashboard and local game
            className={({ isActive }) => `
              relative flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 group
              ${
                isActive
                  ? 'bg-nexus-primary/10 text-nexus-primary border border-nexus-primary/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl transition-colors ${isActive ? 'text-nexus-primary' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-nexus-primary rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-semibold">Logged in as</p>
          <p className="text-sm font-medium text-nexus-text truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;