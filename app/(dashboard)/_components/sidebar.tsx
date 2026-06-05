import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-slate-950 text-white shadow-sm">
      <div className="flex w-full flex-col py-4">
        <SidebarRoutes />
      </div>
    </div>
  );
}
 
export default Sidebar;
