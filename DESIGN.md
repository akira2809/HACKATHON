# Lena's Homestead Design System

## Selection

Chosen visual direction: `Hearth Ledger`

Source references:

- [PRD.md](c:/Users/letha/OneDrive/my_source_code/HACKATHON/PRD.md)
- [WIREFRAME.md](c:/Users/letha/OneDrive/my_source_code/HACKATHON/WIREFRAME.md)
- [VISUAL_EXPLORATION.md](c:/Users/letha/OneDrive/my_source_code/HACKATHON/VISUAL_EXPLORATION.md)

This document turns the selected exploration into an implementation-ready UI design system for the parent experience.

## Design Goal

Create a premium family dashboard that feels like a hand-bound household planner:

- editorial, calm, and tactile
- emotionally warm, but not childish
- magical in details, not noisy in layout
- optimized for mobile parents managing multiple children

## Brand Feel

The product should feel like:

- a cozy planner
- a trusted family companion
- a polished AI product

The product should not feel like:

- a generic SaaS dashboard
- a toy app
- a dark fantasy game
- a purple-and-white startup template

## Core Principles

1. Calm first
Every screen should reduce cognitive load before adding delight.

2. Child context always visible
The active child must stay obvious at the top of the experience.

3. Premium through restraint
Use spacing, typography, and material quality instead of decoration overload.

4. Tactile warmth
Cards should feel paper-like, layered, and slightly crafted.

5. One focal action per section
Each block should guide attention to its primary task.

## Visual DNA

- warm parchment surfaces
- sage borders and moss text
- soft gold accents for rewards and milestones
- serif headlines with clean sans-serif UI text
- subtle paper texture and folded-card details
- rounded forms with controlled shadow depth

## Color System

### Primary Palette

| Token | Value | Usage |
| --- | --- | --- |
| `parchment` | `#F6F0E5` | app background, primary card surfaces |
| `sage-mist` | `#D8E3D1` | secondary surfaces, dividers, inactive chips |
| `warm-wood` | `#A67C52` | secondary accents, icons, metadata emphasis |
| `soft-gold` | `#E6C766` | reward chips, progress highlights, seed accents |
| `moss-text` | `#4F6B52` | primary brand text, icons, borders |

### Supporting Palette

| Token | Value | Usage |
| --- | --- | --- |
| `ink` | `#2F342C` | high-contrast headlines and important labels |
| `paper-white` | `#FBF8F1` | elevated cards and dropdown trays |
| `linen` | `#EEE5D6` | tertiary surfaces, input backgrounds |
| `rose-dust` | `#D8B7AA` | gentle celebration accent, mascot support color |
| `olive-shadow` | `rgba(79,107,82,0.14)` | shadows and overlays |

### Semantic Colors

| Token | Value | Usage |
| --- | --- | --- |
| `success` | `#6E8B63` | completed quests, proximity success |
| `warning` | `#C69A43` | pending states, timers, milestone nudges |
| `danger` | `#B46A5A` | destructive actions, rejection states |
| `info` | `#7C8E76` | helper text and neutral labels |

### CSS Variable Suggestion

```css
:root {
  --bg-app: #F6F0E5;
  --bg-surface: #FBF8F1;
  --bg-muted: #EEE5D6;
  --bg-soft: #D8E3D1;
  --text-primary: #2F342C;
  --text-secondary: #4F6B52;
  --text-muted: #7C8E76;
  --accent-gold: #E6C766;
  --accent-wood: #A67C52;
  --accent-rose: #D8B7AA;
  --border-soft: #D8E3D1;
  --border-strong: #B8C6B1;
  --shadow-soft: 0 12px 28px rgba(79, 107, 82, 0.10);
  --shadow-card: 0 6px 18px rgba(79, 107, 82, 0.12);
  --shadow-dock: 0 10px 30px rgba(47, 52, 44, 0.12);
}
```

## Typography

### Font Stack

| Role | Font | Usage |
| --- | --- | --- |
| Heading | `Fraunces` | page titles, card titles, milestone moments |
| Body/UI | `Manrope` | labels, buttons, helper text, navigation |
| Numbers | `IBM Plex Sans` | seed totals, progress counts, timers |

### Type Scale

| Token | Suggested size | Usage |
| --- | --- | --- |
| `display` | `32/36` | top screen heading |
| `h1` | `28/32` | major section title |
| `h2` | `22/28` | card title |
| `h3` | `18/24` | module heading |
| `body-lg` | `16/24` | priority body copy |
| `body` | `14/22` | standard interface text |
| `label` | `12/16` | metadata and chips |
| `micro` | `11/14` | captions and secondary counts |

