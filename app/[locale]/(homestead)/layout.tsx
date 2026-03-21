'use client';

// ============================================================
// Layout: (homestead) — Child-facing routes
// Wraps: Home, Adventures, Dreams, Moments
// Shared: TopNav + BottomNav (auto-detect active tab)
// ============================================================

import { usePathname } from '@/i18n/routing';  // ← next-intl wrapper (locale-prefix-free)
import { TopNav } from '@/components/homestead/TopNav';
import { BottomNav } from '@/components/homestead/BottomNav';

interface HomesteadLayoutProps {
  children: React.ReactNode;
}

// Map pathname segments → BottomNav activeTab labels
const TAB_MAP: Record<string, string> = {
  '/':            'Home',
  '/adventures':  'Adventures',
  '/dreams':      'Dreams',
  '/moments':     'Moments',
};

export default function HomesteadLayout({ children }: HomesteadLayoutProps) {
  // next-intl's usePathname strips locale prefix automatically
  // e.g. '/en/adventures' → '/adventures', '/vi/dreams' → '/dreams'
  const pathname = usePathname();
  const activeTab = TAB_MAP[pathname] ?? 'Home';

  return (
    <>
      <TopNav showSeeds={30} />
      {children}
      <BottomNav activeTab={activeTab} />
    </>
  );
}
