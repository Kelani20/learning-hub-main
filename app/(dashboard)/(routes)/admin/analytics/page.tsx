import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, Plug, TrendingUp, Users } from "lucide-react";

import { getAnalytics } from "@/actions/get-analytics";
import { getConnectorSummary } from "@/lib/connectors";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage =  async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(userId);
  const connectorSummary = getConnectorSummary();
  const topCourse = [...data].sort((a, b) => b.total - a.total)[0];

  return (
    <div className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <section className="product-surface motion-rise mb-6 rounded-2xl p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
              Instructor analytics
            </p>
            <h1 className="mt-2 text-balance text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Revenue, enrollment, and launch readiness in one view.
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
              Track sales and engagement across your catalog, and see which integrations
              are live so you always know what is connected to your workspace.
            </p>
          </div>
          <Link
            href="/integrations"
            className="inline-flex cursor-pointer items-center text-sm font-bold text-brand-600 transition-colors duration-200 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Review integrations
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DataCard
          icon={TrendingUp}
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          icon={Users}
          label="Total Sales"
          value={totalSales}
        />
        <DataCard
          icon={BarChart3}
          label="Top Course"
          value={topCourse?.total ?? 0}
          shouldFormat
          helper={topCourse?.name ?? "No course data yet"}
        />
        <DataCard
          icon={Plug}
          label="Connected Integrations"
          value={connectorSummary.ready}
          helper={`${connectorSummary.needsSetup} available to connect`}
        />
      </div>
      <Chart
        data={data}
      />
    </div>
  );
}
 
export default AnalyticsPage;
