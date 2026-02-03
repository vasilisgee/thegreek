# TheGreek — Restaurant Website + Admin

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=0A0A0A)

A restaurant one-page website template built with Next.js App Router and Supabase. It includes a one-page site plus a lightweight custom admin dashboard for managing content, media, and translations.

<a href="https://thegreek-flame.vercel.app" target="_blank">View it Live</a> • <a href="https://thegreek-flame.vercel.app/login" target="_blank">Admin Panel</a>


## Highlights
- Modern marketing site with hero media, galleries, and rich sections
- CMS-style admin dashboard for website text, photos, media, and settings
- Google OAuth login with an email whitelist
- Multi-language content support
- Supabase storage integration for media uploads
- GSAP-powered animations and a custom visual theme

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- GSAP (frontend animations)
- Supabase (Auth, Database, Storage)

## Project Structure
- `app/` — public website routes
- `app/admin/` — CMS UI (pages + layout)
- `app/auth/` — OAuth callback handling
- `components/admin/` — admin UI components
- `hooks/` — CMS data hooks (business info, media, galleries, texts)
- `lib/auth/` — auth helpers, session sync, guest mode
- `lib/animations/` — GSAP animation setup
- `lib/supabase/` — Supabase client

## Local Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env.local` (see next section)
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Environment Variables
Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# comma-separated admin emails
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another@example.com
# inactivity timeout (minutes)
NEXT_PUBLIC_ADMIN_IDLE_MINUTES=15
```

If you enable Google OAuth in Supabase, add the redirect URL:
```text
http://localhost:3000/auth/callback
```

## Admin Access
- Login via Google OAuth
- Only emails listed in `NEXT_PUBLIC_ADMIN_EMAILS` can access `/admin`
- Guest mode is read-only and blocks saving changes

## User Types
- **Admin** — full access to CMS data and saves
- **Guest** — read-only access, inputs are empty and saving is blocked

## Scripts
```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes
For production, add proper server-side access checks and hardened RLS policies in Supabase.
