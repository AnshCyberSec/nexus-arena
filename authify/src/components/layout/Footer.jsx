// src/components/layout/Footer.jsx
import React from 'react';
import { APP_NAME, APP_VERSION } from '../../utils/constants';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-auto border-t border-white/5 bg-[#0A0A0A]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Left Side: Copyright */}
          <div className="text-sm text-nexus-muted text-center md:text-left">
            &copy; {currentYear} <span className="text-nexus-primary font-bold">{APP_NAME}</span> v{APP_VERSION}. All rights reserved.
          </div>

          {/* Right Side: Socials */}
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/anshuman-dalabehera-a00727281/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#171717] text-gray-400 hover:text-[#0A66C2] rounded-full border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(10,102,194,0.3)]"
              title="LinkedIn"
            >
              <FiLinkedin size={18} />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/AnshCyberSec"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#171717] text-gray-400 hover:text-white rounded-full border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              title="GitHub"
            >
              <FiGithub size={18} />
            </a>

            {/* Email */}
            <a
              href="mailto:anshumananshuman63@gmail.com"
              className="p-2.5 bg-[#171717] text-gray-400 hover:text-red-500 rounded-full border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              title="Email"
            >
              <FiMail size={18} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;