"use client";

import { useEffect } from "react";
import { Project } from "@/lib/types";
import { X, Award, CheckCircle2, Video, Camera, Calendar, ArrowUpRight } from "lucide-react";
import { soundEngine } from "@/lib/sound";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0c0e] border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.15)] z-10 flex flex-col">
        {/* Top Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 border border-white/20 text-neutral-400 hover:text-white hover:border-white transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Header */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              poster={project.coverImage}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-black/50" />

          {/* Badges on image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-mono uppercase tracking-widest font-bold">
                  {project.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-mono text-neutral-300">
                  {project.year}
                </span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide">
                {project.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-neutral-300 mt-1">
                CLIENT: {project.client}
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Summary */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
              Project Synopsis & Creative Vision
            </h3>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          {/* Technical Specs & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {project.cameraSpecs && (
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                  <Camera className="w-4 h-4 text-white" />
                  <span>HARDWARE / RIG SPEC</span>
                </div>
                <div className="text-sm font-medium text-white font-mono">
                  {project.cameraSpecs}
                </div>
              </div>
            )}

            {project.metrics && (
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                  <Video className="w-4 h-4 text-white" />
                  <span>AUDIENCE IMPACT</span>
                </div>
                <div className="text-sm font-medium text-white font-mono">
                  {project.metrics}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                <Calendar className="w-4 h-4 text-white" />
                <span>ARCHIVAL YEAR</span>
              </div>
              <div className="text-sm font-medium text-white font-mono">
                {project.year} &bull; Production Master
              </div>
            </div>
          </div>

          {/* Deliverables & Accolades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Key Deliverables</span>
                </h4>
                <ul className="space-y-2">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.awards && project.awards.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-white" />
                  <span>Honors & Recognitions</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.awards.map((award, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-white" />
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Call to Action */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-neutral-900 text-[11px] font-mono text-neutral-400 border border-white/5">
                  #{t}
                </span>
              ))}
            </div>

            <a
              href="#vetting-funnel"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-mono uppercase tracking-wider font-semibold shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all"
            >
              <span>Commission Similar Work</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
