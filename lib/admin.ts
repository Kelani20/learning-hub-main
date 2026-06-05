export const isAdmin = (userId: string | null) => {
  return userId === (process.env.DEMO_ADMIN_ID ?? "demo_instructor");
};
