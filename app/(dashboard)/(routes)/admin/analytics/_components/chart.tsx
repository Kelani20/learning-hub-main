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
    <Card className="rounded-md border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">
          Course revenue
        </p>
        <h2 className="mt-1 text-xl font-black tracking-normal text-slate-950">
          Performance by learning path
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey={"name"}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            formatter={(value) => [`$${value}`, "Revenue"]}
            contentStyle={{
              borderRadius: 8,
              borderColor: "#e2e8f0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
              fontSize: 12,
            }}
          />
          <Bar 
            dataKey={"total"}
            fill="#0f172a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
