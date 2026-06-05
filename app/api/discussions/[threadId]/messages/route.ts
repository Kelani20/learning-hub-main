import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { addDiscussionMessage } from "@/lib/discussions";

const messageSchema = z.object({
  body: z.string().min(1).max(2000),
});

export async function POST(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { body } = messageSchema.parse(await req.json());
  const message = await addDiscussionMessage(userId, params.threadId, body);

  return NextResponse.json(message);
}
