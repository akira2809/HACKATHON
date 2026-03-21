'use client';

import React, { useState, useEffect } from 'react';
import { MaterialIcon } from './TopNav';
import { ComicCard } from './ComicCard';
import { ComicButton } from './Button';

/* ============================================================
   Modal — Backdrop modal with comic styling
   ============================================================ */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const maxWidth = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }[size];

  return (
    <div
      className={`
        fixed inset-0 z-[100]
        flex items-center justify-center p-4
        transition-all duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ backgroundColor: 'rgba(28,25,23,0.4)' }}
      onClick={onClose}
    >
      <div
        className={`
          bg-white comic-border comic-shadow
          rounded-[2rem] overflow-visible
          relative flex flex-col items-center p-8
          text-center z-50
          w-full ${maxWidth}
          transform transition-transform
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
        style={{ transform: isOpen ? undefined : 'scale(0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   ConfirmationModal — Adventure welcome modal (Screen 7)
   ============================================================ */

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  dismissText?: string;
  mascotSrc?: string;
  decorationIcon?: string;
  decorationColor?: string;
}

export function ConfirmationModal({
  isOpen,
  onConfirm,
  onDismiss,
  title = 'Ready for an adventure?',
  description = 'Your garden is waiting for its first magical seeds! Shall we begin?',
  confirmText = "LET'S GO! 🚀",
  dismissText = 'Not right now',
  mascotSrc,
  decorationIcon = 'park',
  decorationColor = 'bg-[#34D399]',
}: ConfirmationModalProps) {
  const defaultMascot = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnBrgWHXMLqCU5zBLdyhyq4jSjAPA5_W_K3HEfECp5jwnZbBCvVDbuN875FOeDnN4bQQc9aBEJgPBfyGoK9XnGE95B3v9ojDUfSUwdUmnqhE1BVpD4cCk7EcQq_VHNA3jODrniR5bShdZaeZHVvC4DmulipFvv0KnjxCUcT_T60NFq2HGtaRfA8nkcLcOjfvazQmBsXxhaS0y1iiaBOsEZjHKXgIpv70ugmblSczhdZxXNKW1zoSeeBchLEGJ8ZGlUdTfSQnmlDEhC';

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onDismiss} size="md">
      {/* Floating mascot */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40">
        <img
          src={mascotSrc ?? defaultMascot}
          alt="Lena the flower nymph cheering"
          className="w-full h-full object-contain drop-shadow-[0_8px_0_rgba(28,25,23,1)]"
        />
      </div>

      <div className="mt-16 w-full">
        {/* Magic icon */}
        <div className="flex justify-center mb-2">
          <MaterialIcon icon="auto_awesome" filled className="text-[#A855F7] !text-3xl animate-sparkle" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-[#1C1917] uppercase tracking-tight leading-none mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-[#1C1917] font-bold text-lg opacity-80 mb-8 leading-tight">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4 w-full">
          <ComicButton
            variant="gold"
            size="lg"
            fullWidth
            onClick={onConfirm}
            className="comic-shadow-gold"
          >
            {confirmText}
          </ComicButton>

          <button
            onClick={onDismiss}
            className="w-full py-3 px-6 rounded-xl hover:bg-[#F0FDFA] transition-colors"
          >
            <span className="text-[#1C1917] font-bold uppercase tracking-widest text-sm opacity-60">
              {dismissText}
            </span>
          </button>
        </div>
      </div>

      {/* Floating decorations */}
      <div
        className={`
          absolute -bottom-6 -right-6 w-14 h-14
          ${decorationColor} comic-border-2 comic-shadow-sm
          rounded-2xl flex items-center justify-center
          rotate-12
        `}
      >
        <MaterialIcon icon={decorationIcon} filled className="text-white !text-2xl" />
      </div>
      <div
        className="
          absolute -top-4 -left-4 w-12 h-12
          bg-[#FB7185] comic-border-2 comic-shadow-sm
          rounded-full flex items-center justify-center
          -rotate-12
        "
      >
        <MaterialIcon icon="stars" filled className="text-white !text-xl" />
      </div>
    </Modal>
  );
}

/* ============================================================
   QuestStartModal — Confirm before starting a quest
   ============================================================ */

interface QuestStartModalProps {
  isOpen: boolean;
  questTitle: string;
  questDescription?: string;
  questIcon: string;
  questCategory?: string;
  reward: number;
  durationMinutes?: number;
  onStart: () => void;
  onClose: () => void;
}

export function QuestStartModal({
  isOpen,
  questTitle,
  questDescription,
  questIcon,
  questCategory,
  reward,
  durationMinutes = 120,
  onStart,
  onClose,
}: QuestStartModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {/* Floating mascot */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnBrgWHXMLqCU5zBLdyhyq4jSjAPA5_W_K3HEfECp5jwnZbBCvVDbuN875FOeDnN4bQQc9aBEJgPBfyGoK9XnGE95B3v9ojDUfSUwdUmnqhE1BVpD4cCk7EcQq_VHNA3jODrniR5bShdZaeZHVvC4DmulipFvv0KnjxCUcT_T60NFq2HGtaRfA8nkcLcOjfvazQmBsXxhaS0y1iiaBOsEZjHKXgIpv70ugmblSczhdZxXNKW1zoSeeBchLEGJ8ZGlUdTfSQnmlDEhC"
          alt="Lena the flower nymph"
          className="w-full h-full object-contain drop-shadow-[0_8px_0_rgba(28,25,23,1)]"
        />
      </div>

      <div className="mt-16 w-full">
        {/* Magic icon */}
        <div className="flex justify-center mb-2">
          <MaterialIcon icon="auto_awesome" filled className="text-[#A855F7] !text-3xl animate-sparkle" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-[#1C1917] uppercase tracking-tight leading-none mb-4">
          Ready to Start?
        </h1>

        {/* Quest info card */}
        <div className="bg-[#F0FDF4] comic-border-2 p-4 rounded-2xl mb-4 text-left">
          <div className="flex items-center gap-3 mb-2">
            <MaterialIcon icon={questIcon} className="!text-3xl text-[#059669]" />
            <div>
              <p className="font-black text-[#1C1917] text-sm">{questTitle}</p>
              {questCategory && (
                <p className="text-[10px] font-bold uppercase text-[#059669]">{questCategory}</p>
              )}
            </div>
          </div>
          {questDescription && (
            <p className="text-xs font-bold text-[#3e484f]">{questDescription}</p>
          )}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#A7F3D0]">
            <span className="text-[10px] font-black uppercase text-[#CA8A04]">
              +{reward} Seeds
            </span>
            <span className="text-[10px] font-black uppercase text-[#F472B6]">
              ⏱ {durationMinutes} min
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#1C1917] font-bold text-lg opacity-80 mb-6 leading-tight">
          Are you ready? Once you start, the clock will begin ticking!
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <ComicButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={onStart}
            className="bg-[#38BDF8] hover:bg-[#0EA5E9] comic-shadow"
          >
            LET'S GO! 🚀
          </ComicButton>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl hover:bg-[#F0FDFA] transition-colors"
          >
            <span className="text-[#1C1917] font-bold uppercase tracking-widest text-sm opacity-60">
              Not yet
            </span>
          </button>
        </div>
      </div>

      {/* Floating decorations */}
      <div
        className="
          absolute -bottom-6 -right-6 w-14 h-14
          bg-[#34D399] comic-border-2 comic-shadow-sm
          rounded-2xl flex items-center justify-center
          rotate-12
        "
      >
        <MaterialIcon icon="flag" filled className="text-white !text-2xl" />
      </div>
      <div
        className="
          absolute -top-4 -left-4 w-12 h-12
          bg-[#FB7185] comic-border-2 comic-shadow-sm
          rounded-full flex items-center justify-center
          -rotate-12
        "
      >
        <MaterialIcon icon="stars" filled className="text-white !text-xl" />
      </div>
    </Modal>
  );
}

/* ============================================================
   RecommendationModal — Recommendations popup (Screen 7)
   ============================================================ */

interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: RecommendationItem[];
  onSelect: (id: string) => void;
}

export function RecommendationModal({
  isOpen,
  onClose,
  recommendations,
  onSelect,
}: RecommendationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C1917]/60"
      onClick={onClose}
    >
      <div
        className="
          bg-white comic-border comic-shadow
          rounded-[2.5rem] w-full max-w-md
          relative overflow-hidden
          transform -rotate-1
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            bg-[#FB7185] text-white comic-border-2
            w-10 h-10 rounded-full
            flex items-center justify-center
            hover:scale-110 active:scale-95
            transition-transform z-10
          "
        >
          <MaterialIcon icon="close" className="font-black !text-base" />
        </button>

        {/* Header */}
        <div className="bg-[#BAE6FD] p-6 border-b-4 border-[#1C1917] flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E9D5FF] comic-border-2 overflow-hidden flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD43Ak8jrM1vR43A58_wI-I7HzU2BCesFqsPV-OJPv5r7kYWMHaVokI7ZV6fjXkqmgUF9IkxsBC75C8RPpJY8zHscq-O0zePLLKr8u2XVYDvrGc-MjkHxDvvQ_aOOWBOFD1Ejgtjo5eenjrOwR-smQmqR30Du3jS3BO98erZ_TKsPuiwWqDgiQHXn6pVHGSQFabcpqIBu-PG3N5_KF6PJvDGfrfvGNe4_iP1xVcpgkM2B8HXR3vrQ56MY2QCyRlKYfZL77Nu97JnJEd"
              alt="Lena"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1C1917] uppercase tracking-tight">
              Lena's Recommendations
            </h2>
            <p className="text-xs font-bold text-[#0284C7]">Pick your next adventure!</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 space-y-4">
          {recommendations.map((rec, i) => (
            <div
              key={rec.id}
              className={`
                ${rec.bgColor} comic-border-2 p-4 rounded-2xl
                flex items-center justify-between
                transform ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}
              `}
            >
              <div className="flex items-center gap-3">
                <MaterialIcon icon={rec.icon} className={`!text-3xl ${rec.color}`} />
                <div>
                  <p className="font-black text-sm">{rec.title}</p>
                  <p className={`text-[10px] font-bold uppercase ${rec.color}`}>
                    {rec.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelect(rec.id)}
                className="
                  bg-white comic-border-2 comic-shadow
                  px-3 py-1.5 rounded-xl
                  font-black text-xs
                  hover:bg-[#38BDF8] hover:text-white
                  transition-colors
                "
              >
                Let's Go!
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 text-center">
          <p className="text-[10px] font-bold italic text-slate-500">
            Click an activity to start earning XP!
          </p>
        </div>
      </div>
    </div>
  );
}
