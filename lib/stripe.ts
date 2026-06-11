import Stripe from "stripe";

import { env } from "@/lib/env";

if (env.PAYMENT_PROVIDER === "stripe" && !env.STRIPE_API_KEY) {
  throw new Error("STRIPE_API_KEY is required when PAYMENT_PROVIDER=stripe");
}

export const stripe = new Stripe(env.STRIPE_API_KEY ?? "sk_test_demo_disabled", {
  apiVersion: "2023-10-16",
  typescript: true,
})
