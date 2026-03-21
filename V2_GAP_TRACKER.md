# Lena's Homestead V2 Gap Tracker

Audit date: March 21, 2026

This document tracks how the current repo compares against the `MASTER UI GENERATOR PROMPT (V2)` and what still needs to be built, adjusted, or explicitly rejected.

## Status Legend

| Status | Meaning |
| --- | --- |
| `Done` | Implemented and usable in the current repo |
| `Partial` | Exists, but does not fully satisfy V2 |
| `Missing` | Not implemented yet |
| `Conflict` | V2 request conflicts with the approved `Hearth Ledger` product direction or current repo architecture |

## Baseline Snapshot

- Current parent product routes live under `app/[locale]/parent/...`, not flat `app/...`.
- Current implemented parent screens:
  - `app/[locale]/parent/page.tsx`
  - `app/[locale]/parent/moments/page.tsx`
  - `app/[locale]/parent/moments/proximity/page.tsx`
  - `app/[locale]/parent/moments/timer/page.tsx`
- Current reusable parent UI exists:
  - `components/AppShell.tsx`
  - `components/ChildSelector.tsx`
  - `components/GoalCard.tsx`
  - `components/QuestCard.tsx`
  - `components/MomentCard.tsx`
  - `components/MascotBubble.tsx`
  - `components/ProgressBar.tsx`
  - `components/BottomNavigation.tsx`
- Current state exists in `state/appState.ts`.
- Current helpers exist in:
  - `lib/locale-path.ts`
  - `lib/openai.ts`
  - `lib/elevenlabs.ts`
  - `lib/distance.ts`
- Current API provider routes exist in:
  - `app/api/ai/quests/route.ts`
  - `app/api/ai/advisor/route.ts`
  - `app/api/voice/route.ts`
- `.env.example` now exists with placeholder values only.

## Repo-Aligned Route Mapping

The V2 prompt assumes a greenfield standalone app. This repo is already localized and should stay aligned with `next-intl`.

| V2 Prompt Route | Repo-Aligned Target | Current Status | Notes |
| --- | --- | --- | --- |
| `/app/page.tsx` | `app/[locale]/parent/page.tsx` | `Done` | Implemented as dashboard with tabs |
| `/app/children/page.tsx` | `app/[locale]/parent/children/page.tsx` or keep embedded selector | `Partial` | Child switching exists, but no dedicated page |
| `/app/adventures/page.tsx` | `app/[locale]/parent/adventures/page.tsx` or keep `?tab=adventures` | `Partial` | Adventures exists only as dashboard tab |
| `/app/dreams/page.tsx` | `app/[locale]/parent/dreams/page.tsx` or keep `?tab=dreams` | `Partial` | Dreams exists only as dashboard tab |
| `/app/moments/page.tsx` | `app/[locale]/parent/moments/page.tsx` | `Done` | Planner screen exists |
| `/app/advisor/page.tsx` | `app/[locale]/parent/advisor/page.tsx` | `Missing` | No parent advisor flow yet |
| `/app/moments/proximity/page.tsx` | `app/[locale]/parent/moments/proximity/page.tsx` | `Partial` | Screen exists, but uses simulated proximity |
| `/app/moments/timer/page.tsx` | `app/[locale]/parent/moments/timer/page.tsx` | `Partial` | Screen exists, but lacks voice and richer completion integrations |

## Feature Matrix

