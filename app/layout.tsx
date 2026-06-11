import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import ToasterProvider from "@/components/provider/toaster-provider";
import { ConfettiProvider } from "@/components/provider/confetti-provider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "A modern learning platform with courses, quizzes, discussions, and instructor analytics.",
  icons: {
    icon: "/icon.svg",
  },
};

const themeScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("learning-hub-theme");
      const theme = storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : "light";
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${ibmPlexSans.className} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ConfettiProvider />
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
