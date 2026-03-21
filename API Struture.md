Lena’s Homestead — CRUD API Contract
Base API

Supabase automatically exposes:

BASE_URL
https://<project-id>.supabase.co/rest/v1/

All requests require:

apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
1. Families API
Create Family
POST /families

Body

{
  "name": "Nguyen Household"
}

Response

{
  "id": "uuid",
  "name": "Nguyen Household",
  "createdAt": "timestamp"
}
# Get Families
## GET /families
Get Single Family
GET /families?id=eq.{familyId}
Update Family
PATCH /families?id=eq.{familyId}

Body

{
  "name": "Updated Family Name"
}
Delete Family
DELETE /families?id=eq.{familyId}
2. Parents API
Create Parent
POST /parents

Body

{
  "familyId": "uuid",
  "name": "Alice",
  "email": "alice@email.com"
}
Get Parents of Family
GET /parents?familyId=eq.{familyId}
Update Parent
PATCH /parents?id=eq.{parentId}

Body

{
  "name": "Alice Updated"
}
Delete Parent
DELETE /parents?id=eq.{parentId}
3. Children API
Create Child
POST /children

Body

{
  "familyId": "uuid",
  "name": "Emma",
  "childAge": 8
}

Response

{
  "id": "uuid",
  "name": "Emma",
  "childAge": 8,
  "coins": 0
}
Get Children by Family
GET /children?familyId=eq.{familyId}
Update Child
PATCH /children?id=eq.{childId}

Body

{
  "coins": 50
}
Delete Child
DELETE /children?id=eq.{childId}
4. Quests API (Core Flow)
Create Quests (Parent Approval)
POST /quests

Body

[
  {
    "childId": "uuid",
    "title": "Run for 5 minutes",
    "description": "Do a short exercise",
    "reward": 10,
    "assignedDate": "2026-03-21",
    "status": "pending"
  }
]
Get Today's Quests
GET /quests?childId=eq.{childId}&assignedDate=eq.{today}
Start Quest
PATCH /quests?id=eq.{questId}

Body

{
  "status": "ongoing"
}
Complete Quest
PATCH /quests?id=eq.{questId}

Body

{
  "status": "completed",
  "completedAt": "timestamp"
}
Delete Quest
DELETE /quests?id=eq.{questId}
5. Quest Streak API
Get Streak
GET /quest_streaks?childId=eq.{childId}
Update Streak
PATCH /quest_streaks?childId=eq.{childId}

Body

{
  "currentStreak": 5,
  "longestStreak": 8
}
6. Activities API (Family Moment Flow)
Create Activity
POST /activities

Body

{
  "familyId": "uuid",
  "childId": "uuid",
  "activity": "Visit Aquarium Cafe",
  "locationName": "Ocean Cafe",
  "mapsLink": "google maps url"
}
Get Activities
GET /activities?familyId=eq.{familyId}
Complete Activity
PATCH /activities?id=eq.{activityId}

Body

{
  "completed": true
}
7. Goals API
Create Goal
POST /goals

Body

{
  "childId": "uuid",
  "title": "Buy Birthday Gift",
  "target_coins": 100,
  "deadline": "2026-04-01"
}
Get Goals
GET /goals?childId=eq.{childId}
Update Goal Progress
PATCH /goals?id=eq.{goalId}

Body

{
  "target_coins": 120
}
8. Child Preferences API
Get Preferences
GET /child_preferences?childId=eq.{childId}
Update Preference Score
PATCH /child_preferences?id=eq.{preferenceId}

Body

{
  "score": 6
}
9. Advisor Messages API
Create Advisor Suggestion
POST /advisor_messages

Body

{
  "familyId": "uuid",
  "parentId": "uuid",
  "childId": "uuid",
  "message": "Emma might enjoy visiting an aquarium today",
  "suggestedActivity": "Aquarium Visit"
}
Get Advisor Messages
GET /advisor_messages?familyId=eq.{familyId}
Update Message Status
PATCH /advisor_messages?id=eq.{messageId}

Body

{
  "status": "accepted"
}
10. Event Logs API
Create Event Log
POST /event_logs

Body

{
  "familyId": "uuid",
  "childId": "uuid",
  "eventType": "quest_completed",
  "metadata": {
    "questTitle": "Run for 5 minutes"
  }
}
Get Event Logs
GET /event_logs?familyId=eq.{familyId}
11. Place Cache API
Store Location Results
POST /place_cache

Body

{
  "query": "aquarium cafe",
  "placeName": "Ocean Cafe",
  "rating": 4.5,
  "openNow": true,
  "mapsLink": "google maps url"
}
Get Cached Places
GET /place_cache?query=eq.aquarium%20cafe
12. Calendar API
Create Calendar Event
POST /calendar_events

Body

{
  "parentId": "uuid",
  "familyId": "uuid",
  "title": "Family Activity",
  "startTime": "timestamp",
  "endTime": "timestamp"
}
Get Calendar Events
GET /calendar_events?parentId=eq.{parentId}
Final API Structure
/families
/parents
/children
/quests
/quest_streaks
/activities
/goals
/advisor_messages
/child_preferences
/calendar_events
/event_logs
/place_cache
How This Supports the Two Main Flows
Quest Flow
quests
quest_streaks
event_logs
children
Activity Flow
activities
calendar_events
advisor_messages
place_cache
Recommended Frontend Integration Pattern
Next.js UI
     ↓
Supabase JS SDK
     ↓
Supabase REST API
     ↓
Postgres Database