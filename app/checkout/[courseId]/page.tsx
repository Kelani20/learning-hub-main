import { redirect } from "next/navigation";

import { DemoCheckout } from "@/components/payments/demo-checkout";
import { db } from "@/lib/db";
import { getDemoCourse } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const demoCourse = getDemoCourse(courseId);

  const course =
    isDemoMode && !hasDatabaseUrl && demoCourse
      ? demoCourse
      : await db.course
          .findFirst({
            where: {
              id: courseId,
              isPublished: true,
            },
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
            },
          })
          .catch((error) => {
            console.log("[DEMO_CHECKOUT_PAGE]", error);
            return null;
          });

  if (!course) {
    return redirect("/browse");
  }

  return <DemoCheckout course={course} />;
};

export default CheckoutPage;