| Area | V2 Requirement | Current Status | Gap Detail |
| --- | --- | --- | --- |
| Multi-child family support | Switch child and update all screen data | `Done` | Implemented in Zustand and `ChildSelector` |
| Child context always visible | Active child shown at top of parent screens | `Done` | Implemented through `AppShell` |
| Parent dashboard | Mobile-first parent dashboard | `Done` | Implemented under `app/[locale]/parent/page.tsx` |
| Quest generation with AI | Real OpenAI-backed generation | `Partial` | UI exists, but generation is mocked from local fallback data |
| Parent quest approval | Approve or reject quests | `Done` | Implemented in `QuestCard` and Zustand |
| Quest completion | Complete quest and reward seeds | `Partial` | Completion exists, but no streak update, voice, or celebration chain |
| Quest expiration | Countdown until quests reset | `Missing` | No reset timestamp or `QuestCountdown` component |
| Streak system | Daily streak display and milestone handling | `Missing` | No streak state, no badge, no milestone animation |
| Goal progress | Progress bar toward family goal | `Done` | Implemented in `GoalCard` and `ProgressBar` |
| Advisor system | AI suggestions for parent-child activities | `Missing` | No advisor store, route, or components |
| Place discovery | Nearby location suggestions and maps links | `Missing` | No place data, card, or maps deep links |
| Family moments planner | Accept activity and begin moment flow | `Partial` | Planner exists, but activity generation is mocked and advisor is absent |
| Proximity check | Real geolocation and distance threshold | `Missing` | Current screen simulates distance; no browser geolocation yet |
| Family timer | Countdown and completion rewards | `Partial` | Timer exists, but no ElevenLabs voice and no geolocation handoff |
| Mascot interactions | One calm mascot message per screen | `Done` | Implemented consistently |
| Voice integration | ElevenLabs playback on key events | `Missing` | No helper, no API calls, no playback wiring |
| Bottom navigation | Home, Adventures, Dreams, Moments, Advisor | `Partial` | Advisor tab is missing |
| .env example | OpenAI and ElevenLabs keys documented | `Missing` | No `.env.example` file yet |

## State Model Audit

### Implemented

- `children[]`
- `selectedChildId`
- `goal`
- `quests`
- `familySeeds`
- `aiTokens`
- `lockedChildId`
- `activeMomentChildId`

### Missing from V2 state expectations

- `family.name`
- `streak`
- `advisorMessages`
- `dailyTokens`
- child preferences
- quest reset timestamp
- place suggestions
- advisor suggestion status
- voice playback status
- geolocation state

## Component Audit

| Component | Current Status | Notes |
| --- | --- | --- |
| `AppShell` | `Done` | Good parent-screen shell |
| `ChildSelector` | `Done` | Multi-child switching works |
| `QuestCard` | `Done` | Supports core states |
| `GoalCard` | `Done` | Goal and empty-goal states exist |
| `MomentCard` | `Done` | Ready, empty, error, loading states exist |
| `MascotBubble` | `Done` | Matches calm one-message rule |
| `ProgressBar` | `Done` | Smooth progress visuals exist |
| `BottomNavigation` | `Partial` | Missing advisor nav item |
| `AdvisorCard` | `Missing` | Not implemented |
| `PlaceSuggestionCard` | `Missing` | Not implemented |
| `StreakBadge` | `Missing` | Not implemented |
| `QuestCountdown` | `Missing` | Not implemented |
| `Navbar.tsx` | `Conflict` | Parent app uses a bottom nav pattern, not the marketing navbar pattern |

## Integration Audit

| Integration | Current Status | Gap Detail |
| --- | --- | --- |
| OpenAI API | `Partial` | Provider helper and local API route exist, but the UI is not wired to them yet |
| ElevenLabs API | `Partial` | Provider helper and local voice route exist, but playback is not wired into parent flows yet |
| Browser geolocation | `Missing` | `navigator.geolocation.getCurrentPosition()` is not used |
| Haversine distance | `Done` | `lib/distance.ts` exists, but proximity UI still uses mock values |
| Google Maps links | `Missing` | No nearby place cards or outbound map links |
| `.env.example` | `Done` | Placeholder template exists and is safe to commit |

## UX and Visual Fit Audit

| Topic | Current Status | Notes |
| --- | --- | --- |
| Calm premium spacing | `Done` | Matches `Hearth Ledger` well |
| Mobile-first composition | `Done` | Parent UI is mobile-first |
| Multi-child clarity | `Done` | Strong and visible |
| Cozy magical feeling | `Partial` | Warm and calm, but more editorial than whimsical |
| Small emoji icons | `Conflict` | V2 asks for emoji accents, but approved design system avoids emoji-heavy UI |
| Studio Ghibli / Animal Crossing / Stardew styling | `Conflict` | Current approved direction is premium editorial Hearth Ledger, not playful game UI |
| Glowing seed reward language | `Partial` | Seed rewards exist, but there is no richer animated glow or reward system layer |
| Celebration animation at streak milestones | `Missing` | No streak system yet |

