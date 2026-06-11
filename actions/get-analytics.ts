import { Course, Purchase } from "@prisma/client";

import { db } from "@/lib/db";
import { demoCourses } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

const getDemoAnalytics = () => {
  const enrollmentCounts: Record<string, number> = {
    course_ai_productivity: 18,
    course_product_analytics: 11,
    course_frontend_systems: 9,
  };

  const data = demoCourses.map((course) => ({
    name: course.title,
    total: (course.price ?? 0) * (enrollmentCounts[course.id] ?? 0),
  }));

  return {
    data,
    totalRevenue: data.reduce((total, item) => total + item.total, 0),
    totalSales: Object.values(enrollmentCounts).reduce(
      (total, count) => total + count,
      0
    ),
  };
};

export const getAnalytics = async (userId: string) => {
  if (isDemoMode && !hasDatabaseUrl) {
    return getDemoAnalytics();
  }

  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    if (isDemoMode) {
      return getDemoAnalytics();
    }

    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
