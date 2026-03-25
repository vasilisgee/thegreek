# theGreek: One-Page Business Site + Admin Panel

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-111111?style=flat&logo=shadcnui&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Postgres-4169E1?style=flat&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

A minimal one-page restaurant website with a fully functional CMS admin panel, built as part of the **Gleem project ecosystem**, an original portfolio concept exploring affordable website delivery for small local businesses.

💻 [View Live Site](https://thegreekrestaurant.vercel.app/) &nbsp;&nbsp; 🎛 [Try Admin Panel](https://thegreekrestaurant.vercel.app/login) &nbsp;&nbsp; 🏢 [Gleem: The Company Behind It](https://getgleem.vercel.app)

---

## What Is This?

theGreek is the product that [Gleem](https://github.com/vasilisgee/gleem-landing) sells, a real deployed example of what a Gleem website looks like in production. It serves as both a working demo and a standalone portfolio project in its own right.

The site represents an imaginary Greek restaurant in Stockholm. It is bilingual (EN/SV), fully content-managed through the admin panel, and deployable at zero cost using Vercel and Supabase free plans.

## Project Highlights

- One-page marketing website built with Next.js App Router
- Custom lightweight CMS: content, media, menu catalogue, appearance and SEO all editable from the panel
- Bilingual support (English / Swedish) managed through the admin panel
- Secure Google OAuth with email whitelisting and role-based access
- Guest mode for demo access, explore the full panel without modifying data
- Lighthouse-optimized: performance, accessibility and SEO tuned post-launch
- Deployable at zero cost on Vercel + Supabase free plans

## Screenshots

> Coming soon.

## Tech Stack

### Frontend
- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Embla Carousel

### Admin Panel & Backend
- Supabase Auth (Google OAuth)
- Supabase Postgres
- Supabase Storage
- Admin access control via `NEXT_PUBLIC_ADMIN_EMAILS`
- Idle session logout

## Custom Components

Built from scratch on top of shadcn/ui primitives. These represent deliberate component design decisions, not just configuration:

- **`MediaCard`**: Media upload block with image/video tabs, live preview, and replace/remove actions
- **`ImageCard`**: Image uploader with live preview, loading skeleton, and clear/replace controls
- **`FileCard`**: File uploader with type validation, filename preview, and remove action
- **`LanguageTabs`**: Language switcher UI for editing translated content across EN/SV locales
- **`Menu Catalogue`**: Full admin workflow: create categories and items, edit multilingual content, upload images, drag-and-drop reorder, save and delete

## Architecture Notes

Next.js App Router was chosen over Pages Router for its native support of React Server Components, which keeps the public-facing site lightweight while the admin panel runs entirely client-side. Supabase was selected over a custom backend to keep the project deployable on free plans without sacrificing real auth, storage, and a relational database. The admin and public site share the same Next.js project but are cleanly separated by route groups, with middleware handling auth protection on the `/admin` path.

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Full CMS access, edit and save all content |
| **Guest** | Read-only, inputs are empty, save actions disabled |

Guest mode is intentional for portfolio demo purposes. Anyone can explore the full panel without credentials.

## Database Schema

| Table | Description |
|-------|-------------|
| `site_settings` | Global website text, analytics, maps, hero media (single row) |
| `media_assets` | Hero media, PDFs, and shared assets (single row) |
| `thumb_gallery` | About section lightbox images (multiple rows) |
| `slider_gallery` | Events slider images and titles (multiple rows) |
| `admin_users` | Admin profile data |

---

## Local Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Create `.env.local`
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Comma-separated admin email whitelist
   NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
   # Inactivity timeout in minutes
   NEXT_PUBLIC_ADMIN_IDLE_MINUTES=15
   ```

3. Run the dev server
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`

OAuth redirect URL for local development:
```
http://localhost:3000/auth/callback
```

---

## Part of the Gleem Ecosystem

This project is the live product demo for [Gleem](https://github.com/vasilisgee/gleem-landing), an original portfolio concept built to demonstrate a full product delivery workflow. Gleem's landing page links directly to this project as the working example of what their service delivers.

Both projects are part of a larger body of work documented at **[vasilisportfolio.com](https://vasilisportfolio.com)**.

## License

This project is personal and educational work. Free to explore and reference. Commercial use or redistribution is not permitted without permission.
