'use client';

// ============================================================
// QuestCard — Quest item with full lifecycle UI
// Status: pending | ongoing (countdown) | completed | failed | approved | pending-parent
// ============================================================

import React, { useEffect, useState } from 'react';
import { MaterialIcon } from './TopNav';

// ─── Types ───────────────────────────────────────────────────────────────────

export type QuestCategory = 'learning' | 'exercise' | 'responsibility' | 'nature' | 'default';

export type QuestStatus = 'pending' | 'ongoing' | 'completed' | 'failed' | 'approved' | 'pending-parent';

const categoryConfig: Record<
  QuestCategory,
  { bg: 'blue' | 'mint' | 'yellow' | 'pink' | 'white'; iconBg: string; iconColor: string }
> = {
  learning:     { bg: 'blue',   iconBg: 'bg-[#BAE6FD]', iconColor: 'text-[#0284C7]' },
  exercise:     { bg: 'mint',  iconBg: 'bg-[#A7F3D0]', iconColor: 'text-[#059669]' },
  responsibility: { bg: 'yellow', iconBg: 'bg-[#FEF08A]', iconColor: 'text-[#CA8A04]' },
  nature:       { bg: 'mint',  iconBg: 'bg-[#A7F3D0]', iconColor: 'text-[#059669]' },
  default:      { bg: 'white', iconBg: 'bg-[#BAE6FD]', iconColor: 'text-[#0284C7]' },
};

export interface QuestCardProps {
  id: string;
  title: string;
  description?: string;
  category?: QuestCategory;
  icon: string;
  reward: number;
  status?: QuestStatus;
  startedAt?: number;
  expiredAt?: number;
  // Callbacks
  onGo?: (id: string) => void;
  onComplete?: (id: string) => void;
  onUncomplete?: (id: string) => void;
  onFail?: (id: string) => void;
  onApprove?: (id: string) => void;
  isParent?: boolean;
  className?: string;
}

// ─── Countdown (only for ongoing) ──────────────────────────────────────────

function useCountdown(expiredAt?: number) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!expiredAt) return;

    const tick = () => {
      const diff = expiredAt - Date.now();
      if (diff <= 0) {
        setTimeLeft('0:00');
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`);
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [expiredAt]);

  return timeLeft;
}

// ─── QuestCard ───────────────────────────────────────────────────────────────

export function QuestCard({
  id,
  title,
  description,
  category = 'default',
  icon,
  reward,
  status = 'pending',
  expiredAt,
  onGo,
  onComplete,
  onUncomplete,
  onFail,
  onApprove,
  isParent = false,
  className = '',
}: QuestCardProps) {
  const config = categoryConfig[category];
  const isOngoing = status === 'ongoing';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isApproved = status === 'approved';
  const isPending = status === 'pending-parent';
  const timeLeft = useCountdown(expiredAt);

  const cardClass = `
    bg-white comic-border p-3 rounded-2xl
    flex items-center justify-between gap-4
    ${isCompleted || isApproved ? 'opacity-60 border-dashed' : 'comic-shadow'}
    ${isFailed ? 'opacity-50 border-dashed border-red-400' : ''}
    ${!isCompleted && !isFailed ? 'hover:translate-x-0.5 transition-transform' : ''}
    ${className}
  `;

  return (
    <div className={cardClass}>
      {/* ── Left: Icon + Text ───────────────────────────── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`${config.iconBg} comic-border-2 p-2 rounded-xl flex-shrink-0`}>
          <MaterialIcon icon={icon} filled className={`!text-xl ${config.iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className={`font-black text-sm uppercase truncate ${
            isCompleted || isApproved ? 'line-through text-slate-400' :
            isFailed ? 'line-through text-red-400' : 'text-[#1C1917]'
          }`}>
            {title}
          </p>
          {description && (
            <p className="text-xs font-bold text-[#3e484f] truncate">{description}</p>
          )}
          {/* Seeds reward */}
          <p className="text-[10px] font-black text-[#CA8A04] uppercase">
            +{reward} Seeds
          </p>
          {/* Countdown for ongoing */}
          {isOngoing && timeLeft && (
            <p className="text-[10px] font-black text-[#F472B6] uppercase mt-0.5">
              ⏱ {timeLeft}
            </p>
          )}
          {/* Failed label */}
          {isFailed && (
            <p className="text-[10px] font-black text-red-500 uppercase mt-0.5">
              Expired
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Action Buttons ────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Parent: approve pending quest */}
        {isParent && isPending && onApprove && (
          <button
            onClick={() => onApprove(id)}
            className="px-4 py-1.5 bg-[#34D399] comic-border-2 rounded-xl comic-shadow font-black text-white uppercase text-xs active:scale-95 transition-all"
          >
            Approve!
          </button>
        )}

        {/* Child: pending → GO */}
        {!isParent && status === 'pending' && onGo && (
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

        {/* Ongoing → Complete / Fail */}
        {isOngoing && (
          <div className="flex gap-2">
            <button
              onClick={() => onComplete?.(id)}
              className="px-3 py-1.5 bg-[#34D399] comic-border-2 rounded-xl comic-shadow font-black text-white uppercase text-xs active:scale-95 transition-all"
            >
              Done!
            </button>
            <button
              onClick={() => onFail?.(id)}
              className="px-3 py-1.5 bg-[#FB7185] comic-border-2 rounded-xl comic-shadow font-black text-white uppercase text-xs active:scale-95 transition-all"
            >
              Fail
            </button>
          </div>
        )}

        {/* Completed → uncomplete */}
        {isCompleted && onUncomplete && (
          <button
            onClick={() => onUncomplete(id)}
            className="px-3 py-1.5 bg-slate-200 comic-border-2 rounded-xl font-black text-slate-600 uppercase text-xs active:scale-95 transition-all"
          >
            Undo
          </button>
        )}

        {/* Approved check */}
        {isApproved && (
          <span className="text-[#059669] font-black uppercase flex items-center gap-1">
            <MaterialIcon icon="verified" filled className="!text-base" />
            Approved
          </span>
        )}

        {/* Done check (completed by child) */}
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

// ─── QuestList ───────────────────────────────────────────────────────────────

interface QuestListProps {
  title?: string;
  quests: Omit<QuestCardProps, 'onGo' | 'onComplete' | 'onUncomplete' | 'onFail' | 'onApprove'>[];
  onGo?: (id: string) => void;
  onComplete?: (id: string) => void;
  onUncomplete?: (id: string) => void;
  onFail?: (id: string) => void;
  onApprove?: (id: string) => void;
  isParent?: boolean;
  className?: string;
}

export function QuestList({
  title,
  quests,
  onGo,
  onComplete,
  onUncomplete,
  onFail,
  onApprove,
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
            onComplete={onComplete}
            onUncomplete={onUncomplete}
            onFail={onFail}
            onApprove={onApprove}
            isParent={isParent}
          />
        ))}
      </div>
    </div>
  );
}

// ─── QuestSection ────────────────────────────────────────────────────────────

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
      {badge && (
        <div className={`absolute -top-3 -left-2 ${badgeColor} comic-border-2 px-3 py-1 rounded-lg rotate-[-5deg]`}>
          <h2 className="text-white font-black uppercase tracking-tighter text-xs">{badge}</h2>
        </div>
      )}
      <div className="pt-4">{children}</div>
    </section>
  );
}
