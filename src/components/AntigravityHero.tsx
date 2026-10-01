"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Play, Sparkles, Compass, Award, Eye, Film } from "lucide-react";
import { soundEngine } from "@/lib/sound";

export default function AntigravityHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse coordinate values for Framer Motion physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Layer 3D transforms for different floating elements
  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  const layer2X = useTransform(smoothX, [-0.5, 0.5], [45, -45]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [45, -45]);

  const layer3X = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const layer3Y = useTransform(smoothY, [-0.5, 0.5], [25, -25]);

  const rotateCardX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateCardY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const [mouseVelocity, setMouseVelocity] = useState(0);

  // Handle Mouse Drift Field
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
    setMouseVelocity(Math.abs(x) + Math.abs(y));
  };

  // Antigravity Particle Physics Canvas in Monochrome
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Monochrome Particle nodes
    const particleCount = 75;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      radius: Math.random() * 2 + 0.8,
      color: "#FFFFFF",
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let mouseCoords = { x: width / 2, y: height / 2, active: false };

    const handleCanvasMouse = (e: MouseEvent) => {
      mouseCoords = { x: e.clientX, y: e.clientY, active: true };
    };
    window.addEventListener("mousemove", handleCanvasMouse);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (mouseCoords.active) {
          const dx = mouseCoords.x - p.x;
          const dy = mouseCoords.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220 && dist > 10) {
            const force = (220 - dist) / 220;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dynamicAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#FFFFFF";
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleCanvasMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden select-none bg-black"
    >
      {/* Subtle Ethereal White Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-radial from-white/10 via-white/5 to-transparent blur-[120px] rounded-full animate-glow-breathe" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[450px] h-[450px] bg-radial from-white/5 to-transparent blur-[140px] rounded-full" />

      {/* Physics Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
      />

      {/* Subtle Coordinate Grid Lines */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40 z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        {/* Top Badging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-white/20 text-xs font-mono text-neutral-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-white font-semibold">ANTIGRAVITY ENGINE</span>
            <span className="text-neutral-500">//</span>
            <span className="text-neutral-300">CURATED DIGITAL ATELIER 2026</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <Compass className="w-3.5 h-3.5 text-neutral-300" />
            <span>LATENCY: 0.001s</span>
          </div>
        </motion.div>

        {/* Hero Title and Physics Floating Architecture */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]"
            >
              <span className="block text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                ELEVATING
              </span>
              <span className="block luxury-gradient-text drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
                BEYOND GRAVITY.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed"
            >
              An immersive digital sanctuary for elite visual arts, anamorphic cinema direction, and haute horology brand architecture. Built for clients who demand the uncompromising apex of craftsmanship.
            </motion.p>

            {/* Interactive CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#portfolio"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-white text-black text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.65)] hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Explore Curated Archive</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
              </a>

              <a
                href="#cinematic-reel"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/15 hover:border-white/40 text-white text-xs sm:text-sm font-mono tracking-wider uppercase transition-all backdrop-blur-md hover:scale-[1.02]"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Screen 4K Reel</span>
              </a>

              <a
                href="#interactive-lab"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Gravity Lab</span>
              </a>
            </motion.div>
          </div>

          {/* Floating Kinetic Physics Cards Layer (Antigravity Drift) */}
          <div className="lg:col-span-4 relative h-[380px] sm:h-[460px] flex items-center justify-center">
            {/* Primary Center Holographic Specimen Card */}
            <motion.div
              style={{
                x: layer1X,
                y: layer1Y,
                rotateX: rotateCardX,
                rotateY: rotateCardY,
                transformPerspective: 1000,
              }}
              className="relative z-20 w-[270px] sm:w-[320px] rounded-2xl bg-gradient-to-b from-[#181818]/95 to-[#0c0c0c]/95 p-4 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.15)] backdrop-blur-xl animate-antigravity-slow"
            >
              <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden mb-3.5 group">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85"
                  alt="Saint Laurent Haute Couture Film"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[9px] font-mono text-white">
                  4K ANAMORPHIC
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Featured Specimen</div>
                  <div className="font-cinzel text-xs font-bold text-white tracking-wide truncate">
                    NOIR ÉTERNEL // Saint Laurent
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono border-t border-white/10 pt-2.5 text-neutral-300">
                <span className="flex items-center gap-1 text-white">
                  <Award className="w-3.5 h-3.5" /> CANNES GOLD
                </span>
                <span className="text-neutral-400">ARRI ALEXA 35</span>
              </div>
            </motion.div>

            {/* Orbiting Satellite Card 1 - Cine Spec */}
            <motion.div
              style={{
                x: layer2X,
                y: layer2Y,
              }}
              className="absolute -top-4 -right-2 sm:-right-6 z-30 p-3.5 rounded-xl bg-neutral-900/90 border border-white/15 shadow-2xl backdrop-blur-lg animate-antigravity-fast"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Optics Calibration</div>
                  <div className="text-xs font-bold text-white font-mono">COOKE /i ANAMORPHIC</div>
                </div>
              </div>
            </motion.div>

            {/* Orbiting Satellite Card 2 - Performance Metric */}
            <motion.div
              style={{
                x: layer3X,
                y: layer3Y,
              }}
              className="absolute -bottom-6 -left-2 sm:-left-8 z-30 p-3 rounded-xl bg-neutral-900/90 border border-white/20 shadow-[0_10px_30px_rgba(255,255,255,0.1)] backdrop-blur-lg"
            >
              <div className="text-[9px] font-mono text-neutral-400 uppercase">Global Portfolio Reach</div>
              <div className="text-sm font-black font-cinzel text-white tracking-wider">
                +4.2M AUDIENCE &bull; VOGUE
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 pt-8 border-t border-white/[0.1] grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">48+</div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              International Awards
            </div>
          </div>
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold luxury-gradient-text">$180M+</div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Client Valuation Driven
            </div>
          </div>
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">100%</div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Confidentiality NDA Protocol
            </div>
          </div>
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">8K / 35mm</div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Master Delivery Standards
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pt-8">
        <a
          href="#portfolio"
          className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors font-mono text-[10px] tracking-widest uppercase"
        >
          <span>Scroll to Inspect</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-white" />
        </a>
      </div>
    </section>
  );
}
