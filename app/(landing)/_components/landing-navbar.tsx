"use client";

import { useEffect, useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Github, LogIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // The landing page scrolls an inner overflow-auto container (see
    // LandingLayout), not the window — so listen in the capture phase and read
    // scrollTop from whichever element actually scrolled. This also works if
    // the document itself is the scroller.
    const onScroll = (event: Event) => {
      const target = event.target;
      const top =
        target instanceof HTMLElement
          ? target.scrollTop
          : window.scrollY || document.documentElement.scrollTop;
      setScrolled(top > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/65 dark:border-white/10 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/65"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex cursor-pointer items-center">
          <div className="relative mr-3 h-9 w-9">
            <Image fill alt="Learning Hub logo" src="/logo.png" sizes="36px" />
          </div>
          <span className="brand-text text-xl font-black tracking-tight">
            Learning Hub
          </span>
        </Link>
        <div className="flex items-center gap-x-1 rounded-full border border-white/70 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <ThemeToggle className="border-0 bg-transparent shadow-none" />
          <Link
            href="https://github.com/Kelani20"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-[background-color,color] duration-200 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="hidden h-9 cursor-pointer items-center gap-x-2 rounded-full px-3 text-sm font-bold text-slate-700 transition-[background-color,color] duration-200 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:flex"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
          <Link href="/dashboard">
            <Button className="h-9 cursor-pointer rounded-full bg-teal-600 px-4 font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-lg">
              <span className="hidden sm:inline">Launch app</span>
              <span className="sm:hidden">Open</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
