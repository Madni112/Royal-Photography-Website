"use client";

import Link from "next/link";
import { soundEngine } from "@/lib/sound";
import { Shield, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/[0.1] pt-20 pb-12 text-neutral-400 overflow-hidden">
      {/* Background ambient white glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-t from-white/5 to-transparent blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.1]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white via-neutral-400 to-neutral-700 flex items-center justify-center p-[1px] shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <div className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center">
                  <span className="font-cinzel text-xs font-black tracking-widest text-white">
                    AG
                  </span>
                </div>
              </div>
              <span className="font-cinzel text-lg font-bold tracking-[0.25em] text-white">
                ANTIGRAVITY
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-400 leading-relaxed max-w-sm">
              Luxury digital art atelier & high-end cinematography practice. Crafting bespoke visual benchmarks for sovereign clients, haute horology, and global luxury campaigns.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>PARIS &bull; MILAN &bull; GENEVA &bull; TOKYO &bull; NEW YORK</span>
            </div>
          </div>

          {/* Navigation index */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white">
              Atelier Directory
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="#portfolio"
                  className="hover:text-white transition-colors"
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  &bull; Curated Masterworks
                </a>
              </li>
              <li>
                <a
                  href="#cinematic-reel"
                  className="hover:text-white transition-colors"
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  &bull; 4K Cinema Streaming Reel
                </a>
              </li>
              <li>
                <a
                  href="#interactive-lab"
                  className="hover:text-white transition-colors"
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  &bull; Kinetic Antigravity Lab
                </a>
              </li>
              <li>
                <a
                  href="#vetting-funnel"
                  className="hover:text-white transition-colors"
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  &bull; Private Client Onboarding
                </a>
              </li>
            </ul>
          </div>

          {/* Secure Admin & Spec */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white">
              Engine & Infrastructure
            </h4>
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Architecture:</span>
                <span className="text-white">Next.js 16 + React 19</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Theme:</span>
                <span className="text-white">Monochrome Black & White</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Physics Engine:</span>
                <span className="text-white">Framer Motion Kinetic</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] text-white hover:underline"
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Administrative Vault Panel &rarr;</span>
                </Link>
                <span className="text-[10px] text-neutral-500">MNDA PROTECTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} ANTIGRAVITY CREATIVE ATELIER. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => soundEngine.playHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/50 transition-colors"
          >
            <span>Elevate to Apex</span>
            <ArrowUp className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
