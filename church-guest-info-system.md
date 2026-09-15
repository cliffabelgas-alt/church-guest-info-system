# Church Guest Information System — App Spec

## 1. Overview
A guest management system to help church staff and volunteers capture, track,
and follow up with first-time and returning guests. Goal: make check-in fast
for guests and follow-up easy for staff, using AI to speed up both
development and day-to-day operations.

## 2. Core Goals
- Reduce friction for guests checking in (especially first-timers)
- Give staff a simple dashboard of who visited, when, and what follow-up is needed
- Automate repetitive tasks (thank-you notes, follow-up reminders, data entry)
- Keep guest data private and secure

## 3. Primary Users
- **Guests** — fill out a short form (in person via kiosk/tablet, or online)
- **Front desk / greeters** — check guests in, view visit history
- **Follow-up team / pastors** — see new guests, log outreach, add notes
- **Admin** — manage forms, reports, exports, user permissions

## 4. Key Features

### 4.1 Guest Check-In
- Quick check-in form: name, contact info, first-time vs. returning, how they heard about the church, prayer requests, children's ministry needs
- QR code / kiosk mode for self check-in
- Option for guest to skip fields they're not comfortable sharing

### 4.2 Guest Profiles
- Auto-created/updated profile per guest
- Visit history log (dates attended, service/event)
- Notes field for staff (private, internal only)
- Tags (e.g., "visiting family," "new to area," "interested in membership")

### 4.3 Follow-Up Workflow
- Auto-flag new guests for follow-up within X days
- Assign follow-up owner (staff/volunteer)
- Track follow-up status: Not started / In progress / Complete
- Optional: auto-generate a draft thank-you email/text (AI-assisted)

### 4.4 Dashboard & Reporting
- New guests this week/month
- Follow-up completion rate
- Attendance trends by service/event
- Exportable reports (CSV/PDF)

### 4.5 Notifications
- Alert staff when a new guest checks in
- Reminder nudges for pending follow-ups
- Optional guest-facing: automated "thanks for visiting" message

### 4.6 Admin & Settings
- Manage check-in form fields
- User roles & permissions (Admin / Staff / Volunteer / Read-only)
- Data export & backup
- Privacy/consent settings (opt-in for texts/emails)

## 5. Suggested Data Model

```
Guest
- id
- first_name
- last_name
- email
- phone
- address (optional)
- first_visit_date
- how_heard (dropdown/text)
- household_members (optional, for families)
- tags []
- notes []
- consent_email (bool)
- consent_text (bool)

Visit
- id
- guest_id
- date
- service_or_event
- checked_in_by

FollowUp
- id
- guest_id
- assigned_to
- status (not_started / in_progress / complete)
- due_date
- completed_date
- notes

User
- id
- name
- role (admin / staff / volunteer)
- email
```

## 6. Where AI Can Expedite Development
- **Scaffolding**: generate boilerplate CRUD screens (check-in form, guest list, follow-up board) from this spec
- **Form validation logic**: auto-generate validation rules (required fields, phone/email format)
- **Draft copy**: AI-generated thank-you messages, follow-up email/text templates
- **Data migration scripts**: if importing existing guest lists from spreadsheets/Church Management Software (CMS)
- **Test data generation**: sample guest records for testing the dashboard before real data exists
- **Summarization**: weekly digest of new guests and follow-up status for pastoral staff

## 7. Where AI Can Expedite Ongoing Operations
- Draft personalized follow-up messages based on notes (e.g., "asked about kids ministry")
- Summarize prayer requests submitted through the form
- Suggest which guests may need re-engagement based on attendance gaps

## 8. Tech Stack Suggestions (adjust to your team's skills)
- **Frontend**: React or simple mobile-friendly web form (kiosk mode)
- **Backend**: Node.js/Express, or a low-code backend (Airtable, Supabase, Firebase)
- **Database**: PostgreSQL or Airtable/Supabase for faster MVP
- **Auth**: Simple role-based login (Supabase Auth, Firebase Auth, or Clerk)
- **Notifications**: Email via SendGrid/Postmark; SMS via Twilio (optional)
- **Hosting**: Vercel/Netlify (frontend), Railway/Render (backend) for low-cost MVP hosting

## 9. Privacy & Data Handling Notes
- Always include a consent checkbox for email/text follow-up
- Store only what's needed; avoid collecting sensitive info beyond what's necessary
- Restrict guest notes/prayer requests to authorized staff roles only
- Have a data retention/deletion policy (e.g., guest can request removal)

## 10. Suggested MVP Scope (Phase 1)
1. Check-in form (in-person, tablet-based)
2. Guest profile + visit history
3. Basic follow-up list with status tracking
4. Simple dashboard (new guests this week, pending follow-ups)

**Phase 2 additions**: online check-in, automated messaging, advanced reporting, family/household grouping.

## 11. Open Questions to Resolve
- Do you already use a Church Management System (Planning Center, Breeze, ChurchTrac, etc.) this should integrate with, or is this fully standalone?
- Will check-in happen primarily in-person (kiosk/tablet) or does it need an online/pre-registration option too?
- Who needs access — just staff, or also volunteers doing follow-up?
