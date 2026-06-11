import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { demoCourses } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

const CoursesPage = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect('/sign-in');
  }

  const courses =
    isDemoMode && !hasDatabaseUrl
      ? demoCourses
      : await db.course
          .findMany({
            where: {
              userId,
            },
            orderBy: {
              createdAt: "desc",
            }
          })
          .catch((error) => {
            console.log("[ADMIN_COURSES]", error);
            return isDemoMode ? demoCourses : [];
          });

  const tableCourses = courses.length === 0 && isDemoMode ? demoCourses : courses;

  return (
    <div className="p-6">
      <DataTable columns={columns} data={tableCourses} />
    </div>
  );
}

export default CoursesPage;
