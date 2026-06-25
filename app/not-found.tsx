import Link from "next/link";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-slate-950">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
        404
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-slate-600 dark:text-slate-400">
        The page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard">
          <Button className="h-11 cursor-pointer rounded-full bg-teal-600 px-6 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-500">
            <Home className="mr-2 h-4 w-4" />
            Back to workspace
          </Button>
        </Link>
        <Link href="/browse">
          <Button
            variant="outline"
            className="h-11 cursor-pointer rounded-full px-6 font-bold"
          >
            <Compass className="mr-2 h-4 w-4" />
            Browse courses
          </Button>
        </Link>
      </div>
    </div>
  );
}
