# Learning Hub Modern Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renovate Learning Hub into a modern, free-first, portfolio-ready learning platform that builds reliably and lets visitors use courses, quizzes, discussions, progress, and instructor views without paid service credentials.

**Architecture:** Keep the current Next.js App Router codebase, but introduce clean app-owned adapters for auth, enrollment, video, quiz generation, and discussions. The default path uses PostgreSQL-backed data, seeded demo content, deterministic quiz generation, demo auth, and DB discussions; third-party services become optional instead of build blockers.

**Tech Stack:** Next.js App Router, React 18, Prisma, PostgreSQL, Tailwind, Radix/shadcn components, Zod, Vitest, React Testing Library, optional Clerk/Stripe/Mux/OpenAI adapters.

---

## File Structure Map

- `package.json`: add verification scripts, seed script, testing dependencies, and controlled dependency updates.
- `.env.example`: document demo-first required variables and optional production integration variables.
- `docker-compose.yml`: provide a local free PostgreSQL database for clone-and-run development.
- `prisma/schema.prisma`: migrate from PlanetScale/MySQL assumptions to PostgreSQL-compatible schema, add discussion models, and support demo seed data.
- `prisma/seed.ts`: populate categories, courses, chapters, resources, purchases/enrollments, quiz history, and discussion threads.
- `lib/env.ts`: validate runtime configuration with demo-safe optional integration variables.
- `lib/auth.ts`: centralize server-side demo auth and optional Clerk auth.
- `components/auth/*`: provide demo-aware client auth controls.
- `middleware.ts`: stop requiring Clerk middleware in demo mode; only protect production routes when optional auth is configured.
- `lib/video.ts`: choose demo URL playback by default and isolate optional Mux operations.
- `lib/enrollment.ts`: handle free/demo enrollment records and optional Stripe handoff.
- `lib/quiz/*`: deterministic quiz generation fallback plus optional OpenAI adapter.
- `lib/discussions/*`: DB-backed discussion operations replacing Stream as the default path.
- `app/api/**`: update routes to use app-owned auth, enrollment, video, quiz, and ownership helpers.
- `app/(landing)/**`: replace generic landing page with product-first showcase.
- `app/(dashboard)/**`: improve demo dashboards, quiz surfaces, discussions, and instructor pages.
- `app/(course)/**`: replace Mux-only player with URL/video/embed player and safer progress handling.
- `components/**`: add reusable showcase cards, empty states, page headers, and safer UI primitives where needed.
- `README.md`: rewrite setup, demo, production, architecture, and verification docs.
- `docs/architecture.md`: explain demo-first adapters and optional integrations.
- `tests/**`: add focused tests for quiz generation, enrollment/progress, ownership checks, and data helpers.

---

## Task 0: Import Existing Source Baseline

**Files:**
- Track: existing app files already present in the workspace
- Keep ignored: `node_modules/`, `.next/`, `.env*`, `next-env.d.ts`

- [ ] **Step 1: Confirm only the spec and old source state are present**

Run:

```powershell
rtk git status --short
```

Expected: committed spec is clean, existing source files are untracked.

- [ ] **Step 2: Add the existing source baseline**

Run:

```powershell
rtk git add .eslintrc.json .gitignore README.md actions app components.json components hooks lib middleware.ts next.config.js package-lock.json package.json postcss.config.js prisma public tailwind.config.js tsconfig.json
```

Expected: source files staged; ignored directories remain ignored.

- [ ] **Step 3: Commit the baseline**

Run:

```powershell
rtk git commit -m "chore: import existing Learning Hub source"
```

Expected: baseline commit created. This makes all future modernization diffs reviewable.

---

## Task 1: Establish Verification And Demo Configuration

**Files:**
- Modify: `package.json`
- Modify: `lib/env.ts`
- Create: `.env.example`
- Create: `docker-compose.yml`
- Create: `tests/setup.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Add verification scripts and test tooling**

Modify `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "verify": "npm run lint && npm run typecheck && npm run test && npm run build"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Add dev dependencies:

```powershell
rtk npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom tsx
```

- [ ] **Step 2: Add Vitest configuration**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
    },
  },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Replace narrow env validation with demo-safe validation**

Update `lib/env.ts` to centralize configuration:

```ts
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_DEMO_MODE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  DEMO_USER_ID: z.string().default("demo_learner"),
  DEMO_ADMIN_ID: z.string().default("demo_instructor"),
  AUTH_PROVIDER: z.enum(["demo", "clerk"]).default("demo"),
  VIDEO_PROVIDER: z.enum(["url", "mux"]).default("url"),
  PAYMENT_PROVIDER: z.enum(["demo", "stripe"]).default("demo"),
  QUIZ_PROVIDER: z.enum(["local", "openai"]).default("local"),
  DISCUSSION_PROVIDER: z.enum(["database"]).default("database"),
  CLERK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_API_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  MUX_TOKEN_ID: z.string().optional(),
  MUX_TOKEN_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export const env = schema.parse(process.env);

export const isDemoMode = env.NEXT_PUBLIC_DEMO_MODE;
```

