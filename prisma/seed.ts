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
