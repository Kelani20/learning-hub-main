import { describe, expect, it } from "vitest";

import { toEmbeddableVideoUrl } from "@/lib/video";

describe("toEmbeddableVideoUrl", () => {
  it("converts YouTube watch URLs to embeddable URLs", () => {
    expect(toEmbeddableVideoUrl("https://www.youtube.com/watch?v=jNQXAC9IVRw")).toBe(
      "https://www.youtube.com/embed/jNQXAC9IVRw"
    );
  });

  it("leaves direct video URLs unchanged", () => {
    expect(toEmbeddableVideoUrl("https://example.com/video.mp4")).toBe(
      "https://example.com/video.mp4"
    );
  });
});
