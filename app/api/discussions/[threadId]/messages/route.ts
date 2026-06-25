import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { addDiscussionMessage } from "@/lib/discussions";

const messageSchema = z.object({
  body: z.string().min(1).max(2000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = messageSchema.safeParse(await req.json().catch(() => null));

    if (!parsed.success) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const message = await addDiscussionMessage(userId, threadId, parsed.data.body);

    return NextResponse.json(message);
  } catch (error) {
    console.log("[DISCUSSION_MESSAGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
