import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/format";
import { formatTimeDelta } from "@/lib/utils";

describe("format helpers", () => {
  it("formats Canadian currency", () => {
    expect(formatPrice(19.99)).toBe("CA$19.99");
  });

  it("formats elapsed time as hours, minutes, and seconds", () => {
    expect(formatTimeDelta(3661)).toBe("1h 1m 1s");
  });
});