- [ ] **Step 4: Add `.env.example`**

Create `.env.example`:

```dotenv
# Required for demo/local development
DATABASE_URL="postgresql://learning_hub:learning_hub@localhost:5432/learning_hub?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEMO_MODE="true"
DEMO_USER_ID="demo_learner"
DEMO_ADMIN_ID="demo_instructor"

# Default free-first providers
AUTH_PROVIDER="demo"
VIDEO_PROVIDER="url"
PAYMENT_PROVIDER="demo"
QUIZ_PROVIDER="local"
DISCUSSION_PROVIDER="database"

# Optional production integrations
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
STRIPE_API_KEY=""
STRIPE_WEBHOOK_SECRET=""
MUX_TOKEN_ID=""
MUX_TOKEN_SECRET=""
OPENAI_API_KEY=""
```

- [ ] **Step 5: Add local Postgres compose file**

Create `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: learning-hub-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: learning_hub
      POSTGRES_PASSWORD: learning_hub
      POSTGRES_DB: learning_hub
    ports:
      - "5432:5432"
    volumes:
      - learning_hub_postgres:/var/lib/postgresql/data

volumes:
  learning_hub_postgres:
```

- [ ] **Step 6: Verify scripts parse**

Run:

```powershell
rtk npm run typecheck
```

Expected: it may fail from existing code, but `package.json` script resolution should work. Record failures for later tasks.

- [ ] **Step 7: Commit**

Run:

```powershell
rtk git add package.json package-lock.json lib/env.ts .env.example docker-compose.yml tests/setup.ts vitest.config.ts
rtk git commit -m "chore: add demo configuration and verification scripts"
```

---

## Task 2: Move Auth Behind A Demo-First Boundary

**Files:**
- Create: `lib/auth.ts`
- Create: `components/auth/demo-user-button.tsx`
- Create: `components/auth/auth-action.tsx`
- Modify: `app/layout.tsx`
- Modify: `middleware.ts`
- Modify: `components/navbar-routes.tsx`
- Modify: `app/(landing)/_components/landing-hero.tsx`
- Modify: `app/(landing)/_components/landing-navbar.tsx`
- Modify: server pages/routes importing `auth` or `currentUser` from Clerk

- [ ] **Step 1: Create server auth helper**

Create `lib/auth.ts`:

```ts
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: "learner" | "instructor";
};

const demoUsers: Record<string, AppUser> = {
  demo_learner: {
    id: env.DEMO_USER_ID,
    name: "Demo Learner",
    email: "learner@learninghub.demo",
    role: "learner",
  },
  demo_instructor: {
    id: env.DEMO_ADMIN_ID,
    name: "Demo Instructor",
    email: "instructor@learninghub.demo",
    role: "instructor",
  },
};

export async function getCurrentUser(): Promise<AppUser | null> {
  if (env.AUTH_PROVIDER === "demo") {
    const selected = cookies().get("learning-hub-demo-user")?.value;
    return demoUsers[selected ?? "demo_learner"] ?? demoUsers.demo_learner;
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    name: user.fullName ?? user.username ?? "Learning Hub User",
    email: user.emailAddresses[0]?.emailAddress ?? `${user.id}@users.local`,
    imageUrl: user.imageUrl,
    role: user.id === env.DEMO_ADMIN_ID ? "instructor" : "learner",
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function isInstructor(user: AppUser | null) {
  return user?.role === "instructor" || user?.id === env.DEMO_ADMIN_ID;
}
```

- [ ] **Step 2: Add demo user controls**

