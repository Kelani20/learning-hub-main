"use client";

import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { DemoUserButton } from "@/components/auth/demo-user-button";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isCoursePage = pathname?.includes("/courses");
  const isBrowsePage = pathname === "/browse";

  return (
    <>
      {isBrowsePage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        {isAdminPage || isCoursePage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/courses">
            <Button size="sm" variant="ghost">
              Instructor View
            </Button>
          </Link>
        )}
        <DemoUserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
