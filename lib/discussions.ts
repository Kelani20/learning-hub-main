import { db } from "@/lib/db";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

const demoThreadCreatedAt = new Date("2026-01-01T00:00:00.000Z");

export function makeDiscussionSlug(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "discussion"
  );
}

type DemoMessage = {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

type DemoThread = {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  courseId: string | null;
  createdAt: Date;
  updatedAt: Date;
  course: {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  messages: DemoMessage[];
};

// In demo mode without a database, keep discussions in memory for the life of
// the server process. This makes "create thread" and "reply" actually persist
// within a session instead of silently vanishing on the next refresh.
let demoThreadStore: DemoThread[] | null = null;

function demoThreads(): DemoThread[] {
  if (!demoThreadStore) {
    demoThreadStore = [
      {
        id: "thread_demo_ai_workflow",
        title: "How should I structure an AI-assisted study workflow?",
        slug: "ai-assisted-study-workflow-demo",
        authorId: "demo_learner",
        courseId: "course_ai_productivity",
        createdAt: demoThreadCreatedAt,
        updatedAt: demoThreadCreatedAt,
        course: {
          id: "course_ai_productivity",
          userId: "demo_instructor",
          title: "AI Productivity Systems",
          description:
            "Build a practical learning workflow with AI assistants, focused prompts, and review loops.",
          imageUrl:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop",
          price: 0,
          isPublished: true,
          categoryId: "cat_ai",
          createdAt: demoThreadCreatedAt,
          updatedAt: demoThreadCreatedAt,
        },
        messages: [
          {
            id: "message_demo_question",
            threadId: "thread_demo_ai_workflow",
            authorId: "demo_learner",
            body: "I want a workflow that helps me learn faster without blindly trusting generated answers.",
            createdAt: demoThreadCreatedAt,
            updatedAt: demoThreadCreatedAt,
          },
          {
            id: "message_demo_answer",
            threadId: "thread_demo_ai_workflow",
            authorId: "demo_instructor",
            body: "Start with a question, ask for contrasting approaches, then write your own summary before checking the model's critique.",
            createdAt: demoThreadCreatedAt,
            updatedAt: demoThreadCreatedAt,
          },
        ],
      },
    ];
  }

  return demoThreadStore;
}

function createDemoThread(authorId: string, title: string, slug: string): DemoThread {
  const now = new Date();
  const thread: DemoThread = {
    id: `thread_${slug}`,
    title,
    slug,
    authorId,
    courseId: null,
    createdAt: now,
    updatedAt: now,
    course: null,
    messages: [
      {
        id: `message_${slug}`,
        threadId: `thread_${slug}`,
        authorId,
        body: "Starting the discussion.",
        createdAt: now,
        updatedAt: now,
      },
    ],
  };

  demoThreads().unshift(thread);
  return thread;
}

function createDemoMessage(authorId: string, threadId: string, body: string): DemoMessage {
  const now = new Date();
  const message: DemoMessage = {
    id: `message_${now.getTime()}`,
    threadId,
    authorId,
    body,
    createdAt: now,
    updatedAt: now,
  };

  const thread = demoThreads().find((item) => item.id === threadId);
  if (thread) {
    thread.messages.push(message);
    thread.updatedAt = now;
  }

  return message;
}

export async function listDiscussionThreads() {
  if (isDemoMode && !hasDatabaseUrl) {
    return [...demoThreads()].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  try {
    const threads = await db.discussionThread.findMany({
      include: {
        course: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (threads.length > 0 || !isDemoMode) {
      return threads;
    }
  } catch (error) {
    console.log("[DISCUSSION_THREADS]", error);
  }

  return [...demoThreads()].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
}

export async function createDiscussionThread(authorId: string, title: string) {
  const slug = `${makeDiscussionSlug(title)}-${Date.now()}`;

  if (isDemoMode && !hasDatabaseUrl) {
    return createDemoThread(authorId, title, slug);
  }

  try {
    return await db.discussionThread.create({
      data: {
        title,
        slug,
        authorId,
        messages: {
          create: {
            authorId,
            body: "Starting the discussion.",
          },
        },
      },
      include: {
        messages: true,
      },
    });
  } catch (error) {
    if (!isDemoMode) throw error;

    return createDemoThread(authorId, title, slug);
  }
}

export async function addDiscussionMessage(
  authorId: string,
  threadId: string,
  body: string
) {
  if (isDemoMode && !hasDatabaseUrl) {
    return createDemoMessage(authorId, threadId, body);
  }

  try {
    return await db.discussionMessage.create({
      data: {
        authorId,
        threadId,
        body,
      },
    });
  } catch (error) {
    if (!isDemoMode) throw error;

    return createDemoMessage(authorId, threadId, body);
  }
}