Create `components/auth/demo-user-button.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DemoUserButton() {
  const router = useRouter();

  const switchUser = async (user: "demo_learner" | "demo_instructor") => {
    document.cookie = `learning-hub-demo-user=${user}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => switchUser("demo_learner")}>
        <GraduationCap className="mr-2 h-4 w-4" />
        Learner
      </Button>
      <Button size="sm" variant="outline" onClick={() => switchUser("demo_instructor")}>
        <ShieldCheck className="mr-2 h-4 w-4" />
        Instructor
      </Button>
    </div>
  );
}
```

Create `components/auth/auth-action.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export function AuthAction({ signedInHref = "/dashboard" }: { signedInHref?: string }) {
  if (env.AUTH_PROVIDER === "demo") {
    return (
      <Link href={signedInHref}>
        <Button>Explore demo</Button>
      </Link>
    );
  }

  return (
    <Link href="/sign-up">
      <Button>Get started</Button>
    </Link>
  );
}
```

- [ ] **Step 3: Remove required Clerk provider from root layout in demo mode**

Update `app/layout.tsx` so demo mode does not import and initialize Clerk at build time. Use a small `Providers` component if needed:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ToasterProvider from "@/components/provider/toaster-provider";
import { ConfettiProvider } from "@/components/provider/confetti-provider";
import { env } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "A modern learning platform with courses, quizzes, and discussions.",
};

async function OptionalClerkProvider({ children }: { children: React.ReactNode }) {
  if (env.AUTH_PROVIDER !== "clerk") return <>{children}</>;
  const { ClerkProvider } = await import("@clerk/nextjs");
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OptionalClerkProvider>
          <ConfettiProvider />
          <ToasterProvider />
          {children}
        </OptionalClerkProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Replace Clerk middleware with app middleware**

Update `middleware.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export async function middleware(req: NextRequest) {
  if (env.AUTH_PROVIDER === "demo") {
    return NextResponse.next();
  }

  const { authMiddleware } = await import("@clerk/nextjs");
  return authMiddleware({
    publicRoutes: ["/", "/api/webhook"],
  })(req);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

- [ ] **Step 5: Replace server-side Clerk calls**

For server files using:

```ts
import { auth } from "@clerk/nextjs";
const { userId } = auth();
```

replace with:

```ts
import { getCurrentUser } from "@/lib/auth";
const user = await getCurrentUser();
const userId = user?.id;
```

For protected pages, redirect when `!user`.

- [ ] **Step 6: Replace admin helper**

Update `lib/admin.ts`:

```ts
import { AppUser, isInstructor } from "@/lib/auth";

export const isAdmin = (user: AppUser | null) => isInstructor(user);
```

- [ ] **Step 7: Verify no Clerk imports remain in demo-default paths**

Run:

```powershell
rtk rg -n "@clerk/nextjs" app components lib middleware.ts
```

Expected: only optional dynamic imports remain in `lib/auth.ts`, `app/layout.tsx`, or `middleware.ts`.

- [ ] **Step 8: Commit**

Run:

```powershell
rtk git add lib/auth.ts components/auth app/layout.tsx middleware.ts components/navbar-routes.tsx app lib/admin.ts
rtk git commit -m "feat: add demo-first auth boundary"
```

---

## Task 3: Migrate Schema To PostgreSQL And Seed Demo Data

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `package.json`

- [ ] **Step 1: Update Prisma datasource**

Change datasource and generator:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Remove MySQL-specific `relationMode = "prisma"` and `@@fulltext([title])`.

- [ ] **Step 2: Add discussion models**

Add:

```prisma
model DiscussionThread {
  id        String              @id @default(uuid())
  title     String
  slug      String              @unique
  courseId  String?
  authorId  String
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt
  course    Course?             @relation(fields: [courseId], references: [id], onDelete: SetNull)
  messages  DiscussionMessage[]

  @@index([courseId])
  @@index([authorId])
}

model DiscussionMessage {
  id        String           @id @default(uuid())
  body      String           @db.Text
  authorId  String
  threadId  String
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
  thread    DiscussionThread @relation(fields: [threadId], references: [id], onDelete: Cascade)

  @@index([threadId])
  @@index([authorId])
}
```

Add `discussions DiscussionThread[]` to `Course`.

- [ ] **Step 3: Fix typo in Attachment relation name while preserving behavior**

Change:

```prisma
couse Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
```

to:

```prisma
course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
```

- [ ] **Step 4: Create demo seed**

Create `prisma/seed.ts` with deterministic IDs:

```ts
import { PrismaClient, GameType } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.discussionMessage.deleteMany();
  await db.discussionThread.deleteMany();
  await db.question.deleteMany();
  await db.game.deleteMany();
  await db.userProgress.deleteMany();
  await db.purchase.deleteMany();
  await db.attachment.deleteMany();
  await db.muxData.deleteMany();
  await db.chapter.deleteMany();
  await db.course.deleteMany();
  await db.category.deleteMany();

  const categories = await Promise.all(
    ["Frontend", "Backend", "AI", "Product"].map((name) =>
      db.category.create({ data: { id: `cat_${name.toLowerCase()}`, name } })
    )
  );

  const course = await db.course.create({
    data: {
      id: "course_ai_productivity",
      userId: "demo_instructor",
      title: "AI Productivity Systems",
      description:
        "Build a practical learning workflow with AI assistants, focused prompts, and review loops.",
      imageUrl:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop",
      price: 0,
      isPublished: true,
      categoryId: categories.find((category) => category.name === "AI")!.id,
      chapters: {
        create: [
          {
            id: "chapter_ai_workflows",
            title: "Designing an AI-assisted workflow",
            description:
              "<p>Learn how to break research, drafting, and review into repeatable loops.</p>",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            position: 1,
            isPublished: true,
            isFree: true,
          },
          {
            id: "chapter_prompt_reviews",
            title: "Prompt review and iteration",
            description:
              "<p>Use checklists to test whether an AI response is useful, grounded, and actionable.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 2,
            isPublished: true,
            isFree: false,
          },
        ],
      },
      attachments: {
        create: [
          {
            name: "Workflow checklist",
            url: "https://example.com/learning-hub/workflow-checklist.pdf",
          },
        ],
      },
    },
  });

  await db.purchase.create({
    data: {
      id: "purchase_demo_ai_productivity",
      userId: "demo_learner",
      courseId: course.id,
    },
  });

  await db.userProgress.create({
    data: {
      id: "progress_demo_ai_workflows",
      userId: "demo_learner",
      chapterId: "chapter_ai_workflows",
      isCompleted: true,
    },
  });

  const game = await db.game.create({
    data: {
      id: "game_demo_ai",
      userId: "demo_learner",
      topic: "AI productivity",
      gameType: GameType.mcq,
      timeStarted: new Date(Date.now() - 1000 * 60 * 8),
      timeEnded: new Date(Date.now() - 1000 * 60 * 2),
    },
  });

  await db.question.createMany({
    data: [
      {
        id: "question_demo_ai_1",
        gameId: game.id,
        question: "What makes an AI workflow reliable?",
        answer: "A repeatable review loop",
        options: ["A repeatable review loop", "Random prompting", "Skipping validation", "Only using one tool"],
        questionType: GameType.mcq,
        isCorrect: true,
        userAnswers: "A repeatable review loop",
      },
    ],
  });

  const thread = await db.discussionThread.create({
    data: {
      id: "thread_demo_ai",
      title: "How do you review AI-generated notes?",
      slug: "review-ai-generated-notes",
      courseId: course.id,
      authorId: "demo_learner",
    },
  });

  await db.discussionMessage.createMany({
    data: [
      {
        id: "message_demo_ai_1",
        threadId: thread.id,
        authorId: "demo_learner",
        body: "I compare the answer against source notes and ask for missing assumptions.",
      },
      {
        id: "message_demo_ai_2",
        threadId: thread.id,
        authorId: "demo_instructor",
        body: "Good habit. I also like saving reusable critique prompts for common review tasks.",
      },
    ],
  });
}

main()
  .then(async () => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 5: Validate schema**

Run:

```powershell
rtk proxy cmd /c "set DATABASE_URL=postgresql://learning_hub:learning_hub@localhost:5432/learning_hub?schema=public&& npx prisma validate"
```

Expected: schema is valid.

- [ ] **Step 6: Commit**

Run:

```powershell
rtk git add prisma/schema.prisma prisma/seed.ts package.json package-lock.json
rtk git commit -m "feat: add postgres demo schema and seed data"
```

---

## Task 4: Replace Paid Checkout Default With Demo Enrollment

**Files:**
- Create: `lib/enrollment.ts`
- Create: `app/api/courses/[courseId]/enroll/route.ts`
- Modify: `app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button.tsx`
- Modify: `app/api/courses/[courseId]/checkout/route.ts`
- Modify: `app/api/webhook/route.ts`

- [ ] **Step 1: Add enrollment helper**

Create `lib/enrollment.ts`:

```ts
import { db } from "@/lib/db";

export async function enrollInCourse(userId: string, courseId: string) {
  const course = await db.course.findFirst({
    where: { id: courseId, isPublished: true },
  });

  if (!course) {
    return { ok: false as const, status: 404, message: "Course not found" };
  }

  const purchase = await db.purchase.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  });

  return { ok: true as const, purchase };
}
```

- [ ] **Step 2: Add demo enroll route**

Create `app/api/courses/[courseId]/enroll/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { enrollInCourse } from "@/lib/enrollment";

