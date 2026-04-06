const BASE_URL = "/api";

export interface CutoffRequest {
  user_category: string;
  user_minority_list?: string[];
  user_home_university: string;
  gender?: string;
  cities?: string[] | null;
  divisions?: string[] | null;
  min_percentile_cet?: number;
  max_percentile_cet?: number;
  min_percentile_ai?: number;
  max_percentile_ai?: number;
  is_tech?: boolean;
  is_electronic?: boolean;
  is_other?: boolean;
  is_civil?: boolean;
  is_mechanical?: boolean;
  is_electrical?: boolean;
  is_ews?: boolean;
}

export interface CollegeResult {
  [key: string]: string | number | boolean | null | undefined;
  CET_Percentile?: number;
  cet_percentile?: number;
  cutoff_percentile?: number;
  Percentile?: number;
  percentile?: number;
  college_name?: string;
  College?: string;
  Name?: string;
  name?: string;
  branch_name?: string;
  Branch?: string;
  branch?: string;
  city?: string;
  City?: string;
  category?: string;
  Category?: string;
  seat_type?: string;
  SeatType?: string;
  year?: string | number;
  Year?: string | number;
  round?: string | number;
  Round?: string | number;
  round_no?: string | number;
  home_university?: string;
  University?: string;
  status?: string;
}

export async function getColleges(params?: {
  city?: string;
  division?: string;
  is_minority?: boolean;
}) {
  const url = new URL(`${BASE_URL}/colleges`);
  if (params?.city) url.searchParams.set("city", params.city);
  if (params?.division) url.searchParams.set("division", params.division);
  if (params?.is_minority !== undefined)
    url.searchParams.set("is_minority", String(params.is_minority));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
}

export async function getBranches(params?: {
  college_code?: string;
  branch_name?: string;
}) {
  const url = new URL(`${BASE_URL}/branches`);
  if (params?.college_code) url.searchParams.set("college_code", params.college_code);
  if (params?.branch_name) url.searchParams.set("branch_name", params.branch_name);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}

export async function getEligibleCutoffs(request: CutoffRequest): Promise<CollegeResult[]> {
  const res = await fetch(`${BASE_URL}/eligible-cutoffs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_category: request.user_category,
      user_minority_list: request.user_minority_list ?? [],
      user_home_university: request.user_home_university,
      gender: request.gender ?? "Male",
      cities: request.cities ?? null,
      divisions: request.divisions ?? null,
      min_percentile_cet: request.min_percentile_cet ?? 0,
      max_percentile_cet: request.max_percentile_cet ?? 100,
      min_percentile_ai: request.min_percentile_ai ?? 0,
      max_percentile_ai: request.max_percentile_ai ?? 100,
      is_tech: request.is_tech ?? false,
      is_electronic: request.is_electronic ?? false,
      is_other: request.is_other ?? false,
      is_civil: request.is_civil ?? false,
      is_mechanical: request.is_mechanical ?? false,
      is_electrical: request.is_electrical ?? false,
      is_ews: request.is_ews ?? false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch eligible cutoffs (${res.status}): ${text}`);
  }

  const data = await res.json();

  // Normalize response: backend may return an array directly, or wrap it
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.colleges)) return data.colleges;
    if (Array.isArray(data.data)) return data.data;
  }
  return [];
}

export const CATEGORIES = [
  "GOPEN", "LOPEN", "GOBCH", "LOBCH", "GSEBC", "LSEBC",
  "GSC", "LSC", "GST", "LST", "GVJN", "LVJN",
  "GNT1", "LNT1", "GNT2", "LNT2", "GNT3", "LNT3",
  "GOBC", "LOBC", "GEWS", "LEWS", "TFWS",
];

export const HOME_UNIVERSITIES = [
  "Savitribai Phule Pune University",
  "Mumbai University",
  "Rashtrasant Tukadoji Maharaj Nagpur University",
  "Dr. Babasaheb Ambedkar Marathwada University",
  "Shivaji University",
  "North Maharashtra University",
  "Solapur University",
  "Kavayitri Bahinabai Chaudhari North Maharashtra University",
  "Sant Gadge Baba Amravati University",
];

export const BRANCH_FILTERS = [
  { key: "is_tech", label: "Computer / IT" },
  { key: "is_electronic", label: "Electronics" },
  { key: "is_electrical", label: "Electrical" },
  { key: "is_mechanical", label: "Mechanical" },
  { key: "is_civil", label: "Civil" },
  { key: "is_other", label: "Other" },
] as const;
