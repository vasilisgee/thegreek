# theGreek — One-Page Business Site + Admin Panel

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-111111?style=flat&logo=shadcnui&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Postgres-4169E1?style=flat&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

A minimal one-page restaurant website template built with **React** and **Next.js App Router**, featuring a custom lightweight **CMS admin dashboard** for managing content, media, translations and appearance.

[View it Live](https://thegreekrestaurant.vercel.app/) • [Admin Panel](https://thegreekrestaurant.vercel.app/login)

## Project Purpose

This portfolio project demonstrates a lightweight, SEO friendly, one-page marketing website with a simple, CMS-like admin panel that allows non-technical users to easily manage website content. The frontend is designed to present all essential information a small business needs in a clean, modern layout. When deployed on Vercel and Supabase free plans, the project can run with zero hosting expenses, making it a practical and cost-effective solution for small businesses.


## Highlights
- One-page marketing website built with Next.js App Router
- Custom lightweight CMS for content, media, and translations
- Secure Google OAuth authentication with email whitelisting
- Role-based access control (admin / read-only guest)
- Supabase integration for database, storage, and auth
- Optimized for zero-cost deployment on free hosting plans

## Tech Stack

### Frontend (One-Page Website)
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Embla Carousel
- React Icons

### Backend (Admin Panel)
- shadcn/ui
- Supabase Auth (Google OAuth)
- Supabase Postgres
- Supabase Storage
- Admin access control (`NEXT_PUBLIC_ADMIN_EMAILS`)
- Idle logout session control

### Custom shadcn Components 
- `MediaCard` - Media upload block with image/video tabs, preview, and replace/remove actions.
- `ImageCard` - Reusable image uploader with live preview, loading skeleton, and clear/replace controls.
- `FileCard` - File uploader for admin assets with type validation, filename preview, and remove action.
- `LanguageTabs` (Multilingual card) - Language switcher UI for editing translated content across multiple locales.
- `Business Menu Catalogue Creation & Management` - Admin workflow to create categories and menu items, edit multilingual content, upload item images, reorder via drag and drop, and save or delete entries.

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

## Database Schema 
- `site_settings` — global website text, analytics, maps, hero media (single-row)
- `media_assets` — hero media, PDFs, and shared assets (single-row)
- `thumb_gallery` — about section lightbox images (multiple rows)
- `slider_gallery` — events slider images + titles (multiple rows)
- `admin_users` — admin profile data

## License / Usage
Free for personal and educational use. Commercial use is not permitted without permission.