export async function POST(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const result = await enrollInCourse(user.id, params.courseId);
  if (!result.ok) return new NextResponse(result.message, { status: result.status });

  return NextResponse.json({ enrolled: true });
}
```

- [ ] **Step 3: Update enroll button to default to enroll route**

Change `CourseEnrollButton` to call `/api/courses/${courseId}/enroll` and refresh:

```tsx
const response = await axios.post(`/api/courses/${courseId}/enroll`);
toast.success("You are enrolled");
router.refresh();
```

Keep optional Stripe checkout only behind `PAYMENT_PROVIDER=stripe`.

- [ ] **Step 4: Keep Stripe lazy and optional**

In `app/api/courses/[courseId]/checkout/route.ts`, load Stripe only after checking `env.PAYMENT_PROVIDER === "stripe"` and after validating user/course. Return `400` with `"Stripe checkout is not enabled"` in demo mode.

- [ ] **Step 5: Test enrollment helper**

Create `tests/enrollment.test.ts` with mocked Prisma:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    course: { findFirst: vi.fn() },
    purchase: { upsert: vi.fn() },
  },
}));

import { db } from "@/lib/db";
import { enrollInCourse } from "@/lib/enrollment";

describe("enrollInCourse", () => {
  it("returns not found when the course is missing", async () => {
    vi.mocked(db.course.findFirst).mockResolvedValue(null);
    const result = await enrollInCourse("user_1", "course_1");
    expect(result).toMatchObject({ ok: false, status: 404 });
  });
});
```

- [ ] **Step 6: Commit**

Run:

