import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ToasterProvider from "@/components/provider/toaster-provider";
import { ConfettiProvider } from "@/components/provider/confetti-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "A modern learning platform with courses, quizzes, discussions, and instructor analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfettiProvider />
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
