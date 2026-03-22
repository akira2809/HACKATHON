'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MaterialIcon } from './TopNav';
import { ProgressBar } from './ProgressBar';
import { ComicCard } from './ComicCard';

/* ============================================================
   DreamGoalCard — Dream/goal progress tracker card
   ============================================================ */

interface DreamGoalCardProps {
  title: string;
  subtitle?: string;
  current: number;
  goal: number;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  message?: string;
  navigateToAdventures?: string; // Route path to navigate to (e.g., '/en/homestead/adventures')
  className?: string;
}

export function DreamGoalCard({
  title,
  subtitle,
  current,
  goal,
  icon = 'card_giftcard',
  badge,
  badgeColor = 'bg-[#CA8A04]',
  message,
  navigateToAdventures,
  className = '',
}: DreamGoalCardProps) {
  const router = useRouter();
  const pct = (current / goal) * 100;
  const remaining = goal - current;

  const handleAddSeeds = () => {
    if (navigateToAdventures) {
      router.push(navigateToAdventures);
    }
  };

  return (
    <ComicCard className={`relative overflow-hidden ${className}`}>
      {/* Badge */}
      {badge && (
        <div className="absolute top-0 right-0 bg-yellow-400 comic-border-2 px-3 py-1 font-black text-xs uppercase tracking-widest text-[#1C1917]">
          {badge}
        </div>
      )}

      {/* Icon + Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-[#FEF08A] comic-border-2 rounded-2xl flex items-center justify-center">
          <MaterialIcon icon={icon} filled className="!text-3xl text-[#CA8A04]" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#1C1917]">{title}</h2>
          {subtitle && (
            <p className="text-xs font-bold uppercase text-[#CA8A04]">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-end">
          <span className="text-[#1C1917] font-black text-xl flex items-center gap-1">
            {current}
            <MaterialIcon icon="eco" filled className="text-[#FACC15] seed-glow !text-base" />
          </span>
          <span className="text-[#1C1917] font-bold text-sm uppercase opacity-60">
            Goal: {goal}
          </span>
        </div>
        <ProgressBar value={pct} size="lg" color="bg-[#FACC15]" bgColor="bg-[#FEF08A]" />
      </div>

      {/* CTA */}
      {navigateToAdventures && (
        <button
          onClick={handleAddSeeds}
          className="
            w-full bg-[#38BDF8] text-white
            comic-border-2 comic-shadow
            py-2.5 rounded-2xl
            font-black text-sm uppercase
            active:translate-y-1 active:shadow-none
            hover:bg-[#0ea5e9] transition-all
            cursor-pointer
          "
        >
          Add More Seeds!
        </button>
      )}

      {/* Motivational message */}
      {message && (
        <div className="mt-3 flex items-center gap-2 text-[#1C1917]">
          <MaterialIcon icon={icon} filled className="text-[#CA8A04] !text-base" />
          <p className="text-xs font-bold italic">{message}</p>
        </div>
      )}
    </ComicCard>
  );
}

/* ============================================================
   StoryBadge — Badge/progress badge in bento grid
   ============================================================ */

interface StoryBadgeProps {
  label: string;
  value: string;
  subLabel?: string;
  icon: string;
  iconColor?: string;
  bgColor?: string;
  className?: string;
}

export function StoryBadge({
  label,
  value,
  subLabel,
  icon,
  iconColor = 'text-[#1C1917]',
  bgColor = 'bg-white',
  className = '',
}: StoryBadgeProps) {
  return (
    <ComicCard bg="white" className={`flex flex-col justify-between aspect-square ${className}`}>
      <MaterialIcon icon={icon} filled className={`!text-4xl ${iconColor}`} />
      <div>
        <p className="font-black text-[#1C1917] leading-tight">{value}</p>
        <p className="text-[10px] font-bold uppercase opacity-70">{subLabel ?? label}</p>
      </div>
    </ComicCard>
  );
}

/* ============================================================
   SeedHistoryItem — Seed history list item
   ============================================================ */

interface SeedHistoryItemProps {
  title: string;
  time: string;
  amount: number;
  icon: string;
  iconBg?: string;
  iconColor?: string;
}

export function SeedHistoryItem({
  title,
  time,
  amount,
  icon,
  iconBg = 'bg-[#BAE6FD]',
  iconColor = 'text-[#0284C7]',
}: SeedHistoryItemProps) {
  return (
    <div className="bg-white comic-border p-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`${iconBg} comic-border-2 p-2 rounded-xl`}>
          <MaterialIcon icon={icon} filled className={`!text-base ${iconColor}`} />
        </div>
        <div>
          <p className="font-black text-[#1C1917] text-sm">{title}</p>
          <p className="text-[10px] font-bold uppercase text-slate-400">{time}</p>
        </div>
      </div>
      <div className="font-black text-[#CA8A04] flex items-center gap-0.5">
        +{amount}
        <MaterialIcon icon="eco" filled className="text-[#FACC15] !text-sm ml-0.5" />
      </div>
    </div>
  );
}