```powershell
rtk git add -- lib/enrollment.ts "app/api/courses/[courseId]/enroll" "app/api/courses/[courseId]/checkout" app/api/webhook "app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button.tsx" tests/enrollment.test.ts
rtk git commit -m "feat: add demo enrollment flow"
```

---

## Task 5: Replace Mux-Only Playback With URL Video Adapter

**Files:**
- Create: `lib/video.ts`
- Modify: `app/api/courses/[courseId]/route.ts`
- Modify: `app/api/courses/[courseId]/chapters/[chapterId]/route.ts`
- Modify: `app/(course)/courses/[courseId]/chapters/[chapterId]/page.tsx`
- Modify: `app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player.tsx`

- [ ] **Step 1: Create video helper**

Create `lib/video.ts`:

```ts
import { env } from "@/lib/env";

export function toEmbeddableVideoUrl(url?: string | null) {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) {
    const id = new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  return url;
}

export async function deleteMuxAsset(assetId: string) {
  if (env.VIDEO_PROVIDER !== "mux") return;
  const Mux = (await import("@mux/mux-node")).default;
  const { Video } = new Mux(env.MUX_TOKEN_ID!, env.MUX_TOKEN_SECRET!);
  await Video.Assets.del(assetId);
}

export async function createMuxAsset(input: string) {
  if (env.VIDEO_PROVIDER !== "mux") return null;
  const Mux = (await import("@mux/mux-node")).default;
  const { Video } = new Mux(env.MUX_TOKEN_ID!, env.MUX_TOKEN_SECRET!);
  return Video.Assets.create({ input, playback_policy: "public", test: false });
}
```

- [ ] **Step 2: Remove top-level Mux client creation**

In course and chapter API routes, remove:

```ts
const { Video } = new Mux(...)
```

Use `deleteMuxAsset` and `createMuxAsset` inside request handlers only.

- [ ] **Step 3: Update video player props**

Change `VideoPlayerProps` to accept:

```ts
videoUrl?: string | null;
playbackId?: string | null;
```

Render:

```tsx
{!isLocked && videoUrl && (
  <iframe
    title={title}
    src={videoUrl}
    className="h-full w-full rounded-md border-0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    onLoad={() => setIsReady(true)}
  />
)}
```

Keep Mux player only if `playbackId` exists and `videoUrl` does not.

- [ ] **Step 4: Pass embeddable video URL from chapter page**

In chapter page:

```ts
import { toEmbeddableVideoUrl } from "@/lib/video";
```

Pass:

```tsx
videoUrl={toEmbeddableVideoUrl(chapter.videoUrl)}
playbackId={muxData?.playbackId}
```

- [ ] **Step 5: Commit**

Run:

```powershell
rtk git add -- lib/video.ts app/api/courses "app/(course)/courses"
rtk git commit -m "feat: support demo video playback without mux"
```

---

## Task 6: Add Local Quiz Generation And Secure Quiz Ownership

**Files:**
- Create: `lib/quiz/schema.ts`
- Create: `lib/quiz/local-generator.ts`
- Create: `lib/quiz/openai-generator.ts`
- Modify: `app/api/quiz/questions/route.ts`
- Modify: `app/api/quiz/game/route.ts`
- Modify: `app/api/quiz/checkAnswer/route.ts`
- Modify: `app/api/quiz/endGame/route.ts`
- Modify: quiz pages under `app/(dashboard)/(routes)/quiz/**`
- Create: `tests/quiz-generator.test.ts`
- Create: `tests/quiz-ownership.test.ts`

- [ ] **Step 1: Create shared schemas**

Create `lib/quiz/schema.ts`:

```ts
import { z } from "zod";

export const quizTypeSchema = z.enum(["mcq", "open_ended"]);

export const quizCreationSchema = z.object({
  topic: z.string().min(4).max(80),
  type: quizTypeSchema,
  amount: z.coerce.number().int().min(1).max(10),
});

export const generatedQuestionSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  options: z.array(z.string()).min(3).max(4).optional(),
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
```

- [ ] **Step 2: Add deterministic local generator**

Create `lib/quiz/local-generator.ts`:

```ts
import { GeneratedQuestion } from "@/lib/quiz/schema";

const stems = [
  "What is the most important principle when learning {topic}?",
  "Which habit improves long-term retention for {topic}?",
  "What should you do when a {topic} explanation feels unclear?",
  "Which review technique works best for practicing {topic}?",
];

export function generateLocalQuestions(topic: string, amount: number, type: "mcq" | "open_ended"): GeneratedQuestion[] {
  return Array.from({ length: amount }, (_, index) => {
    const question = stems[index % stems.length].replaceAll("{topic}", topic);
    const answer = index % 2 === 0 ? "Practice with feedback" : "Review and explain it";

    if (type === "open_ended") {
      return { question, answer };
    }

    return {
      question,
      answer,
      options: [answer, "Memorize without context", "Avoid testing yourself", "Skip review"],
    };
  });
}
```

