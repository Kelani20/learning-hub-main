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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="motion-rise max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-x-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Portfolio LMS with auth, checkout, quizzes, discussions, and Supabase-ready connectors
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Learning Hub
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            A full-stack education platform with course management, adaptive practice,
            fake payments for portfolio testing, role-based demo sign-in, and a visible
            integration command center recruiters can actually inspect.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-in">
              <Button className="h-12 rounded-full bg-teal-600 px-6 text-base font-bold text-white shadow-lg shadow-teal-900/20 hover:bg-teal-500">
                Sign in
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="h-12 rounded-full bg-slate-950 px-6 text-base font-bold text-white hover:bg-slate-800">
                Explore Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button variant="outline" className="h-12 rounded-full border-slate-300 bg-white/85 px-6 text-base font-bold text-slate-950 hover:bg-white">
                Instructor View
              </Button>
            </Link>
            <Link href="/integrations">
              <Button variant="outline" className="h-12 rounded-full border-slate-300 bg-white/85 px-6 text-base font-bold text-slate-950 hover:bg-white">
                Connectors
                <Plug className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: BookOpenCheck, label: "Seeded courses" },
              { icon: ClipboardCheck, label: "Adaptive quizzes" },
              { icon: CreditCard, label: "Fake checkout" },
              { icon: MessageSquare, label: "DB discussions" },
              { icon: Plug, label: "Supabase path" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-x-3 rounded-md border border-white/80 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-slate-100">
                <item.icon className="h-4 w-4 text-slate-950" />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="motion-rise-delay-1 mt-12 grid max-w-5xl gap-3 md:grid-cols-3">
          {[
            {
              label: "Learner workspace",
              value: "Progress, previews, certificates, next actions",
            },
            {
              label: "Instructor studio",
              value: "Publishing, chapters, analytics, uploads",
            },
            {
              label: "Integration lab",
              value: "Supabase, payments, video, webhooks, monitoring",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
