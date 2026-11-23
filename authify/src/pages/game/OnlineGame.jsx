// src/pages/game/OnlineGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import { FiArrowLeft, FiUsers, FiAward, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { connectWebSocket, subscribeToRoom, sendMessage, disconnectWebSocket } from '../../api/websocket';
import Square from '../../components/game/Square';
import confetti from 'canvas-confetti';
import {
  playClick,
  playWin,
  playGameOver,
  startBgm,
  stopBgm,
  isMuted,
  setMuted
} from '../../utils/sound';

const MODAL_DELAY_MS = 600;

const OnlineGame = () => {
  const { user } = useAuth();

  const [isConnected, setIsConnected] = useState(false);
  const [viewState, setViewState] = useState('menu');
  const [roomId, setRoomId] = useState('');
  const [tempRoomId, setTempRoomId] = useState('');
  const [playerSymbol, setPlayerSymbol] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [muted, setMutedState] = useState(isMuted());

  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const currentRoomSubscription = useRef(null);
  const isMounted = useRef(false); // Strict Mode Fix
  const playerSymbolRef = useRef(''); // subscription callback me latest symbol ke liye
  const modalTimerRef = useRef(null);

  const updateSymbol = (symbol) => {
    playerSymbolRef.current = symbol;
    setPlayerSymbol(symbol);
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    connectWebSocket(
      () => setIsConnected(true),
      () => setErrorMsg('Failed to connect to server.')
    );

    return () => {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
      stopBgm();
      disconnectWebSocket();
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F97316', '#FCD34D', '#FFFFFF']
    });
  };

  const handleGameOver = (message) => {
    const mySymbol = playerSymbolRef.current;
    const gameWinner = message.winner || 'DRAW';

    setWinner(gameWinner);
    setWinningLine(message.winningLine || []);

    // Result modal thodi der baad, taaki dono players aakhri move dekh sakein
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => {
      setShowVictoryModal(true);
      if (gameWinner === mySymbol) {
        playWin();
        triggerConfetti();
      } else {
        playGameOver();
      }
    }, MODAL_DELAY_MS);
  };

  const joinRoom = (id) => {
    if (!isConnected) {
      setErrorMsg('Not connected to server yet. Please wait.');
      return;
    }

    setErrorMsg('');
    setViewState('waiting');
    setRoomId(id);
    const playerName = user.fullName;

    playClick();
    startBgm(); // Ye user click se chal raha hai, isliye browser allow karta hai

    // Purani subscription hatao
    if (currentRoomSubscription.current) {
      currentRoomSubscription.current.unsubscribe();
    }

    currentRoomSubscription.current = subscribeToRoom(id, (message) => {
      console.log('[GAME] message:', message.type, message);

      if (message.type === 'ERROR') {
        setErrorMsg(message.message || 'Something went wrong.');
        setViewState('menu');
        setRoomId('');
        stopBgm();
      }
      else if (message.type === 'WAITING') {
        // WAITING sirf room banane wale (X) ko milta hai
        if (message.playerName === playerName) {
          updateSymbol('X');
        }
        if (message.board) setBoard(message.board);
      }
      else if (message.type === 'START') {
        // Symbol naam se tay karo, message.symbol pe bharosa mat karo
        if (message.playerX === playerName) {
          updateSymbol('X');
        } else if (message.playerO === playerName) {
          updateSymbol('O');
        }
        setBoard(message.board || Array(9).fill(null));
        setCurrentTurn(message.currentTurn || 'X');
        setViewState('playing');
        startBgm();
      }
      else if (message.type === 'MOVE') {
        playClick();
        setBoard(message.board);
        setCurrentTurn(message.currentTurn);
      }
      else if (message.type === 'GAME_OVER') {
        playClick();
        setBoard(message.board);
        setCurrentTurn(message.currentTurn);
        handleGameOver(message);
      }
      else if (message.type === 'RESET') {
        if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
        playClick();
        setBoard(message.board);
        setCurrentTurn('X');
        setWinner(null);
        setWinningLine([]);
        setShowVictoryModal(false);
      }
    });

    // Join message bhejo
    sendMessage(id, 'join', { playerName });
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    joinRoom(newRoomId);
  };

  const handleJoinRoomSubmit = (e) => {
    e.preventDefault();
    if (!tempRoomId.trim()) return setErrorMsg('Please enter a Room Code');
    joinRoom(tempRoomId.trim().toUpperCase());
  };

  const handleSquareClick = (index) => {
    if (winner || board[index] !== null || currentTurn !== playerSymbol) return;
    sendMessage(roomId, 'move', {
      position: index,
      symbol: playerSymbol,
      playerName: user.fullName
    });
  };

  const handlePlayAgain = () => {
    sendMessage(roomId, 'reset', {});
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-nexus-text font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <Link to="/dashboard" className="text-nexus-muted hover:text-white flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <FiArrowLeft /> Back
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-widest uppercase">Online Arena</h1>
            <div className="w-24 flex justify-end">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute sound' : 'Mute sound'}
                className="text-nexus-muted hover:text-white bg-white/5 p-3 rounded-full border border-white/5 transition-colors"
              >
                {muted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
            </div>
          </div>

          <div className="bg-[#171717]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative">

            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                <span className="text-sm text-nexus-muted">{isConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
              {roomId && (
                <div className="text-sm font-mono bg-white/5 px-3 py-1 rounded-md border border-white/10">
                  Room: {roomId}
                </div>
              )}
            </div>

            {errorMsg && <div className="mb-6 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-center">{errorMsg}</div>}

            {viewState === 'menu' && (
              <div className="space-y-6 animate-fade-in text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Play with a Friend</h2>
                <p className="text-nexus-muted mb-8">Create a room or join one using a code.</p>

                <Button onClick={handleCreateRoom} variant="primary" fullWidth className="py-4" disabled={!isConnected}>
                  <FiUsers className="mr-2" /> Create New Room
                </Button>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-white/10 flex-grow"></div>
                  <span className="text-nexus-muted text-sm uppercase">Or</span>
                  <div className="h-px bg-white/10 flex-grow"></div>
                </div>

                <form onSubmit={handleJoinRoomSubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={tempRoomId}
                    onChange={(e) => setTempRoomId(e.target.value)}
                    className="flex-grow px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-nexus-primary transition-all uppercase"
                    maxLength={6}
                  />
                  <Button type="submit" variant="glass" className="px-8 border-white/10" disabled={!isConnected}>
                    Join
                  </Button>
                </form>
              </div>
            )}

            {viewState === 'waiting' && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nexus-primary/10 flex items-center justify-center animate-bounce">
                  <FiUsers className="text-4xl text-nexus-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Waiting for Opponent...</h2>
                <p className="text-nexus-muted mb-6">Share this code with your friend:</p>
                <div className="text-5xl font-mono font-bold text-nexus-secondary tracking-widest bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
                  {roomId}
                </div>
              </div>
            )}

            {viewState === 'playing' && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className={`text-2xl font-bold ${currentTurn === playerSymbol ? 'text-nexus-primary' : 'text-nexus-secondary'}`}>
                    {winner
                      ? (winner === 'DRAW' ? "It's a Draw!" : winner === playerSymbol ? 'You Won!' : 'You Lost!')
                      : currentTurn === playerSymbol ? 'Your Turn!' : "Opponent's Turn..."}
                  </h2>
                  <p className="text-sm text-nexus-muted mt-1">You are playing as <span className="font-bold text-white">{playerSymbol}</span></p>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl shadow-2xl mx-auto w-fit">
                  {board.map((sq, i) => (
                    <Square
                      key={i}
                      value={sq}
                      onClick={() => handleSquareClick(i)}
                      isWinningSquare={winningLine.includes(i)}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />

      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-[#171717] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nexus-primary/10 flex items-center justify-center">
              <FiAward className="text-4xl text-nexus-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {winner === 'DRAW' ? "It's a Draw!" : winner === playerSymbol ? 'You Won! 🎉' : 'You Lost! 💀'}
            </h2>
            <p className="text-nexus-muted mb-8">
              {winner === 'DRAW' ? 'Nobody wins this time.' : `Winner: ${winner === playerSymbol ? 'You' : 'Opponent'}`}
            </p>
            <Button onClick={handlePlayAgain} variant="primary" fullWidth>
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineGame;