# Lena's Homestead MVP Wireframes

## Repo Fit

- The current repo is a localized Next.js app that renders pages under `app/[locale]`.
- The parent feature area from the PRD fits cleanly under `app/[locale]/parent`.
- `app/[locale]/parent` already exists as an empty directory, so the MVP can be added without disturbing the existing marketing routes.
- Assumption for MVP scope: `Home`, `Adventures`, and `Dreams` are states inside the parent dashboard route, while `Moments`, `Proximity`, and `Timer` are dedicated screens.
- Multi-child households are first-class in the UI. All parent screens share one active child context chosen from a dropdown.

## Route Map

| Route | Screen | Primary job |
| --- | --- | --- |
| `/[locale]/parent` | Parent Home Dashboard | Overview, child switcher, quest generation, approvals, goal progress |
| `/[locale]/parent?tab=adventures` | Adventures state | Review AI quests for the selected child, approve or reject, monitor completion |
| `/[locale]/parent?tab=dreams` | Dreams state | Track goal progress and transfer seeds for the selected child |
| `/[locale]/parent/moments` | Family Moments Planner | Generate and schedule a shared activity for the selected child |
| `/[locale]/parent/moments/proximity` | Proximity Check | Validate parent and selected child are together |
| `/[locale]/parent/moments/timer` | Family Moment Timer | Run countdown and award completion rewards to the selected child |

## Shared UI Blocks

| Component | Used in | Notes |
| --- | --- | --- |
| `Navbar` | All screens | Mobile-first app chrome with family-level navigation |
| `ChildSelector` | All parent screens | Sticky dropdown for choosing the active child |
| `MascotBubble` | Dashboard, timer, completion | Lena guidance and voice playback |
| `QuestCard` | Dashboard, adventures | AI quest suggestion and approval states for the selected child |
| `GoalCard` | Dashboard, dreams | Goal progress, target, milestone reward copy for the selected child |
| `MomentCard` | Moments planner | AI-generated family activity tied to the selected child |
| `ProgressBar` | Goal card, timer | Seed progress and countdown visualization |

## Child Selector Pattern

**Purpose:** Give the parent one clear place to switch between children without leaving the current screen.

```text
+------------------------------------------------------+
| Tracking Child: [ Mina | 8 yrs | 30 Seeds | v ]     |
+------------------------------------------------------+
| When opened:                                         |
| +--------------------------------------------------+ |
| | Mina | 8 yrs | 30 Seeds | Goal: Birthday Gift    | |
| | Leo  | 6 yrs | 18 Seeds | Goal: New Backpack     | |
| | Ava  | 9 yrs | 62 Seeds | Goal: Art Kit          | |
| | Noah | 7 yrs | 25 Seeds | Goal: Museum Trip      | |
| +--------------------------------------------------+ |
| Scroll list if more children exist                   |
+------------------------------------------------------+
```

**Interaction notes**

- The selector stays under the top app bar on every parent screen.
- Switching children updates all child-specific cards in place rather than navigating away.
- The dropdown should be scrollable when the family has many children.
- Persist the most recently selected child locally so the parent returns to the same context next time.

## Screen 1: Parent Home Dashboard

**Purpose:** Give the parent one glanceable place to see family context, selected-child progress, AI quest generation, and today's family status.

```text
+------------------------------------------------------+
| Lena's Homestead                Family Seeds: 30     |
+------------------------------------------------------+
| Tracking Child: [ Mina | 8 yrs | 30 Seeds | v ]     |
+------------------------------------------------------+
| Hi Eric                                              |
| "Welcome back to the homestead!"                     |
| [ Generate Quests with AI ]                          |
+------------------------------------------------------+
| GOAL CARD - Mina                                     |
| Birthday Gift                          30 / 100 Seeds|
| [#########.....................]                     |
| Next milestone: 50 seeds                             |
| [ View Dreams ]              [ Send Seeds to Child ] |
+------------------------------------------------------+
| TODAY'S SNAPSHOT - Mina                              |
| Approved quests: 2   Pending: 3   Moments: 1 planned |
+------------------------------------------------------+
| QUEST PREVIEW                                        |
| +--------------------------------------------------+ |
| | Read 10 pages                     Reward 10 Seeds| |
| | Category: Learning                               | |
| | [Approve]                         [Reject]       | |
| +--------------------------------------------------+ |
| +--------------------------------------------------+ |
| | Tidy toy shelf                    Reward 10 Seeds| |
| | Category: Responsibility                         | |
| | [Approve]                         [Reject]       | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| LENA SAYS                                            |
| "The homestead grows when families spend time        |
| together."                              [Play Voice] |
+------------------------------------------------------+
| [Home]     [Adventures]     [Dreams]     [Moments]  |
+------------------------------------------------------+
```

