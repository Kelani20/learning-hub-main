import { cookies } from "next/headers";

import { env } from "@/lib/env";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: "learner" | "instructor";
};

type ClerkLikeUser = AppUser & {
  fullName: string;
  emailAddresses: { emailAddress: string }[];
};

const users: Record<"learner" | "instructor", AppUser> = {
  learner: {
    id: env.DEMO_USER_ID,
    name: "Demo Learner",
    email: "learner@learninghub.demo",
    role: "learner",
  },
  instructor: {
    id: env.DEMO_ADMIN_ID,
    name: "Demo Instructor",
    email: "instructor@learninghub.demo",
    role: "instructor",
  },
};

function selectedDemoRole() {
  const cookieStore = cookies() as unknown as {
    get: (name: string) => { value: string } | undefined;
  };
  const selected = cookieStore.get("learning-hub-demo-role")?.value;
  return selected === "instructor" ? "instructor" : "learner";
}

export function getDemoUser() {
  return users[selectedDemoRole()];
}

export function auth() {
  return { userId: getDemoUser().id };
}

export async function currentUser(): Promise<ClerkLikeUser> {
  const user = getDemoUser();
  return {
    ...user,
    fullName: user.name,
    emailAddresses: [{ emailAddress: user.email }],
  };
}

export async function getCurrentUser() {
  return getDemoUser();
}

export function isInstructor(userId: string | null | undefined) {
  return userId === env.DEMO_ADMIN_ID;
}
