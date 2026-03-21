'use client';

// ============================================================
// StreakBadge — Fire streak indicator
// Shows: Fire icon + N Day Streak
// ============================================================

import React from 'react';
import { MaterialIcon } from './TopNav';

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Milestone configs
const MILESTONES = [3, 7, 14, 30, 60, 100] as const;

function getMilestone(streak: number): (typeof MILESTONES)[number] | null {
  return MILESTONES.find((m) => streak >= m) ?? null;
}

function getBadgeColor(streak: number): string {
  if (streak >= 60) return 'bg-gradient-to-br from-orange-500 to-red-600 text-white';
  if (streak >= 14) return 'bg-[#FB7185] text-white';
  if (streak >= 7)  return 'bg-[#FACC15] text-[#1C1917]';
  return 'bg-[#FEF08A] text-[#CA8A04]';
}

function getSizeClasses(size: StreakBadgeProps['size']): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-xs gap-1';
    case 'lg': return 'px-6 py-3 text-2xl gap-2';
    default:   return 'px-4 py-2 text-base gap-1.5';
  }
}

export function StreakBadge({ streak, className = '', size = 'md' }: StreakBadgeProps) {
  if (streak <= 0) {
    return (
      <div
        className={`inline-flex items-center rounded-full border-2 border-dashed border-slate-300 ${getSizeClasses(size)} ${className}`}
      >
        <span className="text-slate-400 font-black uppercase tracking-wider">
          No streak yet
        </span>
      </div>
    );
  }

  const milestone = getMilestone(streak);
  const bgColor = getBadgeColor(streak);
  const sizeClass = getSizeClasses(size);

  return (
    <div
      className={`
        inline-flex items-center rounded-full border-4 border-[#1C1917] comic-shadow
        ${bgColor} ${sizeClass} ${className}
        transition-all
      `}
    >
      {/* Fire icon */}
      <MaterialIcon icon="local_fire_department" className="!text-xl" />
      <span className="font-black uppercase tracking-wider">
        {streak} Day{streak !== 1 ? 's' : ''} Streak
      </span>

      {/* Milestone label */}
      {milestone && (
        <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase">
          {milestone}+
        </span>
      )}
    </div>
  );
}
