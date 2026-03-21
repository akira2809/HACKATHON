'use client';

// ============================================================
// Layout: (homestead) — Child-facing routes
// Wraps: Home, Adventures, Dreams, Moments
// Shared: TopNav (seeds from store) + BottomNav (role from store, auto-detect tab)
// ============================================================

import { TopNav } from '@/components/homestead/TopNav';
import { BottomNav } from '@/components/homestead/BottomNav';

interface HomesteadLayoutProps {
  children: React.ReactNode;
}

export default function HomesteadLayout({ children }: HomesteadLayoutProps) {
  return (
    <>
      {/* TopNav: reads seeds from quest store automatically */}
      <TopNav />

      {children}

      {/* BottomNav: reads role from app store + auto-detects active tab from pathname */}
      <BottomNav />
    </>
  );
}
