"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
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

      toast.success("You're enrolled!");
      router.push(`/courses/${course.id}`);
      router.refresh();
    } catch {
      toast.error("We couldn't complete your enrollment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex cursor-pointer items-center text-sm font-bold text-slate-300 transition-colors duration-200 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <section className="motion-rise rounded-2xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/30 sm:p-6 dark:bg-slate-900 dark:text-slate-50">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="inline-flex items-center gap-x-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-bold text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-100">
                  <Lock className="h-4 w-4" />
                  Secure checkout
                </p>
                <h1 className="mt-5 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Complete your enrollment
                </h1>
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Encrypted checkout — get instant access to the course the moment
                  your enrollment is confirmed.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black dark:border-slate-800 dark:bg-slate-950">
                {orderId}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-x-1.5 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  <CreditCard className="h-3.5 w-3.5" />
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
                "256-bit encryption",
                "Instant course access",
                "Lifetime enrollment",
              ].map((item) => (
                <div key={item} className="flex items-center gap-x-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  {item}
                </div>
              ))}
            </div>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={completePurchase}
              className="mt-6 h-12 w-full cursor-pointer rounded-full bg-teal-600 text-base font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Completing enrollment..." : `Complete enrollment · ${formatPrice(price)}`}
              <Lock className="ml-2 h-4 w-4" />
            </Button>
          </section>

          <aside className="motion-rise-delay-1 glass-panel rounded-2xl border border-white/10 p-5 shadow-sm">
            <p className="inline-flex items-center gap-x-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-100">
              <ShieldCheck className="h-4 w-4" />
              Order summary
            </p>
            <h2 className="mt-5 text-balance text-2xl font-black tracking-tight">{course.title}</h2>
            <p className="mt-3 text-pretty text-sm leading-6 text-slate-300">
              {course.description ?? "Unlock the full course and continue learning."}
            </p>
            <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Course access</span>
                <span className="font-black">{formatPrice(price)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Lifetime updates</span>
                <span className="font-black text-teal-300">Included</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between text-lg font-black">
                  <span>Total due today</span>
                  <span>{formatPrice(price)}</span>
                </div>
              </div>
            </div>
            <p className="mt-5 flex items-start gap-x-2 text-sm leading-6 text-slate-300">
              <Lock className="mt-1 h-4 w-4 shrink-0 text-teal-200" />
              Your payment is encrypted end to end. You&apos;ll get instant, lifetime
              access to every chapter the moment you enroll.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
