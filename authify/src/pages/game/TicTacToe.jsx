// src/pages/game/TicTacToe.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Board from '../../components/game/Board';
import { FiArrowLeft } from 'react-icons/fi';

const TicTacToe = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-nexus-text overflow-hidden relative font-sans">

      {/* Background Ambient Glowing Orbs (Nexus Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-nexus-primary/15 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-nexus-secondary/15 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-nexus-primary/5 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }}></div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-2xl">

          {/* Header & Back Link */}
          <div className="mb-8 flex justify-between items-center">
            <Link
              to="/dashboard"
              className="text-nexus-muted hover:text-white flex items-center gap-2 transition-all duration-300 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/5 hover:border-white/10 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">
              Nexus Arena
            </h1>
            <div className="w-24"></div> {/* Spacer for centering title */}
          </div>

          {/* Game Container (Premium Glassmorphism) */}
          <div className="bg-[#18181B]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_80px_rgba(217,70,239,0.1)] relative overflow-hidden">

            {/* Decorative Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-nexus-primary to-transparent opacity-50"></div>

            <Board />
          </div>

          {/* Footer text inside the game page */}
          <p className="text-center text-nexus-muted text-sm mt-8">
            Challenge your friends in the ultimate battle of wits.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TicTacToe;