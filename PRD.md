You are a senior full-stack engineer.

Generate a complete hackathon MVP frontend project for a mobile-first web app called **"Lena's Homestead"**.

TECH STACK

* Next.js (App Router)
* React
* TailwindCSS
* OpenAI API integration
* ElevenLabs voice API
* Local state management only
* No backend server required

The app should run locally with `pnpm install` and `pnpm run dev`.

APP CONCEPT (Focus on Parent features)

Lena's Homestead is an AI-powered family companion app where children complete daily quests and grow toward meaningful goals in a cozy magical homestead guided by Lena, a friendly flower nymph.

Parents approve quests, track progress for multiple children, and schedule shared family activities called "Homestead Moments".

The app demonstrates three loops:

QUEST LOOP
Parent chooses a child -> AI generates quests -> parent approves -> child completes quest -> seeds increase -> progress toward that child's goal.

GOAL LOOP
Seeds contribute toward a meaningful goal for the selected child (example: buying a birthday gift).

FAMILY MOMENT LOOP
Parent chooses a child -> parent and child complete a shared activity verified through a proximity check and timer.

VISUAL STYLE

Use Tailwind to create a cozy fantasy aesthetic inspired by:

* Studio Ghibli
* Animal Crossing
* Stardew Valley

Color palette:

* sage green
* warm beige
* blossom pink
* soft gold accents

Coins should be represented as **glowing seeds**.

Include simple emoji icons where appropriate.

PROJECT STRUCTURE

Create the following structure:

`/app/[locale]/parent/page.tsx` (Parent Home Dashboard)
`/app/[locale]/parent/moments/page.tsx` (Family Moments Planner)
`/app/[locale]/parent/moments/proximity/page.tsx` (Proximity Check Screen)
`/app/[locale]/parent/moments/timer/page.tsx` (Family Moment Timer)

`/components`
`QuestCard.tsx`
`GoalCard.tsx`
`MascotBubble.tsx`
`MomentCard.tsx`
`ProgressBar.tsx`
`Navbar.tsx`
`ChildSelector.tsx`

`/lib`
`openai.ts`
`elevenlabs.ts`
`distance.ts`

`/state`
`appState.ts`

GLOBAL STATE

Use React context or simple Zustand store to hold:

```ts
parent = {
    name: "Eric",
    familySeeds: 30
}

selectedChildId = "mina"

children = [
    {
        id: "mina",
        name: "Mina",
        age: 8,
        seeds: 30,
        aiTokens: 6,
        goal: {
            title: "Birthday Gift",
            target: 100
        },
        approvedQuests: [],
        rejectedQuests: [],
        completedQuests: [],
        plannedMoments: []
    }
]
```

The selected child should drive the content shown on the dashboard, adventures, dreams, and moments flows.

MAIN FEATURES

1. MULTI-CHILD SWITCHER

Create a sticky child selector dropdown visible on all parent screens.

Requirements:

* Parent can manage multiple children
* The selector shows the active child name, age, and current seed balance
* When the parent opens the dropdown, they can choose which child to track
* When the selection changes, all cards, quests, goals, and moments update to that child
* If there are many children, the dropdown list should be scrollable
* Persist the last selected child in local state

2. QUEST GENERATION

Create a button:

"Generate Quests with AI"

Use OpenAI API to generate 3 quests for the currently selected child.

Prompt template:

Generate 3 daily quests for a child.

Child name: Mina
Child age: 8

Categories:
learning
exercise
responsibility

Return JSON:

```json
[
    { "title": "", "reward": 10, "category": "learning" },
    { "title": "", "reward": 10, "category": "exercise" },
    { "title": "", "reward": 10, "category": "responsibility" }
]
```

Display quests using `QuestCard` components.

Parent can approve or reject them.

Additional parent feature:

* Parent can send a number of seeds to the selected child

3. CHILD ADVENTURE SCREEN

Display approved quests for the selected child.

Each quest has:

"I Did It!" button

When clicked:

* mark quest completed
* increase that child's seeds
* update that child's goal progress
* trigger mascot message

4. GOAL PROGRESS

Display progress bar for the selected child:

`seeds / target`

Example:

`60 / 100 seeds`

Use `ProgressBar` component.

5. FAMILY MOMENTS PLANNER

Allow parent to generate AI activity suggestion for the selected child.

Prompt example:

Suggest one short activity a parent and child can do together.

Child name: Mina
Duration: 15-30 minutes
Theme: cozy homestead

Return JSON:

```json
{
    "activity": "",
    "duration": ""
}
```

Display activity card with:

* selected child context
* Start Moment button

6. PROXIMITY CHECK

Simulate proximity verification using browser geolocation for the parent and the selected child.

Use:

`navigator.geolocation.getCurrentPosition()`

Store coordinates.

Use Haversine formula to compute distance.

If distance < 50 meters:

Show success state:

"Homestead connection confirmed."

Allow activity timer to start.

7. FAMILY MOMENT TIMER

Display a countdown timer (20 minutes).

When finished:

* add +5 seeds to the selected child
* add +3 AI tokens to the selected child
* show celebration screen

8. MASCOT INTERACTIONS

Create a `MascotBubble` component.

Lena gives short messages like:

* "Welcome back to the homestead!"
* "Wonderful job!"
* "The homestead grows when families spend time together."

9. VOICE INTEGRATION

Use ElevenLabs API to convert mascot messages to voice.

Create helper function in `/lib/elevenlabs.ts`.

Play voice when:

* quest completed
* family moment completed
* goal milestone reached

10. NAVIGATION

Create bottom navigation bar:

* Home
* Adventures
* Dreams
* Moments

Use simple icons.

Keep the child selector available above the page content so the parent can switch tracked children from any main parent screen.

11. RESPONSIVE DESIGN

Ensure the layout looks like a mobile app.

Use max-width container centered on screen.

Prioritize a compact, easy-to-scan UI for families with several children, so the selector and child-specific cards do not feel crowded.

OUTPUT FORMAT

Generate:

1. Full folder structure
2. All React components
3. Tailwind styling
4. OpenAI integration code
5. ElevenLabs voice function
6. Child selector dropdown behavior
7. Example environment variables:

`NEXT_PUBLIC_OPENAI_API_KEY=`
`NEXT_PUBLIC_ELEVENLABS_API_KEY=`

Ensure the project runs immediately after installation.

Make the UI clean.
