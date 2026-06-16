"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
};

export const Chart = ({
  data
}: ChartProps) => {
  return(
    <Card className="product-surface rounded-2xl p-5">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
          Course revenue
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
          Performance by learning path
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
          <XAxis
            dataKey={"name"}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: "#14b8a614" }}
            formatter={(value) => [`$${value}`, "Revenue"]}
            contentStyle={{
              borderRadius: 12,
              borderColor: "#14b8a633",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.18)",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey={"total"}
            fill="#14b8a6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