## What Is Not Suited To The Current Product Direction

These items should not be adopted blindly from V2 without a design decision:

| V2 Ask | Why It Does Not Cleanly Fit Right Now | Recommendation |
| --- | --- | --- |
| Emoji-forward UI | Conflicts with `Hearth Ledger` restraint and premium tone | Keep iconography subtle; only add tiny accents if explicitly approved |
| Flat `/app/...` route structure | Repo already depends on localized `app/[locale]/...` routing | Keep locale-based routing |
| Generic `Navbar.tsx` requirement | Parent product currently uses a fixed bottom dock and sticky child context | Keep bottom-nav-first mobile shell |
| Game-like visual references as primary style | Conflicts with approved editorial calm direction | Treat "magical homestead" as content tone, not a full visual redesign |

## Priority Backlog

### P0: Required To Reach Real V2 MVP

- [x] Create `lib/openai.ts`
- [x] Create `lib/elevenlabs.ts`
- [x] Create `lib/distance.ts`
- [x] Add `.env.example`
- [ ] Extend Zustand state for `streak`, `dailyTokens`, `advisorMessages`, `questResetAt`, `preferences`, and `placeSuggestions`
- [ ] Replace mocked quest generation with real OpenAI quest generation
- [ ] Add `QuestCountdown.tsx`
- [ ] Add `StreakBadge.tsx`
- [ ] Add `AdvisorCard.tsx`
- [ ] Add `PlaceSuggestionCard.tsx`
- [ ] Add real advisor page and route
- [ ] Add advisor tab to `BottomNavigation`
- [ ] Replace simulated proximity with browser geolocation plus Haversine distance
- [ ] Add ElevenLabs playback for quest completion, moment completion, and milestone events

### P1: Strongly Recommended For Hackathon Demo Quality

- [ ] Split `Adventures` into its own route instead of query-param tab only
- [ ] Split `Dreams` into its own route instead of query-param tab only
- [ ] Decide whether a dedicated `Children` route is needed or whether embedded selector is the final pattern
- [ ] Add Google Maps deep links for advisor place suggestions
- [ ] Add richer goal milestone handling
- [ ] Add quest reset persistence and daily refresh logic
- [ ] Add loading and error state coverage for advisor and voice features

### P2: Nice-To-Have Polish

- [ ] Add subtle reward glow for seed gain
- [ ] Add tiny motion for streak milestones
- [ ] Add better sample household metadata like `family.name`
- [ ] Add demo-friendly mock preferences and place suggestions
- [ ] Add lightweight local persistence for selected child and in-progress moment state

## Recommended Next Implementation Order

1. Integration foundation:
   Build `lib/openai.ts`, `lib/elevenlabs.ts`, `lib/distance.ts`, and `.env.example`.
2. State foundation:
   Expand `state/appState.ts` to support streaks, advisor messages, daily tokens, preferences, quest reset, and place suggestions.
3. Missing reusable components:
   Add `QuestCountdown`, `StreakBadge`, `AdvisorCard`, and `PlaceSuggestionCard`.
4. Missing routes:
   Add repo-aligned advisor route first, then decide whether `adventures` and `dreams` stay tabbed or become dedicated pages.
5. Real device behavior:
   Replace mock proximity with browser geolocation and Haversine distance.
6. Demo quality:
   Add ElevenLabs voice playback and real OpenAI-backed generation flows.

## Suggested Definition Of Done For V2

V2 should be considered complete when all of the following are true:

- [ ] Multi-child switching updates quests, streak, goals, advisor suggestions, and moments
- [ ] Quest generation is powered by OpenAI, not fallback arrays
- [ ] Quest reset countdown is visible
- [ ] Streak badge exists and updates correctly
- [ ] Advisor page generates one family activity suggestion
- [ ] Place suggestions render with maps links
- [ ] Browser geolocation is used for proximity checks
- [ ] Moment timer completion triggers seeds, tokens, and voice playback
- [ ] Bottom navigation includes Advisor
- [ ] `.env.example` is committed and the app is easy to run locally
