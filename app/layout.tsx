import "./globals.css";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import ToasterProvider from "@/components/provider/toaster-provider";
import { ConfettiProvider } from "@/components/provider/confetti-provider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://usamakelani.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Learning Hub — Modern Course & Learning Platform",
    template: "%s · Learning Hub",
  },
  description:
    "Learning Hub is a full-stack learning platform: course management, adaptive practice, role-based workspaces, community discussions, and instructor analytics.",
  applicationName: "Learning Hub",
  authors: [{ name: "Usama Kelani", url: siteUrl }],
  creator: "Usama Kelani",
  keywords: [
    "learning platform",
    "LMS",
    "course management",
    "online courses",
    "quizzes",
    "Next.js",
    "React",
    "TypeScript",
  ],
  openGraph: {
    type: "website",
    siteName: "Learning Hub",
    title: "Learning Hub — Modern Course & Learning Platform",
    description:
      "A full-stack learning platform with courses, adaptive practice, discussions, and instructor analytics.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Hub — Modern Course & Learning Platform",
    description:
      "A full-stack learning platform with courses, adaptive practice, discussions, and instructor analytics.",
  },
  // Icons are auto-detected from app/icon.svg and app/favicon.ico — no explicit
  // entry needed (avoids a duplicate <link rel="icon">).
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  colorScheme: "dark light",
};

// Dark mode is the default. We only switch to light if the visitor has
// explicitly chosen it, and we do it before paint to avoid any flash.
const themeScript = `
  (() => {
    try {
      const stored = localStorage.getItem("learning-hub-theme");
      const theme = stored === "light" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    } catch {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${ibmPlexSans.variable}`}
      style={{ colorScheme: "dark" }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ConfettiProvider />
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
