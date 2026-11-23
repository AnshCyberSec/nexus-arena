// src/components/common/Button.jsx
import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  icon,
}) => {
  // Base classes
  const baseClasses =
    'relative flex items-center justify-center font-bold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group tracking-wide';

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Variant classes
  const variantClasses = {
    // ROYAL ORANGE PRIMARY BUTTON
    primary:
      'bg-gradient-to-r from-[#F97316] to-[#FCD34D] text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] focus:ring-[#F97316] border border-transparent',
    // OUTLINE BUTTON
    outline:
      'bg-transparent text-[#F97316] border-2 border-[#F97316]/50 hover:border-[#F97316] hover:bg-[#F97316]/10 focus:ring-[#F97316]',
    // DANGER BUTTON
    danger:
      'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] focus:ring-red-500 border border-transparent',
    // GLASS BUTTON
    glass:
      'bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-white/10 focus:ring-white/30',
  };

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Combined classes
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {/* Animated Glow Effect on Hover */}
      <span className="absolute inset-0 w-full h-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            <span>Please wait...</span>
          </>
        ) : (
          <>
            {icon && <span className="text-xl">{icon}</span>}
            {children}
          </>
        )}
      </span>
    </button>
  );
};

export default Button;