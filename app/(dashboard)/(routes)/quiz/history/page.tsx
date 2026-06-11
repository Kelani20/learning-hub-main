import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LucideLayoutDashboard } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryComponent from "./_components/history";

const History = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
              Practice lab
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
              Quiz history
            </h1>
          </div>
          <Link className={buttonVariants({ variant: "outline" })} href="/quiz">
            <LucideLayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-2xl font-black tracking-normal text-slate-950">
              Recent attempts
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-auto p-6">
            <HistoryComponent limit={100} userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
