export interface ProductCard {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  source_url: string;
  source_name: string;
  image_url: string | null;
  fit_score: "strong" | "partial" | "poor";
  fit_rationale: string;
  specs: Record<string, string>;
  risks: string[];
  selected_for_purchase: boolean;
}

export interface Need {
  id: string;
  description: string;
  rationale: string;
  priority: "critical" | "important" | "nice-to-have";
  estimated_cost_range: string;
  selected: boolean;
  products: ProductCard[];
}

export interface Citation {
  title: string;
  url: string;
  snippet: string;
}

export interface DirectLookupResult {
  answer: string;
  confidence: number;
  part_numbers: string[];
  citations: Citation[];
  fitment: string | null;
}

export interface ResearchSession {
  id: string;
  created_at: string;
  goal: string;
  mode: "goal-driven" | "product-research" | "direct-lookup";
  budget: number | null;
  wiki_context: string[];
  needs: Need[];
  status: "created" | "analyzing" | "researching" | "complete" | "decided";
  lookup_result: DirectLookupResult | null;
}

export interface ResearchJob {
  job_id: string;
  session_id: string;
  status: string;
  current_need: string | null;
  current_round: number;
  needs_completed: number;
  needs_total: number;
  error: string | null;
}

export interface NeedStatus {
  need_id: string;
  description: string;
  status: "pending" | "searching" | "evaluating" | "complete" | "failed";
  product_count: number;
  error: string | null;
}

export interface JobStatus {
  job_id: string;
  session_id: string;
  status: string;
  needs_completed: number;
  needs_total: number;
  error: string | null;
  started_at: string | null;
  need_statuses: NeedStatus[];
}
