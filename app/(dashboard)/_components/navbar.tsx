import Image from "next/image";
import Link from "next/link";

import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="flex h-full items-center border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
      <MobileSidebar />
      <Link href="/" className="flex items-center" aria-label="Learning Hub home">
        <div className="relative mr-3 h-9 w-9">
          <Image fill alt="Logo" src="/logo.png" sizes="36px" />
        </div>
        <h1 className="hidden text-xl font-black tracking-normal text-slate-950 sm:block">
          Learning Hub
        </h1>
      </Link>
      <NavbarRoutes />
    </div>
  );
}
 
export default Navbar;
