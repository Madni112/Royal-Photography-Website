"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { soundEngine } from "@/lib/sound";
import { Volume2, VolumeX, Shield, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export default function HeaderNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleSound = () => {
    const active = soundEngine.toggleSound();
    setSoundActive(active);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.1] py-3.5 shadow-2xl"
          : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Identity */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => soundEngine.playClick()}
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-white via-neutral-300 to-neutral-700 flex items-center justify-center p-[1px] shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.7)] transition-all duration-300">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center">
              <span className="font-cinzel text-xs font-black tracking-widest text-white group-hover:scale-110 transition-transform">
                AG
              </span>
            </div>
          </div>
          <div>
            <span className="font-cinzel text-sm sm:text-base font-bold tracking-[0.25em] text-white group-hover:text-neutral-300 transition-colors">
              ANTIGRAVITY
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
              STUDIO &bull; ATELIER 2026
            </span>
          </div>
        </Link>

        {/* Live Status Pill (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-white/15 text-[11px] font-mono text-neutral-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-neutral-400">STATUS:</span>
          <span className="text-white font-medium">ACCEPTING PRIVATE CLIENT COMMISSIONS</span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase">
            <a
              href="#portfolio"
              className="text-neutral-400 hover:text-white transition-colors"
              onMouseEnter={() => soundEngine.playHover()}
            >
              Gallery
            </a>
            <a
              href="#cinematic-reel"
              className="text-neutral-400 hover:text-white transition-colors"
              onMouseEnter={() => soundEngine.playHover()}
            >
              Cinema Reel
            </a>
            <a
              href="#interactive-lab"
              className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              onMouseEnter={() => soundEngine.playHover()}
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
              Gravity Lab
            </a>
            <a
              href="#vetting-funnel"
              className="text-neutral-400 hover:text-white transition-colors"
              onMouseEnter={() => soundEngine.playHover()}
            >
              Commission
            </a>
          </nav>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-full border transition-all flex items-center justify-center ${
              soundActive
                ? "border-white bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                : "border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-600 hover:text-white"
            }`}
            title={soundActive ? "Mute Studio Audio" : "Enable Spatial Audio Experience"}
            onMouseEnter={() => soundEngine.playHover()}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Admin Panel Gateway */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950/90 text-[11px] font-mono tracking-wider text-neutral-300 hover:border-white/50 hover:text-white transition-all shadow-sm group"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
          >
            <Shield className="w-3.5 h-3.5 text-neutral-300 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">VAULT / ADMIN</span>
          </Link>

          {/* Direct CTA button */}
          <a
            href="#vetting-funnel"
            className="relative hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.35)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all active:scale-95"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
          >
            <span>Initiate Brief</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg border border-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-neutral-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-3 font-mono text-sm tracking-wider uppercase">
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              Gallery Portfolio
            </a>
            <a
              href="#cinematic-reel"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              Cinematic Reel
            </a>
            <a
              href="#interactive-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-neutral-300 py-1 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Interactive Antigravity Lab
            </a>
            <a
              href="#vetting-funnel"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              Client Onboarding Funnel
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-white" />
              Admin Management Console
            </Link>
          </div>
          <div className="pt-3 border-t border-neutral-800">
            <a
              href="#vetting-funnel"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              Initiate Project Brief
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
