import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    chapter: {
      findMany: vi.fn(),
    },
    userProgress: {
      count: vi.fn(),
    },
  },
}));

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

describe("getProgress", () => {
  it("returns zero when a course has no published chapters", async () => {
    vi.mocked(db.chapter.findMany).mockResolvedValue([]);

    await expect(getProgress("user_1", "course_1")).resolves.toBe(0);
    expect(db.userProgress.count).not.toHaveBeenCalled();
  });
});
