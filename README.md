# theGreek — Restaurant Website & CMS

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=0A0A0A)

A modern one-page restaurant website template built with **Next.js App Router** and **GSAP**, featuring a custom lightweight **CMS admin dashboard** for managing content, media, and translations.

<a href="https://thegreek.vercel.app" target="_blank">View it Live</a> • <a href="https://thegreek.vercel.app/login" target="_blank">Admin Panel</a>


## Highlights
- Modern marketing site with hero media, galleries, and rich sections
- CMS-style admin dashboard for website text, photos, media, and settings
- Google OAuth login with an email whitelist
- Multi-language content support
- Supabase storage integration for media uploads
- GSAP-powered animations and a custom visual theme

## Tech Stack
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **GSAP** (frontend animations)
- **Supabase** (Auth, Database, Storage)

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
2. Create `.env.local`
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # admin emails whitelist
   NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another@example.com
   # user inactivity timeout (minutes)
   NEXT_PUBLIC_ADMIN_IDLE_MINUTES=15
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Authentication & Access

- Google OAuth via Supabase
- Only emails listed in `NEXT_PUBLIC_ADMIN_EMAILS` can access /admin
- Automatic logout after inactivity
- Guest mode allows navigation but blocks saving and hides data
  
OAuth redirect URL:
```text
http://localhost:3000/auth/callback
```

## User Roles
- **Admin** — full CMS access (edit & save)
- **Guest** — read-only access, empty inputs, save actions disabled

## Database Schema (Supabase)
- `site_settings` — global website text, analytics, maps, hero media (single-row)
- `media_assets` — hero media, PDFs, and shared assets (single-row)
- `thumb_gallery` — about section lightbox images (multiple rows)
- `slider_gallery` — events slider images + titles (multiple rows)
- `admin_users` — admin profile data

## License / Usage
Free for personal and educational use. Commercial use is not permitted without permission.
