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
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => switchRole("learner")}>
        <GraduationCap className="mr-2 h-4 w-4" />
        Learner
      </Button>
      <Button size="sm" variant="outline" onClick={() => switchRole("instructor")}>
        <ShieldCheck className="mr-2 h-4 w-4" />
        Instructor
      </Button>
    </div>
  );
}
