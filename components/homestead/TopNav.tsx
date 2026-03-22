'use client';

// ============================================================
// TopNav — Fixed top navigation bar
// Supports both Parent and Child modes
// Parent: Shows family selector + all children
// Child: Shows current child + seeds
// ============================================================

import React, { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChildDashboardData } from '@/hooks/useChildDashboardData'; 
import { useParentOfChildrenDashboardData } from '@/hooks/useParentDashboardData';
import { setChildSession } from '@/hooks/useChildSession'; 
import { setParentSession, clearParentSession } from '@/hooks/useParentSession';
import { buildLocalizedHref } from '@/lib/locale-path';

interface ChildInfo {
    id: string;
    name: string;
    childAge: number;
    coins: number;
    familyId?: string;
}

interface TopNavProps {
  showSeeds?: number;
  showLogo?: boolean;
  logoText?: string;
  logoColor?: string;
  rightIcons?: React.ReactNode;
  onModeChange?: (mode: 'parent' | 'child') => void;
}

export function TopNav({
  showSeeds,
  showLogo = true,
  logoText = "Lena's Homestead",
  logoColor = 'text-[#0284C8]',
  rightIcons,
  onModeChange,
}: TopNavProps) {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const [isParentMode, setIsParentMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Child data
  const childData = useChildDashboardData();

  // Parent data
  const parentData = useParentOfChildrenDashboardData();

  // Display values
  const displaySeeds = showSeeds ?? (isParentMode ? parentData.activeChild?.seeds ?? 0 : childData.seeds);
  const children: ChildInfo[] = isParentMode ? parentData.children : childData.children;
  const currentChild: ChildInfo | null = isParentMode
    ? (parentData.activeChild as ChildInfo | null)
    : (childData.currentChild as ChildInfo | null);
  const childName = (isParentMode ? parentData.activeChild?.name : childData.childName) || null;
  const familyName = parentData.familyName;
  const isLoading = (isParentMode ? parentData.isChildrenLoading : childData.isChildrenLoading) || parentData.isFamiliesLoading;

  // Handle mode switch - just toggle view mode, BottomNav handles routing
  const handleModeSwitch = useCallback((newMode: 'parent' | 'child') => {
    const shouldBeParent = newMode === 'parent';
    setIsProfileDropdownOpen(false);
    
    if (shouldBeParent) {
      // Switching to parent mode
      if (parentData.family) {
        setParentSession({
          parentId: 'demo-parent',
          familyId: parentData.family.id,
          parentName: 'Demo Parent',
          familyName: parentData.family.name,
        });
      }
    } else {
      // Switching to child mode - clear parent session
      clearParentSession();
    }
    
    setIsParentMode(shouldBeParent);
    onModeChange?.(newMode);
  }, [parentData, onModeChange]);

  // Handle child selection
  const handleSelectChild = useCallback((childId: string) => {
    setIsProfileDropdownOpen(false);

    if (isParentMode) {
      // In parent mode, clicking a child switches to child view mode with that child
      const child = children.find((c) => c.id === childId);
      if (child) {
        setChildSession({
          childId: child.id,
          familyId: child.familyId || parentData.familyId || '',
          childName: child.name,
          childAge: child.childAge,
        });
        clearParentSession();
        setIsParentMode(false);
        onModeChange?.('child');
        // Fetch child's data after switching
        setTimeout(() => {
          childData.refetchDashboardData?.();
        }, 0);
      }
    } else {
      // In child mode, switch child and fetch their data
      childData.selectChild(childId);
      childData.refetchDashboardData?.();
    }
    setIsDropdownOpen(false);
  }, [isParentMode, children, parentData, childData, onModeChange]);

  // Handle switch back to child from parent mode
  const handleBackToChild = useCallback(() => {
    clearParentSession();
    setIsParentMode(false);
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    onModeChange?.('child');
  }, [onModeChange]);

  // Handle parent login
  const handleParentLogin = useCallback(() => {
    if (parentData.family) {
      setParentSession({
        parentId: 'demo-parent',
        familyId: parentData.family.id,
        parentName: 'Demo Parent',
        familyName: parentData.family.name,
      });
      setIsParentMode(true);
      setIsProfileDropdownOpen(false);
      onModeChange?.('parent');
    }
  }, [parentData, onModeChange]);

  const handleOpenParentDashboard = useCallback(() => {
    if (parentData.familyId) {
      setParentSession({
        parentId: 'demo-parent',
        familyId: parentData.familyId,
        parentName: parentData.parentName ?? 'Demo Parent',
        familyName: parentData.familyName ?? 'Family Board',
      });
    }

    setIsParentMode(true);
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    onModeChange?.('parent');
    router.push(buildLocalizedHref(params.locale, '/parent'));
  }, [onModeChange, params.locale, parentData.familyId, parentData.familyName, parentData.parentName, router]);

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        flex justify-between items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4
        px-2 sm:px-3 md:px-4 lg:px-6 h-14 sm:h-16 md:h-20
        bg-white/95 backdrop-blur-sm
        border-b-2 sm:border-b-3 md:border-b-4 border-[#1C1917]
        shadow-[2px_2px_0px_#1C1917] sm:shadow-[3px_3px_0px_#1C1917] md:shadow-[4px_4px_0px_#1C1917]
      "
    >
      {/* Logo or placeholder */}
      <div className="flex-shrink-0 w-16 sm:w-20 md:w-auto">
        {showLogo && (
          <h1
            className={`
              text-sm sm:text-lg md:text-xl lg:text-2xl font-black italic uppercase tracking-tight
              ${logoColor} drop-shadow-[1px_1px_0px_#1C1917] sm:drop-shadow-[2px_2px_0px_#1C1917]
            `}
          >
            {logoText}
          </h1>
        )}
      </div>

      {/* Right side - center using flex-1 and justify-end */}
      <div className="flex items-center justify-end gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 flex-1 min-w-0">
        {/* Mode Toggle */}
        <div className="flex items-center bg-[#E5E7EB] rounded-full p-0.5 sm:p-1 flex-shrink-0">
          <button
            onClick={() => handleModeSwitch('child')}
            className={`
              px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-xs font-black transition-all whitespace-nowrap
              ${!isParentMode
                ? 'bg-[#0284C8] text-white shadow-sm'
                : 'text-[#1C1917] hover:bg-[#D8E3D1]'
              }
            `}
          >
            Child
          </button>
          <button
            onClick={() => handleModeSwitch('parent')}
            className={`
              px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-xs font-black transition-all whitespace-nowrap
              ${isParentMode
                ? 'bg-[#0284C8] text-white shadow-sm'
                : 'text-[#1C1917] hover:bg-[#D8E3D1]'
              }
            `}
          >
            Parent
          </button>
        </div>

        {/* Child/Family Selector */}
        {isParentMode ? (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="
                flex items-center gap-0.5 sm:gap-1 md:gap-2
                bg-[#BAE6FD] comic-border-2 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full
                font-black text-[9px] sm:text-xs md:text-sm text-[#1C1917]
                hover:bg-[#7DD3FC] transition-all whitespace-nowrap
              "
            >
              <div className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 rounded-full bg-[#0284C8] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] sm:text-[9px] md:text-xs font-black">👨‍👩‍👧</span>
              </div>
              <span className="hidden lg:inline max-w-[80px] truncate">
                {familyName?.substring(0, 12) || 'Family'}
              </span>
              <MaterialIcon icon="expand_more" className="!text-sm sm:!text-base md:!text-base flex-shrink-0" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsProfileDropdownOpen(false);
                  }}
                />
                <div className="
                  absolute right-0 top-full mt-1 sm:mt-2
                  bg-white border-2 sm:border-4 border-[#1C1917] rounded-xl sm:rounded-2xl
                  shadow-[2px_2px_0px_#1C1917] sm:shadow-[4px_4px_0px_#1C1917]
                  min-w-[180px] sm:min-w-[240px] z-50 overflow-hidden
                  max-h-[60vh] overflow-y-auto
                ">
                  <div className="p-2">
                    {!parentData.hasSession && parentData.family && (
                      <button
                        onClick={handleParentLogin}
                        className="
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-left transition-all bg-[#34D399] hover:bg-[#10B981]
                          mb-2
                        "
                      >
                        <MaterialIcon icon="login" className="!text-base text-white" />
                        <span className="font-black text-sm text-white">
                          Login as Parent (Demo)
                        </span>
                      </button>
                    )}

                    <p className="text-[10px] font-black uppercase text-[#7C8E76] px-2 py-1">
                      Children
                    </p>
                    {children.length === 0 ? (
                      <p className="text-xs text-[#7C8E76] px-3 py-2">
                        No children yet
                      </p>
                    ) : (
                      children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleSelectChild(child.id)}
                          className="
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                            text-left transition-all hover:bg-[#FEF9C3]
                            border-b border-[#E5E7EB] last:border-b-0
                          "
                        >
                          <div className="w-8 h-8 rounded-full bg-[#0284C8] flex items-center justify-center font-black text-sm text-white">
                            {child.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm text-[#1C1917] truncate">{child.name}</p>
                            <p className="text-[10px] text-[#7C8E76]">{child.childAge} years old</p>
                          </div>
                          <div className="flex items-center gap-1 bg-[#FEF9C3] px-2 py-1 rounded-full">
                            <MaterialIcon icon="eco" className="!text-xs text-[#CA8A04]" />
                            <span className="text-xs font-black text-[#92400E]">{child.coins}</span>
                          </div>
                        </button>
                      ))
                    )}

                    <div className="mt-2 pt-2 border-t-2 border-[#E5E7EB]">
                      <button
                        onClick={handleBackToChild}
                        className="
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-left transition-all hover:bg-[#BAE6FD]
                        "
                      >
                        <MaterialIcon icon="person" className="!text-base text-[#0284C8]" />
                        <span className="font-black text-sm text-[#0284C8]">
                          View as Child
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => children.length > 1 && setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-0.5 sm:gap-1 md:gap-2
                bg-[#BAE6FD] comic-border-2 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full
                font-black text-[9px] sm:text-xs md:text-sm text-[#1C1917]
                transition-all whitespace-nowrap
                ${children.length > 1 ? 'hover:bg-[#7DD3FC] cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 rounded-full bg-[#0284C8] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] sm:text-[9px] md:text-xs font-black">
                  {childName?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <span className="hidden lg:inline max-w-[60px] truncate">
                {childName?.substring(0, 10) || 'Child'}
              </span>
              {children.length > 1 && (
                <MaterialIcon icon="expand_more" className="!text-sm sm:!text-base md:!text-base flex-shrink-0" />
              )}
            </button>

            {isDropdownOpen && children.length > 1 && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsProfileDropdownOpen(false);
                  }}
                />
                <div className="
                  absolute right-0 top-full mt-1 sm:mt-2
                  bg-white border-2 sm:border-4 border-[#1C1917] rounded-xl sm:rounded-2xl
                  shadow-[2px_2px_0px_#1C1917] sm:shadow-[4px_4px_0px_#1C1917]
                  min-w-[160px] sm:min-w-[200px] z-50 overflow-hidden
                  max-h-[60vh] overflow-y-auto
                ">
                  <div className="p-2">
                    <p className="text-[10px] font-black uppercase text-[#7C8E76] px-2 py-1">
                      Switch Child
                    </p>
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleSelectChild(child.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-left transition-all
                          ${child.id === currentChild?.id
                            ? 'bg-[#BAE6FD]'
                            : 'hover:bg-[#FEF9C3]'
                          }
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                          ${child.id === currentChild?.id
                            ? 'bg-[#0284C8] text-white'
                            : 'bg-[#D8E3D1] text-[#1C1917]'
                          }
                        `}>
                          {child.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-[#1C1917] truncate">{child.name}</p>
                          <p className="text-[10px] text-[#7C8E76]">{child.childAge} years old</p>
                        </div>
                        {child.id === currentChild?.id && (
                          <MaterialIcon icon="check" className="!text-base text-[#0284C8]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isLoading && (
          <div className="w-16 h-8 bg-[#E5E7EB] rounded-full animate-pulse" />
        )}

        {/* Seed counter */}
        <div
          className="
            flex items-center gap-0.5 sm:gap-1 md:gap-1.5
            bg-[#FEF08A] comic-border-2 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full
            font-black text-[9px] sm:text-xs md:text-sm text-[#1C1917]
            skew-x-[-6deg] flex-shrink-0
          "
        >
          <MaterialIcon icon="eco" filled className="text-[#FACC15] !text-sm sm:!text-base md:!text-base flex-shrink-0" />
          <span className="hidden xs:inline">{displaySeeds.toLocaleString()}</span>
          <span className="hidden xs:inline text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase text-[#CA8A04]">S</span>
        </div>

        {rightIcons ?? (
          <>
            <button className="p-0.5 sm:p-1 md:p-2 rounded-lg sm:rounded-lg md:rounded-xl text-[#1C1917] hover:bg-[#BAE6FD] transition-all flex-shrink-0">
              <MaterialIcon icon="notifications" className="!text-base sm:!text-lg md:!text-2xl" />
            </button>
            <div className="relative flex-shrink-0">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProfileDropdownOpen((current) => !current);
                }}
                className="p-0.5 sm:p-1 md:p-2 rounded-lg sm:rounded-lg md:rounded-xl text-[#1C1917] hover:bg-[#BAE6FD] transition-all flex-shrink-0"
              >
                <MaterialIcon icon="account_circle" filled className="!text-base sm:!text-lg md:!text-2xl" />
              </button>

              {isProfileDropdownOpen ? (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="
                    absolute right-0 top-full mt-1 sm:mt-2
                    min-w-[140px] z-50 overflow-hidden
                    rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#1C1917] bg-white
                    shadow-[2px_2px_0px_#1C1917] sm:shadow-[4px_4px_0px_#1C1917]
                  ">
                    <div className="p-2">
                      <button
                        onClick={handleOpenParentDashboard}
                        className="
                          flex w-full items-center gap-3 rounded-xl px-3 py-2.5
                          text-left transition-all hover:bg-[#BAE6FD]
                        "
                      >
                        <MaterialIcon icon="family_home" className="!text-base text-[#0284C8]" />
                        <span className="font-black text-sm text-[#1C1917]">
                          Parent
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export function MaterialIcon({
  icon,
  filled = false,
  className = '',
}: {
  icon: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
      data-icon={icon}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {icon}
    </span>
  );
}
