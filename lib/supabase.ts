import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

export type SupabaseCapabilityStatus = "ready" | "public_only" | "needs_keys";

export type SupabaseCapability = {
  id: string;
  name: string;
  description: string;
  status: SupabaseCapabilityStatus;
  env: string[];
};

const publicUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseProjectRef() {
  if (!publicUrl) return null;

  try {
    return new URL(publicUrl).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

export function isSupabasePublicConfigured() {
  return Boolean(publicUrl && publicKey);
}

export function isSupabaseServerConfigured() {
  return Boolean(publicUrl && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createSupabasePublicClient() {
  if (!publicUrl || !publicKey) return null;

  return createClient(publicUrl, publicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseServiceClient() {
  if (typeof window !== "undefined") {
    throw new Error("Supabase service clients must never be created in the browser");
  }

  if (!publicUrl || !env.SUPABASE_SERVICE_ROLE_KEY) return null;

  return createClient(publicUrl, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseCapabilities(): SupabaseCapability[] {
  const publicReady = isSupabasePublicConfigured();
  const serverReady = isSupabaseServerConfigured();
  const projectRef = getSupabaseProjectRef();

  return [
    {
      id: "supabase-auth",
      name: "Auth",
      description:
        "Upgrade demo role cookies to email, magic-link, OAuth, and protected sessions.",
      status: publicReady ? "ready" : "needs_keys",
      env: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    },
    {
      id: "supabase-db",
      name: "Postgres database",
      description:
        "Move courses, purchases, progress, quiz attempts, and discussions into managed Postgres.",
      status: serverReady ? "ready" : publicReady ? "public_only" : "needs_keys",
      env: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    },
    {
      id: "supabase-storage",
      name: "Storage",
      description:
        "Host course images, PDFs, attachments, and generated learning assets with bucket policies.",
      status: serverReady ? "ready" : publicReady ? "public_only" : "needs_keys",
      env: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    },
    {
      id: "supabase-realtime",
      name: "Realtime",
      description:
        "Power live discussion updates, instructor notifications, and cohort activity feeds.",
      status: publicReady ? "ready" : "needs_keys",
      env: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    },
    {
      id: "supabase-edge",
      name: "Edge Functions",
      description:
        "Run webhook signing, fake-to-real checkout upgrades, quiz enrichment, and content imports.",
      status: serverReady ? "ready" : publicReady ? "public_only" : "needs_keys",
      env: ["SUPABASE_SERVICE_ROLE_KEY"],
    },
    {
      id: "supabase-vector",
      name: "Vector search",
      description:
        "Index lessons and discussions for semantic search, recommendations, and AI study help.",
      status: serverReady ? "ready" : publicReady ? "public_only" : "needs_keys",
      env: ["SUPABASE_SERVICE_ROLE_KEY"],
    },
    {
      id: "supabase-observability",
      name: "Logs and observability",
      description:
        projectRef
          ? `Project ${projectRef} can back audit logs, admin events, and webhook traces.`
          : "Use Supabase logs and database events for admin audits and integration traces.",
      status: publicReady ? "ready" : "needs_keys",
      env: ["NEXT_PUBLIC_SUPABASE_URL"],
    },
  ];
}
