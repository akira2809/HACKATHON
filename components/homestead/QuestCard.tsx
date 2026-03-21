'use client';

import React, { useState } from 'react';
import { MaterialIcon } from './TopNav';
import { ComicCard } from './ComicCard';
import { ProgressBar } from './ProgressBar';

/* ============================================================
   QuestCard — Quest item card (used in quest lists)
   ============================================================ */

export type QuestCategory = 'learning' | 'exercise' | 'responsibility' | 'nature' | 'default';

const categoryConfig: Record<
  QuestCategory,
  { bg: 'blue' | 'mint' | 'yellow' | 'pink' | 'white'; iconBg: string; iconColor: string }
> = {
  learning: { bg: 'blue', iconBg: 'bg-[#BAE6FD]', iconColor: 'text-[#0284C7]' },
  exercise: { bg: 'mint', iconBg: 'bg-[#A7F3D0]', iconColor: 'text-[#059669]' },
  responsibility: { bg: 'yellow', iconBg: 'bg-[#FEF08A]', iconColor: 'text-[#CA8A04]' },
  nature: { bg: 'mint', iconBg: 'bg-[#A7F3D0]', iconColor: 'text-[#059669]' },
  default: { bg: 'white', iconBg: 'bg-[#BAE6FD]', iconColor: 'text-[#0284C7]' },
};

interface QuestCardProps {
  id: string;
  title: string;
  description?: string;
  category?: QuestCategory;
  icon: string;
  reward: number;
  status?: 'pending' | 'approved' | 'completed' | 'pending-parent';
  onGo?: (id: string) => void;
  onApprove?: (id: string) => void;
  onComplete?: (id: string) => void;
  isParent?: boolean;
  className?: string;
}

export function QuestCard({
  id,
  title,
  description,
  category = 'default',
  icon,
  reward,
  status = 'pending',
  onGo,
  onApprove,
  onComplete,
  isParent = false,
  className = '',
}: QuestCardProps) {
  const config = categoryConfig[category];
  const isCompleted = status === 'completed';
  const isPending = status === 'pending-parent';

  return (
    <div
      className={`
        bg-white comic-border p-3 rounded-2xl
        flex items-center justify-between gap-4
        group
        ${isCompleted ? 'opacity-60 border-dashed' : 'comic-shadow'}
        ${!isCompleted ? 'hover:translate-x-0.5 transition-transform' : ''}
        ${className}
      `}
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`${config.iconBg} comic-border-2 p-2 rounded-xl flex-shrink-0`}>
          <MaterialIcon icon={icon} filled className={`!text-xl ${config.iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className={`font-black text-sm uppercase truncate ${isCompleted ? 'line-through text-slate-400' : 'text-[#1C1917]'}`}>
            {title}
          </p>
          {description && (
            <p className="text-xs font-bold text-[#3e484f] truncate">{description}</p>
          )}
          <p className="text-[10px] font-black text-[#CA8A04] uppercase">+{reward} Seeds</p>
        </div>
      </div>

      {/* Right: Action */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isParent && status === 'pending-parent' && onApprove && (
          <>
            <button
              onClick={() => onApprove(id)}
              className="
                px-4 py-1.5 bg-[#34D399] comic-border-2 rounded-xl
                comic-shadow font-black text-white uppercase text-xs
                active:scale-95 transition-all
              "
            >
              Approve!
            </button>
            <button className="p-1.5 comic-border-2 rounded-xl hover:bg-slate-100 transition-colors">
              <MaterialIcon icon="more_vert" className="!text-base text-[#1C1917]" />
            </button>
          </>
        )}

        {!isParent && (status === 'pending' || status === 'pending-parent') && onGo && (
          <button
            onClick={() => onGo(id)}
            className="
              bg-[#38BDF8] text-white comic-border-2 comic-shadow
              px-4 py-1.5 rounded-xl font-black text-xs
              hover:scale-105 active:scale-90 transition-all
            "
          >
            GO! 🚀
          </button>
        )}

        {isCompleted && (
          <span className="text-[#059669] font-black uppercase flex items-center gap-1">
            <MaterialIcon icon="check_circle" filled className="!text-base" />
            Done!
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   QuestList — Group of QuestCards with header
   ============================================================ */

interface QuestListProps {
  title?: string;
  quests: Omit<QuestCardProps, 'onGo' | 'onApprove' | 'onComplete'>[];
  onGo?: (id: string) => void;
  onApprove?: (id: string) => void;
  onComplete?: (id: string) => void;
  isParent?: boolean;
  className?: string;
}

export function QuestList({
  title,
  quests,
  onGo,
  onApprove,
  onComplete,
  isParent = false,
  className = '',
}: QuestListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h3 className="text-xl font-black text-[#1C1917] uppercase italic tracking-tight">
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            {...quest}
            onGo={onGo}
            onApprove={onApprove}
            onComplete={onComplete}
            isParent={isParent}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   QuestSection — Full quest page section with badge
   ============================================================ */

interface QuestSectionProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
  badgeColor?: string;
  className?: string;
}

export function QuestSection({
  children,
  title,
  badge,
  badgeColor = 'bg-[#FB7185]',
  className = '',
}: QuestSectionProps) {
  return (
    <section className={`relative ${className}`}>
      {/* Badge */}
      {badge && (
        <div className={`absolute -top-3 -left-2 ${badgeColor} comic-border-2 px-3 py-1 rounded-lg rotate-[-5deg]`}>
          <h2 className="text-white font-black uppercase tracking-tighter text-xs">{badge}</h2>
        </div>
      )}
      <div className="pt-4">{children}</div>
    </section>
  );
}
