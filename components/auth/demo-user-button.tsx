"use client";

import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DemoUserButton() {
  const router = useRouter();

  const switchRole = (role: "learner" | "instructor") => {
    document.cookie = `learning-hub-demo-role=${role}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => switchRole("learner")}
        aria-label="Switch to learner workspace"
        className="h-10 w-10 cursor-pointer rounded-full px-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/50 sm:w-auto sm:rounded-full sm:px-4"
      >
        <GraduationCap className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Learner</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => switchRole("instructor")}
        aria-label="Switch to instructor workspace"
        className="h-10 w-10 cursor-pointer rounded-full px-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/50 sm:w-auto sm:rounded-full sm:px-4"
      >
        <ShieldCheck className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Instructor</span>
      </Button>
    </div>
  );
}
