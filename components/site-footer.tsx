import Link from "next/link";
import { BookOpenCheck, Github, Globe, Linkedin } from "lucide-react";

const productLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Browse courses", href: "/browse" },
  { label: "Practice", href: "/quiz" },
  { label: "Discussions", href: "/discussions" },
  { label: "Integrations", href: "/integrations" },
];

const socialLinks = [
  { label: "Portfolio", href: "https://usamakelani.com", icon: Globe },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/usamakelani",
    icon: Linkedin,
  },
  { label: "GitHub", href: "https://github.com/Kelani20", icon: Github },
];

const currentYear = 2026;

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-x-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-slate-950 shadow-glow">
                <BookOpenCheck className="h-5 w-5" />
              </span>
              <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                Learning Hub
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              A modern, full-stack learning platform — courses, adaptive
              practice, discussions, and instructor analytics in one workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Product
              </p>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Built by Usama Kelani
              </p>
              <ul className="mt-4 space-y-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-x-2 text-sm font-semibold text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Learning Hub. Designed &amp; built by Usama Kelani.</p>
          <p className="font-medium">
            Next.js · React · TypeScript · Tailwind · Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
