"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Github, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const LandingNavbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center">
        <div className="relative mr-3 h-9 w-9">
          <Image fill alt="Logo" src="/logo.png" sizes="36px" />
        </div>
        <span className="text-xl font-black tracking-normal text-slate-950">
          Learning Hub
        </span>
      </Link>
      <div className="flex items-center gap-x-1 rounded-full border border-white/70 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <ThemeToggle className="border-0 bg-transparent shadow-none" />
        <Link
          href="http://github.com/kelani20"
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-[background-color,color] hover:bg-slate-100 hover:text-slate-950"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </Link>
        <Link
          href="/sign-in"
          className="hidden h-9 items-center gap-x-2 rounded-full px-3 text-sm font-bold text-slate-700 transition-[background-color,color] hover:bg-slate-100 hover:text-slate-950 sm:flex"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </Link>
        <Link href="/dashboard">
          <Button className="h-9 rounded-full bg-slate-950 px-4 text-white hover:bg-slate-800">
            <span className="hidden sm:inline">Explore Demo</span>
            <span className="sm:hidden">Demo</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </nav>
  )
}
