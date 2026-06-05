import { db } from "@/lib/db";

export function makeDiscussionSlug(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "discussion"
  );
}

export async function listDiscussionThreads() {
  return db.discussionThread.findMany({
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
}

export async function createDiscussionThread(authorId: string, title: string) {
  const slug = `${makeDiscussionSlug(title)}-${Date.now()}`;

  return db.discussionThread.create({
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
}

export async function addDiscussionMessage(
  authorId: string,
  threadId: string,
  body: string
) {
  return db.discussionMessage.create({
    data: {
      authorId,
      threadId,
      body,
    },
  });
}
