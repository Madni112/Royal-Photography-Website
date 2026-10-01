"use client";

import { useState, useEffect } from "react";
import { Project, ProjectCategory } from "@/lib/types";
import { getStoredProjects, subscribeToStore } from "@/lib/store";
import { soundEngine } from "@/lib/sound";
import ProjectModal from "./ProjectModal";
import { Eye, Film, Sparkles, Filter, PlusCircle } from "lucide-react";
import Link from "next/link";

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Cinematography",
  "Graphic Design",
  "Premium Photography",
  "Art Direction"
];

export default function StaggeredPortfolioGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(getStoredProjects());
    const unsubscribe = subscribeToStore(() => {
      setProjects(getStoredProjects());
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="relative py-28 bg-black text-neutral-100">
      {/* Background glow lines */}
      <div className="pointer-events-none absolute top-1/3 left-0 w-96 h-96 bg-white/5 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 w-96 h-96 bg-white/5 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-white/[0.1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span>DIGITAL ART & CINEMA ARCHIVE</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-white">
              CURATED <span className="luxury-gradient-text">MASTERWORKS</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105"
                    : "bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Staggered Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredProjects.map((project) => {
            const isCinematic = project.aspectRatio === "cinematic";
            const isPortrait = project.aspectRatio === "portrait";

            return (
              <div
                key={project.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveModalProject(project);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                data-cursor-text="INSPECT"
                className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.1] hover:border-white/60 shadow-lg hover:shadow-[0_15px_40px_rgba(255,255,255,0.12)] transition-all duration-500 cursor-pointer"
              >
                {/* Media Container */}
                <div
                  className={`relative w-full overflow-hidden ${
                    isCinematic
                      ? "aspect-[16/9]"
                      : isPortrait
                      ? "aspect-[3/4]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-md bg-black/80 border border-white/20 backdrop-blur-md text-[10px] font-mono text-white uppercase tracking-wider">
                      {project.category}
                    </span>
                    {project.videoUrl && (
                      <span className="p-1.5 rounded-md bg-white/90 text-black shadow-md">
                        <Film className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Dark Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Top Laser Accent on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                      <span>{project.client}</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover:text-neutral-200 transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 font-light leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-neutral-400">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <span className="flex items-center gap-1 text-[11px] font-mono text-white group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state or Add in Admin */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-neutral-950/60 border border-white/10 rounded-2xl">
            <Filter className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 font-mono text-sm">
              No works cataloged under "{selectedCategory}".
            </p>
            <Link
              href="/admin"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-white/20 text-xs font-mono text-white"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Projects in Admin Console</span>
            </Link>
          </div>
        )}
      </div>

      {/* Project Detail Lightbox Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
