// src/components/game/Square.jsx
import React, { useRef } from 'react';
import clickSoundFile from '../../assets/sounds/click.mp3';

const Square = ({ value, onClick, isWinningSquare }) => {
  const clickAudio = useRef(new Audio(clickSoundFile));

  const getColor = () => {
    if (value === 'X') return 'text-nexus-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]'; // Royal Orange
    if (value === 'O') return 'text-nexus-secondary drop-shadow-[0_0_15px_rgba(252,211,77,0.8)]'; // Amber Gold
    return 'text-transparent';
  };

  const handleSquareClick = () => {
    if (value === null) {
      // Chhota sa click sound effect
      clickAudio.current.currentTime = 0;
      clickAudio.current.volume = 0.3; // Thoda slow volume
      clickAudio.current.play().catch(() => {});
    }
    onClick();
  };

  return (
    <button
      onClick={handleSquareClick}
      disabled={value !== null || isWinningSquare}
      className={`
        w-24 h-24 sm:w-32 sm:h-32
        flex items-center justify-center
        bg-[#171717] border border-white/5 rounded-2xl text-5xl sm:text-7xl font-black
        transition-all duration-300 ease-in-out
        hover:bg-[#262626] hover:border-white/10
        focus:outline-none
        ${getColor()}
        ${isWinningSquare ? 'bg-white/5 border-nexus-primary/50 shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-105 z-10' : ''}
        ${value !== null ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
    >
      <span className={`${value ? 'animate-slide-up' : ''}`}>
        {value}
      </span>
    </button>
  );
};

export default Square;