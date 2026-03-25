const BASE_URL = "https://cetrank-5wly.onrender.com";

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

export async function getEligibleCutoffs(request: CutoffRequest) {
  const res = await fetch(`${BASE_URL}/eligible-cutoffs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Failed to fetch eligible cutoffs");
  return res.json();
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
