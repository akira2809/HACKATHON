# MVP Frontend Gap Checklist

Checklist from current frontend scope vs. current MVP plan.

## Current scope snapshot

- [x] Parent dashboard exists for quests, dreams, and moments
- [x] Child home, adventures, dreams, and moments screens exist
- [x] Parent quest generation and 3-quest selection flow exists
- [x] Seeds, streak, dream progress, proximity, and timer UI exist
- [x] Child quest sync exists through localStorage demo bridge
- [ ] Real backend data flow is connected

## P0 - Must finish for MVP flow fidelity

- [ ] Replace demo Zustand-only data with real Supabase-backed frontend reads and writes
- [ ] Add real family and child identity flow instead of hardcoded demo children
- [ ] Finish quest loop so it matches plan:
  child starts quest -> child submits completion -> parent verifies -> reward granted
- [ ] Use `pending-parent` quest state in the actual UI flow
- [ ] Prevent child flow from auto-completing and auto-rewarding quests before parent verification
- [ ] Make streak logic match MVP rule:
  streak increases only when all 3 daily quests are completed for the day
- [ ] Make approved quest sync real and reactive, not mount-time localStorage only

## P0 - Must finish for activity loop

- [ ] Add child-side activity selection UI for family moments
- [ ] Add parent-side scheduling step with time input
- [ ] Add calendar or scheduled-time state to the frontend flow
- [ ] Add parent notification or request-review surface after child selects activity
- [ ] Keep location fixed to home for MVP demo path
- [ ] Preserve planner -> proximity -> timer -> completion flow after scheduling is added
- [ ] Make "Try Another" / refresh actually generate a different moment suggestion

## P1 - Needed for reward and dreams coherence

- [ ] Add parent flow to create a goal for a child
- [ ] Add parent flow to edit or replace a goal
- [ ] Make child dreams screen read the active child goal, not a separate static dream seed setup
- [ ] Unify seeds and rewards across parent and child state so both sides show same totals
- [ ] Make moment completion use the actual configured reward values instead of fixed `+5` / `+3`
- [ ] Add reward history or event log surface for quests and moments

## P1 - Needed for multi-child correctness

- [ ] Add child-facing child selection or child identity selection
- [ ] Stop defaulting child app sync to the first available localStorage child id
- [ ] Scope quests, dreams, moments, rewards, and streak to the active child consistently
- [ ] Verify parent and child views stay aligned when switching children

## P1 - AI and personalization gaps

- [ ] Add frontend usage of advisor suggestions API
- [ ] Add UI for child preferences or preference signals
- [ ] Record accepted quests, selected moments, and completed activities as preference-learning inputs
- [ ] Show parent-facing advisor guidance only where it supports the MVP loop

## P2 - Nice-to-have if time remains

- [ ] Add child moments timer route if the child experience needs full parity
- [ ] Add better empty, loading, and error states for backend-connected flows
- [ ] Add voice UI only if it helps the demo story
- [ ] Add place suggestions only if scope expands beyond "home" for MVP

## Suggested build order

- [ ] 1. Connect real family, child, quest, moment, and goal data
- [ ] 2. Fix quest verification flow and streak logic
- [ ] 3. Add activity selection + scheduling step
- [ ] 4. Unify rewards and goals across parent and child
- [ ] 5. Add advisor/preferences loop if time remains

## Unresolved questions

- Should hackathon MVP stay partly demo-state, or should frontend be fully Supabase-backed?
- Is child-side moment selection required for demo, or can parent-side selection carry MVP?
- Should child-side moments include a timer route, or is parent-only timer enough for the demo?
