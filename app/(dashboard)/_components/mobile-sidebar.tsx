import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import Sidebar from "./sidebar";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="mr-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-teal-500/40 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white md:hidden"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 border-0 bg-slate-950 p-0">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
 
export default MobileSidebar;
