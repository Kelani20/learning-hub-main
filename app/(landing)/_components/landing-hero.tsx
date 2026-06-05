"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, MessageSquare, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  return (
    <section
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-slate-100 pt-24"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(248,250,252,0.98) 0%, rgba(248,250,252,0.90) 44%, rgba(248,250,252,0.32) 100%), url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1800&auto=format&fit=crop')",
        backgroundPosition: "center top",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-x-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Demo LMS, rebuilt for portfolio review
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Learning Hub
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            A modern course platform with demo auth, free enrollment, instructor publishing,
            local quizzes, progress tracking, and database-backed discussions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: BookOpenCheck, label: "Seeded courses" },
              { icon: MessageSquare, label: "Live discussions" },
              { icon: Sparkles, label: "Local quiz engine" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-x-3 rounded-md border border-white/80 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
                <item.icon className="h-4 w-4 text-slate-950" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
