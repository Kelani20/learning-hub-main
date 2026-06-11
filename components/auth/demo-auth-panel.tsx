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
    title: "Demo Learner",
    email: "learner@learninghub.demo",
    description: "Browse, enroll, pay through fake checkout, take quizzes, and join discussions.",
    icon: GraduationCap,
  },
  {
    role: "instructor" as const,
    title: "Demo Instructor",
    email: "instructor@learninghub.demo",
    description: "Manage courses, chapters, publishing, analytics, and integration readiness.",
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
          <Link href="/" className="inline-flex items-center gap-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-slate-950 shadow-lg">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-normal">Learning Hub</span>
          </Link>
          <p className="mt-8 inline-flex items-center gap-x-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-bold text-cyan-100">
            <KeyRound className="h-4 w-4" />
            Portfolio-safe demo authentication
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            {mode === "sign-up" ? "Create a demo account in one click." : "Sign in and test the whole LMS."}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            No password or private account is required. Pick a role and the app opens
            the same protected learner and instructor workflows a reviewer would test.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              "Role cookies",
              "Protected pages",
              "No secret keys in browser",
            ].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/10 p-4 text-sm font-bold text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="motion-rise-delay-1 rounded-md border border-white/10 bg-white p-4 text-slate-950 shadow-2xl shadow-black/30 sm:p-6 dark:bg-slate-900 dark:text-slate-50">
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
                    "min-h-[170px] rounded-md border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.96]",
                    isSelected
                      ? "border-teal-500 bg-teal-50 shadow-lg shadow-teal-900/10 dark:bg-teal-950/40"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-black tracking-normal">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Demo email
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
                value="portfolio-demo"
                readOnly
                type="password"
                className="mt-2 h-12 bg-white font-semibold dark:bg-slate-900"
              />
            </div>
            <Button
              type="button"
              onClick={continueDemo}
              className="h-12 w-full rounded-full bg-slate-950 text-base font-black text-white hover:bg-slate-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              Continue as {selectedCard.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-slate-300">
            <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="hover:text-slate-950 dark:hover:text-white">
              {mode === "sign-in" ? "Need an account? Try sign up" : "Already have a demo account? Sign in"}
            </Link>
            <Link
              href="http://github.com/kelani20"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-x-2 hover:text-slate-950 dark:hover:text-white"
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
