import { SiteFooter } from "@/components/site-footer";

import { LandingContent } from "./_components/landing-content";
import { LandingHero } from "./_components/landing-hero";
import { LandingNavbar } from "./_components/landing-navbar";

const LandingPage = () => {
  return (
    <div className="min-h-full bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingContent />
      </main>
      <SiteFooter />
    </div>
  )
}

export default LandingPage;
