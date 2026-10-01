"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Compass, Flame, Zap } from "lucide-react";
import { soundEngine } from "@/lib/sound";

interface PhysicsOrb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  category: string;
  color: string;
  isDragging?: boolean;
}

export default function InteractiveAntigravityLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gravityMode, setGravityMode] = useState<"zero" | "inverted" | "magnetic">("zero");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 480);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 480;
    };
    window.addEventListener("resize", handleResize);

    const labels = [
      { text: "35mm Cinema", cat: "Optics", color: "#FFFFFF" },
      { text: "Saint Laurent", cat: "Client", color: "#E0E0E0" },
      { text: "Dolby Atmos", cat: "Sound", color: "#FFFFFF" },
      { text: "Hasselblad 100c", cat: "Camera", color: "#EDEDED" },
      { text: "Cartier Jewels", cat: "Client", color: "#F5F5F5" },
      { text: "Cannes Gold", cat: "Honor", color: "#FFFFFF" },
      { text: "Alexa 35", cat: "Sensor", color: "#CCCCCC" },
      { text: "Monaco Grand", cat: "Venue", color: "#FFFFFF" },
      { text: "Octane 4K", cat: "VFX", color: "#E5E5E5" },
      { text: "Lake Como", cat: "Location", color: "#EDEDED" },
      { text: "8K HDR Master", cat: "Grade", color: "#FFFFFF" },
      { text: "Private VIP", cat: "Status", color: "#FFFFFF" },
    ];

    const orbs: PhysicsOrb[] = labels.map((item, idx) => ({
      id: idx,
      x: 100 + (idx % 4) * 180 + Math.random() * 40,
      y: 80 + Math.floor(idx / 4) * 120 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      radius: 42,
      label: item.text,
      category: item.cat,
      color: item.color,
    }));

    let draggedOrb: PhysicsOrb | null = null;
    let mousePos = { x: 0, y: 0 };

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getMousePos(e);
      orbs.forEach((orb) => {
        const dist = Math.hypot(orb.x - pos.x, orb.y - pos.y);
        if (dist <= orb.radius) {
          draggedOrb = orb;
          orb.isDragging = true;
          soundEngine.playClick();
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos = getMousePos(e);
      if (draggedOrb) {
        draggedOrb.vx = (mousePos.x - draggedOrb.x) * 0.4;
        draggedOrb.vy = (mousePos.y - draggedOrb.y) * 0.4;
        draggedOrb.x = mousePos.x;
        draggedOrb.y = mousePos.y;
      }
    };

    const handleMouseUp = () => {
      if (draggedOrb) {
        draggedOrb.isDragging = false;
        draggedOrb = null;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Background grid in canvas
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Physics loop
      orbs.forEach((orb, i) => {
        if (!orb.isDragging) {
          if (gravityMode === "inverted") {
            orb.vy -= 0.12;
          } else if (gravityMode === "magnetic") {
            const dx = mousePos.x - orb.x;
            const dy = mousePos.y - orb.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 10 && dist < 350) {
              orb.vx += (dx / dist) * 0.25;
              orb.vy += (dy / dist) * 0.25;
            }
          } else {
            orb.vx *= 0.992;
            orb.vy *= 0.992;
          }

          orb.x += orb.vx;
          orb.y += orb.vy;

          const bounce = 0.85;
          if (orb.x - orb.radius < 0) {
            orb.x = orb.radius;
            orb.vx = -orb.vx * bounce;
          } else if (orb.x + orb.radius > width) {
            orb.x = width - orb.radius;
            orb.vx = -orb.vx * bounce;
          }

          if (orb.y - orb.radius < 0) {
            orb.y = orb.radius;
            orb.vy = -orb.vy * bounce;
          } else if (orb.y + orb.radius > height) {
            orb.y = height - orb.radius;
            orb.vy = -orb.vy * bounce;
          }
        }

        // Inter-orb collisions
        for (let j = i + 1; j < orbs.length; j++) {
          const other = orbs[j];
          const dx = other.x - orb.x;
          const dy = other.y - orb.y;
          const dist = Math.hypot(dx, dy);
          const minDist = orb.radius + other.radius;

          if (dist < minDist && dist > 0) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            if (!orb.isDragging) {
              orb.x -= nx * overlap;
              orb.y -= ny * overlap;
              orb.vx -= nx * 0.6;
              orb.vy -= ny * 0.6;
            }
            if (!other.isDragging) {
              other.x += nx * overlap;
              other.y += ny * overlap;
              other.vx += nx * 0.6;
              other.vy += ny * 0.6;
            }
          }
        }

        // Connecting lines between close orbs
        for (let k = i + 1; k < orbs.length; k++) {
          const o2 = orbs[k];
          const d = Math.hypot(orb.x - o2.x, orb.y - o2.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(orb.x, orb.y);
            ctx.lineTo(o2.x, o2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * (1 - d / 140)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Draw Orb Shell
        ctx.save();
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);

        // Glass gradient fill
        const grad = ctx.createRadialGradient(
          orb.x - 10,
          orb.y - 10,
          2,
          orb.x,
          orb.y,
          orb.radius
        );
        grad.addColorStop(0, "rgba(45, 45, 45, 0.95)");
        grad.addColorStop(1, "rgba(15, 15, 15, 0.9)");
        ctx.fillStyle = grad;
        ctx.fill();

        // White/silver rim light
        ctx.lineWidth = orb.isDragging ? 2.5 : 1.5;
        ctx.strokeStyle = orb.isDragging ? "#FFFFFF" : "rgba(255, 255, 255, 0.35)";
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = orb.isDragging ? 25 : 8;
        ctx.stroke();

        // Label Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#A0A0A0";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(orb.category.toUpperCase(), orb.x, orb.y - 10);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px system-ui";
        ctx.fillText(orb.label, orb.x, orb.y + 7);
        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [gravityMode]);

  return (
    <section id="interactive-lab" className="relative py-24 bg-[#080808] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-white" />
              <span>PHYSICS-BASED KINETIC EXPERIMENT</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-black text-white">
              ANTIGRAVITY <span className="luxury-gradient-text">LABORATORY</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-1">
              Drag, fling, and toss interactive tokens across simulated gravitational vector fields.
            </p>
          </div>

          {/* Physics Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setGravityMode("zero");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                gravityMode === "zero"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Zero-G Inertia</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setGravityMode("inverted");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                gravityMode === "inverted"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Inverted Up-Draft</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setGravityMode("magnetic");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                gravityMode === "magnetic"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Cursor Magnetic Field</span>
            </button>
          </div>
        </div>

        {/* Canvas Arena */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#050505] border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.08)] h-[480px]">
          <canvas ref={canvasRef} data-cursor-text="FLING" className="w-full h-full block" />

          <div className="pointer-events-none absolute bottom-4 left-4 text-[10px] font-mono text-neutral-500">
            KINETIC VECTORS // ACTIVE NODES: 12 &bull; MOUSE HOVER TO ATTRACT
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] font-mono text-neutral-400">
            ● ATELIER REAL-TIME ENGINE
          </div>
        </div>
      </div>
    </section>
  );
}
