import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  CreditCard,
  LogIn,
  MessageSquare,
  Plug,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  return (
    <section
      className="learning-hero relative isolate flex min-h-[86vh] items-center overflow-hidden bg-slate-100 pt-24 dark:bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="motion-rise max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-x-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-teal-500" />
            Courses, adaptive practice, checkout, discussions, and instructor analytics
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[1.02] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            The learning platform that{" "}
            <span className="brand-text">ships everything</span> in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-700 dark:text-slate-300 sm:text-xl">
            Learning Hub brings course management, adaptive practice, secure
            enrollment, course discussions, and instructor analytics into a
            single, modern workspace — with integrations ready when you grow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button className="h-12 cursor-pointer rounded-full bg-teal-600 px-6 text-base font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-lg">
                Launch app
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="h-12 cursor-pointer rounded-full bg-slate-950 px-6 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                Sign in
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button variant="outline" className="h-12 cursor-pointer rounded-full border-slate-300 bg-white/85 px-6 text-base font-bold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                Instructor view
              </Button>
            </Link>
            <Link href="/integrations">
              <Button variant="outline" className="h-12 cursor-pointer rounded-full border-slate-300 bg-white/85 px-6 text-base font-bold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                Integrations
                <Plug className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: BookOpenCheck, label: "Course library" },
              { icon: ClipboardCheck, label: "Adaptive practice" },
              { icon: CreditCard, label: "Secure checkout" },
              { icon: MessageSquare, label: "Discussions" },
              { icon: Plug, label: "Integrations" },
            ].map((item) => (
              <div key={item.label} className="glass-panel flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 dark:text-slate-100">
                <item.icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="motion-rise-delay-1 mt-12 grid max-w-5xl gap-3 md:grid-cols-3">
          {[
            {
              label: "Learner workspace",
              value: "Progress tracking, lesson previews, certificates, and next-best actions.",
            },
            {
              label: "Instructor studio",
              value: "Publishing, chapter management, analytics, and media uploads.",
            },
            {
              label: "Integrations",
              value: "Supabase, payments, video, webhooks, and monitoring — ready to connect.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="product-surface rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-600 dark:text-teal-400">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
