# Learning Hub Modern Showcase Design

## Summary

Learning Hub will be renovated from an aging credential-heavy LMS demo into a modern, free-first showcase application. The app should feel useful to a portfolio reviewer immediately: they can browse seeded courses, open lessons, track progress, generate or play quizzes, and participate in discussions without needing paid service accounts.

The original product identity stays intact: a learning platform with course authoring, learning progress, AI-style quizzes, discussions, and instructor analytics. The implementation will modernize the foundation enough to survive real usage while keeping the scope grounded in the current codebase.

## Current Baseline

Exploration on 2026-06-05 found:

- The project is a Next.js 13 app with Prisma/MySQL, Clerk, Stripe, Mux, UploadThing, OpenAI, Stream Chat, Tailwind, and shadcn-style UI components.
- The folder was not a Git repository before this design checkpoint.
- `npm install --legacy-peer-deps` completes, but npm reports 41 vulnerabilities, including 3 critical.
- `npm run lint` passes.
- `npm run build` fails under local Node v25.6.1 because old transitive dependencies imported through `@mux/mux-node@7.3.2` expect a removed `SlowBuffer.prototype`.
- Under Node 22, the build gets past that Node-specific issue but fails because Mux clients are created at module import time and require real Mux tokens during `next build`.
- With dummy Mux/database/chat/auth env vars, the build advances again but fails because Clerk validates publishable key shape during build/page data collection.
- `prisma validate` passes when a MySQL-shaped `DATABASE_URL` is supplied.
- There are no tests, no `.env.example`, no seed/demo content path, and the README is stale.
- Several routes have ownership gaps, especially quiz game/question reads and writes by ID.
- The landing page uses generic copy and fake testimonials, which weakens the portfolio impression.

## Product Goals

The renovated app should:

- Make an impressive first impression for portfolio reviewers.
- Be usable in a public/demo environment without paid credentials.
- Preserve meaningful LMS behavior rather than becoming a static marketing page.
- Demonstrate engineering maturity through clear architecture, tests, seed data, and setup docs.
- Keep optional production integrations possible without letting them block local/demo builds.

## Non-Goals

This pass will not:

- Rebuild the entire app from scratch.
- Require paid Mux, Stripe, Stream, UploadThing, or OpenAI accounts for the default demo path.
- Implement enterprise-grade payments, moderation, or multi-tenant administration.
- Promise a fully hardened commercial SaaS launch.
- Upgrade every dependency to the latest major version if doing so creates disproportionate migration risk.

## Target Experience

### Visitor Journey

A portfolio reviewer can:

1. Open the app and understand the product immediately.
2. Enter a demo experience with minimal friction.
3. Browse seeded course content.
4. Open lessons with working media and resources.
5. Track chapter progress.
6. Create or play a quiz on a topic.
7. See quiz history/statistics.
8. Open discussions and interact with seeded or DB-backed threads.
9. Inspect admin/instructor screens in demo mode.

### Instructor/Admin Journey

An instructor can:

1. View and manage demo courses.
2. Create or edit course metadata.
3. Add chapters and resources.
4. See analytics backed by demo purchases/enrollments/progress.
5. Understand which features are demo-native and which can use production adapters.

## Architecture Direction

### Free-First Core

The default app will rely on local/database-backed features:

- Course catalog, lessons, progress, quiz data, discussions, and analytics live in Prisma-backed models.
- Seed scripts populate a coherent demo dataset.
- The UI handles empty states professionally, but the default seeded app should not feel empty.
- Demo mode should be explicit in configuration and documentation.

### Optional Service Adapters

Paid or external integrations remain optional behind clean boundaries:

- Auth: support a free/default demo path. Clerk may remain optional if configured, but the app should not fail build without Clerk-looking keys.
- Payments: default to enrollment/demo checkout. Stripe becomes optional for production.
- Video: default to public/embed video URLs or demo media. Mux becomes optional for production encoding.
- Quiz AI: default to deterministic local generation or curated prompts. OpenAI-compatible generation becomes optional when an API key exists.
- Discussions: default to DB-backed discussions. Stream Chat becomes optional or removed if not needed.
- Uploads: default to URL-based resources or local/demo metadata. UploadThing becomes optional for production file uploads.

Adapters should be lazy-loaded or request-scoped so third-party SDKs do not run during `next build` unless the route actually needs them.

