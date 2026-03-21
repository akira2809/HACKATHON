'use client';

import React from 'react';
import { MaterialIcon } from './TopNav';

interface ProgressBarProps {
  value: number;          // 0-100
  max?: number;
  label?: string;
  showCount?: boolean;
  current?: number;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showStripe?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showCount = false,
  current,
  color = 'bg-[#38BDF8]',
  bgColor = 'bg-white',
  size = 'md',
  showStripe = false,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heightMap = { sm: 'h-3', md: 'h-6', lg: 'h-8' };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-black uppercase text-[#1C1917]">{label}</span>
          {showCount && (
            <span className="text-xs font-black text-[#0284C7]">
              {current ?? value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full ${heightMap[size]}
          ${bgColor} comic-border-2 rounded-full
          overflow-hidden p-1
        `}
      >
        <div
          className={`
            h-full ${color}
            rounded-full
            border-r-4 border-[#1C1917]
            transition-all duration-500
            relative
          `}
          style={{ width: `${pct}%` }}
        >
          {showStripe && (
            <div
              className="
                absolute inset-0 opacity-30
                bg-[radial-gradient(#FFFFFF_1px,transparent_1px)]
                bg-[size:6px_6px]
              "
            />
          )}
          {/* Shiny highlight */}
          <div className="absolute top-1 left-2 h-0.5 w-1/3 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LevelProgress — Shows XP level + progress bar
   ============================================================ */

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNext: number;
  rewardName?: string;
  className?: string;
}

export function LevelProgress({
  level,
  xp,
  xpToNext,
  rewardName,
  className = '',
}: LevelProgressProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="font-black uppercase text-sm">Level {level} Explorer</span>
        <span className="font-black text-xs text-[#0284C7]">
          {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
        </span>
      </div>
      <ProgressBar value={(xp / xpToNext) * 100} size="lg" color="bg-[#F472B6]" />
      {rewardName && (
        <p className="font-black text-xs uppercase text-[#1C1917]">
          Next Prize: {rewardName}
        </p>
      )}
    </div>
  );
}
