# Learning Hub

Learning Hub is a portfolio-ready course platform rebuilt around a free, demo-first workflow. Reviewers can sign in as a learner or instructor, browse courses, complete a fake payment flow, watch embedded lessons, complete quizzes, switch into instructor mode, and use database-backed discussions without needing paid API keys.

## What Works

- Demo authentication with learner and instructor roles
- Demo sign-in and sign-up pages that route into protected learner or instructor workspaces
- Course catalog with category filters, search, progress, enrollment, and paid-course fake checkout
- Instructor course builder with chapters, publishing, uploads, and ordering
- URL-based lesson playback by default, with optional Mux support
- Local quiz generation with saved attempts, topic counts, and history
- Database-backed discussion threads and messages
- Integration hub that shows live demo providers, Supabase capabilities, optional production services, required env keys, and connector roadmap items
- Persistent dark mode with responsive learner, instructor, catalog, analytics, and connector surfaces
- SVG app icon for browser tabs
- Baseline security headers plus closed demo-mode Stripe webhook behavior
- PostgreSQL Prisma schema with deterministic seed data
- Vitest coverage for formatting, enrollment, video URLs, quizzes, progress, and discussions

## Stack

- Next.js 15, React 18, TypeScript, Tailwind CSS
- Prisma 5 with PostgreSQL
- Vitest and Testing Library
- UploadThing for optional uploads
- Supabase JS for optional auth, Postgres, storage, realtime, edge functions, vector search, and observability paths
- Stripe and Mux are optional production integrations, disabled in demo mode

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

## Demo Mode

The default `.env.example` is configured for a fully local showcase:

```env
NEXT_PUBLIC_DEMO_MODE="true"
AUTH_PROVIDER="demo"
VIDEO_PROVIDER="url"
PAYMENT_PROVIDER="demo"
QUIZ_PROVIDER="local"
DISCUSSION_PROVIDER="database"
```

Use the role switcher in the navbar to move between:

- `Demo Learner`: browse, enroll, watch, complete chapters, quiz, discuss
- `Demo Instructor`: create and manage courses from `/admin/courses`

Paid seeded courses open `/checkout/[courseId]`, which simulates a card checkout and then calls the same enrollment API. It is intentionally fake: no real card is charged.

## Useful Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
npm audit --audit-level=high
```

`npm audit --audit-level=high` is the security gate for this demo. The dependency tree has no high or critical advisories after modernization; npm may still report a moderate nested PostCSS advisory inside the current Next package line.

## Production Notes

The app is designed to be usable as-is for a portfolio demo and easy to harden further:

- Keep demo auth for public portfolio deployments, or replace `lib/auth.ts` with a real provider.
- Keep `PAYMENT_PROVIDER=demo` for frictionless review, or enable Stripe with `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET`.
- Keep `VIDEO_PROVIDER=url` for free embedded video, or enable Mux with `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET`.
- Add Supabase public keys with `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Keep `SUPABASE_SERVICE_ROLE_KEY` only in server/deployment secrets.
- Use `/integrations` to review connector readiness for Supabase, uploads, GitHub, Notion, Google Drive, Slack, webhooks, PostHog, and Sentry.
- Public responses include baseline security headers: frame denial, content-type sniffing protection, strict origin referrers, and locked camera/microphone/geolocation permissions.
- Stripe webhooks return `404` in demo mode and only initialize Stripe when `PAYMENT_PROVIDER=stripe`.
- Seed data is deterministic, so demos can be reset with `npm run db:seed`.

Do not commit real secret keys. If live service-role or secret keys were shared outside a secure secret manager, rotate them before a public deployment.

## Connector Hub

The `/integrations` route is an operator-facing map of what is usable now and what can be configured next:

- Live demo providers: demo auth, URL video, demo enrollment, local quiz generation, and database discussions
- Supabase upgrade paths: Auth, Postgres, Storage, Realtime, Edge Functions, Vector Search, and observability
- Optional production providers: Stripe, Mux, UploadThing, PostHog, and Sentry
- Connector roadmap: GitHub, Notion, Google Drive, Slack, and signed outbound webhooks

The page reads environment variables directly, so adding optional keys changes connector status without changing UI code.

## Health Check

Before sharing the project, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit --audit-level=high
```

These checks cover code quality, TypeScript safety, core behavior tests, production build viability, and high-severity dependency posture.
