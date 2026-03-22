"use client";

// ============================================================
// BottomNav — Fixed bottom navigation bar
// Auto-detects active tab from current pathname (next-intl)
// Shows current child avatar when logged in
// ============================================================

import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import { MaterialIcon } from "./TopNav";
import { useChildDashboardData } from "@/hooks/useChildDashboardData";

type NavTab = {
  label: string;
  icon: string;
  href: string;
  activeColor?: string;
};

interface BottomNavProps {
  variant?: "child" | "parent";
}

const CHILD_TABS: NavTab[] = [
  {
    label: "Home",
    icon: "home_app_logo",
    href: "/",
    activeColor: "bg-[#38BDF8]",
  },
  {
    label: "Adventures",
    icon: "explore",
    href: "/adventures",
    activeColor: "bg-[#38BDF8]",
  },
  {
    label: "Dreams",
    icon: "cloud",
    href: "/dreams",
    activeColor: "bg-[#38BDF8]",
  },
  {
    label: "Moments",
    icon: "favorite",
    href: "/moments",
    activeColor: "bg-[#38BDF8]",
  },
];

const PARENT_TABS: NavTab[] = [
  { label: "Home", icon: "home", href: "/parent", activeColor: "bg-[#38BDF8]" },
  {
    label: "Adventures",
    icon: "explore",
    href: "/parent/adventures",
    activeColor: "bg-[#38BDF8]",
  },
  {
    label: "Dreams",
    icon: "auto_awesome",
    href: "/parent/dreams",
    activeColor: "bg-[#38BDF8]",
  },
  {
    label: "Moments",
    icon: "auto_stories",
    href: "/parent/moments",
    activeColor: "bg-[#38BDF8]",
  },
];

// Determine active tab label from pathname
function getActiveTabLabel(pathname: string, tabs: NavTab[]): string {
  // Exact match first
  const exact = tabs.find((t) => t.href === pathname);
  if (exact) return exact.label;

  // Prefix match (e.g. /adventures → Adventures)
  const prefix = tabs.find((t) => pathname.startsWith(t.href + "/"));
  if (prefix) return prefix.label;

  // Default to Home
  return tabs[0].label;
}

export function BottomNav({ variant }: BottomNavProps) {
  const pathname = usePathname();
  const { childName, isChildrenLoading } = useChildDashboardData();

  const activeRole = variant ?? "child";
  const tabs = activeRole === "parent" ? PARENT_TABS : CHILD_TABS;
  const activeTab = getActiveTabLabel(pathname, tabs);

  return (
    <nav
      className="
        fixed bottom-0 left-0 w-full z-50
        flex justify-around items-center
        px-1 sm:px-2 md:px-4 pb-2 sm:pb-3 md:pb-5 pt-1.5 sm:pt-2 md:pt-3
        bg-white/95 backdrop-blur-sm
        border-t-2 sm:border-t-3 md:border-t-4 border-[#1C1917]
        rounded-t-2xl sm:rounded-t-3xl
        shadow-[0_-2px_0px_#1C1917] sm:shadow-[0_-3px_0px_#1C1917] md:shadow-[0_-4px_0px_#1C1917]
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
              px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl md:rounded-2xl
              transition-all duration-150 active:scale-90
              ${
                isActive
                  ? `${tab.activeColor} text-white`
                  : "text-[#1C1917] hover:bg-[#BAE6FD]"
              }
            `}
          >
            {/* Show child avatar on active home tab */}
            {isActive && tab.href === "/" && childName && !isChildrenLoading ? (
              <div className="relative">
                <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                  <span className="text-[#0284C8] text-xs sm:text-sm font-black">
                    {childName[0].toUpperCase()}
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-green-400 rounded-full border border-sm sm:border-2 border-white" />
              </div>
            ) : (
              <MaterialIcon
                icon={tab.icon}
                filled={isActive}
                className="!text-lg sm:!text-xl md:!text-2xl"
              />
            )}
            <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-0.5">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
