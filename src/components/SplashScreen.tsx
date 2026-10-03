"use client";

import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Session check: ensure it shows once per session or on initial load
    const hasSeenSplash = sessionStorage.getItem('has_seen_borcegui_splash');
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    // Timeline: 1.6s display + 0.4s fade out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1600);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('has_seen_borcegui_splash', 'true');
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none select-none ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Radial Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />

      {/* Brand Logo with Smooth Entrance Animation */}
      <div className="relative z-10 flex flex-col items-center space-y-6 animate-in zoom-in-90 fade-in duration-700">
        <div className="relative p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-2xl backdrop-blur-md">
          <img
            src="/logo-borcegui.png"
            alt="Borceguí Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse"
          />
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-40 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 w-full animate-in slide-in-from-left duration-1000" />
        </div>

        <p className="text-[11px] font-mono tracking-widest text-cyan-400 font-extrabold uppercase">
          CARACAS 2026
        </p>
      </div>
    </div>
  );
};
