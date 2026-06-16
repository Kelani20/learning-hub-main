import { Chapter, Course, UserProgress } from "@prisma/client";

import NavbarRoutes from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex h-full items-center border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
