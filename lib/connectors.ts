import { env } from "@/lib/env";
import { getSupabaseCapabilities } from "@/lib/supabase";

export type ConnectorStatus = "live" | "configured" | "needs_setup";
export type ConnectorCategory =
  | "Core learning"
  | "Supabase platform"
  | "Content"
  | "Growth"
  | "Operations";

export type Connector = {
  id: string;
  name: string;
  provider: string;
  category: ConnectorCategory;
  description: string;
  status: ConnectorStatus;
  statusLabel: string;
  requiredEnv: string[];
  signal: string;
  action: string;
};

type OptionalConnectorDefinition = Omit<Connector, "status" | "statusLabel"> & {
  configuredLabel: string;
  setupLabel: string;
};

const hasEnv = (key: string) => {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0;
};

const hasEveryEnv = (keys: string[]) => keys.every(hasEnv);

const providerConnector = ({
  id,
  name,
  provider,
  category,
  description,
  signal,
  action,
  requiredEnv = [],
  configured,
}: {
  id: string;
  name: string;
  provider: string;
  category: ConnectorCategory;
  description: string;
  signal: string;
  action: string;
  requiredEnv?: string[];
  configured: boolean;
}): Connector => ({
  id,
  name,
  provider,
  category,
  description,
  signal,
  action,
  requiredEnv,
  status: configured ? "configured" : "needs_setup",
  statusLabel: configured ? "Configured" : "Needs setup",
});

const optionalConnectors: OptionalConnectorDefinition[] = [
  {
    id: "uploadthing",
    name: "Asset uploads",
    provider: "UploadThing",
    category: "Content",
    description:
      "Instructor upload flow for course images, attachments, audio, video, and PDFs.",
    requiredEnv: ["UPLOADTHING_APP_ID", "UPLOADTHING_SECRET"],
    signal: "Course media pipeline",
    action: "Add UploadThing keys for production uploads",
    configuredLabel: "Configured",
    setupLabel: "Ready to wire",
  },
  {
    id: "github",
    name: "GitHub learning source",
    provider: "GitHub",
    category: "Content",
    description:
      "Connect repositories to turn READMEs, docs, and release notes into lesson material.",
    requiredEnv: ["GITHUB_CLIENT_ID"],
    signal: "Developer-course imports",
    action: "Add OAuth app details before enabling repo imports",
    configuredLabel: "Configured",
    setupLabel: "Blueprint",
  },
  {
    id: "notion",
    name: "Notion knowledge base",
    provider: "Notion",
    category: "Content",
    description:
      "Use team notes and course outlines as structured source material for curricula.",
    requiredEnv: ["NOTION_API_KEY"],
    signal: "Team knowledge imports",
    action: "Add a Notion integration secret",
    configuredLabel: "Configured",
    setupLabel: "Blueprint",
  },
  {
    id: "google-drive",
    name: "Google Drive library",
    provider: "Google Drive",
    category: "Content",
    description:
      "Attach slide decks, docs, worksheets, and source files to learning paths.",
    requiredEnv: ["GOOGLE_CLIENT_ID"],
    signal: "Document resource sync",
    action: "Add Google OAuth client settings",
    configuredLabel: "Configured",
    setupLabel: "Blueprint",
  },
  {
    id: "slack",
    name: "Slack cohort alerts",
    provider: "Slack",
    category: "Growth",
    description:
      "Send cohort nudges, instructor replies, and discussion highlights to Slack.",
    requiredEnv: ["SLACK_BOT_TOKEN"],
    signal: "Learner engagement",
    action: "Add a Slack bot token",
    configuredLabel: "Configured",
    setupLabel: "Blueprint",
  },
  {
    id: "webhooks",
    name: "Outbound webhooks",
    provider: "Signed webhooks",
    category: "Operations",
    description:
      "Notify external systems when enrollments, completions, and quiz attempts happen.",
    requiredEnv: ["WEBHOOK_SIGNING_SECRET"],
    signal: "Automation events",
    action: "Add a signing secret",
    configuredLabel: "Configured",
    setupLabel: "Blueprint",
  },
  {
    id: "posthog",
    name: "Product analytics",
    provider: "PostHog",
    category: "Operations",
    description:
      "Track activation, lesson completion, quiz creation, and discussion conversion.",
    requiredEnv: ["NEXT_PUBLIC_POSTHOG_KEY"],
    signal: "Usage instrumentation",
    action: "Add the public project key",
    configuredLabel: "Configured",
    setupLabel: "Ready to wire",
  },
  {
    id: "sentry",
    name: "Error monitoring",
    provider: "Sentry",
    category: "Operations",
    description:
      "Capture production errors across routes, server actions, and integration calls.",
    requiredEnv: ["SENTRY_DSN"],
    signal: "Runtime observability",
    action: "Add a Sentry DSN",
    configuredLabel: "Configured",
    setupLabel: "Ready to wire",
  },
];

