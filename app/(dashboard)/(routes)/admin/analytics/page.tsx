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
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <section className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
              Instructor analytics
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
              Revenue, enrollment, and launch readiness in one view.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Demo analytics stay populated without paid providers, while connector
              readiness stays visible for a production handoff.
            </p>
          </div>
          <Link href="/integrations" className="inline-flex items-center text-sm font-bold text-teal-700 hover:text-teal-900">
            Review connector setup
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
          label="Ready Connectors"
          value={connectorSummary.ready}
          helper={`${connectorSummary.needsSetup} still need setup`}
        />
      </div>
      <Chart
        data={data}
      />
    </div>
  );
}
 
export default AnalyticsPage;