### Typography Rules

- Use `Fraunces` only where hierarchy matters.
- Keep most interface text in `Manrope` for modern clarity.
- Use `IBM Plex Sans` for all seed counts, timers, and progress numbers.
- Avoid uppercase on large bodies of text; reserve it for tiny metadata only.

## Layout System

### Container

- Mobile-first centered column
- Max content width: `420px` to `460px`
- Page horizontal padding: `16px`
- Comfortable section gap: `16px` to `20px`

### Spacing Scale

| Token | Value |
| --- | --- |
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| `radius-sm` | `12px` | chips, small buttons |
| `radius-md` | `18px` | cards, inputs |
| `radius-lg` | `24px` | dock, hero cards, overlays |
| `radius-pill` | `999px` | `ChildSelector`, chips, segmented controls |

### Border Language

- Most borders are `1px solid var(--border-soft)`.
- Interactive elevated elements can use double-depth treatment:
  first border + shadow.
- Avoid heavy black outlines.

## Surface Model

### Background

- Base page uses `parchment`
- Add a subtle radial wash or paper grain, but keep it very quiet
- Background motion should not be noticeable during normal reading

### Card Hierarchy

| Level | Surface | Use |
| --- | --- | --- |
| Level 0 | `parchment` | page canvas |
| Level 1 | `paper-white` | standard cards |
| Level 2 | `linen` | inset modules, grouped sections |
| Level 3 | `sage-mist` | inactive UI, helper backgrounds |

### Tactile Details

- Slight inner highlight on premium cards
- Folded-corner hint on select hero cards
- Reward chips may use tiny embossed or inset styling

## Motion System

### Principles

- Motion should support orientation and reward
- No large springy animations
- Use soft ease curves and short durations

### Motion Tokens

| Token | Duration | Usage |
| --- | --- | --- |
| `motion-fast` | `120ms` | taps, button press |
| `motion-base` | `180ms` | card hover, chip change |
| `motion-slow` | `260ms` | dropdown reveal, overlays |

### Interaction Effects

- Cards lift by `2px` on hover or active press
- Seed counters animate upward gently
- Dropdown opens like a paper panel unfolding downward
- Progress changes should sweep smoothly, not snap

## Iconography

- Use rounded, slightly hand-friendly icon shapes
- Avoid ultra-sharp enterprise line icons
- Seed icon is the main reward motif
- Keep icons secondary to typography

## Component System

## App Shell

**Purpose**

Create a stable, premium mobile frame for the parent experience.

**Rules**

- Top bar stays calm and minimal
- Page title uses `Fraunces`
- Family-level seed summary can live in the top bar
- Bottom navigation floats above the page with soft inset shadow

## ChildSelector

**Role**

Persistent active-child context switcher for multi-child households.

**Visual treatment**

- Pill-shaped card with soft cream fill
- Thin sage border
- Small seed or crest icon on the left
- Child name and age stacked or inline
- Current seed count shown in numeric font
- Chevron on the far right

**Expanded dropdown**

- Paper-white tray
- Each child row includes:
  name, age, seeds, and current goal
- Use subtle separators, not heavy borders
- If many children exist, tray scrolls inside a fixed-height panel

**States**

- default: soft cream surface
- hover: slightly brighter surface and deeper shadow
- active: outline strengthens and dropdown opens
- selected row: soft sage tint with small gold indicator

## GoalCard

**Role**

Make the selected child's goal feel meaningful and premium.

**Visual treatment**

- Larger than other cards
- Folded-ledger styling with layered header and body
- Title in `Fraunces`
- Seed count in `IBM Plex Sans`
- Progress bar framed inside a soft inset groove
- Milestone note styled like a handwritten ledger annotation

**Content priority**

1. goal title
2. progress
3. milestone
4. action button

## QuestCard

**Role**

Support fast approval and scanning for AI-generated or approved quests.

**Visual treatment**

- Cream surface with crisp padding
- Thin sage outline
- Reward chip in soft gold
- Category label in muted moss capsule
- Buttons stay compact and aligned at the bottom or right edge

**States**

- pending: neutral
- approved: pale sage accent
- completed: soft success tint
- rejected: muted rose-beige tint

## MomentCard

**Role**

Present family activities as special, warm, slightly ceremonial actions.

**Visual treatment**

- Similar structure to `GoalCard`, but lighter
- Activity title in serif
- Support details in sans
- Time chip and reward chip grouped together
- Primary CTA gets the richest gold accent on the screen