- [ ] **Step 3: Update quiz game route to avoid HTTP self-calls**

In `app/api/quiz/game/route.ts`, replace `axios.post(process.env.API_URL...)` with direct generator call:

```ts
const questions = env.QUIZ_PROVIDER === "openai"
  ? await generateOpenAiQuestions(topic, amount, type)
  : generateLocalQuestions(topic, amount, type);
```

Then write questions to DB.

- [ ] **Step 4: Lock quiz pages to current user**

For game reads, change:

```ts
where: { id: gameId }
```

to:

```ts
where: { id: gameId, userId }
```

in MCQ, open-ended, and statistics pages.

- [ ] **Step 5: Lock answer updates to owning user**

In `checkAnswer`, fetch question with game ownership:

```ts
const question = await db.question.findFirst({
  where: {
    id: questionId,
    game: { userId: user.id },
  },
});
```

In `endGame`, update with:

```ts
await db.game.update({
  where: { id: gameId, userId: user.id },
  data: { timeEnded: new Date() },
});
```

- [ ] **Step 6: Add tests**

Create `tests/quiz-generator.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateLocalQuestions } from "@/lib/quiz/local-generator";

describe("generateLocalQuestions", () => {
  it("creates deterministic mcq questions with answer in options", () => {
    const questions = generateLocalQuestions("React state", 3, "mcq");
    expect(questions).toHaveLength(3);
    expect(questions[0].options).toContain(questions[0].answer);
  });

  it("creates open-ended questions without options", () => {
    const questions = generateLocalQuestions("PostgreSQL", 2, "open_ended");
    expect(questions[0].options).toBeUndefined();
  });
});
```

- [ ] **Step 7: Commit**

Run:

```powershell
rtk git add -- lib/quiz app/api/quiz "app/(dashboard)/(routes)/quiz" tests/quiz-generator.test.ts tests/quiz-ownership.test.ts
rtk git commit -m "feat: add local quiz generation and ownership checks"
```

---

## Task 7: Replace Stream Chat Default With Database Discussions

**Files:**
- Create: `lib/discussions.ts`
- Modify: `app/(dashboard)/(routes)/discussions/page.tsx`
- Create: `app/api/discussions/route.ts`
- Create: `app/api/discussions/[threadId]/messages/route.ts`
- Remove or stop using: `lib/chat-client.ts`
- Remove or stop using: `app/api/get-token/route.ts`

- [ ] **Step 1: Add DB discussion helpers**

Create `lib/discussions.ts`:

```ts
import { db } from "@/lib/db";

export async function listDiscussionThreads() {
  return db.discussionThread.findMany({
    include: {
      course: true,
      messages: { orderBy: { createdAt: "asc" }, take: 3 },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createDiscussionThread(authorId: string, title: string) {
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
  return db.discussionThread.create({
    data: {
      title,
      slug,
      authorId,
      messages: {
        create: { authorId, body: "Starting the discussion." },
      },
    },
  });
}
```

- [ ] **Step 2: Add discussion routes**

Create `app/api/discussions/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createDiscussionThread, listDiscussionThreads } from "@/lib/discussions";

const schema = z.object({ title: z.string().min(4).max(120) });

export async function GET() {
  return NextResponse.json(await listDiscussionThreads());
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { title } = schema.parse(await req.json());
  return NextResponse.json(await createDiscussionThread(user.id, title));
}
```

- [ ] **Step 3: Replace Stream page with DB discussion UI**

Update `app/(dashboard)/(routes)/discussions/page.tsx` to a server page that lists threads and a client form for new questions. Use existing `Card`, `Button`, `Input`, and `Textarea` components.

- [ ] **Step 4: Remove Stream env requirements**

Ensure `NEXT_PUBLIC_STREAM_KEY` and `STREAM_SECRET` are no longer required by `lib/env.ts`.

- [ ] **Step 5: Commit**

Run:

```powershell
rtk git add -- lib/discussions.ts app/api/discussions "app/(dashboard)/(routes)/discussions" lib/env.ts
rtk git commit -m "feat: add database-backed discussions"
```

---

## Task 8: Fix Progress And Course Access Safety

**Files:**
- Modify: `actions/get-progress.ts`
- Modify: `actions/get-chapter.ts`
- Modify: `app/(course)/courses/[courseId]/page.tsx`
- Modify: `app/api/courses/[courseId]/chapters/[chapterId]/progress/route.ts`
- Create: `tests/progress.test.ts`

- [ ] **Step 1: Prevent divide-by-zero progress**

In `actions/get-progress.ts`:

```ts
if (publishedChapterIds.length === 0) {
  return 0;
}
```

before calculating percentage.

- [ ] **Step 2: Avoid redirecting to missing first chapter**

In `app/(course)/courses/[courseId]/page.tsx`, handle empty chapters:

```ts
const firstChapter = course.chapters[0];
if (!firstChapter) return redirect("/browse");
return redirect(`/courses/${course.id}/chapters/${firstChapter.id}`);
```

