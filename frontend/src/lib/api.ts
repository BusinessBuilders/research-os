import type { ResearchSession, ResearchJob } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  listSessions: () => fetchAPI<ResearchSession[]>("/api/sessions"),

  getSession: (id: string) => fetchAPI<ResearchSession>(`/api/sessions/${id}`),

  createSession: (data: { goal: string; budget?: number; wiki_context?: string[]; mode?: string }) =>
    fetchAPI<ResearchSession>("/api/sessions", { method: "POST", body: JSON.stringify(data) }),

  analyze: (id: string) =>
    fetchAPI<ResearchSession>(`/api/sessions/${id}/analyze`, { method: "POST" }),

  startResearch: (id: string) =>
    fetchAPI<{ job_id: string; status: string }>(`/api/sessions/${id}/research`, { method: "POST" }),

  getStatus: (id: string) => fetchAPI<ResearchJob>(`/api/sessions/${id}/status`),

  decide: (id: string, data: { project_slug?: string; rationale?: string; selected_product_ids: string[]; budget_category?: string }) =>
    fetchAPI<{ decision: unknown; wiki_path: string }>(`/api/sessions/${id}/decide`, { method: "POST", body: JSON.stringify(data) }),

  getEquipment: () => fetchAPI<{ inventory: string }>("/api/equipment"),

  listProjects: () => fetchAPI<{ projects: string[] }>("/api/projects"),

  getHealth: () => fetchAPI<{ status: string; services: Record<string, string> }>("/api/health"),
};
