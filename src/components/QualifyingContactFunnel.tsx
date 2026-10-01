"use client";

import { useState } from "react";
import { soundEngine } from "@/lib/sound";
import { submitNewLead } from "@/lib/store";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  MapPin,
  Camera,
  Send,
  ShieldCheck,
  Sparkles,
  Lock
} from "lucide-react";

const DISCIPLINES = [
  {
    id: "cinematography",
    title: "Cinematography & Hero Commercials",
    desc: "Anamorphic 35mm / 8K Cinema productions for luxury maisons and elite automotive."
  },
  {
    id: "horology",
    title: "Haute Horology & Fine Jewelry Art",
    desc: "Micro-macro captures, kinetic 3D typography, and bespoke collector catalog design."
  },
  {
    id: "nuptials",
    title: "Royal Nuptials & Private Estate Documentaries",
    desc: "Discreet medium-format and cinematic storytelling for private billionaire families."
  },
  {
    id: "art-direction",
    title: "Spatial Art Direction & CGI Identity",
    desc: "Architectural pavilions, high-fashion runway visual systems, and bespoke typography."
  }
];

const BUDGET_BRACKETS = [
  { id: "b1", label: "$15,000 – $30,000", sub: "Focused Single-Deliverable Campaign" },
  { id: "b2", label: "$30,000 – $75,000", sub: "Full Production Master & Stills Suite" },
  { id: "b3", label: "$75,000 – $150,000", sub: "Multi-City Cinema & Global Rollout" },
  { id: "b4", label: "$150,000+ Bespoke", sub: "Private Masterpiece & Sovereign Production" }
];

const TIMELINES = [
  "Immediate VIP Sprint (Within 30 Days)",
  "Q4 2026 (November – December)",
  "Q1 2027 (January – March)",
  "Flexible / Long-Horizon Archival"
];

const LOCATIONS = [
  "Paris & Milan",
  "Monaco & French Riviera",
  "Lake Como & Swiss Alps (Geneva / St. Moritz)",
  "London & Edinburgh",
  "New York & Los Angeles",
  "Tokyo / Dubai / Global Multi-City"
];

const PRODUCTION_SCALES = [
  "Solo Master Director + Leica / Medium Format Stills",
  "Full Cinema Unit with Dual ARRI Alexa 35 & Cooke Optics",
  "Extreme Aerial Unit + Heavy-Lift Gyro Chase Systems",
  "Complete 3D Spatial CGI + Dolby Atmos Sound Master"
];

