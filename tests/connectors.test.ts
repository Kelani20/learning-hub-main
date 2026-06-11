import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getConnectorCatalog, getConnectorSummary } from "@/lib/connectors";

const envKeys = [
  "SLACK_BOT_TOKEN",
  "SENTRY_DSN",
  "NEXT_PUBLIC_POSTHOG_KEY",
] as const;

const originalValues = new Map<string, string | undefined>();

beforeEach(() => {
  envKeys.forEach((key) => {
    originalValues.set(key, process.env[key]);
    delete process.env[key];
  });
});

afterEach(() => {
  envKeys.forEach((key) => {
    const originalValue = originalValues.get(key);

    if (originalValue === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  });
  originalValues.clear();
});

describe("connector catalog", () => {
  it("includes demo-live learning providers and optional production connectors", () => {
    const connectors = getConnectorCatalog();
    const summary = getConnectorSummary(connectors);

    expect(connectors).toHaveLength(20);
    expect(connectors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "auth", status: "live" }),
        expect.objectContaining({ id: "quiz", status: "live" }),
        expect.objectContaining({ id: "discussions", status: "live" }),
        expect.objectContaining({ id: "supabase-auth", status: "needs_setup" }),
        expect.objectContaining({ id: "uploadthing", status: "needs_setup" }),
      ])
    );
    expect(summary).toMatchObject({
      total: 20,
      live: 3,
      ready: 5,
      needsSetup: 15,
    });
  });

  it("marks optional connectors configured when their required env keys are present", () => {
    process.env.SLACK_BOT_TOKEN = "xoxb-token";
    process.env.SENTRY_DSN = "https://example@sentry.io/1";

    const connectors = getConnectorCatalog();
    const summary = getConnectorSummary(connectors);

    expect(connectors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "slack", status: "configured" }),
        expect.objectContaining({ id: "sentry", status: "configured" }),
      ])
    );
    expect(summary.configured).toBe(4);
    expect(summary.ready).toBe(7);
  });
});