- [ ] **Step 3: Verify chapter belongs to course before progress update**

In progress route, add:

```ts
const chapter = await db.chapter.findFirst({
  where: {
    id: params.chapterId,
    courseId: params.courseId,
    isPublished: true,
  },
});

if (!chapter) {
  return new NextResponse("Chapter not found", { status: 404 });
}
```

Then require purchase or free chapter:

```ts
const purchase = await db.purchase.findUnique({
  where: { userId_courseId: { userId: user.id, courseId: params.courseId } },
});

if (!chapter.isFree && !purchase) {
  return new NextResponse("Forbidden", { status: 403 });
}
```

- [ ] **Step 4: Commit**

Run:

```powershell
rtk git add -- actions/get-progress.ts actions/get-chapter.ts "app/(course)/courses" "app/api/courses/[courseId]/chapters/[chapterId]/progress" tests/progress.test.ts
rtk git commit -m "fix: harden course progress access"
```

---

## Task 9: Refresh Portfolio-Facing UI

**Files:**
- Modify: `app/(landing)/page.tsx`
- Modify: `app/(landing)/layout.tsx`
- Modify: `app/(landing)/_components/landing-navbar.tsx`
- Modify: `app/(landing)/_components/landing-hero.tsx`
- Modify: `app/(landing)/_components/landing-content.tsx`
- Modify: `app/(dashboard)/(routes)/dashboard/page.tsx`
- Modify: `app/(dashboard)/(routes)/quiz/page.tsx`
- Modify: `app/(dashboard)/(routes)/admin/analytics/page.tsx`
- Modify: `components/course-card.tsx`
- Create: `components/page-header.tsx`
- Create: `components/empty-state.tsx`

- [ ] **Step 1: Add shared page header**

Create `components/page-header.tsx`:

```tsx
import { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-sky-600" />}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add polished empty state**

Create `components/empty-state.tsx`:

```tsx
import { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-md border border-dashed bg-slate-50 px-6 text-center">
      <Icon className="mb-3 h-8 w-8 text-slate-500" />
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Replace fake testimonials with product proof**

Update `LandingContent` to show feature sections:

```tsx
const features = [
  { title: "Course workspace", description: "Browse seeded lessons, resources, and progress." },
  { title: "Quiz practice", description: "Generate practice questions even without an AI key." },
  { title: "Discussion threads", description: "Ask and answer course questions in the demo." },
  { title: "Instructor analytics", description: "Inspect course activity and learning outcomes." },
];
```

Render cards with concise content and screenshots/previews where possible.

- [ ] **Step 4: Improve landing hero**

Make the first viewport signal the product:

```tsx
<h1>Learning Hub</h1>
<p>A demo-ready learning platform with courses, quizzes, discussions, and instructor analytics.</p>
```

Buttons:

```tsx
<Link href="/dashboard"><Button>Explore demo</Button></Link>
<Link href="/browse"><Button variant="outline">Browse courses</Button></Link>
```

- [ ] **Step 5: Commit**

Run:

```powershell
rtk git add -- "app/(landing)" "app/(dashboard)/(routes)/dashboard" "app/(dashboard)/(routes)/quiz" "app/(dashboard)/(routes)/admin/analytics" components/page-header.tsx components/empty-state.tsx components/course-card.tsx
rtk git commit -m "feat: refresh showcase user experience"
```

---

## Task 10: Dependency Modernization And Build Stability

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.js`
- Modify: source files affected by package API changes

- [ ] **Step 1: Apply safe patch/minor updates first**

Run:

```powershell
rtk npm update
```

Expected: compatible package updates within existing ranges.

- [ ] **Step 2: Upgrade known critical packages within current major when possible**

Run targeted installs:

```powershell
rtk npm install next@13.5.11 @clerk/nextjs@4.31.8 @mux/mux-node@7.3.5 openai@4.104.0 stream-chat@8.60.0 stream-chat-react@10.22.3 axios@1.17.0 postcss@8.5.15
```

If Stream is fully removed from runtime, remove `stream-chat` and `stream-chat-react` instead:

```powershell
rtk npm uninstall stream-chat stream-chat-react
```

- [ ] **Step 3: Remove packages no longer used**

After code replacement, run:

```powershell
rtk rg -n "stream-chat|MuxPlayer|react-quill|OpenAI|axios" app components lib
```

Uninstall unused packages:

```powershell
rtk npm uninstall stream-chat stream-chat-react @mux/mux-player-react
```

Keep optional SDKs only if lazy-loaded adapters still use them.

- [ ] **Step 4: Verify build no longer initializes optional SDKs**

Run without optional credentials:

```powershell
rtk proxy cmd /c "set DATABASE_URL=postgresql://learning_hub:learning_hub@localhost:5432/learning_hub?schema=public&& set NEXT_PUBLIC_DEMO_MODE=true&& set AUTH_PROVIDER=demo&& set VIDEO_PROVIDER=url&& set PAYMENT_PROVIDER=demo&& set QUIZ_PROVIDER=local&& npm run build"
```

Expected: build succeeds or fails only on remaining code issues, not missing Clerk/Mux/Stripe/OpenAI keys.

- [ ] **Step 5: Commit**

Run:

```powershell
rtk git add package.json package-lock.json next.config.js app components lib
rtk git commit -m "chore: modernize dependencies and stabilize build"
```

---

## Task 11: Documentation And Architecture Notes

**Files:**
- Modify: `README.md`
- Create: `docs/architecture.md`
- Create: `docs/deployment.md`

- [ ] **Step 1: Rewrite README**

README must include:

```md
# Learning Hub

Learning Hub is a demo-ready learning platform with course browsing, lessons, progress tracking, quiz practice, discussions, and instructor analytics.

## Demo-first setup

1. Copy `.env.example` to `.env`.
2. Start Postgres with `docker compose up -d`.
3. Run `npm install`.
4. Run `npm run db:push`.
5. Run `npm run db:seed`.
6. Run `npm run dev`.

## Verification

Run `npm run verify`.

## Optional integrations

Clerk, Stripe, Mux, and OpenAI can be enabled with provider env vars, but the default demo does not require them.
```

- [ ] **Step 2: Add architecture note**

Create `docs/architecture.md` explaining:

- Demo-first provider flags.
- Auth boundary.
- Enrollment boundary.
- Video boundary.
- Quiz generation boundary.
- Discussion storage.
- Seed data strategy.

- [ ] **Step 3: Add deployment note**

Create `docs/deployment.md` with free-ish deployment path:

```md
## Suggested showcase deployment

- App hosting: Vercel, Render, or Fly.io.
- Database: Neon or Supabase free PostgreSQL.
- Default providers: demo auth, demo enrollment, URL video, local quiz, database discussions.
- Optional providers can be enabled later with environment variables.
```

- [ ] **Step 4: Commit**

Run:

```powershell
rtk git add README.md docs/architecture.md docs/deployment.md .env.example
rtk git commit -m "docs: refresh setup and architecture docs"
```

---

## Task 12: Final Verification And Demo Smoke Test

**Files:**
- Modify as needed based on failures found by verification

- [ ] **Step 1: Run lint**

Run:

```powershell
rtk npm run lint
```

Expected: pass.

- [ ] **Step 2: Run typecheck**

Run:

```powershell
rtk npm run typecheck
```

Expected: pass.

- [ ] **Step 3: Run tests**

Run:

```powershell
rtk npm run test
```

Expected: pass.

- [ ] **Step 4: Validate Prisma**

Run:

```powershell
rtk proxy cmd /c "set DATABASE_URL=postgresql://learning_hub:learning_hub@localhost:5432/learning_hub?schema=public&& npx prisma validate"
```

Expected: pass.

- [ ] **Step 5: Run production build in demo mode**

Run:

```powershell
rtk proxy cmd /c "set DATABASE_URL=postgresql://learning_hub:learning_hub@localhost:5432/learning_hub?schema=public&& set NEXT_PUBLIC_DEMO_MODE=true&& set AUTH_PROVIDER=demo&& set VIDEO_PROVIDER=url&& set PAYMENT_PROVIDER=demo&& set QUIZ_PROVIDER=local&& npm run build"
```

Expected: pass without Clerk/Mux/Stripe/OpenAI keys.

- [ ] **Step 6: Run audit**

Run:

```powershell
rtk npm audit --omit=dev
```

Expected: no critical or high issues. If medium/low issues remain, document them in the final answer and README if they matter.

- [ ] **Step 7: Start local app**

Run:

```powershell
rtk npm run dev
```

Open:

```text
http://localhost:3000
```

Smoke test:

- Landing page loads and looks polished.
- `Explore demo` reaches dashboard.
- Browse page shows seeded courses.
- Course chapter video area renders without Mux.
- Enroll button creates access.
- Progress updates.
- Quiz creation works without OpenAI.
- Quiz stats page opens only for owning demo user.
- Discussions list seeded thread and allows a new thread/message.
- Instructor switch exposes admin course and analytics pages.

- [ ] **Step 8: Commit final fixes**

Run:

```powershell
rtk git status --short
rtk git add .
rtk git commit -m "fix: complete modernization verification"
```

Only commit if there are final fix changes.

---

## Plan Self-Review Checklist

- Spec coverage: the plan covers build stability, demo mode, optional integrations, seed data, security, UI, docs, dependency cleanup, and verification.
- Placeholder scan: no unfinished markers or unspecified "handle later" steps are allowed.
- Type consistency: app auth uses `AppUser`; quiz type uses `"mcq" | "open_ended"` matching Prisma `GameType`; provider env values match `lib/env.ts`.
- Risk note: exact dependency upgrades may require adjustment during Task 10 if package APIs conflict. Changes must be verified after each targeted update.
