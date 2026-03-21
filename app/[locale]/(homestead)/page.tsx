// ============================================================
// Screen: Child Home Dashboard  (ROOT — /en, /vi, etc.)
// Route: (homestead)/page.tsx
// Layout: (homestead)/layout.tsx (TopNav + BottomNav via pathname)
// ============================================================
// Server Component — interactive parts extracted to ChildHomeContent.tsx

import { ChildHomeContent } from './ChildHomeContent';

export default function ChildHomePage() {
  return <ChildHomeContent />;
}