const mapOptionalConnector = (
  connector: OptionalConnectorDefinition
): Connector => {
  const configured = hasEveryEnv(connector.requiredEnv);

  return {
    ...connector,
    status: configured ? "configured" : "needs_setup",
    statusLabel: configured ? connector.configuredLabel : connector.setupLabel,
  };
};

export function getConnectorCatalog(): Connector[] {
  const supabaseConnectors: Connector[] = getSupabaseCapabilities().map(
    (capability) => ({
      id: capability.id,
      name: capability.name,
      provider: "Supabase",
      category: "Supabase platform",
      description: capability.description,
      requiredEnv: capability.env,
      signal:
        capability.status === "ready"
          ? "Connected capability"
          : capability.status === "public_only"
            ? "Public keys present; server secret still needed"
            : "Ready to connect with Supabase env keys",
      action:
        capability.status === "ready"
          ? "Use this path for production data and automation"
          : capability.status === "public_only"
            ? "Add the server-side service role only in deployment secrets"
            : "Add public Supabase URL and browser-safe anon or publishable key",
      status: capability.status === "needs_keys" ? "needs_setup" : "configured",
      statusLabel:
        capability.status === "ready"
          ? "Configured"
          : capability.status === "public_only"
            ? "Public keys"
            : "Needs setup",
    })
  );

  const videoConnector = providerConnector({
    id: "video",
    name: "Lesson video",
    provider: env.VIDEO_PROVIDER === "mux" ? "Mux" : "URL embeds",
    category: "Core learning",
    description:
      "Deliver chapters with the free URL player by default or switch to Mux when encoding is needed.",
    requiredEnv: env.VIDEO_PROVIDER === "mux" ? ["MUX_TOKEN_ID", "MUX_TOKEN_SECRET"] : [],
    signal: env.VIDEO_PROVIDER === "mux" ? "Encoding pipeline" : "Free embedded playback",
    action:
      env.VIDEO_PROVIDER === "mux"
        ? "Keep Mux keys present in production"
        : "Set VIDEO_PROVIDER=mux when managed video is required",
    configured:
      env.VIDEO_PROVIDER === "mux"
        ? Boolean(env.MUX_TOKEN_ID && env.MUX_TOKEN_SECRET)
        : true,
  });

  const paymentConnector = providerConnector({
    id: "payments",
    name: "Enrollment and payments",
    provider: env.PAYMENT_PROVIDER === "stripe" ? "Stripe" : "Demo enrollment",
    category: "Growth",
    description:
      "Keep public demos frictionless with free enrollment, then enable Stripe for paid courses.",
    requiredEnv:
      env.PAYMENT_PROVIDER === "stripe"
        ? ["STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET"]
        : [],
    signal:
      env.PAYMENT_PROVIDER === "stripe"
        ? "Paid checkout"
        : "No-card course access",
    action:
      env.PAYMENT_PROVIDER === "stripe"
        ? "Verify checkout and webhook secrets"
        : "Set PAYMENT_PROVIDER=stripe for paid launch",
    configured:
      env.PAYMENT_PROVIDER === "stripe"
        ? Boolean(env.STRIPE_API_KEY && env.STRIPE_WEBHOOK_SECRET)
        : true,
  });

  return [
    {
      id: "auth",
      name: "Authentication",
      provider: "Demo auth",
      category: "Core learning",
      description:
        "Role switching keeps learner and instructor journeys available without private accounts.",
      status: "live",
      statusLabel: "Live in demo",
      requiredEnv: ["DEMO_USER_ID", "DEMO_ADMIN_ID"],
      signal: "Learner and instructor personas",
      action: "Replace with a production auth provider for private deployments",
    },
    videoConnector,
    paymentConnector,
    ...supabaseConnectors,
    {
      id: "quiz",
      name: "Quiz generation",
      provider: "Local engine",
      category: "Core learning",
      description:
        "Deterministic topic quizzes work without paid AI keys and stay testable in CI.",
      status: "live",
      statusLabel: "Live in demo",
      requiredEnv: ["QUIZ_PROVIDER"],
      signal: "Saved practice attempts",
      action: "Add an AI provider later without breaking the local fallback",
    },
    {
      id: "discussions",
      name: "Discussions",
      provider: "Database threads",
      category: "Core learning",
      description:
        "Course discussions are backed by app data instead of a paid chat dependency.",
      status: "live",
      statusLabel: "Live in demo",
      requiredEnv: ["DISCUSSION_PROVIDER"],
      signal: "Course-specific community",
      action: "Add moderation workflows before high-volume launch",
    },
    ...optionalConnectors.map(mapOptionalConnector),
  ];
}

export function getConnectorSummary(connectors = getConnectorCatalog()) {
  const live = connectors.filter((connector) => connector.status === "live").length;
  const configured = connectors.filter(
    (connector) => connector.status === "configured"
  ).length;
  const needsSetup = connectors.filter(
    (connector) => connector.status === "needs_setup"
  ).length;

  return {
    total: connectors.length,
    live,
    configured,
    needsSetup,
    ready: live + configured,
  };
}