**Interaction notes**

- The hero action is quest generation because it powers the main loop.
- Goal progress sits above quest cards so reward context is always visible.
- The selected child is always visible near the top so the parent knows whose data is on screen.
- The bottom nav should remain fixed for thumb reach on mobile.

## Screen 2: Adventures State

**Purpose:** Let the parent review AI-generated quests, approve or reject them, and see which approved quests were completed for the selected child.

```text
+------------------------------------------------------+
| Adventures                                [Back]     |
+------------------------------------------------------+
| Tracking Child: [ Mina | 8 yrs | 30 Seeds | v ]     |
+------------------------------------------------------+
| Categories: [Learning] [Exercise] [Responsibility]   |
| [ Regenerate 3 Quests ]                              |
+------------------------------------------------------+
| AI SUGGESTIONS FOR MINA                              |
| +--------------------------------------------------+ |
| | Water the window plants            Reward 10 Seeds| |
| | Reason: gentle responsibility task               | |
| | [Approve]                         [Reject]       | |
| +--------------------------------------------------+ |
| +--------------------------------------------------+ |
| | 10-minute garden walk             Reward 10 Seeds| |
| | Reason: light movement and observation           | |
| | [Approve]                         [Reject]       | |
| +--------------------------------------------------+ |
| +--------------------------------------------------+ |
| | Learn 3 new nature words          Reward 10 Seeds| |
| | Reason: cozy learning challenge                   | |
| | [Approve]                         [Reject]       | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| APPROVED TODAY                                       |
| [Done] Read 10 pages                     Completed   |
| [ ] Tidy toy shelf                       Awaiting    |
+------------------------------------------------------+
| QUICK ACTION                                         |
| [ Send Bonus Seeds ]                                 |
+------------------------------------------------------+
| [Home]     [Adventures]     [Dreams]     [Moments]  |
+------------------------------------------------------+
```

**Interaction notes**

- This state is still parent-facing, but it also surfaces child completion status.
- `Send Bonus Seeds` applies to the currently selected child.
- When the parent switches children, both the suggestions and the approved list refresh.

## Screen 3: Dreams State

**Purpose:** Keep the selected child's goal emotionally visible so seeds feel meaningful instead of abstract points.

```text
+------------------------------------------------------+
| Dreams                                    [Back]     |
+------------------------------------------------------+
| Tracking Child: [ Mina | 8 yrs | 30 Seeds | v ]     |
+------------------------------------------------------+
| CURRENT GOAL - Mina                                  |
| +--------------------------------------------------+ |
| | Birthday Gift                                   | |
| | 30 / 100 seeds                                  | |
| | [#########.....................]                | |
| | At 50 seeds: Lena unlocks a special message     | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| WHY THIS GOAL MATTERS                                |
| "A shared goal helps daily quests feel purposeful." |
+------------------------------------------------------+
| SEED ACTIONS                                         |
| [ +5 Seeds ]   [ +10 Seeds ]   [ Custom Amount ]    |
+------------------------------------------------------+
| PROGRESS MOMENTS                                     |
| 10 seeds  - first sprout                             |
| 50 seeds  - glowing blossom                          |
| 100 seeds - gift achieved                            |
+------------------------------------------------------+
| [Home]     [Adventures]     [Dreams]     [Moments]  |
+------------------------------------------------------+
```

**Interaction notes**

- This can live behind `?tab=dreams` for MVP, then split into its own route later if needed.
- The milestone copy gives the UI more emotional payoff without adding backend complexity.
- If the parent switches children here, the goal card and progress moments update instantly.

## Screen 4: Family Moments Planner

**Purpose:** Help the parent generate a quick shared activity for the selected child, confirm the plan, and move into the verification flow.

```text
+------------------------------------------------------+
| Homestead Moments                         [Back]     |
+------------------------------------------------------+
| Tracking Child: [ Mina | 8 yrs | 30 Seeds | v ]     |
+------------------------------------------------------+
| Create a shared family activity                      |
| Duration: [15-30 min v]                              |
| Theme: cozy homestead                                |
| [ Suggest Activity with AI ]                         |
+------------------------------------------------------+
| AI MOMENT SUGGESTION                                 |
| +--------------------------------------------------+ |
| | Activity: Build a blanket reading nest           | |
| | For: Mina                                         | |
| | Duration: 20 minutes                             | |
| | Supplies: blanket, 2 pillows, favorite book      | |
| | [ Try Another ]                  [ Use This ]    | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| TODAY'S PLAN                                         |
| Start time: [ 6:30 PM ]                              |
| Parent: Eric                                         |
| Child: Mina                                          |
| Reward on finish: +5 seeds, +3 AI tokens             |
+------------------------------------------------------+
| +--------------------------------------------------+ |
| | MOMENT CARD                                       | |
| | Blanket reading nest                              | |
| | 20 min                                Cozy        | |
| | [ Start Moment ]                                  | |
| +--------------------------------------------------+ |
+------------------------------------------------------+
| [Home]     [Adventures]     [Dreams]     [Moments]  |
+------------------------------------------------------+
```

