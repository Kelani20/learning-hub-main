import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  CreditCard,
  Database,
  GraduationCap,
  MessageSquare,
  PlayCircle,
  Plug,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { getConnectorCatalog, getConnectorSummary } from "@/lib/connectors";

const paths = [
  {
    title: "Learner workspace",
    description: "Sign in as a learner, browse the course library, enroll through secure checkout, watch lessons, and track completion.",
    href: "/sign-in",
    icon: GraduationCap,
  },
  {
    title: "Instructor studio",
    description: "Create courses, manage chapters, reorder lessons, publish content, and review analytics.",
    href: "/admin/courses",
    icon: BookOpenCheck,
  },
  {
    title: "Practice lab",
    description: "Generate adaptive multiple-choice and open-ended prompts, complete quizzes, and build topic history.",
    href: "/quiz",
    icon: ClipboardCheck,
  },
  {
    title: "Secure checkout",
    description: "Move through an encrypted enrollment flow and get instant access to paid courses.",
    href: "/checkout/course_product_analytics",
    icon: CreditCard,
  },
];

export const LandingContent = () => {
  const connectors = getConnectorCatalog();
  const connectorSummary = getConnectorSummary(connectors);
  const highlightedConnectors = connectors.slice(0, 8);

  return (
    <section className="border-t border-slate-200 bg-white px-4 py-16 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
              Everything in one workspace
            </p>
            <h2 className="mt-3 max-w-2xl text-balance text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Real routes, real workflows — built to use every day.
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 dark:text-slate-400">
              Learning Hub opens straight into working auth, learner, instructor,
              quiz, discussion, analytics, checkout, and Supabase-backed
              workflows — a product, not a marketing shell.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:grid-cols-4">
            <div className="flex items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
              <PlayCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Video lessons
            </div>
            <div className="flex items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
              <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Analytics
            </div>
            <div className="flex items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
              <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Discussions
            </div>
            <div className="flex items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
              <Plug className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Supabase
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paths.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="product-muted group cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
              <span className="mt-5 inline-flex text-sm font-bold text-teal-600 transition-colors duration-200 group-hover:text-teal-500 dark:text-teal-400 dark:group-hover:text-teal-300">
                Open route
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-elevate-dark">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-300">
              Integrations
            </p>
            <h2 className="mt-3 text-balance text-3xl font-black tracking-tight">
              {connectorSummary.ready} connected, {connectorSummary.needsSetup} available to connect.
            </h2>
            <p className="mt-3 text-pretty text-sm leading-6 text-slate-300">
              Everything Learning Hub connects to — organized by provider, status,
              and the environment keys each integration needs.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: connectorSummary.total },
                { label: "Live", value: connectorSummary.live },
                { label: "Available", value: connectorSummary.needsSetup },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-black tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/integrations" className="mt-6 inline-flex cursor-pointer items-center text-sm font-bold text-teal-200 transition-colors duration-200 hover:text-white">
              Explore integrations
              <Plug className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlightedConnectors.map((connector) => (
              <div key={connector.id} className="product-muted rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black tracking-tight text-slate-950 dark:text-white">
                    {connector.name}
                  </p>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {connector.statusLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {connector.provider}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {connector.signal}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              label: "Roles built in",
              body: "Learner and instructor journeys are available out of the box, with role-aware navigation and permissions.",
            },
            {
              icon: Database,
              label: "Rich, real data",
              body: "Courses, progress, quiz history, discussion threads, and analytics keep every route populated and useful.",
            },
            {
              icon: UploadCloud,
              label: "Production-ready architecture",
              body: "Supabase auth, Postgres, storage, realtime, Edge Functions, Stripe, Mux, and observability connect as you scale.",
            },
          ].map((item) => (
            <div key={item.label} className="product-surface rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
