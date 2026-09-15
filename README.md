# Church Guest Information System

A minimal Next.js (App Router, TypeScript) starter with:

- `/` — landing page with a link to the New Guest form
- `/new-guest` — a simple guest intake form (name, phone, email, first-time flag, notes)

Styling is plain CSS (`app/globals.css`) — no UI framework, kept simple and readable.

## Setup

This project's dependencies aren't installed yet (they need network access, which
wasn't available in the environment that generated these files). To run it:

```bash
# from inside this project folder
npm install
npm run dev
```

Then open http://localhost:3000.

### Supabase

The Supabase client lives in `lib/supabase.ts` and reads its config from
environment variables. Copy the example env file and fill in your project's
values (Supabase dashboard → your project → Settings → API):

```bash
cp .env.local.example .env.local
```

Required variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — your project's URL (e.g. `https://xxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the project's `anon` public API key

`.env.local` is already git-ignored, so your keys won't get committed.

Import the client wherever you need it:

```ts
import { supabase } from "@/lib/supabase";
```

## What's here vs. what's next

- `/` — landing page
- `/new-guest` — sign-up form (full name, email, PH mobile, remarks) with
  friendly validation, inserting into Supabase `guests`.
- `/login` — passwordless (magic link) sign-in for coaches.
- `/dashboard` — a signed-in coach's assigned guests (name, email, cell,
  phase), with an editable remarks box that saves back to `guests`.

Supabase project: `church-guest-info-system` (org `ccfgis`, region
`ap-southeast-1`). Tables:

- `guests`: id, full_name, email, cell, remarks, created_at, phase
- `coaches`: id, name, auth_user_id, created_at
- `assignments`: id, guest_id, coach_id, created_at

Row-level security: a coach (linked via `coaches.auth_user_id = auth.uid()`)
can only select/update guests they're assigned to via `assignments`. Public
sign-up (the anon key) can only insert into `guests`, never read it.

### Setting up a coach

There's no admin UI for this yet. To let someone use `/dashboard`:

1. Have them sign in once via `/login` with their email — this creates
   their `auth.users` row via the magic link flow.
2. In the Supabase dashboard, find their user ID (Authentication → Users).
3. Insert a row into `coaches` with that `auth_user_id` and their name.
4. Insert rows into `assignments` linking `guest_id` to their `coach_id`.

Happy to build a simple admin page for steps 3–4 next, instead of doing
them by hand in the Supabase dashboard.

If you want to build toward the fuller guest-journey flow (QR check-in,
prayer requests, discipleship tier selection, print/email of welcome
letters, DGroup registration & routing), that's a much bigger system with
real architecture decisions (data storage, print/email integrations,
real-time table/runner coordination). Happy to whiteboard that next as a
phased build on top of this scaffold.
