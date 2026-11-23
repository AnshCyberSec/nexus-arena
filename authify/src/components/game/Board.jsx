// src/components/game/Board.jsx
import React, { useState, useEffect, useRef } from 'react';
import Square from './Square';
import Button from '../common/Button';
import { FiRefreshCw, FiUser, FiAward, FiX, FiAlertCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Sounds import
import clickSoundFile from '../../assets/sounds/click.mp3';
import winSoundFile from '../../assets/sounds/win.mp3';
import bgmSoundFile from '../../assets/sounds/bgm.mp3';
import gameOverSoundFile from '../../assets/sounds/gameover.mp3';

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [players, setPlayers] = useState({ X: '', O: '' }); // Ab default nahi hai
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [tempNames, setTempNames] = useState({ X: '', O: '' });

  // Validation Error State
  const [nameError, setNameError] = useState('');

  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const clickAudio = useRef(new Audio(clickSoundFile));
  const winAudio = useRef(new Audio(winSoundFile));
  const gameOverAudio = useRef(new Audio(gameOverSoundFile));
  const bgmAudio = useRef(new Audio(bgmSoundFile));

  useEffect(() => {
    bgmAudio.current.loop = true;
    bgmAudio.current.volume = 0.2;
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#F97316', '#FCD34D', '#FFFFFF']
      });
      confetti({
        particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#F97316', '#FCD34D', '#FFFFFF']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const calculateWinner = (sq) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
        return { winner: sq[a], line: lines[i] };
      }
    }
    return null;
  };

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];
  const isDraw = !winner && squares.every((sq) => sq !== null);

  useEffect(() => {
    if (winner || isDraw) {
      bgmAudio.current.pause();
      bgmAudio.current.currentTime = 0;

      if (winner) {
        triggerConfetti();
        winAudio.current.currentTime = 0;
        winAudio.current.play().catch(e => console.log(e));
      } else if (isDraw) {
        gameOverAudio.current.currentTime = 0;
        gameOverAudio.current.play().catch(e => console.log(e));
      }

      setTimeout(() => setShowVictoryModal(true), 500);
    }
  }, [winner, isDraw]);

  const handleClick = (i) => {
    if (winner || isDraw || squares[i]) return;

    clickAudio.current.currentTime = 0;
    clickAudio.current.play().catch(e => console.log(e));

    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setShowVictoryModal(false);

    bgmAudio.current.currentTime = 0;
    bgmAudio.current.play().catch(e => console.log(e));
  };

  const handleStartGame = (e) => {
    e.preventDefault();

    // VALIDATION LOGIC
    const player1 = tempNames.X.trim();
    const player2 = tempNames.O.trim();

    if (!player1 || !player2) {
      setNameError('Please enter names for both players.');
      return;
    }

    if (player1.length < 2 || player2.length < 2) {
      setNameError('Names must be at least 2 characters long.');
      return;
    }

    if (player1.toLowerCase() === player2.toLowerCase()) {
      setNameError('Both players cannot have the same name.');
      return;
    }

    // Agar sab theek hai
    setNameError(''); // clear error
    setPlayers({ X: player1, O: player2 });
    setIsGameStarted(true);

    bgmAudio.current.play().catch(e => console.log("Audio play failed:", e));
  };

  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center animate-slide-up w-full">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Who is playing?</h2>
        <p className="text-nexus-muted mb-8 text-sm">Enter names to start the match</p>

        {/* Error Message Display */}
        {nameError && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2 animate-pulse">
            <FiAlertCircle /> {nameError}
          </div>
        )}

        <form onSubmit={handleStartGame} className="w-full space-y-5">
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-nexus-primary" />
            <input
              type="text"
              placeholder="Player 1 Name (X)"
              value={tempNames.X}
              onChange={(e) => {
                setTempNames({ ...tempNames, X: e.target.value });
                if (nameError) setNameError('');
              }}
              className={`w-full pl-12 pr-4 py-4 bg-[#171717] border rounded-xl text-white focus:outline-none transition-all ${
                nameError && !tempNames.X.trim() ? 'border-red-500/50' : 'border-white/5 focus:border-nexus-primary'
              }`}
            />
          </div>
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-nexus-secondary" />
            <input
              type="text"
              placeholder="Player 2 Name (O)"
              value={tempNames.O}
              onChange={(e) => {
                setTempNames({ ...tempNames, O: e.target.value });
                if (nameError) setNameError('');
              }}
              className={`w-full pl-12 pr-4 py-4 bg-[#171717] border rounded-xl text-white focus:outline-none transition-all ${
                nameError && !tempNames.O.trim() ? 'border-red-500/50' : 'border-white/5 focus:border-nexus-secondary'
              }`}
            />
          </div>
          <Button type="submit" variant="primary" fullWidth className="mt-6 py-4">
            Start Match
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full relative">

      <div className="mb-8 text-center h-16 w-full flex items-center justify-center">
        {!winner && !isDraw && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Current Turn</p>
            <h2 className={`text-3xl font-bold tracking-tight ${isXNext ? 'text-nexus-primary' : 'text-nexus-secondary'}`}>
              {isXNext ? players.X : players.O}
            </h2>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl shadow-2xl relative">
        {squares.map((sq, i) => (
          <Square
            key={i}
            value={sq}
            onClick={() => handleClick(i)}
            isWinningSquare={winningLine.includes(i)}
          />
        ))}
      </div>

      {(winner || isDraw) && (
        <div className="mt-12 animate-fade-in">
          <Button onClick={handleReset} variant="glass" className="flex items-center gap-2 px-8 py-3 border-white/10 hover:border-nexus-primary/50 hover:text-nexus-primary">
            <FiRefreshCw /> Play Again
          </Button>
        </div>
      )}

      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-[#171717] border border-white/10 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-[0_0_50px_rgba(249,115,22,0.2)] relative overflow-hidden text-center transform animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-primary to-nexus-secondary"></div>
            <button
              onClick={() => setShowVictoryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center relative">
              <div className={`absolute inset-0 rounded-full blur-md opacity-20 ${winner === 'X' ? 'bg-nexus-primary' : winner === 'O' ? 'bg-nexus-secondary' : 'bg-gray-500'}`}></div>
              <FiAward className={`text-5xl relative z-10 ${winner === 'X' ? 'text-nexus-primary' : winner === 'O' ? 'text-nexus-secondary' : 'text-gray-400'}`} />
            </div>

            {winner ? (
              <>
                <h2 className="text-sm font-bold text-gray-400 mb-2 tracking-[0.3em] uppercase">Victory</h2>
                <h3 className={`text-4xl font-extrabold mb-6 break-words ${winner === 'X' ? 'text-nexus-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'text-nexus-secondary drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]'}`}>
                  {players[winner]}
                </h3>
                <p className="text-nexus-muted mb-8 text-sm">Congratulations! You have dominated the Nexus Arena.</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-white mb-2">It's a Draw!</h2>
                <p className="text-nexus-muted mb-8 text-sm">A battle of equals. Nobody backs down!</p>
              </>
            )}

            <div className="flex flex-col gap-3 relative z-10">
              <Button onClick={handleReset} variant="primary" fullWidth className="py-3">
                Play Again
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Board;