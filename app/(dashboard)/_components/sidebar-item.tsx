"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon,
  label: string,
  href: string,
}

const SidebarItem = ({
  icon: Icon,
  label,
  href
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = 
    (pathname === "/dashboard" && href === "/dashboard") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "mx-3 flex h-12 items-center rounded-md px-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white",
        isActive && "bg-white text-slate-950 shadow-sm hover:bg-white hover:text-slate-950"
      )}
    >
      <div className="flex items-center gap-x-3">
        <Icon 
          size={20}
          className={cn(
            "text-slate-400",
            isActive && "text-teal-700"
          )}
          />
        {label}
      </div>
    </button>
  );
}
 
export default SidebarItem;
