"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

type DemoCheckoutProps = {
  course: {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
  };
};

export function DemoCheckout({ course }: DemoCheckoutProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const price = course.price ?? 0;
  const orderId = useMemo(
    () =>
      `LH-${course.id.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase()}-${Math.round(price * 100)
        .toString()
        .padStart(4, "0")}`,
    [course.id, price]
  );

  const completePurchase = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Demo payment approved");
      router.push(`/courses/${course.id}`);
      router.refresh();
    } catch {
      toast.error("Demo checkout could not be completed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center text-sm font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <section className="motion-rise rounded-md border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/30 sm:p-6 dark:bg-slate-900 dark:text-slate-50">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="inline-flex items-center gap-x-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-bold text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-100">
                  <CreditCard className="h-4 w-4" />
                  Fake payment gateway
                </p>
                <h1 className="mt-5 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
                  Complete demo checkout
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  This simulates a production payment flow for portfolio testing. No card
                  is charged, and the existing enrollment API still records access.
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black dark:border-slate-800 dark:bg-slate-950">
                {orderId}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  Card number
                </label>
                <Input
                  value="4242 4242 4242 4242"
                  readOnly
                  className="mt-2 h-12 bg-white font-semibold dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  Expiry
                </label>
                <Input
                  value="12 / 30"
                  readOnly
                  className="mt-2 h-12 bg-white font-semibold dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  CVC
                </label>
                <Input
                  value="123"
                  readOnly
                  className="mt-2 h-12 bg-white font-semibold dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "No real charge",
                "Enrollment API",
                "Secure demo copy",
              ].map((item) => (
                <div key={item} className="flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  {item}
                </div>
              ))}
            </div>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={completePurchase}
              className="mt-6 h-12 w-full rounded-full bg-teal-600 text-base font-black text-white hover:bg-teal-500"
            >
              {isSubmitting ? "Approving demo payment..." : `Approve ${formatPrice(price)} demo payment`}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </section>

          <aside className="motion-rise-delay-1 rounded-md border border-white/10 bg-white/10 p-5 shadow-sm backdrop-blur">
            <p className="inline-flex items-center gap-x-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-bold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Order summary
            </p>
            <h2 className="mt-5 text-2xl font-black tracking-normal">{course.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {course.description ?? "Unlock the full course and continue learning."}
            </p>
            <div className="mt-6 space-y-3 rounded-md border border-white/10 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Course access</span>
                <span className="font-black">{formatPrice(price)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Demo discount</span>
                <span className="font-black text-teal-300">No charge</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between text-lg font-black">
                  <span>Total due today</span>
                  <span>{formatPrice(price)}</span>
                </div>
              </div>
            </div>
            <p className="mt-5 flex items-start gap-x-2 text-sm leading-6 text-slate-300">
              <KeyRound className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
              In production this route can be swapped for Stripe, Supabase Edge
              Functions, or another processor while keeping the demo path safe.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
