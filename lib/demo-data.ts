import {
  Attachment,
  Category,
  Chapter,
  Course,
  Game,
  GameType,
  Purchase,
  Question,
  UserProgress,
} from "@prisma/client";
import { Buffer } from "node:buffer";

import { generateLocalQuestions } from "@/lib/quiz/local-generator";

const now = new Date("2026-01-01T00:00:00.000Z");
const demoGameStartedAt = new Date("2026-01-01T13:00:00.000Z");
const demoGameEndedAt = new Date("2026-01-01T13:04:00.000Z");

type DemoGameInput = {
  type: GameType;
  topic: string;
  amount: number;
};

export type DemoGameWithQuestions = Game & { questions: Question[] };

export const demoCategories: Category[] = [
  {
    id: "cat_frontend",
    name: "Frontend",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat_ai",
    name: "AI",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat_product",
    name: "Product",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat_backend",
    name: "Backend",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoCourses: Course[] = [
  {
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
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_product_analytics",
    userId: "demo_instructor",
    title: "Product Analytics Fundamentals",
    description:
      "Learn how to turn user behavior into practical product decisions.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    price: 49,
    isPublished: true,
    categoryId: "cat_product",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_frontend_systems",
    userId: "demo_instructor",
    title: "Frontend Systems That Scale",
    description:
      "Design reusable UI patterns, data loading boundaries, and resilient app surfaces.",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
    price: 29,
    isPublished: true,
    categoryId: "cat_frontend",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_backend_apis",
    userId: "demo_instructor",
    title: "Backend APIs in Production",
    description:
      "Design dependable REST and webhook APIs with clear contracts, pagination, idempotency, and graceful error handling.",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    price: 39,
    isPublished: true,
    categoryId: "cat_backend",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_typescript_deep_dive",
    userId: "demo_instructor",
    title: "TypeScript Deep Dive",
    description:
      "Move beyond basics with generics, narrowing, and utility types that make large codebases safer to refactor.",
    imageUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
    price: 0,
    isPublished: true,
    categoryId: "cat_frontend",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "course_data_storytelling",
    userId: "demo_instructor",
    title: "Data Storytelling for Teams",
    description:
      "Turn dashboards into decisions with clear narratives, honest visualizations, and metrics your team actually trusts.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    price: 59,
    isPublished: true,
    categoryId: "cat_product",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoChapters: Chapter[] = [
  {
    id: "chapter_ai_workflows",
    title: "Designing an AI-assisted workflow",
    description:
      "Break research, drafting, and review into repeatable loops that help you learn faster without losing judgment.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 1,
    isPublished: true,
    isFree: true,
    courseId: "course_ai_productivity",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_prompt_reviews",
    title: "Prompt review and iteration",
    description:
      "Use checklists to test whether an AI response is useful, grounded, and actionable.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    position: 2,
    isPublished: true,
    isFree: false,
    courseId: "course_ai_productivity",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_metrics_that_matter",
    title: "Metrics that matter",
    description:
      "Separate vanity metrics from signals that can guide a product team.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 1,
    isPublished: true,
    isFree: true,
    courseId: "course_product_analytics",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_design_system_boundaries",
    title: "Design system boundaries",
    description:
      "Learn how to keep components reusable without hiding product-specific decisions.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 1,
    isPublished: true,
    isFree: true,
    courseId: "course_frontend_systems",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_api_contracts",
    title: "Designing clear API contracts",
    description:
      "Model resources, status codes, and error shapes so clients can integrate confidently and predictably.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 1,
    isPublished: true,
    isFree: true,
    courseId: "course_backend_apis",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_idempotency_pagination",
    title: "Idempotency and pagination",
    description:
      "Make write endpoints safe to retry and read endpoints scalable with cursor-based pagination.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    position: 2,
    isPublished: true,
    isFree: false,
    courseId: "course_backend_apis",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_webhooks_resilience",
    title: "Webhooks and resilience",
    description:
      "Verify signatures, handle retries, and design outbound webhooks that survive downstream failures.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 3,
    isPublished: true,
    isFree: false,
    courseId: "course_backend_apis",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_ts_generics",
    title: "Generics that pay off",
    description:
      "Write reusable, type-safe functions and components without leaking complexity to callers.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 1,
    isPublished: true,
    isFree: true,
    courseId: "course_typescript_deep_dive",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_ts_narrowing",
    title: "Narrowing and control flow",
    description:
      "Use discriminated unions and type guards to let the compiler rule out impossible states.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    position: 2,
    isPublished: true,
    isFree: true,
    courseId: "course_typescript_deep_dive",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_ts_utility_types",
    title: "Utility types in practice",
    description:
      "Compose Pick, Omit, and mapped types to refactor large codebases with confidence.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 3,
    isPublished: true,
    isFree: false,
    courseId: "course_typescript_deep_dive",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_data_narratives",
    title: "From dashboards to decisions",
    description:
      "Frame a metric inside a clear question so stakeholders know what action it should drive.",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    position: 1,
    isPublished: true,
    isFree: true,
    courseId: "course_data_storytelling",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "chapter_honest_visuals",
    title: "Honest visualizations",
    description:
      "Choose chart types and scales that tell the truth and earn long-term trust from your team.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    position: 2,
    isPublished: true,
    isFree: false,
    courseId: "course_data_storytelling",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoAttachments: Attachment[] = [
  {
    id: "attachment_ai_workflow_checklist",
    name: "Workflow checklist",
    url: "https://example.com/learning-hub/workflow-checklist.pdf",
    courseId: "course_ai_productivity",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoPurchase: Purchase = {
  id: "purchase_demo_ai_productivity",
  userId: "demo_learner",
  courseId: "course_ai_productivity",
  createdAt: now,
  updatedAt: now,
};

const demoHistorySeeds: DemoGameInput[] = [
  {
    type: GameType.mcq,
    topic: "AI study workflows",
    amount: 4,
  },
  {
    type: GameType.open_ended,
    topic: "Product analytics",
    amount: 3,
  },
  {
    type: GameType.mcq,
    topic: "Frontend architecture",
    amount: 4,
  },
];

function encodeDemoTopic(topic: string) {
  return Buffer.from(topic, "utf8").toString("base64url");
}

function decodeDemoTopic(encodedTopic: string) {
  return Buffer.from(encodedTopic, "base64url").toString("utf8");
}

export function createDemoGameId({ type, topic, amount }: DemoGameInput) {
  return `demo-${type}-${amount}-${encodeDemoTopic(topic)}`;
}

export function parseDemoGameId(gameId: string): DemoGameInput | null {
  const match = gameId.match(/^demo-(mcq|open_ended)-(\d+)-(.+)$/);

  if (!match) return null;

  const amount = Number.parseInt(match[2], 10);

  if (!Number.isFinite(amount) || amount < 1) return null;

  try {
    return {
      type: match[1] as GameType,
      amount,
      topic: decodeDemoTopic(match[3]),
    };
  } catch {
    return null;
  }
}

export function isDemoGameId(gameId: string) {
  return parseDemoGameId(gameId) !== null;
}

export function getDemoGameWithQuestions(
  gameId: string,
  userId: string,
  ended = false
): DemoGameWithQuestions | null {
  const parsedGame = parseDemoGameId(gameId);

  if (!parsedGame) return null;

  const generatedQuestions = generateLocalQuestions(
    parsedGame.topic,
    parsedGame.amount,
    parsedGame.type
  );

  const questions = generatedQuestions.map((question, index): Question => {
    const demoAnswer =
      parsedGame.type === GameType.mcq
        ? question.options?.[0] ?? question.answer
        : question.answer;

    return {
      id: `demo-question-${index}-${gameId}`,
      gameId,
      question: question.question,
      answer: demoAnswer,
      options:
        parsedGame.type === GameType.mcq
          ? JSON.stringify(question.options ?? [question.answer])
          : null,
      percentageCorrect: ended && parsedGame.type === GameType.open_ended ? 86 : null,
      isCorrect: ended && parsedGame.type === GameType.mcq ? index % 4 !== 1 : null,
      questionType: parsedGame.type,
      userAnswers: ended
        ? parsedGame.type === GameType.mcq
          ? demoAnswer
          : demoAnswer
        : null,
    };
  });

  return {
    id: gameId,
    userId,
    timeStarted: demoGameStartedAt,
    timeEnded: ended ? demoGameEndedAt : null,
    topic: parsedGame.topic,
    gameType: parsedGame.type,
    questions,
  };
}

export function getDemoGames(userId: string, limit = 10): Game[] {
  return demoHistorySeeds
    .map((seed, index) => ({
      id: createDemoGameId(seed),
      userId,
      timeStarted: new Date(demoGameStartedAt.getTime() - index * 86400000),
      timeEnded: new Date(demoGameEndedAt.getTime() - index * 86400000),
      topic: seed.topic,
      gameType: seed.type,
    }))
    .slice(0, limit);
}

export function getDemoTopicCounts() {
  return [
    { text: "AI workflows", value: 14 },
    { text: "Product analytics", value: 10 },
    { text: "Frontend systems", value: 8 },
    { text: "Study habits", value: 7 },
    { text: "Review loops", value: 6 },
  ];
}

export function isDemoCourseId(courseId: string) {
  return demoCourses.some((course) => course.id === courseId);
}

export function getDemoCategory(categoryId?: string | null) {
  return demoCategories.find((category) => category.id === categoryId) ?? null;
}

export function getDemoCourse(courseId: string) {
  return demoCourses.find((course) => course.id === courseId) ?? null;
}

export function getDemoChapters(courseId: string) {
  return demoChapters
    .filter((chapter) => chapter.courseId === courseId && chapter.isPublished)
    .sort((a, b) => a.position - b.position);
}

export function getDemoChapter(chapterId: string) {
  return demoChapters.find((chapter) => chapter.id === chapterId) ?? null;
}

export function getDemoProgress(courseId: string) {
  if (courseId === "course_product_analytics") return 100;
  if (courseId === "course_ai_productivity") return 50;
  return null;
}

export function getDemoProgressRows(
  userId: string,
  courseId: string
): UserProgress[] {
  if (courseId !== "course_ai_productivity") return [];

  return [
    {
      id: "progress_demo_ai_workflows",
      userId,
      chapterId: "chapter_ai_workflows",
      isCompleted: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function filterDemoCourses({
  title,
  categoryId,
}: {
  title?: string;
  categoryId?: string;
}) {
  const normalizedTitle = title?.trim().toLowerCase();

  return demoCourses.filter((course) => {
    const matchesTitle = normalizedTitle
      ? course.title.toLowerCase().includes(normalizedTitle)
      : true;
    const matchesCategory = categoryId ? course.categoryId === categoryId : true;

    return course.isPublished && matchesTitle && matchesCategory;
  });
}

export function makeDemoPurchase(userId: string, courseId: string): Purchase {
  return {
    ...demoPurchase,
    id: `purchase_${userId}_${courseId}`,
    userId,
    courseId,
  };
}
