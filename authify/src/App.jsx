// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';

// Note: Hum baad me Toast notifications ke liye 'react-hot-toast' use karenge.
// Filhal ke liye hum structure ready kar rahe hain.

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      <AppRoutes />
    </div>
  );
}

export default App;