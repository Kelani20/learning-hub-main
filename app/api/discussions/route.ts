import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createDiscussionThread, listDiscussionThreads } from "@/lib/discussions";

const threadSchema = z.object({
  title: z.string().min(4).max(120),
});

export async function GET() {
  return NextResponse.json(await listDiscussionThreads());
}

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title } = threadSchema.parse(await req.json());
  const thread = await createDiscussionThread(userId, title);

  return NextResponse.json(thread);
}
