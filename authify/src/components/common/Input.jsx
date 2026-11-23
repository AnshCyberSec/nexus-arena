// src/components/common/Input.jsx
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder = ' ',
  icon,
  className = '',
  required = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`relative w-full mb-6 group ${className}`}>
      {/* Main Input Field */}
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          peer w-full px-4 py-3 rounded-xl bg-[#1e293b]/50 backdrop-blur-sm
          border-2 text-white text-base
          transition-all duration-300 ease-in-out
          focus:outline-none focus:bg-[#1e293b]/80
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            error
              ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'border-slate-700/50 focus:border-indigo-500 shadow-sm focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:border-slate-600'
          }
          ${icon ? 'pl-12' : 'pl-4'}
          ${isPassword ? 'pr-12' : 'pr-4'}
        `}
      />

      {/* Floating Label */}
      <label
        className={`
          absolute left-4 top-3.5 text-slate-400 pointer-events-none
          transition-all duration-300 ease-in-out
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-400 peer-focus:bg-[#0f172a] peer-focus:px-2 peer-focus:rounded-full
          peer-valid:-top-2.5 peer-valid:text-xs peer-valid:text-slate-400 peer-valid:bg-[#0f172a] peer-valid:px-2 peer-valid:rounded-full
          ${error ? 'peer-focus:text-red-400' : ''}
          ${icon ? 'left-11' : ''}
        `}
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* Left Icon */}
      {icon && (
        <div className="absolute left-4 top-3.5 text-slate-400 peer-focus:text-indigo-400 transition-colors duration-300 text-xl pointer-events-none">
          {icon}
        </div>
      )}

      {/* Password Eye Toggle Icon */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-400 transition-colors duration-300 focus:outline-none z-10"
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <p className="absolute -bottom-5 left-1 text-xs text-red-400 animate-pulse font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;