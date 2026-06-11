"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const storageKey = "learning-hub-theme";

function getPreferredTheme() {
  if (typeof window === "undefined") return "light";

  let storedTheme: string | null = null;

  try {
    storedTheme = window.localStorage?.getItem(storageKey) ?? null;
  } catch {
    storedTheme = null;
  }

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  useEffect(() => {
    const initialTheme = getPreferredTheme() as "dark" | "light";
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    try {
      window.localStorage?.setItem(storageKey, nextTheme);
    } catch {}
    applyTheme(nextTheme);
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={cn(
        "relative h-10 w-10 rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-[opacity,transform,filter] duration-200",
          "scale-[0.25] opacity-0 blur-sm dark:scale-100 dark:opacity-100 dark:blur-none"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-[opacity,transform,filter] duration-200",
          "scale-100 opacity-100 blur-none dark:scale-[0.25] dark:opacity-0 dark:blur-sm"
        )}
      />
    </Button>
  );
}
