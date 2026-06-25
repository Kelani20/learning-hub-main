import type { MetadataRoute } from "next";

const baseUrl = "https://usamakelani.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "",
    "/sign-in",
    "/sign-up",
    "/browse",
    "/dashboard",
    "/quiz",
    "/discussions",
    "/integrations",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
