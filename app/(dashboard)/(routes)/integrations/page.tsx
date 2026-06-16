import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  CreditCard,
  Database,
  FileText,
  FolderOpen,
  Github,
  KeyRound,
  MessageSquare,
  Plug,
  Radio,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UploadCloud,
  Video,
} from "lucide-react";

import {
  Connector,
  ConnectorCategory,
  ConnectorStatus,
  getConnectorCatalog,
  getConnectorSummary,
} from "@/lib/connectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categoryOrder: ConnectorCategory[] = [
  "Core learning",
  "Supabase platform",
  "Content",
  "Growth",
  "Operations",
];

const iconMap = {
  auth: ShieldCheck,
  video: Video,
  payments: CreditCard,
  "supabase-auth": ShieldCheck,
  "supabase-db": Database,
  "supabase-storage": UploadCloud,
  "supabase-realtime": Radio,
  "supabase-edge": Code2,
  "supabase-vector": Search,
  "supabase-observability": Activity,
  quiz: Bot,
  discussions: MessageSquare,
  uploadthing: UploadCloud,
  github: Github,
  notion: FileText,
  "google-drive": FolderOpen,
  slack: Send,
  webhooks: Plug,
  posthog: Activity,
  sentry: AlertTriangle,
};

const statusStyles: Record<ConnectorStatus, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  configured: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100",
  needs_setup: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
};

const statusIcon = {
  live: CheckCircle2,
  configured: Settings,
  needs_setup: KeyRound,
};

function groupByCategory(connectors: Connector[]) {
  return connectors.reduce<Record<ConnectorCategory, Connector[]>>(
    (groups, connector) => {
      groups[connector.category].push(connector);
      return groups;
    },
    {
      "Core learning": [],
      "Supabase platform": [],
      Content: [],
      Growth: [],
      Operations: [],
    }
  );
}

const IntegrationsPage = () => {
  const connectors = getConnectorCatalog();
  const summary = getConnectorSummary(connectors);
  const groupedConnectors = groupByCategory(connectors);

  return (
    <div className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <section className="glass-panel motion-rise relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-elevate-dark">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-60" />
        <div className="relative grid gap-8 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-x-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-200">
              <Plug className="h-3.5 w-3.5" />
              Integrations
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Everything Learning Hub connects to, in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-slate-300">
              Video, payments, uploads, content imports, automations, analytics, and
              monitoring all plug into the same workspace. See what is live, connect a
              provider, and extend the platform without touching the core learning flow.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/admin/courses">
                <Button className="keep-light h-11 cursor-pointer rounded-full bg-brand-500 px-5 font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lg">
                  Open instructor studio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="h-11 cursor-pointer rounded-full border-white/20 bg-white/10 px-5 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                >
                  Back to workspace
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Integrations", value: summary.total },
              { label: "Connected", value: summary.ready },
              { label: "Live", value: summary.live },
              { label: "Available", value: summary.needsSetup },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors duration-200 hover:border-brand-500/30 hover:bg-white/10"
              >
                <p className="text-3xl font-black tabular-nums tracking-tight">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="product-surface motion-rise rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
            Architecture
          </p>
          <h2 className="mt-3 text-balance text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Production-ready architecture.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
            Every integration is a swappable provider behind a stable interface. Connect
            a service by adding its keys, and the platform routes to it instantly with no
            changes to your courses or learner experience.
          </p>
        </div>
        <div className="product-surface motion-rise-delay-1 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
            Coverage
          </p>
          <h2 className="mt-3 text-balance text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            <span className="tabular-nums">{summary.ready}</span> of{" "}
            <span className="tabular-nums">{summary.total}</span> connected.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
            Core learning flows run live out of the box. Imports, automation, and
            telemetry are ready to connect the moment you add their keys.
          </p>
        </div>
        <div className="product-surface motion-rise-delay-2 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
            Recommended next
          </p>
          <h2 className="mt-3 text-balance text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Turn on observability.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
            Connect Sentry and product analytics to see errors and learner activity in
            real time, so you can ship confidently as your audience grows.
          </p>
        </div>
      </section>

      <div className="mt-6 space-y-6">
        {categoryOrder.map((category) => (
          <section key={category}>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                  Connector group
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  {category}
                </h2>
              </div>
              <Badge variant="outline" className="rounded-full bg-white dark:bg-slate-900">
                {groupedConnectors[category].length} items
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groupedConnectors[category].map((connector) => {
                const Icon = iconMap[connector.id as keyof typeof iconMap] ?? Plug;
                const StatusIcon = statusIcon[connector.status];

                return (
                  <article
                    key={connector.id}
                    className="product-surface group flex min-h-[250px] flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lg dark:hover:border-brand-500/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors duration-200 group-hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div
                        className={`inline-flex items-center gap-x-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[connector.status]}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {connector.statusLabel}
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        {connector.provider}
                      </p>
                      <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                        {connector.name}
                      </h3>
                      <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {connector.description}
                      </p>
                    </div>
                    <div className="mt-auto pt-5">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                          Signal
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {connector.signal}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {connector.requiredEnv.length > 0 ? (
                          connector.requiredEnv.map((key) => (
                            <Badge key={key} variant="secondary" className="font-mono text-xs">
                              {key}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">Included, no extra keys</Badge>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {connector.action}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
