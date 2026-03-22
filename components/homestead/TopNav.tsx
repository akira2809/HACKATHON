'use client';

// ============================================================
// TopNav — Fixed top navigation bar
// Reads seeds from the shared dashboard hook unless an override is provided
// ============================================================

import React from 'react';
import { useParentDashboardData } from '@/hooks/useParentDashboardData';

interface TopNavProps {
  showSeeds?: number;  // Optional override — if omitted, reads from quest store
  showLogo?: boolean;
  logoText?: string;
  logoColor?: string;
  rightIcons?: React.ReactNode;
}

export function TopNav({
  showSeeds,
  showLogo = true,
  logoText = "Lena's Homestead",
  logoColor = 'text-[#0284C7]',
  rightIcons,
}: TopNavProps) {
  const sharedDashboard = useParentDashboardData({
    syncSelectedChild: false,
  });
  const seeds = showSeeds ?? sharedDashboard.activeChild?.seeds ?? 0;

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        flex justify-between items-center
        px-4 md:px-6 h-16 md:h-20
        bg-white/95 backdrop-blur-sm
        border-b-4 border-[#1C1917]
        shadow-[4px_4px_0px_#1C1917]
      "
    >
      {/* Logo */}
      {showLogo && (
        <h1
          className={`
            text-xl md:text-2xl font-black italic uppercase tracking-tight
            ${logoColor} drop-shadow-[2px_2px_0px_#1C1917]
          `}
        >
          {logoText}
        </h1>
      )}

      {/* Spacer when logo hidden */}
      {!showLogo && <div />}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Seed counter pill — always from store */}
        <div
          className="
            flex items-center gap-1.5
            bg-[#FEF08A] comic-border-2 px-3 py-1 rounded-full
            font-black text-sm text-[#1C1917]
            skew-x-[-6deg]
          "
        >
          <MaterialIcon icon="eco" filled className="text-[#FACC15] !text-base" />
          <span>{seeds.toLocaleString()}</span>
          <span className="text-[10px] font-bold uppercase text-[#CA8A04]">Seeds</span>
        </div>

        {/* Custom icons or default icons */}
        {rightIcons ?? (
          <>
            <button className="p-2 rounded-xl text-[#1C1917] hover:bg-[#BAE6FD] transition-all active:translate-x-[2px] active:shadow-none">
              <MaterialIcon icon="notifications" className="!text-2xl" />
            </button>
            <button className="p-2 rounded-xl text-[#1C1917] hover:bg-[#BAE6FD] transition-all active:translate-x-[2px] active:shadow-none">
              <MaterialIcon icon="account_circle" filled className="!text-2xl" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

// ─── MaterialIcon helper (exported for reuse) ─────────────────────────────────

export function MaterialIcon({
  icon,
  filled = false,
  className = '',
}: {
  icon: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
      data-icon={icon}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {icon}
    </span>
  );
}
