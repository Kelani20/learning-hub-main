import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/webhook/route";

describe("Stripe webhook route", () => {
  it("stays closed in the default demo payment mode", async () => {
    const response = await POST(new Request("http://localhost/api/webhook", {
      method: "POST",
      body: "{}",
    }));

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Stripe webhooks are not enabled");
  });
});
