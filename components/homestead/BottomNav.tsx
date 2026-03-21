'use client';

// ============================================================
// BottomNav — Fixed bottom navigation bar
// Auto-detects active tab from current pathname (next-intl)
// ============================================================

import Link from 'next/link';
import { usePathname } from '@/i18n/routing';
import { MaterialIcon } from './TopNav';

type NavTab = {
  label: string;
  icon: string;
  href: string;
  activeColor?: string;
};

interface BottomNavProps {
  variant?: 'child' | 'parent';
}

const CHILD_TABS: NavTab[] = [
  { label: 'Home',       icon: 'home_app_logo', href: '/',             activeColor: 'bg-[#38BDF8]' },
  { label: 'Adventures', icon: 'explore',       href: '/adventures',   activeColor: 'bg-[#38BDF8]' },
  { label: 'Dreams',     icon: 'cloud',         href: '/dreams',      activeColor: 'bg-[#38BDF8]' },
  { label: 'Moments',    icon: 'favorite',      href: '/moments',     activeColor: 'bg-[#38BDF8]' },
];

const PARENT_TABS: NavTab[] = [
  { label: 'Home',       icon: 'home',          href: '/parent',            activeColor: 'bg-[#38BDF8]' },
  { label: 'Adventures',  icon: 'explore',       href: '/parent/adventures',  activeColor: 'bg-[#38BDF8]' },
  { label: 'Dreams',     icon: 'auto_awesome',  href: '/parent/dreams',     activeColor: 'bg-[#38BDF8]' },
  { label: 'Moments',    icon: 'auto_stories',   href: '/parent/moments',    activeColor: 'bg-[#38BDF8]' },
];

// Determine active tab label from pathname
function getActiveTabLabel(pathname: string, tabs: NavTab[]): string {
  // Exact match first
  const exact = tabs.find((t) => t.href === pathname);
  if (exact) return exact.label;

  // Prefix match (e.g. /adventures → Adventures)
  const prefix = tabs.find((t) => pathname.startsWith(t.href + '/'));
  if (prefix) return prefix.label;

  // Default to Home
  return tabs[0].label;
}

export function BottomNav({ variant }: BottomNavProps) {
  const pathname = usePathname();

  const activeRole = variant ?? 'child';
  const tabs = activeRole === 'parent' ? PARENT_TABS : CHILD_TABS;
  const activeTab = getActiveTabLabel(pathname, tabs);

  return (
    <nav
      className="
        fixed bottom-0 left-0 w-full z-50
        flex justify-around items-center
        px-4 pb-8 pt-3
        bg-white/95 backdrop-blur-sm
        border-t-4 border-[#1C1917]
        rounded-t-3xl
        shadow-[0_-4px_0px_#1C1917]
      "
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`
              flex flex-col items-center justify-center
              px-3 py-1.5 rounded-2xl
              transition-all duration-150 active:scale-90
              ${isActive
                ? `${tab.activeColor} text-white`
                : 'text-[#1C1917] hover:bg-[#BAE6FD]'
              }
            `}
          >
            <MaterialIcon
              icon={tab.icon}
              filled={isActive}
              className="!text-2xl"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {tab.label}
            </span>
          </Link>
        );
      })}

    </nav>
  );
}
