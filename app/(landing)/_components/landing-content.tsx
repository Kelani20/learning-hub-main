"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  PlayCircle,
} from "lucide-react";

const paths = [
  {
    title: "Learner Demo",
    description: "Browse seeded courses, enroll without Stripe, watch embedded lessons, and track completion.",
    href: "/dashboard",
    icon: GraduationCap,
  },
  {
    title: "Instructor Studio",
    description: "Create courses, manage chapters, reorder lessons, publish content, and review analytics.",
    href: "/admin/courses",
    icon: BookOpenCheck,
  },
  {
    title: "Practice Lab",
    description: "Generate local multiple-choice prompts, complete quizzes, and build a topic history.",
    href: "/quiz",
    icon: ClipboardCheck,
  },
  {
    title: "Community",
    description: "Open discussion threads and reply with database-backed messages.",
    href: "/discussions",
    icon: MessageSquare,
  },
];

export const LandingContent = () => {
  return (
    <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Demo routes
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Built so reviewers can actually click through the product.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
            <div className="flex items-center gap-x-2 rounded-md border border-slate-200 px-3 py-2">
              <PlayCircle className="h-4 w-4 text-teal-700" />
              URL video
            </div>
            <div className="flex items-center gap-x-2 rounded-md border border-slate-200 px-3 py-2">
              <BarChart3 className="h-4 w-4 text-amber-600" />
              Analytics
            </div>
            <div className="flex items-center gap-x-2 rounded-md border border-slate-200 px-3 py-2">
              <MessageSquare className="h-4 w-4 text-rose-600" />
              Threads
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paths.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-md border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black tracking-normal text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <span className="mt-5 inline-flex text-sm font-bold text-teal-700 transition group-hover:text-teal-900">
                Open route
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
