"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { DemoUserButton } from "@/components/auth/demo-user-button";
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
          <Suspense fallback={<div className="ml-8 h-10 w-[320px] rounded-full bg-slate-100" />}>
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
              className="h-10 w-10 rounded-full px-0 sm:w-auto sm:rounded-md sm:px-3"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </Link>
        ) : (
          <Link href="/admin/courses">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Open instructor view"
              className="h-10 w-10 rounded-full px-0 sm:w-auto sm:rounded-md sm:px-3"
            >
              <ShieldCheck className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Instructor View</span>
            </Button>
          </Link>
        )}
        <DemoUserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
