import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { enrollInCourse } from "@/lib/enrollment";

export async function POST(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await enrollInCourse(userId, params.courseId);

  if (!result.ok) {
    return new NextResponse(result.message, { status: result.status });
  }

  return NextResponse.json({ enrolled: true });
}
