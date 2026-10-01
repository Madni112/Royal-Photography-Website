export type ProjectCategory = 
  | "All"
  | "Cinematography"
  | "Graphic Design"
  | "Premium Photography"
  | "Art Direction";

export interface Project {
  id: string;
  title: string;
  client: string;
  category: "Cinematography" | "Graphic Design" | "Premium Photography" | "Art Direction";
  description: string;
  coverImage: string;
  mediaUrl?: string;
  videoUrl?: string;
  aspectRatio: "portrait" | "landscape" | "cinematic" | "square";
  tags: string[];
  year: string;
  featured: boolean;
  awards?: string[];
  cameraSpecs?: string;
  deliverables?: string[];
  metrics?: string;
  createdAt: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budgetBracket: string;
  timeline: string;
  location: string;
  projectScale: string;
  notes: string;
  status: "New Lead" | "Qualified" | "In Discussion" | "Proposal Sent" | "Archived";
  leadScore: number;
  createdAt: string;
}

export interface AdminStats {
  totalViews: number;
  activeLeads: number;
  pipelineValue: string;
  totalAssets: number;
  lastRevalidated: string;
}
