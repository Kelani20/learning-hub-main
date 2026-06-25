"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-slate-950">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-slate-600 dark:text-slate-400">
        We hit an unexpected error loading this page. You can try again, or head
        back to your workspace.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => reset()}
          className="h-11 cursor-pointer rounded-full bg-teal-600 px-6 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-500"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="h-11 cursor-pointer rounded-full px-6 font-bold"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to workspace
          </Button>
        </Link>
      </div>
    </div>
  );
}
