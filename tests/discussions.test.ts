import { describe, expect, it } from "vitest";

import { makeDiscussionSlug } from "@/lib/discussions";

describe("makeDiscussionSlug", () => {
  it("normalizes a title into a readable slug", () => {
    expect(makeDiscussionSlug("How do I review AI notes?")).toBe(
      "how-do-i-review-ai-notes"
    );
  });
});
