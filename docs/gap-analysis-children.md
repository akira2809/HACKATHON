# Gap Analysis — UI Prompt V2 vs. Implementation

> So sánh spec `UI Prompt V2.txt` với những gì đã implement. Đánh dấu ✅ = xong, ❌ = còn thiếu.

---

## 1. Routes / Pages

| Spec | Path | Status |
|------|------|--------|
| Parent Dashboard | `/page.tsx` (trong `(homestead)`) | ❌ Chưa có |
| Child Selector | `/children/page.tsx` | ❌ Chưa có |
| Child Quest Screen | `/adventures/page.tsx` | ✅ Xong |
| Goals | `/dreams/page.tsx` | ✅ Xong |
| Family Moments Planner | `/moments/page.tsx` | ✅ Xong |
| Advisor Suggestions | `/advisor/page.tsx` | ❌ Chưa có |
| Proximity Check | `/moments/proximity/page.tsx` | ❌ Chưa có |
| Family Moment Timer | `/moments/timer/page.tsx` | ❌ Chưa có |

---

## 2. Components

| Spec | File | Status | Ghi chú |
|------|------|--------|---------|
| TopNav | `TopNav.tsx` | ✅ | Seeds từ quest store |
| BottomNav | `BottomNav.tsx` | ✅ | Role toggle từ app store |
| QuestCard | `QuestCard.tsx` | ✅ | 6 trạng thái + countdown |
| GoalCard | `DreamGoal.tsx` | ✅ | |
| MomentCard | — | ❌ | Cần tách `MomentsContent` |
| **AdvisorCard** | — | ❌ Còn thiếu | |
| **PlaceSuggestionCard** | — | ❌ Còn thiếu | |
| **MascotBubble** | `SpeechBubble.tsx` | ✅ | |
| ProgressBar | `ProgressBar.tsx` | ✅ | |
| **StreakBadge** | — | ❌ Còn thiếu | |
| QuestCountdown | Tích hợp trong `QuestCard.tsx` | ✅ | |

---

## 3. Lib / API Helpers

| Spec | File | Status |
|------|------|--------|
| OpenAI integration | `lib/openai.ts` | ❌ Chưa có |
| ElevenLabs voice | `lib/elevenlabs.ts` | ❌ Chưa có |
| Haversine distance | `lib/distance.ts` | ❌ Chưa có |

---

## 4. Global State (Zustand)

| Spec | Store | Status |
|------|-------|--------|
| family name | `app.store.ts` | ✅ |
| children[] | — | ❌ Còn thiếu |
| selectedChildId | — | ❌ Còn thiếu |
| quests | `quest.store.ts` | ✅ |
| **streak** | — | ❌ Còn thiếu |
| goal | `dream.store.ts` | ✅ |
| advisorMessages | — | ❌ Còn thiếu |
| **dailyTokens** | — | ❌ Còn thiếu |

---

## 5. Main Features

| # | Feature | Status | Ghi chú |
|---|---------|--------|---------|
| 1 | Child Selector | ❌ Còn thiếu | Cần route `/children` + store |
| 2 | Quest Generation (AI) | ❌ Còn thiếu | Cần `lib/openai.ts` + API call |
| 3 | Quest Expiration | ✅ Xong | `checkExpiredQuests()` |
| 4 | Quest Completion | ✅ Xong | `completeQuest()` → +seeds |
| 5 | Streak System | ✅ Xong | `streak` + `checkAndUpdateStreak()`, StreakBadge component |
| 6 | Goal Progress | ✅ Xong | `dream.store.ts` |
| 7 | Advisor System (AI) | ❌ Còn thiếu | AdvisorCard + `lib/openai.ts` |
| 8 | Place Discovery | ❌ Còn thiếu | PlaceSuggestionCard + Google Maps |
| 9 | Family Moments | ✅ Xong | `moments.store.ts` |
| 10 | Proximity Check | ✅ Xong | `useProximity` hook + `/moments/proximity/page.tsx` |
| 11 | Family Moment Timer | ✅ Xong | `moment.store.ts` có `startTimer/tickTimer/finishTimer` |
| 12 | Mascot Interactions | ✅ Xong | `MascotSection` |
| 13 | Voice Integration | ❌ Còn thiếu | ElevenLabs + `lib/elevenlabs.ts` |
| 14 | Navigation | ✅ Xong | BottomNav với role toggle |

---

## 6. Cấu trúc hiện tại

```
app/[locale]/
├── layout.tsx
├── providers.tsx
└── (homestead)/
    ├── layout.tsx          ← TopNav + BottomNav (shared)
    ├── page.tsx           ← Home (Server wrapper)
    ├── ChildHomeContent.tsx ← Home (Client + quest store)
    ├── AdventuresContent.tsx ← Adventures (Client + quest store)
    ├── DreamsContent.tsx  ← Dreams (Client + quest/dream store)
    ├── MomentsContent.tsx  ← Moments (Client + moment store)
    ├── adventures/page.tsx
    ├── dreams/page.tsx
    └── moments/page.tsx

stores/
├── index.ts
├── quest.store.ts         ✅ localStorage
├── dream.store.ts        ✅ localStorage
├── moment.store.ts        ✅ localStorage
└── app.store.ts          ✅ localStorage

components/homestead/     ✅ Homestead Design System
```

---

## 7. Priority đề xuất cho team

### 🔴 Cao (MVP cần thiết)
1. **Multi-child support** — `children[]` + `selectedChildId` trong store
2. **Child Selector route** — `/children/page.tsx`
3. **Streak system** — thêm `streak` +o `quest.store.ts`
4. **AdvisorCard** — component hiển thị gợi ý AI
5. **Advisor route** — `/advisor/page.tsx`

### 🟡 Trung bình (Tăng trải nghiệm)
6. **OpenAI quest generation** — `lib/openai.ts` + call khi parent bấm nút
7. **Proximity check** — `/moments/proximity/page.tsx`
8. **Moment timer** — `/moments/timer/page.tsx`

### 🟢 Thấp (Nice to have)
9. **ElevenLabs voice** — `lib/elevenlabs.ts`
10. **PlaceSuggestionCard** + Google Maps link
11. **Parent Dashboard** — route `/` cho parent
12. **MomentCard** tách component riêng

---

## 8. Open questions

- [ ] Quest generation: dùng OpenAI hay hardcoded mock data trước?
- [ ] ElevenLabs: cần API key từ đâu? `.env`?
- [ ] Proximity: 50m threshold hay config được?
- [ ] Streak: reset khi nào? (cuối ngày? sau 24h?)
- [ ] Multi-child: mỗi child có quest riêng hay share?
