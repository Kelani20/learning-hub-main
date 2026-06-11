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
    title: "Learner Demo",
    description: "Sign in as a learner, browse seeded courses, complete fake checkout, watch lessons, and track completion.",
    href: "/sign-in",
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
    description: "Generate adaptive multiple-choice and open-ended prompts, complete quizzes, and build topic history.",
    href: "/quiz",
    icon: ClipboardCheck,
  },
  {
    title: "Fake Checkout",
    description: "Test a Stripe-like payment journey with no real card charge, then unlock paid demo courses.",
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Product surface
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Filled with real routes a reviewer can actually use.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              The app opens into functioning auth, learner, instructor, quiz,
              discussion, analytics, fake payment, and Supabase-ready workflows
              instead of a static marketing shell.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-4">
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
            <div className="flex items-center gap-x-2 rounded-md border border-slate-200 px-3 py-2">
              <Plug className="h-4 w-4 text-cyan-700" />
              Supabase
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paths.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="product-muted group rounded-md p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
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

        <div className="mt-16 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-md border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
              Connector readiness
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal">
              {connectorSummary.ready} ready now, {connectorSummary.needsSetup} clearly staged.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo mode keeps the product open to reviewers. Production services are
              organized by provider, status, and required environment keys.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: connectorSummary.total },
                { label: "Live", value: connectorSummary.live },
                { label: "Setup", value: connectorSummary.needsSetup },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-black tracking-normal">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/integrations" className="mt-6 inline-flex items-center text-sm font-bold text-cyan-100 hover:text-white">
              Open connector hub
              <Plug className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlightedConnectors.map((connector) => (
              <div key={connector.id} className="product-muted rounded-md p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black tracking-normal text-slate-950">
                    {connector.name}
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
                    {connector.statusLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {connector.provider}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
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
              label: "Demo-safe by default",
              body: "Learner and instructor roles are available without paid auth, payment, video, or AI accounts.",
            },
            {
              icon: Database,
              label: "Useful data surfaces",
              body: "Seeded courses, progress, quiz history, discussion threads, and analytics keep every route populated.",
            },
            {
              icon: UploadCloud,
              label: "Production upgrade path",
              body: "Supabase auth, Postgres, storage, realtime, Edge Functions, Stripe, Mux, and observability are visible as connector work.",
            },
          ].map((item) => (
            <div key={item.label} className="product-surface rounded-md p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-black tracking-normal text-slate-950">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
