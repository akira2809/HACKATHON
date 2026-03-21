'use client';

import React from 'react';
import { MaterialIcon } from './TopNav';

/* ============================================================
   ComicButton — Primary action button with comic styling
   ============================================================ */

interface ComicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<NonNullable<ComicButtonProps['variant']>, string> = {
  primary: 'bg-[#38BDF8] text-white comic-shadow',
  secondary: 'bg-[#E9D5FF] text-[#7E22CE] comic-shadow',
  success: 'bg-[#34D399] text-white comic-shadow',
  danger: 'bg-[#FB7185] text-white comic-shadow',
  gold: 'bg-[#FACC15] text-[#1C1917] comic-shadow',
  outline: 'bg-white text-[#1C1917] comic-shadow',
};

const sizeStyles: Record<NonNullable<ComicButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-xl font-black',
  md: 'px-5 py-2.5 text-sm rounded-2xl font-black',
  lg: 'px-6 py-3 text-xl rounded-2xl font-black',
  xl: 'px-8 py-4 text-2xl rounded-3xl font-black',
};

export function ComicButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
}: ComicButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        comic-border-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-2
        active:translate-y-1 active:shadow-none
        hover:scale-[1.02] transition-all
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0
        uppercase tracking-wide
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && (
        <MaterialIcon icon={icon} filled className="!text-lg" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <MaterialIcon icon={icon} filled className="!text-lg" />
      )}
    </button>
  );
}

/* ============================================================
   LinkButton — CTA link-style button
   ============================================================ */

interface LinkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  className?: string;
}

export function LinkButton({
  children,
  onClick,
  color = 'text-[#0284C7]',
  className = '',
}: LinkButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        font-bold uppercase tracking-widest text-xs
        underline opacity-60
        hover:opacity-100 transition-opacity
        ${color} ${className}
      `}
    >
      {children}
    </button>
  );
}
