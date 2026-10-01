"use client";

import { Project, LeadSubmission } from "./types";
import { initialProjects, initialLeads } from "./initialData";

const PROJECTS_STORAGE_KEY = "antigravity_projects_v2";
const LEADS_STORAGE_KEY = "antigravity_leads_v2";
const REVALIDATION_KEY = "antigravity_last_revalidated";

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error("Store listener error:", e);
    }
  });
}

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") {
    return initialProjects;
  }
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(raw);
  } catch {
    return initialProjects;
  }
}

export function saveProjectToStore(project: Project): Project[] {
  const current = getStoredProjects();
  const existingIndex = current.findIndex((p) => p.id === project.id);
  let updated: Project[];

  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = project;
  } else {
    updated = [project, ...current];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(REVALIDATION_KEY, new Date().toISOString());
  }
  notifyListeners();
  return updated;
}

export function deleteProjectFromStore(id: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(REVALIDATION_KEY, new Date().toISOString());
  }
  notifyListeners();
  return updated;
}

export function resetProjectsToDefault(): Project[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialProjects));
    localStorage.setItem(REVALIDATION_KEY, new Date().toISOString());
  }
  notifyListeners();
  return initialProjects;
}

export function getStoredLeads(): LeadSubmission[] {
  if (typeof window === "undefined") {
    return initialLeads;
  }
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialLeads));
      return initialLeads;
    }
    return JSON.parse(raw);
  } catch {
    return initialLeads;
  }
}

export function submitNewLead(lead: Omit<LeadSubmission, "id" | "createdAt" | "status" | "leadScore">): LeadSubmission {
  const current = getStoredLeads();
  
  // Calculate VIP lead quality score based on budget & scope
  let score = 70;
  if (lead.budgetBracket.includes("150k") || lead.budgetBracket.includes("75k")) score += 20;
  if (lead.company && lead.company.length > 3) score += 5;
  if (lead.notes && lead.notes.length > 20) score += 5;

  const newLead: LeadSubmission = {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: score >= 90 ? "Qualified" : "New Lead",
    leadScore: Math.min(score, 100)
  };

  const updated = [newLead, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  }
  notifyListeners();
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadSubmission["status"]): LeadSubmission[] {
  const current = getStoredLeads();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));

  if (typeof window !== "undefined") {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  }
  notifyListeners();
  return updated;
}

export function deleteLeadFromStore(id: string): LeadSubmission[] {
  const current = getStoredLeads();
  const updated = current.filter((item) => item.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  }
  notifyListeners();
  return updated;
}

export function getLastRevalidationTime(): string {
  if (typeof window === "undefined") return new Date().toISOString();
  return localStorage.getItem(REVALIDATION_KEY) || new Date().toISOString();
}

export function triggerSimulatedRevalidation(): { success: boolean; timestamp: string; revalidatedPaths: string[] } {
  const timestamp = new Date().toISOString();
  if (typeof window !== "undefined") {
    localStorage.setItem(REVALIDATION_KEY, timestamp);
  }
  notifyListeners();
  return {
    success: true,
    timestamp,
    revalidatedPaths: ["/", "/admin", "/#portfolio", "/#cinematic-reel"]
  };
}
