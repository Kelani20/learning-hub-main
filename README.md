# Learning Hub

A modern, full-stack learning management platform where teams browse courses, learn through video lessons and adaptive practice, discuss what they're learning, and ship their own course content from a polished instructor studio.

## Features

- **Course catalog** — search, category filters, progress tracking, enrollment, and secure checkout for paid courses
- **Adaptive practice** — generate quizzes on any topic, save attempts, and review your history and topic mastery over time
- **Discussions** — threaded conversations per course so learners and instructors can trade questions and answers
- **Instructor studio** — build courses with chapters, attachments, drag-to-reorder, uploads, and one-click publishing
- **Analytics** — track enrollment, revenue, and course performance from a dedicated dashboard
- **Integrations** — a connector hub showing everything Learning Hub connects to, from auth and video to payments, storage, and observability
- **Video lessons** — embedded URL playback by default, with optional Mux streaming
- **Dark mode** — a refined dark-first interface with full responsive support across every surface
- **Roles** — switch between learner and instructor experiences from the navbar

## Tech Stack

- **Framework** — Next.js 15 (App Router), React 18, TypeScript
- **Styling** — Tailwind CSS with a teal-accented design system
- **Database** — Prisma 5 with PostgreSQL
- **Testing** — Vitest and Testing Library
- **Uploads** — UploadThing
- **Optional integrations** — Stripe (payments), Mux (video), Supabase (auth, Postgres, storage, realtime, edge functions, vector search), PostHog, and Sentry

## Screenshots

> _Add screenshots or a short walkthrough GIF here (catalog, lesson player, instructor studio, analytics)._

## Quick Start

```bash
npm install --legacy-peer-deps
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

The seed creates a full catalog across Frontend, Backend, AI, and Product categories — including free and paid courses, published chapters, progress, discussions, and saved practice attempts — so you can explore the platform end to end immediately. Seed data is deterministic, so you can reset state at any time with `npm run db:seed`.

## Configuration

Learning Hub reads provider settings from environment variables, so you can swap implementations without touching UI code:

```env
AUTH_PROVIDER="demo"
VIDEO_PROVIDER="url"
PAYMENT_PROVIDER="demo"
QUIZ_PROVIDER="local"
DISCUSSION_PROVIDER="database"
```

- Enable Stripe with `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET`.
- Enable Mux streaming with `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET`.
- Add Supabase with `NEXT_PUBLIC_SUPABASE_URL` and a public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`); keep `SUPABASE_SERVICE_ROLE_KEY` in server-side secrets only.
- Visit `/integrations` to see which connectors are active and which become available as you add keys.

Every public response ships with baseline security headers: frame denial, content-type sniffing protection, strict-origin referrers, and locked camera, microphone, and geolocation permissions. Never commit real secret keys.

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run lint       # lint the codebase
npm run typecheck  # TypeScript type checking
npm run test       # run the Vitest suite
npm run verify     # lint, typecheck, test, and build
```

## Built by Usama Kelani

Designed and built by **Usama Kelani**.

- Portfolio: [usamakelani.com](https://usamakelani.com)
- LinkedIn: [linkedin.com/in/usamakelani](https://linkedin.com/in/usamakelani)
- GitHub: [github.com/Kelani20](https://github.com/Kelani20)
