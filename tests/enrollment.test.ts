import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    course: {
      findFirst: vi.fn(),
    },
    purchase: {
      upsert: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";
import { enrollInCourse } from "@/lib/enrollment";

describe("enrollInCourse", () => {
  it("returns not found when a published course does not exist", async () => {
    vi.mocked(db.course.findFirst).mockResolvedValue(null);

    const result = await enrollInCourse("user_1", "course_1");

    expect(result).toMatchObject({
      ok: false,
      status: 404,
      message: "Course not found",
    });
  });

  it("upserts a purchase for a published course", async () => {
    vi.mocked(db.course.findFirst).mockResolvedValue({
      id: "course_1",
      userId: "instructor_1",
      title: "Course",
      description: null,
      imageUrl: null,
      price: 0,
      isPublished: true,
      categoryId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.purchase.upsert).mockResolvedValue({
      id: "purchase_1",
      userId: "user_1",
      courseId: "course_1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await enrollInCourse("user_1", "course_1");

    expect(result).toMatchObject({ ok: true });
    expect(db.purchase.upsert).toHaveBeenCalledWith({
      where: { userId_courseId: { userId: "user_1", courseId: "course_1" } },
      update: {},
      create: { userId: "user_1", courseId: "course_1" },
    });
  });
});