**Interaction notes**

- `Use This` locks the AI suggestion into the planner card.
- `Start Moment` moves to the proximity screen because the PRD requires location verification before the timer begins.
- If the parent changes the child selector, the suggestion should be regenerated or clearly marked as belonging to the previous child.

## Screen 5: Proximity Check

**Purpose:** Simulate that parent and the selected child are physically together before the shared activity starts.

```text
+------------------------------------------------------+
| Proximity Check                           [Cancel]   |
+------------------------------------------------------+
| Parent: Eric                      Child: Mina        |
| Step 1 of 2                                          |
| Confirming homestead connection...                   |
+------------------------------------------------------+
| PARENT DEVICE                                        |
| Location status: [ Granted ]                         |
| Coordinates: 10.1234, 106.1234                       |
+------------------------------------------------------+
| CHILD DEVICE - MINA                                  |
| Location status: [ Granted ]                         |
| Coordinates: 10.1236, 106.1237                       |
+------------------------------------------------------+
| DISTANCE                                             |
| Current distance: 34 m                               |
| Threshold: less than 50 m                            |
| Status: Homestead connection confirmed               |
+------------------------------------------------------+
| [ Recheck ]                         [ Start Timer ]  |
+------------------------------------------------------+
| Lena: "Wonderful job! You're together and ready."   |
+------------------------------------------------------+
```

**Interaction notes**

- The success state should feel calm and clear, not technical or alarming.
- If distance is over 50 m, replace the success row with a gentle retry message and disable `Start Timer`.
- Keep the child name visible on this screen to avoid ambiguity in multi-child households.

## Screen 6: Family Moment Timer

**Purpose:** Keep the shared activity focused, then celebrate completion with clear rewards for the selected child.

```text
+------------------------------------------------------+
| Family Moment Timer                       [Exit]     |
+------------------------------------------------------+
| Eric + Mina                                          |
| Blanket Reading Nest                                 |
| Stay together until the homestead timer blooms       |
+------------------------------------------------------+
| TIMER                                                |
|                    19:58                             |
|           [###################.....]                 |
|                  20 min total                        |
+------------------------------------------------------+
| REWARDS ON COMPLETION                                |
| +5 Seeds to Mina                                     |
| +3 AI Tokens to Mina                                 |
+------------------------------------------------------+
| LENA BUBBLE                                          |
| "The homestead grows when families spend time        |
| together."                              [Play Voice] |
+------------------------------------------------------+
| [ Pause ]                            [ Finish Early ]|
+------------------------------------------------------+
```

**Completion overlay**

```text
+------------------------------------------------------+
| Moment Complete!                                     |
+------------------------------------------------------+
| +5 seeds added to Mina                               |
| +3 AI tokens added to Mina                           |
| Goal progress is now 35 / 100 seeds                  |
+------------------------------------------------------+
| Lena: "Wonderful job! Your homestead is blooming."  |
+------------------------------------------------------+
| [ Back to Home ]                  [ Plan Another ]  |
+------------------------------------------------------+
```

## MVP Flow Summary

```text
Parent opens parent area
   |
   +--> Choose active child from dropdown
   |       |
   |       +--> Dashboard, Adventures, Dreams sync to that child
   |
   +--> Generate Quests with AI
   |       |
   |       +--> Approve / Reject
   |       |
   |       +--> Child completes quest
   |       |
   |       +--> Seeds update selected-child goal progress
   |
   +--> Moments Planner
           |
           +--> AI suggests activity for selected child
           |
           +--> Proximity Check
           |
           +--> Timer
           |
           +--> Completion rewards for selected child
```

## Build Notes

- Keep the screen width centered around a phone-sized container even on desktop.
- Re-theme the current repo away from the existing culinary palette toward sage, beige, blossom pink, and soft gold.
- The wireframes assume voice playback is an optional secondary action inside `MascotBubble`, not a blocking step.
- Use a dropdown rather than horizontal child tabs so the UI still works well when parents manage many children.
