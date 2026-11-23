// src/components/common/Modal.jsx
import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // Jab modal open ho, toh background scroll rok do
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#1e293b] border border-slate-700/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden transform transition-all animate-fade-in-up">

        {/* Decorative Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-all duration-300 focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-slate-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[#0f172a]/50 border-t border-slate-700/50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;