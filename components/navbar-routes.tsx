"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { DemoUserButton } from "@/components/auth/demo-user-button";
import { InstructorCta } from "@/components/auth/instructor-cta";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { ThemeToggle } from "@/components/theme-toggle";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isCoursePage = pathname?.includes("/courses");
  const isBrowsePage = pathname === "/browse";

  return (
    <>
      {isBrowsePage && (
        <div className="hidden md:block">
          <Suspense fallback={<div className="skeleton ml-8 h-10 w-[320px] rounded-full" />}>
            <SearchInput />
          </Suspense>
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        {isAdminPage || isCoursePage ? (
          <Link href="/dashboard">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Exit to dashboard"
              className="h-10 w-10 cursor-pointer rounded-full px-0 font-semibold transition hover:text-teal-600 dark:hover:text-teal-300 sm:w-auto sm:rounded-full sm:px-3"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </Link>
        ) : (
          <InstructorCta
            size="sm"
            variant="ghost"
            ariaLabel="Open instructor view"
            className="h-10 w-10 rounded-full px-0 font-semibold transition hover:text-teal-600 dark:hover:text-teal-300 sm:w-auto sm:rounded-full sm:px-3"
          >
            <ShieldCheck className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Instructor View</span>
          </InstructorCta>
        )}
        <DemoUserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
