import { GameType, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function resetDemoData() {
  await db.discussionMessage.deleteMany();
  await db.discussionThread.deleteMany();
  await db.question.deleteMany();
  await db.game.deleteMany();
  await db.topic_count.deleteMany();
  await db.userProgress.deleteMany();
  await db.purchase.deleteMany();
  await db.attachment.deleteMany();
  await db.muxData.deleteMany();
  await db.chapter.deleteMany();
  await db.course.deleteMany();
  await db.category.deleteMany();
}

async function seedCategories() {
  const names = ["Frontend", "Backend", "AI", "Product"];

  return Promise.all(
    names.map((name) =>
      db.category.create({
        data: {
          id: `cat_${name.toLowerCase()}`,
          name,
        },
      })
    )
  );
}

async function main() {
  await resetDemoData();
  const categories = await seedCategories();
  const aiCategory = categories.find((category) => category.name === "AI");
  const productCategory = categories.find((category) => category.name === "Product");
  const frontendCategory = categories.find((category) => category.name === "Frontend");
  const backendCategory = categories.find((category) => category.name === "Backend");

  const aiCourse = await db.course.create({
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
      categoryId: aiCategory?.id,
      chapters: {
        create: [
          {
            id: "chapter_ai_workflows",
            title: "Designing an AI-assisted workflow",
            description:
              "<p>Break research, drafting, and review into repeatable loops that help you learn faster without losing judgment.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 1,
            isPublished: true,
            isFree: true,
          },
          {
            id: "chapter_prompt_reviews",
            title: "Prompt review and iteration",
            description:
              "<p>Use checklists to test whether an AI response is useful, grounded, and actionable.</p>",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            position: 2,
            isPublished: true,
            isFree: false,
          },
        ],
      },
      attachments: {
        create: [
          {
            id: "attachment_ai_workflow_checklist",
            name: "Workflow checklist",
            url: "https://example.com/learning-hub/workflow-checklist.pdf",
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      id: "course_product_analytics",
      userId: "demo_instructor",
      title: "Product Analytics Fundamentals",
      description:
        "Learn how to turn user behavior into practical product decisions.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
      price: 49,
      isPublished: true,
      categoryId: productCategory?.id,
      chapters: {
        create: [
          {
            id: "chapter_metrics_that_matter",
            title: "Metrics that matter",
            description:
              "<p>Separate vanity metrics from signals that can guide a product team.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 1,
            isPublished: true,
            isFree: true,
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      id: "course_frontend_systems",
      userId: "demo_instructor",
      title: "Frontend Systems That Scale",
      description:
        "Design reusable UI patterns, data loading boundaries, and resilient app surfaces.",
      imageUrl:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
      price: 29,
      isPublished: true,
      categoryId: frontendCategory?.id,
      chapters: {
        create: [
          {
            id: "chapter_design_system_boundaries",
            title: "Design system boundaries",
            description:
              "<p>Learn how to keep components reusable without hiding product-specific decisions.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 1,
            isPublished: true,
            isFree: true,
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      id: "course_backend_apis",
      userId: "demo_instructor",
      title: "Backend APIs in Production",
      description:
        "Design dependable REST and webhook APIs with clear contracts, pagination, idempotency, and graceful error handling.",
      imageUrl:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
      price: 39,
      isPublished: true,
      categoryId: backendCategory?.id,
      chapters: {
        create: [
          {
            id: "chapter_api_contracts",
            title: "Designing clear API contracts",
            description:
              "<p>Model resources, status codes, and error shapes so clients can integrate confidently and predictably.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 1,
            isPublished: true,
            isFree: true,
          },
          {
            id: "chapter_idempotency_pagination",
            title: "Idempotency and pagination",
            description:
              "<p>Make write endpoints safe to retry and read endpoints scalable with cursor-based pagination.</p>",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            position: 2,
            isPublished: true,
            isFree: false,
          },
          {
            id: "chapter_webhooks_resilience",
            title: "Webhooks and resilience",
            description:
              "<p>Verify signatures, handle retries, and design outbound webhooks that survive downstream failures.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 3,
            isPublished: true,
            isFree: false,
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      id: "course_typescript_deep_dive",
      userId: "demo_instructor",
      title: "TypeScript Deep Dive",
      description:
        "Move beyond basics with generics, narrowing, and utility types that make large codebases safer to refactor.",
      imageUrl:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
      price: 0,
      isPublished: true,
      categoryId: frontendCategory?.id,
      chapters: {
        create: [
          {
            id: "chapter_ts_generics",
            title: "Generics that pay off",
            description:
              "<p>Write reusable, type-safe functions and components without leaking complexity to callers.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 1,
            isPublished: true,
            isFree: true,
          },
          {
            id: "chapter_ts_narrowing",
            title: "Narrowing and control flow",
            description:
              "<p>Use discriminated unions and type guards to let the compiler rule out impossible states.</p>",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            position: 2,
            isPublished: true,
            isFree: true,
          },
          {
            id: "chapter_ts_utility_types",
            title: "Utility types in practice",
            description:
              "<p>Compose Pick, Omit, and mapped types to refactor large codebases with confidence.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 3,
            isPublished: true,
            isFree: false,
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      id: "course_data_storytelling",
      userId: "demo_instructor",
      title: "Data Storytelling for Teams",
      description:
        "Turn dashboards into decisions with clear narratives, honest visualizations, and metrics your team actually trusts.",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
      price: 59,
      isPublished: true,
      categoryId: productCategory?.id,
      chapters: {
        create: [
          {
            id: "chapter_data_narratives",
            title: "From dashboards to decisions",
            description:
              "<p>Frame a metric inside a clear question so stakeholders know what action it should drive.</p>",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            position: 1,
            isPublished: true,
            isFree: true,
          },
          {
            id: "chapter_honest_visuals",
            title: "Honest visualizations",
            description:
              "<p>Choose chart types and scales that tell the truth and earn long-term trust from your team.</p>",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            position: 2,
            isPublished: true,
            isFree: false,
          },
        ],
      },
    },
  });

  await db.purchase.create({
    data: {
      id: "purchase_demo_ai_productivity",
      userId: "demo_learner",
      courseId: aiCourse.id,
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
        question: "What makes an AI learning workflow reliable?",
        answer: "A repeatable review loop",
        options: [
          "A repeatable review loop",
          "Random prompting",
          "Skipping validation",
          "Only using one tool",
        ],
        questionType: GameType.mcq,
        isCorrect: true,
        userAnswers: "A repeatable review loop",
      },
      {
        id: "question_demo_ai_2",
        gameId: game.id,
        question: "Which habit improves AI-assisted study sessions?",
        answer: "Checking assumptions",
        options: [
          "Checking assumptions",
          "Accepting every answer",
          "Avoiding examples",
          "Never reviewing notes",
        ],
        questionType: GameType.mcq,
        isCorrect: false,
        userAnswers: "Accepting every answer",
      },
    ],
  });

  await db.topic_count.createMany({
    data: [
      { id: "topic_ai_productivity", topic: "AI productivity", count: 8 },
      { id: "topic_product_analytics", topic: "Product analytics", count: 5 },
    ],
  });

  const thread = await db.discussionThread.create({
    data: {
      id: "thread_demo_ai",
      title: "How do you review AI-generated notes?",
      slug: "review-ai-generated-notes",
      courseId: aiCourse.id,
      authorId: "demo_learner",
    },
  });

  await db.discussionMessage.createMany({
    data: [
      {
        id: "message_demo_ai_1",
        threadId: thread.id,
        authorId: "demo_learner",
        body: "I compare the answer against source notes and ask what assumptions are missing.",
      },
      {
        id: "message_demo_ai_2",
        threadId: thread.id,
        authorId: "demo_instructor",
        body: "That is a good habit. I also like saving reusable critique prompts for common review tasks.",
      },
    ],
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
