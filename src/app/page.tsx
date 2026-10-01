import CustomCursor from "@/components/CustomCursor";
import HeaderNavbar from "@/components/HeaderNavbar";
import AntigravityHero from "@/components/AntigravityHero";
import CinematicReel from "@/components/CinematicReel";
import StaggeredPortfolioGrid from "@/components/StaggeredPortfolioGrid";
import InteractiveAntigravityLab from "@/components/InteractiveAntigravityLab";
import QualifyingContactFunnel from "@/components/QualifyingContactFunnel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Custom Interactive Follower Cursor */}
      <CustomCursor />

      {/* Global Luxury Navigation Bar */}
      <HeaderNavbar />

      {/* 1. Antigravity Hero Section with Physics Drift */}
      <AntigravityHero />

      {/* 2. Borderless Cinematic Reel with Soft Crimson Glowing Shadow Drop */}
      <CinematicReel />

      {/* 3. Staggered Portfolio Grid (Asymmetric Layout & Quick Modal Lightbox) */}
      <StaggeredPortfolioGrid />

      {/* 4. Interactive Antigravity Laboratory (Kinetic physics & tokens) */}
      <InteractiveAntigravityLab />

      {/* 5. Qualifying Contact Funnel (Multi-step lead vetting & scoring) */}
      <QualifyingContactFunnel />

      {/* 6. Footer & Administrative Gate */}
      <Footer />
    </main>
  );
}
