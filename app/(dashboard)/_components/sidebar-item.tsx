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
        "group relative mx-3 flex h-11 cursor-pointer items-center rounded-xl px-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60",
        isActive && "bg-teal-500/15 text-white hover:bg-teal-500/20"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-teal-400" />
      )}
      <div className="flex items-center gap-x-3">
        <Icon
          size={20}
          className={cn(
            "text-slate-400 transition group-hover:text-slate-200",
            isActive && "text-teal-300 group-hover:text-teal-300"
          )}
          />
        {label}
      </div>
    </button>
  );
}
 
export default SidebarItem;
