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
    <div className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="product-surface motion-rise mb-6 rounded-2xl p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
          Instructor studio
        </p>
        <h1 className="mt-2 text-balance text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          Your courses
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
          Build, publish, and refine your catalog. Edit a course to manage its chapters,
          pricing, media, and resources.
        </p>
      </div>
      <DataTable columns={columns} data={tableCourses} />
    </div>
  );
}

export default CoursesPage;
