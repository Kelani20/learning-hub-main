import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-slate-950 text-white shadow-elevate-dark dark:border-slate-800">
      <div className="flex w-full flex-col gap-y-1 py-4">
        <SidebarRoutes />
      </div>
    </div>
  );
}
 
export default Sidebar;
