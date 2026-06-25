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
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = threadSchema.safeParse(await req.json().catch(() => null));

    if (!parsed.success) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const thread = await createDiscussionThread(userId, parsed.data.title);

    return NextResponse.json(thread);
  } catch (error) {
    console.log("[DISCUSSIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
