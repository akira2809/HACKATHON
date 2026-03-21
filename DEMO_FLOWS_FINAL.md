Hackathon Demo Scenario
“A Cozy Wednesday Evening at Lena’s Homestead”
Characters

Parent:

Alice (Mother)

Child:

Emma (8 years old)

Family:

Nguyen Household

Day:

Wednesday

Free time:

6:30 PM – 7:30 PM

Location:

At home
Demo Flow Overview

The demo shows two flows:

Quest Flow
↓
Activity Flow
↓
Reward + Streak

Total demo time:

2–3 minutes
Scene 1 — Parent Opens Lena’s Homestead

Parent opens the Parent Dashboard.

Lena greets them:

“Good evening Alice. Let’s prepare Emma’s adventures for today.”

AI suggests 3 quests.

Example suggestions:

1️⃣ Learn 3 new English words  
2️⃣ Run in place for 5 minutes  
3️⃣ Help set the dinner table

Parent actions:

Approve all 3 quests
Backend Operation

Supabase insert:

supabase.from("quests").insert([
 {
  childId: emmaId,
  title: "Learn 3 new English words",
  reward: 10,
  status: "pending"
 },
 {
  childId: emmaId,
  title: "Run in place for 5 minutes",
  reward: 10,
  status: "pending"
 },
 {
  childId: emmaId,
  title: "Help set the dinner table",
  reward: 10,
  status: "pending"
 }
])
Scene 2 — Child Opens the App

Emma opens the Child Dashboard.

Lena appears:

“Emma! Your adventures for today are ready!”

Emma sees:

Today's Quests

Cards appear:

📖 Learn 3 new words  
🏃 Run in place for 5 minutes  
🍽 Help set the dinner table
Scene 3 — Completing Quests

Emma completes quests one by one.

Quest 1

Emma presses:

Start Quest

Status becomes:

ongoing

Parent verifies completion.

Database update:

status = completed

Reward:

+10 Seeds
Quest 2

Same flow.

Reward:

+10 Seeds
Quest 3

Same flow.

Reward:

+10 Seeds

Total reward today:

30 Seeds
Scene 4 — Streak Update

Because Emma completed all 3 quests today, the system checks:

quests_completed_today = 3

Database update:

quest_streaks.currentStreak +1

Lena celebrates:

“Wonderful! Your streak is now 3 days!”

Visual:

🌱 Plant grows slightly
Scene 5 — Activity Suggestion

Now the Activity Flow begins.

Emma opens the Moments tab.

AI suggests 3 activities.

Example:

1️⃣ Read a short story together
2️⃣ Play a board game
3️⃣ Draw a picture together

Emma chooses:

Play a board game
Backend Operation

Supabase insert:

supabase.from("activities").insert({
 childId: emmaId,
 familyId: familyId,
 activity: "Play a board game together",
 completed: false
})
Scene 6 — Parent Scheduling

Parent receives notification:

“Emma wants to play a board game together.”

Parent enters available time:

6:30 PM – 7:30 PM

Since the activity is at home, no location search is needed.

Database update:

activities.locationName = "Home"
activities.mapsLink = null
Scene 7 — Activity Begins

At 6:30 PM.

Parent presses:

Start Activity

Timer appears:

20 minutes

Emma and parent play a board game.

Scene 8 — Activity Completion

Parent presses:

Complete Activity

Database update:

activities.completed = true
Scene 9 — Rewards Granted

Backend operations:

1️⃣ Child reward:

children.coins += 20

2️⃣ Event log:

event_logs.insert({
 eventType: "activity_completed"
})

3️⃣ Parent bonus tokens:

(optional)

Final UI Moment

Lena appears:

“What a wonderful evening at your homestead!”

Summary:

Today's Progress

✔ 3 Quests Completed
✔ 1 Family Moment
🔥 Streak: 3 Days
🌱 Seeds Earned: 50