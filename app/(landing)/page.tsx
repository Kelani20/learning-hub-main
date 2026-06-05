import { LandingContent } from "./_components/landing-content";
import { LandingHero } from "./_components/landing-hero";
import { LandingNavbar } from "./_components/landing-navbar";

const LandingPage = () => {
  return (
    <div className="min-h-full bg-slate-50 text-slate-950">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

export default LandingPage;
