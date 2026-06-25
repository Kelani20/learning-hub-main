"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InstructorCtaProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  href?: string;
  ariaLabel?: string;
}

// The instructor area is gated by the demo "instructor" role. These CTAs are
// advertised to every visitor (who starts as a learner), so switch the demo
// role into instructor before navigating — otherwise the admin layout bounces
// the visitor straight back to /dashboard (a dead end).
export function InstructorCta({
  children,
  className,
  variant = "default",
  size = "default",
  href = "/admin/courses",
  ariaLabel,
}: InstructorCtaProps) {
  const router = useRouter();

  const onClick = () => {
    document.cookie =
      "learning-hub-demo-role=instructor; path=/; max-age=31536000; SameSite=Lax";
    router.push(href);
    router.refresh();
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </Button>
  );
}
