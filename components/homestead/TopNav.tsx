'use client';

// ============================================================
// TopNav — Fixed top navigation bar
// Supports both Parent and Child modes
// Parent: Shows family selector + all children
// Child: Shows current child + seeds
// ============================================================

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChildDashboardData } from '@/hooks/useChildDashboardData';
import { useParentDashboardData } from '@/hooks/useParentDashboardData';
import { setChildSession } from '@/hooks/useChildSession';
import { setParentSession, clearParentSession } from '@/hooks/useParentSession';

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
  const router = useRouter();
  const [isParentMode, setIsParentMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Child data
  const childData = useChildDashboardData();

  // Parent data
  const parentData = useParentDashboardData();

  // Display values
  const displaySeeds = showSeeds ?? (isParentMode ? parentData.activeChild?.seeds ?? 0 : childData.seeds);
  const children: ChildInfo[] = isParentMode ? parentData.children : childData.children;
  const currentChild: ChildInfo | null = isParentMode
    ? (parentData.activeChild as ChildInfo | null)
    : (childData.currentChild as ChildInfo | null);
  const childName = (isParentMode ? parentData.activeChild?.name : childData.childName) || null;
  const familyName = parentData.familyName;
  const isLoading = (isParentMode ? parentData.isChildrenLoading : childData.isChildrenLoading) || parentData.isFamiliesLoading;

  // Handle mode switch with routing and refetch
  const handleModeSwitch = useCallback(async (newMode: 'parent' | 'child') => {
    const shouldBeParent = newMode === 'parent';
    
    if (shouldBeParent) {
      // Switching to parent mode
      if (parentData.family) {
        setParentSession({
          parentId: 'demo-parent',
          familyId: parentData.family.id,
          parentName: 'Demo Parent',
          familyName: parentData.family.name,
        });
        // Refetch parent data
        await parentData.refetchDashboardData?.();
      }
    } else {
      // Switching to child mode - clear parent session and refetch child data
      clearParentSession();
      await childData.refetchDashboardData?.();
    }
    
    setIsParentMode(shouldBeParent);
    onModeChange?.(newMode);
    
    // Navigate to appropriate route
    router.push(shouldBeParent ? '/parent' : '/');
  }, [parentData, childData, router, onModeChange]);

  // Handle child selection with routing and refetch
  const handleSelectChild = useCallback(async (childId: string) => {
    if (isParentMode) {
      // In parent mode, switch to child mode with that child
      const child = children.find((c) => c.id === childId);
      if (child) {
        setChildSession({
          childId: child.id,
          familyId: child.familyId || parentData.familyId || '',
          childName: child.name,
          childAge: child.childAge,
        });
        clearParentSession();
        
        // Refetch child data and navigate
        await childData.refetchDashboardData?.();
        setIsParentMode(false);
        onModeChange?.('child');
        router.push('/');
      }
    } else {
      // In child mode, switch child and refetch
      childData.selectChild(childId);
      await childData.refetchDashboardData?.();
    }
    setIsDropdownOpen(false);
  }, [isParentMode, children, parentData, childData, router, onModeChange]);

  // Handle switch back to child from parent mode with refetch and routing
  const handleBackToChild = useCallback(async () => {
    clearParentSession();
    await childData.refetchDashboardData?.();
    setIsParentMode(false);
    setIsDropdownOpen(false);
    onModeChange?.('child');
    router.push('/');
  }, [childData, router, onModeChange]);

  // Handle parent login demo with routing and refetch
  const handleParentLogin = useCallback(async () => {
    if (parentData.family) {
      setParentSession({
        parentId: 'demo-parent',
        familyId: parentData.family.id,
        parentName: 'Demo Parent',
        familyName: parentData.family.name,
      });
      
      // Refetch parent data and navigate
      await parentData.refetchDashboardData?.();
      setIsParentMode(true);
      onModeChange?.('parent');
      router.push('/parent');
    }
  }, [parentData, router, onModeChange]);

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        flex justify-between items-center
        px-4 md:px-6 h-16 md:h-20
        bg-white/95 backdrop-blur-sm
        border-b-4 border-[#1C1917]
        shadow-[4px_4px_0px_#1C1917]
      "
    >
      {/* Logo */}
      {showLogo && (
        <h1
          className={`
            text-xl md:text-2xl font-black italic uppercase tracking-tight
            ${logoColor} drop-shadow-[2px_2px_0px_#1C1917]
          `}
        >
          {logoText}
        </h1>
      )}

      {!showLogo && <div />}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <div className="flex items-center bg-[#E5E7EB] rounded-full p-1">
          <button
            onClick={() => handleModeSwitch('child')}
            className={`
              px-3 py-1 rounded-full text-xs font-black transition-all
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
              px-3 py-1 rounded-full text-xs font-black transition-all
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
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="
                flex items-center gap-2
                bg-[#BAE6FD] comic-border-2 px-3 py-1.5 rounded-full
                font-black text-sm text-[#1C1917]
                hover:bg-[#7DD3FC] transition-all
              "
            >
              <div className="w-6 h-6 rounded-full bg-[#0284C8] flex items-center justify-center">
                <span className="text-white text-xs font-black">👨‍👩‍👧</span>
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">
                {familyName || 'Select Family'}
              </span>
              <MaterialIcon icon="expand_more" className="!text-base" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="
                  absolute right-0 top-full mt-2
                  bg-white border-4 border-[#1C1917] rounded-2xl
                  shadow-[4px_4px_0px_#1C1917]
                  min-w-[240px] z-50 overflow-hidden
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
          <div className="relative">
            <button
              onClick={() => children.length > 1 && setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-2
                bg-[#BAE6FD] comic-border-2 px-3 py-1.5 rounded-full
                font-black text-sm text-[#1C1917]
                transition-all
                ${children.length > 1 ? 'hover:bg-[#7DD3FC] cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className="w-6 h-6 rounded-full bg-[#0284C8] flex items-center justify-center">
                <span className="text-white text-xs font-black">
                  {childName?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <span className="hidden sm:inline max-w-[80px] truncate">
                {childName || 'No Child'}
              </span>
              {children.length > 1 && (
                <MaterialIcon icon="expand_more" className="!text-base" />
              )}
            </button>

            {isDropdownOpen && children.length > 1 && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="
                  absolute right-0 top-full mt-2
                  bg-white border-4 border-[#1C1917] rounded-2xl
                  shadow-[4px_4px_0px_#1C1917]
                  min-w-[200px] z-50 overflow-hidden
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
            flex items-center gap-1.5
            bg-[#FEF08A] comic-border-2 px-3 py-1 rounded-full
            font-black text-sm text-[#1C1917]
            skew-x-[-6deg]
          "
        >
          <MaterialIcon icon="eco" filled className="text-[#FACC15] !text-base" />
          <span>{displaySeeds.toLocaleString()}</span>
          <span className="text-[10px] font-bold uppercase text-[#CA8A04]">Seeds</span>
        </div>

        {rightIcons ?? null}
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
