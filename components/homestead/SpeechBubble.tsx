'use client';

import React from 'react';
import { MaterialIcon } from './TopNav';
import { ComicCard } from './ComicCard';

/* ============================================================
   Lena Mascot — Avatar component with speech bubble
   ============================================================ */

interface LenaAvatarProps {
  size?: number | string;
  src?: string;
  alt?: string;
  bgColor?: string;
  borderColor?: string;
  className?: string;
}

export function LenaAvatar({
  size = 80,
  src,
  alt = 'Lena the Flower Nymph',
  bgColor = 'bg-[#E9D5FF]',
  borderColor = '#1C1917',
  className = '',
}: LenaAvatarProps) {
  const defaultSrc = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD43Ak8jrM1vR43A58_wI-I7HzU2BCesFqsPV-OJPv5r7kYWMHaVokI7ZV6fjXkqmgUF9IkxsBC75C8RPpJY8zHscq-O0zePLLKr8u2XVYDvrGc-MjkHxDvvQ_aOOWBOFD1Ejgtjo5eenjrOwR-smQmqR30Du3jS3BO98erZ_TKsPuiwWqDgiQHXn6pVHGSQFabcpqIBu-PG3N5_KF6PJvDGfrfvGNe4_iP1xVcpgkM2B8HXR3vrQ56MY2QCyRlKYfZL77Nu97JnJEd';

  return (
    <div
      className={`
        rounded-full overflow-hidden flex-shrink-0
        ${bgColor}
      `}
      style={{
        width: size,
        height: size,
        border: `4px solid ${borderColor}`,
        boxShadow: '4px 4px 0px #1C1917',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src ?? defaultSrc}
        alt={alt}
        width={Number(size)}
        height={Number(size)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

/* ============================================================
   SpeechBubble — Mascot speech bubble with tail
   ============================================================ */

interface SpeechBubbleProps {
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  skew?: 'left' | 'right' | 'none';
  className?: string;
}

export function SpeechBubble({
  children,
  bgColor = 'bg-[#E9D5FF]',
  borderColor = '#1C1917',
  textColor = 'text-[#7E22CE]',
  skew = 'left',
  className = '',
}: SpeechBubbleProps) {
  const tailDirection = skew === 'left' ? 'left' : 'right';
  const skewClass = skew === 'left' ? 'skew-panel rounded-bl-none' : skew === 'right' ? 'skew-panel-reverse rounded-br-none' : '';

  return (
    <div className={`relative ${skewClass} ${bgColor} p-4 rounded-2xl comic-border comic-shadow ${className}`}>
      <div
        className={`
          absolute bottom-0 ${tailDirection === 'left' ? '-left-3' : '-right-3'}
          w-0 h-0
          border-t-[10px] border-t-transparent
          border-r-[16px] border-r-[${borderColor}]
          border-b-[8px] border-b-transparent
        `}
        style={{
          borderRightColor: borderColor,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      />
      {/* White inner tail */}
      <div
        className={`
          absolute bottom-0 ${tailDirection === 'left' ? '-left-2' : '-right-2'}
          w-0 h-0
          border-t-[8px] border-t-transparent
          border-r-[14px] border-r-white
          border-b-[6px] border-b-transparent
        `}
        style={{
          borderRightColor: 'white',
        }}
      />
      <p className={`font-bold text-lg leading-tight ${textColor}`}>
        {children}
      </p>
    </div>
  );
}

/* ============================================================
   MascotSection — Full mascot + speech section
   ============================================================ */

interface MascotSectionProps {
  message: string;
  avatarSize?: number;
  emoji?: string;
  className?: string;
}

export function MascotSection({
  message,
  avatarSize = 80,
  emoji,
  className = '',
}: MascotSectionProps) {
  return (
    <section className={`flex items-end gap-4 ${className}`}>
      <LenaAvatar size={avatarSize} />
      <SpeechBubble>
        {message}
        {emoji && <span className="ml-1">{emoji}</span>}
      </SpeechBubble>
    </section>
  );
}