### Modernization Strategy

Modernization will be staged:

1. Stabilize the current app and build pipeline.
2. Introduce demo mode, seeds, and configuration validation.
3. Replace brittle paid-service defaults with free-first flows.
4. Improve security and ownership checks.
5. Refresh the UI and portfolio-facing narrative.
6. Update dependencies in controlled batches with verification after each batch.

This avoids a high-risk one-shot migration while still moving the project toward a modern production shape.

## Data Model Direction

The existing Prisma models are broadly usable. Required changes may include:

- Add or refine discussion/thread/comment models if Stream is replaced.
- Add enrollment/demo purchase records if Stripe checkout is bypassed in demo mode.
- Add seed metadata for course content, lesson resources, quiz examples, and analytics.
- Keep course, chapter, progress, game, question, category, and purchase concepts unless implementation evidence shows a simpler refactor is necessary.

Any schema change must include a seed update and validation command.

## Security And Ownership

The renovated app must close obvious portfolio-review risks:

- Quiz game pages must only load games owned by the current user or explicitly available in demo mode.
- Quiz answer and end-game API routes must verify question/game ownership.
- Course progress updates must verify the chapter belongs to the course and that the user can access it.
- Admin checks must not rely only on a public env var. Demo admin access can be explicit, but production admin authorization must be server-side.
- Public API routes should be limited to routes that genuinely need to be public, such as webhooks.
- Error responses should avoid leaking implementation details.

## UI Direction

The visual style should become more confident and useful:

- Replace the generic landing page with a product-first homepage showing the actual learning experience.
- Use real screenshots or in-app previews of courses, quizzes, discussions, and analytics.
- Add strong demo entry points: "Explore demo", "Browse courses", and "Instructor view".
- Improve dashboards with meaningful seeded data, compact information hierarchy, and polished empty/loading states.
- Keep the operational LMS surfaces quiet and scannable rather than overly decorative.
- Avoid fake testimonials. Use feature proof, metrics, or demo content instead.

## Documentation

Documentation must include:

- A refreshed README with the product story, tech stack, demo setup, and production notes.
- `.env.example` covering all required and optional variables.
- A setup path that works without paid credentials.
- A deployment note that explains demo mode versus production integrations.
- A short architecture note describing the adapter strategy and seed/demo data.

## Testing And Verification

The final implementation should provide enough automated coverage to make the rescue credible:

- Unit tests for quiz generation fallback and parsing.
- Route or integration tests for ownership checks where practical.
- Tests for enrollment/progress behavior.
- Prisma validation with a dummy MySQL-shaped URL.
- `npm run lint`.
- Type/build verification.
- Seed script verification.
- `npm audit` or equivalent dependency report with remaining risks documented if not fully cleared.

## Acceptance Criteria

The work is complete when:

- A fresh install can run from documented steps.
- The app can build without paid/live integration credentials.
- Demo mode provides useful seeded courses, lessons, quizzes, discussions, and analytics.
- A visitor can meaningfully interact with the app without private service accounts.
- Optional third-party services do not initialize at build time.
- Critical and high-severity dependency risks are removed or explicitly documented with a justified exception.
- Key ownership/security gaps in quiz and progress flows are fixed.
- The landing and dashboard experiences look portfolio-ready.
- README and `.env.example` are accurate.
- Verification commands pass or any remaining limitation is documented with evidence.

## Open Implementation Decisions

The implementation plan should choose exact libraries and migration steps after inspecting compatibility in detail. The likely choices are:

- Stay on React 18 while moving Next.js to a patched compatible version before considering a larger Next 15/16 migration.
- Replace Stream Chat with DB-backed discussions unless a free Stream path is clearly worth preserving.
- Replace Mux as the default video path with public video embeds or URL playback.
- Replace Stripe as the default checkout path with free enrollment/demo purchase records.
- Keep OpenAI optional and add deterministic fallback generation for demos.

## Rollout Plan

1. Create a clean verification baseline and scripts.
2. Fix build-time SDK initialization and env validation.
3. Add demo configuration, seed data, and default usable flows.
4. Replace or isolate paid integrations.
5. Add security fixes and tests.
6. Refresh the portfolio-facing UI and docs.
7. Perform dependency/security cleanup.
8. Run final verification and document the result.
