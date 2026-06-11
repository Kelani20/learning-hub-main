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
      <section className="overflow-hidden rounded-md border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-x-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-cyan-100">
              <Plug className="h-3.5 w-3.5" />
              Production connector hub
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-normal sm:text-4xl">
              See what is live, what is configured, and what is ready to wire next.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Learning Hub stays usable in demo mode while keeping the production
              provider path visible for video, payments, uploads, content imports,
              automations, analytics, and monitoring.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/admin/courses">
                <Button className="keep-light h-11 rounded-full bg-white px-5 font-bold text-slate-950 hover:bg-cyan-50">
                  Open instructor studio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-white/20 bg-white/10 px-5 font-bold text-white hover:bg-white/15 hover:text-white"
                >
                  Back to workspace
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Connectors", value: summary.total },
              { label: "Ready now", value: summary.ready },
              { label: "Demo live", value: summary.live },
              { label: "Needs setup", value: summary.needsSetup },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-white/10 bg-white/10 p-4"
              >
                <p className="text-3xl font-black tracking-normal">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="product-surface rounded-md p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
            Launch posture
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950">
            Demo-first, production-aware.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Reviewers can use the product without paid accounts. Operators can still
            see the provider switches and environment keys needed for a private launch.
          </p>
        </div>
        <div className="product-surface rounded-md p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-700">
            Coverage
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950">
            {summary.ready} of {summary.total} connectors ready.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Core learning flows are live. Optional imports, automation, and telemetry
            are displayed as setup-ready connector plans until their keys are present.
          </p>
        </div>
        <div className="product-surface rounded-md p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-rose-700">
            Next best step
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950">
            Wire observability before traffic.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sentry and product analytics make the demo safer to run publicly and make
            the product story more credible when real users arrive.
          </p>
        </div>
      </section>

      <div className="mt-6 space-y-6">
        {categoryOrder.map((category) => (
          <section key={category}>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Connector group
                </p>
                <h2 className="mt-1 text-xl font-black tracking-normal text-slate-950">
                  {category}
                </h2>
              </div>
              <Badge variant="outline" className="bg-white dark:bg-slate-900">
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
                    className="product-surface flex min-h-[250px] flex-col rounded-md p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
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
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        {connector.provider}
                      </p>
                      <h3 className="mt-1 text-lg font-black tracking-normal text-slate-950">
                        {connector.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {connector.description}
                      </p>
                    </div>
                    <div className="mt-auto pt-5">
                      <div className="rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          Signal
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {connector.signal}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {connector.requiredEnv.length > 0 ? (
                          connector.requiredEnv.map((key) => (
                            <Badge key={key} variant="secondary">
                              {key}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">No paid keys required</Badge>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700">
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
