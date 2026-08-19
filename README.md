# Newcomer Training Schedule

A shared, read-only training schedule for Customer Care newcomers. Not an LMS — a public onboarding timetable.

## Status: Phase 2

Schedule data now lives in Supabase. The public page queries `schedules` (filtered to `status = 'published'`) joined with `training_days` and `activities`, protected by Row Level Security — there is still no admin editor or auth yet (that's Phase 3).

If Supabase isn't configured (no `.env.local`), the app falls back to the same sample data from Phase 1 with a console warning, so local UI work doesn't strictly require a database connection. Once you add real credentials, it switches to live data automatically.

## Supabase setup

1. **Create a project** at [supabase.com](https://supabase.com) if you don't have one yet.
2. **Run the schema.** In your project's Dashboard → SQL Editor → New query, paste the contents of `supabase/schema.sql` and run it. This creates all six tables (`templates`, `template_days`, `template_activities`, `schedules`, `training_days`, `activities`), indexes, an `updated_at` trigger, and the Row Level Security policies that let the public page read only published schedules.
3. **Load the sample schedule.** In a new SQL Editor query, paste the contents of `supabase/seed.sql` and run it. This inserts the same 6-day "Customer Care Newcomer – Standard" schedule used in Phase 1 — so the public page shows identical content once you flip on real data. Safe to re-run; it deletes and re-inserts by slug/name first.
4. **Get your API credentials.** Project Settings → API → copy the "Project URL" and the "anon / public" key (not the service_role key).
5. **Set your environment variables.** Copy `.env.example` to `.env.local` and fill in the two values from step 4:
   ```bash
   cp .env.example .env.local
   ```
6. **Restart the dev server** (`npm run dev`) — it should now be reading from Supabase instead of the sample data fallback.

### On Vercel

Add the same two variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) under Project Settings → Environment Variables, for both Production and Preview. Redeploy after adding them.

## Local development

Requirements: Node.js 18.18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects straight to the published schedule (from Supabase if configured, otherwise the sample data).

To check a production build locally:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  page.tsx                     redirects to the sample published schedule
  schedule/[slug]/page.tsx     the public schedule route — loads from Supabase, falls back to sample data
  layout.tsx, globals.css

components/
  ScheduleView.tsx             client component: holds focus-day / view-all state
  ScheduleHeader.tsx           title, day count, date range
  JourneyRail.tsx              the connected day-timeline at the top
  DayNav.tsx                   prev/next + view-all toggle
  DayCard.tsx                  one training day's content
  ActivityRow.tsx              renders each activity type distinctly

lib/
  types.ts                     Schedule / TrainingDay / Activity shapes (app-level, camelCase)
  sample-data.ts                Phase 1 sample schedule — now used only as a config-missing fallback
  schedule-dates.ts             day-number → calendar date, weekend skipping, "today" logic
  supabase/
    client.ts                   Supabase client factory + isSupabaseConfigured() check
    db-types.ts                 raw DB row shapes (snake_case, as Supabase returns them)
    queries.ts                  getPublishedScheduleBySlug() — fetches + maps DB rows to app types

supabase/
  schema.sql                   tables, indexes, triggers, RLS policies — paste into the SQL Editor once
  seed.sql                     sample template + published schedule — paste into the SQL Editor once
```

## Deploying (GitHub → Vercel)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Phase 2: Supabase-backed schedule data"
   git branch -M main
   git remote add origin https://github.com/<your-org>/<repo-name>.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
   - Framework preset: Vercel auto-detects Next.js — no config needed.
   - Add the two Supabase environment variables (see "On Vercel" above) before the first deploy, or add them after and redeploy.
   - Click **Deploy**. Vercel gives you a URL like `https://<project>.vercel.app`.
   - The public link to share will be `https://<project>.vercel.app/schedule/customer-care`.

3. **Custom domain (optional)**: add it under the Vercel project's Domains settings once you have one you'd like to use (e.g. `training.webnode.com`).

## What changes in later phases

- **Phase 3**: the admin editor (auth-gated `/admin` routes, Supabase Auth, `SUPABASE_SERVICE_ROLE_KEY` for privileged writes).
- **Phase 4**: templates + start-date calculation in the admin UI (the underlying schema and `lib/schedule-dates.ts` logic already support this — `seed.sql` even demonstrates the template → schedule copy that "Publish" will do).
- **Phase 5**: draft/published toggle exposed in the admin UI (already enforced at the data layer — flipping `schedules.status` is all "Publish" needs to do).
- **Phase 6**: polish, Graphik font files, mobile pass.
