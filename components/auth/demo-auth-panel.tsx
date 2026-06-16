"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Github,
  GraduationCap,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DemoRole = "learner" | "instructor";

const roleCards = [
  {
    role: "learner" as const,
    title: "Learner",
    email: "learner@learninghub.app",
    description: "Browse the catalog, enroll, complete secure checkout, take quizzes, and join discussions.",
    icon: GraduationCap,
  },
  {
    role: "instructor" as const,
    title: "Instructor",
    email: "instructor@learninghub.app",
    description: "Build courses, manage chapters and publishing, track analytics, and wire up integrations.",
    icon: ShieldCheck,
  },
];

export function DemoAuthPanel({
  mode = "sign-in",
}: {
  mode?: "sign-in" | "sign-up";
}) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<DemoRole>("learner");
  const [email, setEmail] = useState(roleCards[0].email);

  const selectedCard = roleCards.find((card) => card.role === selectedRole)!;

  const continueDemo = () => {
    document.cookie = `learning-hub-demo-role=${selectedRole}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(selectedRole === "instructor" ? "/admin/courses" : "/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen w-full bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="motion-rise">
          <Link href="/" className="group inline-flex cursor-pointer items-center gap-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20 transition-transform duration-200 group-hover:-translate-y-0.5">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight">Learning Hub</span>
          </Link>
          <p className="mt-8 inline-flex items-center gap-x-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-100">
            <KeyRound className="h-4 w-4" />
            Choose your workspace
          </p>
          <h1 className="mt-5 max-w-2xl text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {mode === "sign-up" ? "Create your account in one click." : "Sign in to your Learning Hub."}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-slate-300">
            Pick the workspace that fits you. Each role opens its own protected
            experience — the full learner journey or the complete instructor studio.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              "Role-based access",
              "Protected pages",
              "Secure by default",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-100 transition-colors duration-200 hover:border-brand-500/40">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="motion-rise-delay-1 rounded-2xl border border-white/10 bg-white p-4 text-slate-950 shadow-2xl shadow-black/30 sm:p-6 dark:bg-slate-900 dark:text-slate-50">
          <div className="grid gap-3 sm:grid-cols-2">
            {roleCards.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedRole === card.role;

              return (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(card.role);
                    setEmail(card.email);
                  }}
                  className={cn(
                    "min-h-[170px] cursor-pointer rounded-xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 active:scale-[0.97]",
                    isSelected
                      ? "border-teal-500 bg-teal-50 shadow-lg shadow-teal-900/10 dark:bg-teal-950/40"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                  )}
                >
                  <div className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200",
                    isSelected
                      ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950"
                      : "bg-slate-950 text-white dark:bg-slate-800"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-black tracking-tight">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Email
              </label>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 bg-white font-semibold dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Password
              </label>
              <Input
                value="••••••••••"
                readOnly
                type="password"
                className="mt-2 h-12 bg-white font-semibold dark:bg-slate-900"
              />
            </div>
            <Button
              type="button"
              onClick={continueDemo}
              className="h-12 w-full cursor-pointer rounded-full bg-slate-950 text-base font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              Continue as {selectedCard.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-slate-300">
            <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="cursor-pointer transition-colors duration-200 hover:text-slate-950 dark:hover:text-white">
              {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Link>
            <Link
              href="https://github.com/Kelani20"
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center gap-x-2 transition-colors duration-200 hover:text-slate-950 dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
