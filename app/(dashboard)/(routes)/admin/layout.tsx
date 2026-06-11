import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin";

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
} 
) => {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return redirect("/dashboard");
  }

  return <>{children}</>
}
 
export default DashboardLayout;
