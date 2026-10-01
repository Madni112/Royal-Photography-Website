"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Project,
  LeadSubmission,
} from "@/lib/types";
import {
  getStoredProjects,
  saveProjectToStore,
  deleteProjectFromStore,
  resetProjectsToDefault,
  getStoredLeads,
  updateLeadStatus,
  deleteLeadFromStore,
  getLastRevalidationTime,
  triggerSimulatedRevalidation,
  subscribeToStore
} from "@/lib/store";
import { revalidatePortfolioAction } from "@/app/actions";
import { soundEngine } from "@/lib/sound";
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  Inbox,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  ExternalLink,
  DollarSign
} from "lucide-react";

const ADMIN_PASSCODE = "antigravity2026";

const CATEGORIES: ("Cinematography" | "Graphic Design" | "Premium Photography" | "Art Direction")[] = [
  "Cinematography",
  "Graphic Design",
  "Premium Photography",
  "Art Direction"
];

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"projects" | "leads" | "revalidate" | "analytics">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [lastRevalidated, setLastRevalidated] = useState("");

  // CRUD Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form inputs for CRUD
  const [formTitle, setFormTitle] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formCategory, setFormCategory] = useState<Project["category"]>("Cinematography");
  const [formDescription, setFormDescription] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formAspectRatio, setFormAspectRatio] = useState<Project["aspectRatio"]>("cinematic");
  const [formYear, setFormYear] = useState("2026");
  const [formTags, setFormTags] = useState("");
  const [formCameraSpecs, setFormCameraSpecs] = useState("");
  const [formAwards, setFormAwards] = useState("");
  const [formMetrics, setFormMetrics] = useState("");
  const [formFeatured, setFormFeatured] = useState(true);

  // Server Action Revalidation State
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidationNotice, setRevalidationNotice] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("antigravity_admin_token");
    if (savedToken === "authenticated_session_token_ok") {
      setIsAuthenticated(true);
    }

    const loadData = () => {
      setProjects(getStoredProjects());
      setLeads(getStoredLeads());
      setLastRevalidated(getLastRevalidationTime());
    };

    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    if (passcodeInput === ADMIN_PASSCODE || passcodeInput.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("antigravity_admin_token", "authenticated_session_token_ok");
      document.cookie = "antigravity_admin_token=authenticated_session_token_ok; path=/; max-age=86400";
      setAuthError("");
      soundEngine.playChime();
    } else {
      setAuthError("Invalid master authorization token. Check passcode.");
    }
  };

  const handleLogout = () => {
    soundEngine.playClick();
    setIsAuthenticated(false);
    localStorage.removeItem("antigravity_admin_token");
    document.cookie = "antigravity_admin_token=; path=/; max-age=0";
  };

  const openCreateModal = () => {
    soundEngine.playClick();
    setEditingProject(null);
    setFormTitle("");
    setFormClient("");
    setFormCategory("Cinematography");
    setFormDescription("");
    setFormCoverImage("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=85");
    setFormVideoUrl("");
    setFormAspectRatio("cinematic");
    setFormYear("2026");
    setFormTags("Haute Horology, 35mm, Studio");
    setFormCameraSpecs("ARRI Alexa 35 + Master Anamorphic");
    setFormAwards("Cannes Lions Gold");
    setFormMetrics("+3.5M Organic Impressions");
    setFormFeatured(true);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    soundEngine.playClick();
    setEditingProject(proj);
    setFormTitle(proj.title);
    setFormClient(proj.client);
    setFormCategory(proj.category);
    setFormDescription(proj.description);
    setFormCoverImage(proj.coverImage);
    setFormVideoUrl(proj.videoUrl || "");
    setFormAspectRatio(proj.aspectRatio);
    setFormYear(proj.year);
    setFormTags(proj.tags.join(", "));
    setFormCameraSpecs(proj.cameraSpecs || "");
    setFormAwards(proj.awards ? proj.awards.join(", ") : "");
    setFormMetrics(proj.metrics || "");
    setFormFeatured(proj.featured);
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();

    const newProject: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: formTitle,
      client: formClient || "Private Commission",
      category: formCategory,
      description: formDescription,
      coverImage: formCoverImage || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
      videoUrl: formVideoUrl || undefined,
      aspectRatio: formAspectRatio,
      tags: formTags.split(",").map((s) => s.trim()).filter(Boolean),
      year: formYear,
      featured: formFeatured,
      cameraSpecs: formCameraSpecs || undefined,
      awards: formAwards ? formAwards.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      metrics: formMetrics || undefined,
      deliverables: ["4K Master Film", "Stills Archive", "Social Global Suite"],
      createdAt: editingProject ? editingProject.createdAt : new Date().toISOString(),
    };

    saveProjectToStore(newProject);
    setIsModalOpen(false);
    soundEngine.playChime();
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you certain you want to destroy this portfolio asset from the production database?")) {
      soundEngine.playClick();
      deleteProjectFromStore(id);
    }
  };

  const handleTriggerRevalidation = async () => {
    soundEngine.playClick();
    setIsRevalidating(true);
    setRevalidationNotice(null);

    try {
      const serverResult = await revalidatePortfolioAction("/");
      triggerSimulatedRevalidation();
      setLastRevalidated(new Date().toISOString());
      setRevalidationNotice(`On-Demand Cache Revalidated: ${serverResult.message} (${new Date().toLocaleTimeString()})`);
      soundEngine.playChime();
    } catch {
      triggerSimulatedRevalidation();
      setLastRevalidated(new Date().toISOString());
      setRevalidationNotice("Simulated edge cache purge & revalidation complete.");
    } finally {
      setIsRevalidating(false);
    }
  };

  // 1. Password Fence View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient White Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-white/5 blur-[140px] rounded-full" />

        <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#0d0d0e]/95 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.15)] backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              <Lock className="w-7 h-7 text-black" />
            </div>
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
              SECURE MIDDLEWARE FENCE
            </div>
            <h1 className="font-cinzel text-2xl font-bold text-white mt-1">
              ADMINISTRATIVE VAULT
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Restricted /admin path. Enter master credential to unlock live project CRUD & cache revalidation.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-white" />
                <span>Master Security Passcode</span>
              </label>
              <input
                type="password"
                placeholder="Enter passcode (e.g. antigravity2026)"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-neutral-900 border border-red-500/40 text-xs font-mono text-neutral-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-wider font-bold shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>

            <div className="pt-3 text-center">
              <span className="text-[11px] font-mono text-neutral-500">
                Default Demo Key: <code className="text-white bg-neutral-900 px-2 py-0.5 rounded border border-white/10">antigravity2026</code>
              </span>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Gallery</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase">
              <Shield className="w-4 h-4 text-white" />
              <span>ADMINISTRATIVE CONTROL CONSOLE // SECURE APP ROUTER</span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mt-1">
              ANTIGRAVITY <span className="luxury-gradient-text">ADMIN VAULT</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
              <span>View Live Site</span>
            </Link>

            <button
              onClick={handleTriggerRevalidation}
              disabled={isRevalidating}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/30 hover:border-white text-xs font-mono text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRevalidating ? "animate-spin" : ""}`} />
              <span>{isRevalidating ? "Revalidating..." : "Purge Edge Cache"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              Lock Vault
            </button>
          </div>
        </div>

        {/* Cache Revalidation Banner if triggered */}
        {revalidationNotice && (
          <div className="mb-6 p-4 rounded-xl bg-neutral-900 border border-white/30 text-xs font-mono text-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>{revalidationNotice}</span>
            </div>
            <button
              onClick={() => setRevalidationNotice(null)}
              className="text-neutral-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Key Metrics HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
              <span>ACTIVE ASSETS</span>
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-cinzel font-bold text-white">{projects.length}</div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">Live in Gallery Grid</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
              <span>QUALIFIED LEADS</span>
              <Inbox className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-cinzel font-bold luxury-gradient-text">{leads.length}</div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">Inbound Onboarding Briefs</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
              <span>PIPELINE VALUE</span>
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-cinzel font-bold text-white">$485,000+</div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1">Estimated Dealflow</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-1">
              <span>LAST CACHE SYNC</span>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-mono text-white truncate mt-1">
              {new Date(lastRevalidated).toLocaleTimeString()}
            </div>
            <div className="text-[10px] font-mono text-neutral-400 mt-1">Edge ISR Status: Active</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
              activeTab === "projects"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            Live Projects CRUD ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
              activeTab === "leads"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            Lead Management Inbox ({leads.length})
          </button>
        </div>

        {/* TAB 1: Projects CRUD */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Portfolio Assets Catalog
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm("Reset all project catalog items to curated defaults?")) {
                      resetProjectsToDefault();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Reset Defaults
                </button>

                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:bg-neutral-200 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Asset</span>
                </button>
              </div>
            </div>

            {/* Project List Table */}
            <div className="rounded-2xl border border-white/10 bg-neutral-950/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Cover</th>
                      <th className="p-4">Title & Client</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Format / Year</th>
                      <th className="p-4">Metrics / Awards</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 w-20">
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            className="w-16 h-12 rounded-lg object-cover border border-white/10"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{proj.title}</div>
                          <div className="text-neutral-400 text-[11px]">{proj.client}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-white/10 text-[10px] text-neutral-300">
                            {proj.category}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-400">
                          <div>{proj.aspectRatio.toUpperCase()}</div>
                          <div className="text-[10px] text-neutral-500">{proj.year}</div>
                        </td>
                        <td className="p-4 text-neutral-400">
                          <div className="text-white">{proj.metrics || "Standard Delivery"}</div>
                          <div className="text-[10px] text-neutral-300">
                            {proj.awards ? proj.awards[0] : "Official Atelier"}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(proj)}
                              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10"
                              title="Edit Project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10"
                              title="Destroy Project Asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Leads Management */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
              Inbound Vetted Client Inquiries
            </h2>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-6 rounded-2xl bg-neutral-950/90 border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel font-bold text-base text-white">
                          {lead.name}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          &bull; {lead.company}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-white/20 text-[10px] font-mono text-white">
                          VIP Score: {lead.leadScore}/100
                        </span>
                      </div>
                      <div className="text-xs font-mono text-neutral-400 mt-0.5">
                        {lead.email} &bull; Received {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadSubmission["status"])}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white"
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="Qualified">Qualified</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Archived">Archived</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm("Delete this lead submission?")) {
                            deleteLeadFromStore(lead.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                      <div className="text-neutral-500">REQUESTED SERVICE</div>
                      <div className="text-white font-medium mt-0.5">{lead.service}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                      <div className="text-neutral-500">INVESTMENT TIER</div>
                      <div className="text-white font-bold mt-0.5">{lead.budgetBracket}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                      <div className="text-neutral-500">LOCATION & TIMELINE</div>
                      <div className="text-white mt-0.5">{lead.location} &bull; {lead.timeline}</div>
                    </div>
                  </div>

                  {lead.notes && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-neutral-300">
                      <span className="text-neutral-500">CLIENT BRIEF: </span>
                      {lead.notes}
                    </div>
                  )}
                </div>
              ))}

              {leads.length === 0 && (
                <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                  No inbound client inquiries currently logged.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CRUD Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0e10] border border-white/20 p-6 sm:p-8 shadow-[0_0_70px_rgba(255,255,255,0.15)]">
            <h3 className="font-cinzel text-xl font-bold text-white mb-6">
              {editingProject ? "Mutate Asset // Edit Project" : "New Portfolio Asset // Add Entry"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. NOIR ÉTERNEL // Haute Couture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Client / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Maison Saint Laurent"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Project["category"])}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Aspect Ratio</label>
                  <select
                    value={formAspectRatio}
                    onChange={(e) => setFormAspectRatio(e.target.value as Project["aspectRatio"])}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  >
                    <option value="cinematic">Cinematic (16:9 / 21:9)</option>
                    <option value="portrait">Portrait (3:4)</option>
                    <option value="landscape">Landscape (4:3)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Archival Year</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">High-Res Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Media / Video Stream URL (Optional)</label>
                <input
                  type="url"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/... or .mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Project Synopsis & Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Creative vision, lighting, lens specs and concept..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Camera / Software Rig</label>
                  <input
                    type="text"
                    value={formCameraSpecs}
                    onChange={(e) => setFormCameraSpecs(e.target.value)}
                    placeholder="e.g. ARRI Alexa 35 + Cooke Anamorphic"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Awards / Honors</label>
                  <input
                    type="text"
                    value={formAwards}
                    onChange={(e) => setFormAwards(e.target.value)}
                    placeholder="e.g. Cannes Lions Gold 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Haute Horology, Studio, 35mm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Audience Reach / Metric</label>
                  <input
                    type="text"
                    value={formMetrics}
                    onChange={(e) => setFormMetrics(e.target.value)}
                    placeholder="+4.2M Views // Vogue Feature"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded accent-white w-4 h-4"
                />
                <label htmlFor="featuredCheck" className="text-neutral-300">
                  Feature in Hero Highlights & Key Repertoire
                </label>
              </div>

              {/* Form Action buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Save & Push Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
