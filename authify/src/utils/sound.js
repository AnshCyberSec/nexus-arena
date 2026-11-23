// src/utils/sound.js
import clickSrc from '../assets/sounds/click.mp3';
import bgmSrc from '../assets/sounds/bgm.mp3';
import winSrc from '../assets/sounds/win.mp3';
import gameoverSrc from '../assets/sounds/gameover.mp3';

let muted = false;
try {
  muted = localStorage.getItem('nexusMuted') === '1';
} catch (e) {
  // localStorage na mile to ignore
}

const clickAudio = new Audio(clickSrc);
const winAudio = new Audio(winSrc);
const gameoverAudio = new Audio(gameoverSrc);
const bgmAudio = new Audio(bgmSrc);

clickAudio.volume = 0.6;
winAudio.volume = 0.8;
gameoverAudio.volume = 0.8;
bgmAudio.volume = 0.25;
bgmAudio.loop = true;

let bgmWanted = false;

const playOnce = (audio) => {
  if (muted) return;
  audio.currentTime = 0;
  audio.play().catch((err) => console.warn('[SOUND] play blocked:', err.message));
};

export const isMuted = () => muted;

export const setMuted = (value) => {
  muted = value;
  try {
    localStorage.setItem('nexusMuted', value ? '1' : '0');
  } catch (e) {
    // ignore
  }
  if (muted) {
    bgmAudio.pause();
  } else if (bgmWanted) {
    bgmAudio.play().catch(() => {});
  }
};

export const startBgm = () => {
  bgmWanted = true;
  if (muted) return;
  if (bgmAudio.paused) {
    bgmAudio.play().catch((err) => console.warn('[SOUND] bgm blocked:', err.message));
  }
};

export const stopBgm = () => {
  bgmWanted = false;
  bgmAudio.pause();
  bgmAudio.currentTime = 0;
};

export const playClick = () => playOnce(clickAudio);
export const playWin = () => playOnce(winAudio);
export const playGameOver = () => playOnce(gameoverAudio);