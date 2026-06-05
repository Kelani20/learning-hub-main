import { z } from "zod";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const endGameSchema = z.object({
  gameId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { gameId } = endGameSchema.parse(body);

    const game = await db.game.findFirst({
      where: {
        id: gameId,
        userId,
      },
    });

    if (!game) {
      return NextResponse.json("Game not found", { status: 404 });
    }

    await db.game.update({
      where: {
        id: gameId,
      },
      data: {
        timeEnded: new Date(),
      },
    });

    return NextResponse.json("Game ended");
  } catch (error) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
