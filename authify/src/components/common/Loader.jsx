// src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ fullScreen = false, size = 'md', text = 'Processing...' }) => {
  // Sizes mapping
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Outer Glowing Ring */}
      <div className="relative">
        {/* Orange Spinner */}
        <div
          className={`${sizeClasses[size]} rounded-full border-t-transparent border-r-transparent border-b-nexus-primary border-l-nexus-primary animate-spin`}
          style={{ borderWidth: '3px' }}
        ></div>

        {/* Inner Glowing Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-nexus-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(252,211,77,0.8)]"></div>
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <p className="text-nexus-muted font-medium tracking-widest text-sm uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;