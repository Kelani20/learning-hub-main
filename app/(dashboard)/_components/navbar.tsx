import Image from "next/image";
import Link from "next/link";

import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="flex h-full items-center border-b border-slate-200 bg-white/80 px-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <MobileSidebar />
      <Link
        href="/"
        className="group flex items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-label="Learning Hub home"
      >
        <div className="relative mr-3 h-9 w-9 transition group-hover:-translate-y-0.5">
          <Image fill alt="Logo" src="/logo.png" sizes="36px" />
        </div>
        <h1 className="hidden text-xl font-black tracking-tight text-slate-950 dark:text-white sm:block">
          Learning Hub
        </h1>
      </Link>
      <NavbarRoutes />
    </div>
  );
}
 
export default Navbar;