export default function QualifyingContactFunnel() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: DISCIPLINES[0].title,
    budgetBracket: BUDGET_BRACKETS[1].label,
    timeline: TIMELINES[1],
    location: LOCATIONS[0],
    projectScale: PRODUCTION_SCALES[1],
    name: "",
    email: "",
    company: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadId, setLeadId] = useState("");

  const handleNext = () => {
    soundEngine.playClick();
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    soundEngine.playClick();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = submitNewLead({
        name: formData.name || "VIP Client",
        email: formData.email,
        company: formData.company || "Private Principal",
        service: formData.service,
        budgetBracket: formData.budgetBracket,
        timeline: formData.timeline,
        location: formData.location,
        projectScale: formData.projectScale,
        notes: formData.notes
      });

      setLeadId(created.id);
      setIsSubmitting(false);
      setIsSubmitted(true);
      soundEngine.playChime();

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FFFFFF", "#CCCCCC", "#777777"]
        });
      } catch {
        // Fallback
      }
    }, 600);
  };

  return (
    <section id="vetting-funnel" className="relative py-28 bg-black text-white">
      {/* Background Radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-white/5 blur-[150px] rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-white/20 text-xs font-mono text-neutral-300 mb-3">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span>CONFIDENTIAL CLIENT ONBOARDING PROTOCOL</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-white">
            COMMISSION <span className="luxury-gradient-text">THE ATELIER</span>
          </h2>
          <p className="text-xs sm:text-sm font-mono text-neutral-400 max-w-xl mx-auto mt-2">
            To preserve uncompromising execution, we accept only 12 master commissions annually. Please complete our vetting questionnaire below.
          </p>
        </div>

        {/* Multi-Step Funnel Container */}
        <div className="relative rounded-3xl bg-[#0c0c0e]/95 border border-white/20 p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(255,255,255,0.08)] backdrop-blur-2xl">
          {/* Progress Indicator */}
          {!isSubmitted && (
            <div className="mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-3">
                <span className="text-white font-bold">PHASE 0{step} OF 04</span>
                <span>{step === 1 ? "Creative Scope" : step === 2 ? "Investment & Schedule" : step === 3 ? "Logistics & Hardware" : "Principal Credentials"}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neutral-400 to-white transition-all duration-500 rounded-full shadow-[0_0_12px_#FFFFFF]"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Form State */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: Creative Scope */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                  <h3 className="text-base sm:text-lg font-cinzel font-bold text-white mb-2">
                    01 // Select Primary Discipline & Creative Scope
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DISCIPLINES.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setFormData({ ...formData, service: item.title });
                        }}
                        onMouseEnter={() => soundEngine.playHover()}
                        className={`p-5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between ${
                          formData.service === item.title
                            ? "bg-neutral-800/90 border-white shadow-[0_0_25px_rgba(255,255,255,0.2)] scale-[1.02]"
                            : "bg-neutral-900/60 border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-cinzel text-sm sm:text-base font-bold text-white">
                              {item.title}
                            </span>
                            {formData.service === item.title && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Budget & Timeline */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                  <div>
                    <h3 className="text-base sm:text-lg font-cinzel font-bold text-white mb-3">
                      02 // Targeted Budget Investment Bracket
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {BUDGET_BRACKETS.map((b) => (
                        <button
                          type="button"
                          key={b.id}
                          onClick={() => {
                            soundEngine.playClick();
                            setFormData({ ...formData, budgetBracket: b.label });
                          }}
                          onMouseEnter={() => soundEngine.playHover()}
                          className={`p-4 rounded-xl text-left border transition-all ${
                            formData.budgetBracket === b.label
                              ? "bg-neutral-800/90 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                              : "bg-neutral-900/60 border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold text-white">
                              {b.label}
                            </span>
                            {formData.budgetBracket === b.label && (
                              <DollarSign className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1">{b.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Target Launch Window
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-white"
                    >
                      {TIMELINES.map((t, idx) => (
                        <option key={idx} value={t} className="bg-neutral-900 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: Location & Scale */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                  <div>
                    <h3 className="text-base sm:text-lg font-cinzel font-bold text-white mb-2">
                      03 // Location & Hardware Scale
                    </h3>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Primary Production Location
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {LOCATIONS.map((loc, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            soundEngine.playClick();
                            setFormData({ ...formData, location: loc });
                          }}
                          className={`p-3 rounded-xl text-left text-xs font-mono border transition-all flex items-center gap-2 ${
                            formData.location === loc
                              ? "bg-neutral-800 border-white text-white"
                              : "bg-neutral-900/60 border-white/10 text-neutral-400 hover:text-white"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-white" />
                          <span>{loc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Production & Crew Scale Requirements
                    </label>
                    <div className="space-y-2">
                      {PRODUCTION_SCALES.map((scale, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            soundEngine.playClick();
                            setFormData({ ...formData, projectScale: scale });
                          }}
                          className={`w-full p-3.5 rounded-xl text-left text-xs font-mono border transition-all flex items-center justify-between ${
                            formData.projectScale === scale
                              ? "bg-neutral-800 border-white text-white font-semibold"
                              : "bg-neutral-900/60 border-white/10 text-neutral-400 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Camera className="w-3.5 h-3.5 text-white" />
                            {scale}
                          </span>
                          {formData.projectScale === scale && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Executive Details */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                  <h3 className="text-base sm:text-lg font-cinzel font-bold text-white mb-2">
                    04 // Principal Executive Credentials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Principal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lady Vivienne Montgomery"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Executive VIP Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vivienne@montgomery-holdings.ch"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Brand / Family Office / Entity Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maison Montgomery Fine Horology"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Confidential Project Synopsis & Vision
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Outline any special aesthetic desires, confidentiality constraints, or bespoke timeline needs..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/20 flex items-center gap-3 text-xs font-mono text-neutral-300">
                    <ShieldCheck className="w-5 h-5 text-white shrink-0" />
                    <span>All submissions encrypted under strict Studio Mutual Non-Disclosure Agreement (MNDA).</span>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] hover:bg-neutral-200 transition-all"
                  >
                    <span>Proceed to Phase 0{step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_rgba(255,255,255,0.7)] hover:bg-neutral-200 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Encrypting & Transmitting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Master Brief</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Success View */
            <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,255,255,0.6)]">
                <Sparkles className="w-8 h-8 text-black" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-white/30 text-[10px] font-mono text-white uppercase">
                  LEAD QUALIFICATION PROTOCOL APPROVED
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white mt-2">
                  BRIEF RECEIVED // {leadId}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-neutral-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your confidential inquiry for <strong className="text-white">{formData.service}</strong> has entered our private curation queue.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-900/90 border border-white/15 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Investment Tier:</span>
                  <span className="text-white font-bold">{formData.budgetBracket}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Target Region:</span>
                  <span className="text-white">{formData.location}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>SLA Response:</span>
                  <span className="text-white font-bold">&lt; 4 Hours Executive Callback</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsSubmitted(false);
                  setStep(1);
                }}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-xs font-mono text-neutral-300 hover:text-white"
              >
                Submit Another Project Scope
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
