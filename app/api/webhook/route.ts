import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  if (env.PAYMENT_PROVIDER !== "stripe") {
    return new NextResponse("Stripe webhooks are not enabled", { status: 404 });
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Stripe webhook secret is not configured", {
      status: 503,
    });
  }

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  if (!signature) {
    return new NextResponse("Webhook Error: Missing Stripe signature", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    const { stripe } = await import("@/lib/stripe");
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type == "checkout.session.completed") {
    if (!userId || !courseId) {
      return new NextResponse(`Webhook Error: Missing metadata`, {
        status: 400,
      });
    }

    try {
      // Idempotent: Stripe retries deliver the same event, so upsert instead of
      // create to avoid a unique-constraint crash (and an infinite retry loop).
      await db.purchase.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: { courseId, userId },
      });
    } catch (error) {
      console.log("[STRIPE_WEBHOOK]", error);
      return new NextResponse("Webhook handler failed", { status: 500 });
    }
  } else {
    return new NextResponse(
      `Webhook Error: Unhandled event type ${event.type}`,
      { status: 200 }
    );
  }

  return new NextResponse(null, { status: 200 });
}
