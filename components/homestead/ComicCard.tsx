'use client';

import React from 'react';
import { MaterialIcon } from './TopNav';

/* ============================================================
   ComicCard — Base card with comic styling
   ============================================================ */

interface ComicCardProps {
  children: React.ReactNode;
  className?: string;
  skew?: 'left' | 'right' | 'none';
  shadow?: 'default' | 'gold' | 'pink' | 'mint' | 'magic' | 'none';
  bg?: 'white' | 'yellow' | 'pink' | 'blue' | 'mint' | 'purple';
  borderRadius?: 'xl' | '2xl' | '3xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

const bgMap: Record<NonNullable<ComicCardProps['bg']>, string> = {
  white: 'bg-white',
  yellow: 'bg-[#FEF08A]',
  pink: 'bg-[#FECDD3]',
  blue: 'bg-[#BAE6FD]',
  mint: 'bg-[#A7F3D0]',
  purple: 'bg-[#E9D5FF]',
};

const shadowMap: Record<NonNullable<ComicCardProps['shadow']>, string> = {
  default: 'comic-shadow',
  gold: 'comic-shadow-gold',
  pink: 'comic-shadow-pink',
  mint: 'comic-shadow-mint',
  magic: 'comic-shadow-magic',
  none: '',
};

export function ComicCard({
  children,
  className = '',
  skew = 'none',
  shadow = 'default',
  bg = 'white',
  borderRadius = '2xl',
  padding = 'md',
  onClick,
  style,
}: ComicCardProps) {
  const radiusMap = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const paddingMap = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const skewClass = skew === 'left' ? 'skew-panel' : skew === 'right' ? 'skew-panel-reverse' : '';

  return (
    <div
      className={`
        comic-border ${bgMap[bg]} ${shadowMap[shadow]}
        ${radiusMap[borderRadius]} ${paddingMap[padding]}
        ${skewClass} ${skewClass && 'origin-center'}
        ${onClick ? 'cursor-pointer hover:scale-[1.01] transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

/* ============================================================
   StatCard — Small stat/metric card (used in grids)
   ============================================================ */

interface StatCardProps {
  icon: string;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string | number;
  bg?: ComicCardProps['bg'];
  shadow?: ComicCardProps['shadow'];
}

export function StatCard({
  icon,
  iconColor = 'text-[#1C1917]',
  iconBg = 'bg-white',
  label,
  value,
  bg = 'white',
  shadow = 'default',
}: StatCardProps) {
  return (
    <ComicCard bg={bg} shadow={shadow} padding="md">
      <div className="flex items-center gap-3">
        <div className={`${iconBg} comic-border-2 p-2 rounded-xl`}>
          <MaterialIcon icon={icon} filled className={`!text-xl ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-[#1C1917] opacity-70">{label}</p>
          <p className="text-2xl font-black text-[#1C1917]">{value}</p>
        </div>
      </div>
    </ComicCard>
  );
}

/* ============================================================
   BentoGrid — Bento-style layout grid
   ============================================================ */

interface BentoGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BentoGrid({ children, cols = 2, gap = 'md', className = '' }: BentoGridProps) {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
  const gapMap = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' };

  return (
    <div className={`grid ${colMap[cols]} ${gapMap[gap]} ${className}`}>
      {children}
    </div>
  );
}