## MascotBubble

**Role**

Deliver warmth and delight without hijacking the interface.

**Visual treatment**

- Paper speech card with rose-dust accent shadow
- Lena avatar or floral glyph on the left
- Optional voice action as a secondary pill button
- Keep bubble compact and readable

**Behavior**

- Only one mascot block per section
- Avoid stacking multiple mascot messages on a screen

## ProgressBar

**Role**

Show progress clearly while matching the ledger aesthetic.

**Visual treatment**

- Rounded inset track
- Warm cream track with sage outline
- Fill uses gold for rewards and moss-gold blend for long goals
- Milestone nodes can appear as tiny seed markers

## Button System

### Primary Button

- gold-toned fill
- moss or ink text
- rounded pill shape
- use for one primary action per section

### Secondary Button

- cream fill
- sage border
- moss text

### Tertiary Button

- text-first
- minimal background
- used for back, retry, or alternate actions

## Inputs And Selects

- Inputs use cream or linen surfaces
- Border stays soft sage
- Placeholder text is muted moss-gray
- Focus state uses gold ring plus stronger sage border

## Bottom Navigation

**Visual treatment**

- Floating rounded dock
- Paper-white surface
- Soft inset and outer shadow
- Active item gets moss text plus gold seed underline or dot

**Behavior**

- Always visible on primary parent screens
- Use labels plus icons
- Keep spacing wide enough for thumb taps

## Screen Translation

## Parent Dashboard

**Visual focus**

- top title and family seed summary
- `ChildSelector`
- `GoalCard`
- quest stack
- quiet mascot message

**Design notes**

- Keep `GoalCard` above quests
- Quest stack can slightly overlap in vertical rhythm to feel curated
- Snapshot metrics should appear as small ledger stats, not dashboard charts

## Adventures

**Visual focus**

- child selector
- category filters
- quest list
- approved summary

**Design notes**

- Use a tighter, more operational layout than the dashboard
- Reward chips should remain very readable
- Avoid making this feel like a task management app

## Dreams

**Visual focus**

- selected-child goal
- progress bar
- seed action controls
- milestone storytelling

**Design notes**

- This screen should feel the most reflective and motivational
- Use more breathing room here than on Adventures

## Moments Planner

**Visual focus**

- child selector
- AI suggestion card
- plan summary
- prominent `Start Moment` action

**Design notes**

- This page should feel gently celebratory
- Use the softest gold accent here after the goal card

## Proximity Check

**Visual focus**

- clear status
- parent and child labels
- confirmation state
- next action

**Design notes**

- Strip away visual clutter here
- This is a trust screen, so clarity beats charm
- Success color should be subtle and reassuring

## Timer And Completion

**Visual focus**

- timer digits
- progress ring or bar
- reward summary
- celebration overlay

**Design notes**

- Timer digits should use `IBM Plex Sans`
- Keep completion state warm and elegant, not gamified chaos
- Celebration may use a soft blossom or seed shimmer in the background

## Accessibility Rules

- Maintain readable contrast against parchment and cream surfaces
- Minimum touch target: `44px`
- Do not encode status with color alone
- Numeric progress should always appear in text, not only in bars
- Dropdown states must remain clear on keyboard focus

## Tailwind Implementation Prep

### Suggested Token Names

```ts
colors: {
  parchment: "#F6F0E5",
  paper: "#FBF8F1",
  linen: "#EEE5D6",
  sage: "#D8E3D1",
  moss: "#4F6B52",
  ink: "#2F342C",
  wood: "#A67C52",
  gold: "#E6C766",
  rose: "#D8B7AA",
}
```

### Utility Priorities

- reusable page container
- reusable ledger card
- reusable pill selector
- reusable gold reward chip
- reusable dock navigation shell

### Font Loading Priority

1. `Fraunces`
2. `Manrope`
3. `IBM Plex Sans`

## Do Not Do

- no pure white sterile screens
- no heavy gradients across entire cards
- no neon gold
- no oversized emoji-driven UI
- no overly cute cartoon framing
- no cramped dashboard grids
- no sharp corporate blue focus states

## Implementation Order

1. App background and type system
2. Top app shell and bottom nav
3. `ChildSelector`
4. `GoalCard`
5. `QuestCard`
6. `MomentCard`
7. `MascotBubble`
8. motion and polish

## Ready State

This design system is ready to guide:

- page implementation in `app/[locale]/parent/...`
- component styling rules
- Tailwind token setup
- a high-fidelity UI pass for the parent dashboard and related screens
