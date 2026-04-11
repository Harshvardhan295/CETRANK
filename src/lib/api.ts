const DEFAULT_API_BASE_URL = "/api";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const resolvedBaseUrl = import.meta.env.DEV
  ? DEFAULT_API_BASE_URL
  : configuredBaseUrl || DEFAULT_API_BASE_URL;

const BASE_URL = resolvedBaseUrl.replace(/\/+$/, "");

const API_ROOT = BASE_URL.startsWith("http") ? `${BASE_URL}/api` : BASE_URL;

const buildApiUrl = (path: string) =>
  new URL(`${API_ROOT}${path.startsWith("/") ? path : `/${path}`}`, window.location.origin);

const getStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const pickFirstStringList = (...values: unknown[]) => {
  for (const value of values) {
    const items = getStringList(value);
    if (items.length > 0) {
      return items;
    }
  }

  return [];
};

/** Split comma-separated entries (e.g. "Amravati Division, Nagpur Division") into distinct values. */
const splitAndDedupe = (items: string[]): string[] => {
  const unique = new Set<string>();
  for (const item of items) {
    for (const part of item.split(",")) {
      const trimmed = part.trim();
      if (trimmed) unique.add(trimmed);
    }
  }
  return Array.from(unique).sort();
};

export interface CutoffRequest {
  user_category: string;
  user_minority_list: string[];
  user_home_university: string;
  user_gender: string;
  city?: string[] | null;
  division?: string[] | null;
  percentile_cet: number;
  percentile_ai: number;
  is_tech: boolean;
  is_electronic: boolean;
  is_other: boolean;
  is_civil: boolean;
  is_mechanical: boolean;
  is_electrical: boolean;
  is_ews: boolean;
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
  course_name?: string;
  city?: string;
  City?: string;
  category?: string;
  Category?: string;
  seat_type?: string;
  SeatType?: string;
  reservation_category?: string;
  user_category?: string;
  year?: string | number;
  Year?: string | number;
  round?: string | number;
  Round?: string | number;
  round_no?: string | number;
  home_university?: string;
  University?: string;
  status?: string;
}

export interface MetadataResponse {
  cities: string[];
  divisions: string[];
  universities: string[];
  minorities: string[];
}

export interface ChatResponse {
  answer: string;
  sql_generated?: string;
  row_count?: number;
}

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

const parseErrorDetail = async (res: Response) => {
  const text = await res.text();

  try {
    const parsed = JSON.parse(text) as { detail?: string };
    return parsed.detail ?? text;
  } catch {
    return text;
  }
};

export async function getColleges(params?: {
  city?: string;
  division?: string;
  is_minority?: boolean;
}) {
  const url = buildApiUrl("/colleges");
  if (params?.city) url.searchParams.set("city", params.city);
  if (params?.division) url.searchParams.set("division", params.division);
  if (params?.is_minority !== undefined) {
    url.searchParams.set("is_minority", String(params.is_minority));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
}

export async function getBranches(params?: {
  college_code?: string;
  branch_name?: string;
}) {
  const url = buildApiUrl("/branches");
  if (params?.college_code) url.searchParams.set("college_code", params.college_code);
  if (params?.branch_name) url.searchParams.set("branch_name", params.branch_name);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}

export async function getMetadata(): Promise<MetadataResponse> {
  const res = await fetch(buildApiUrl("/v1/metadata").toString());

  if (!res.ok) {
    const detail = await parseErrorDetail(res);
    throw new ApiError(res.status, `Failed to fetch metadata (${res.status})`, detail);
  }

  const rawData = await res.json();
  const data =
    rawData && typeof rawData === "object" && rawData.data && typeof rawData.data === "object"
      ? rawData.data
      : rawData;

  return {
    cities: pickFirstStringList(data?.cities, data?.Cities),
    divisions: splitAndDedupe(pickFirstStringList(data?.divisions, data?.Divisions)),
    universities: pickFirstStringList(
      data?.universities,
      data?.Universities,
      data?.home_universities,
      data?.homeUniversities,
    ),
    minorities: pickFirstStringList(
      data?.minorities,
      data?.Minorities,
      data?.minority,
      data?.Minority,
      data?.minority_list,
      data?.minority_lists,
      data?.minorityList,
      data?.minorityLists,
      data?.minority_options,
      data?.minorityOptions,
      data?.minority_types,
      data?.minorityTypes,
      data?.user_minority_list,
      data?.userMinorityList,
    ),
  };
}

export async function getEligibleCutoffs(request: CutoffRequest): Promise<CollegeResult[]> {
  const url = buildApiUrl("/v1/get-cutoffs").toString();
  console.log("[getEligibleCutoffs] POST", url);
  console.log("[getEligibleCutoffs] Request body:", JSON.stringify(request, null, 2));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  console.log("[getEligibleCutoffs] Response status:", res.status);

  if (!res.ok) {
    const detail = await parseErrorDetail(res);
    console.error("[getEligibleCutoffs] API error:", res.status, detail);
    throw new ApiError(
      res.status,
      `Failed to fetch eligible cutoffs (${res.status})`,
      detail,
    );
  }

  const data = await res.json();

  console.log("[getEligibleCutoffs] Response keys:", data ? Object.keys(data) : "null/undefined");
  console.log("[getEligibleCutoffs] count:", data?.count, "| results length:", data?.results?.length);

  if (Array.isArray(data)) {
    console.log("[getEligibleCutoffs] Response is a direct array, length:", data.length);
    return data;
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.results)) {
      console.log("[getEligibleCutoffs] Found data.results with", data.results.length, "items");
      const responseCategory =
        typeof data.user_details?.user_category === "string" && data.user_details.user_category
          ? data.user_details.user_category
          : request.user_category;

      return data.results.map((result) =>
        result && typeof result === "object"
          ? {
              ...result,
              user_category:
                typeof result.user_category === "string" && result.user_category
                  ? result.user_category
                  : responseCategory,
            }
          : result,
      );
    }
    if (Array.isArray(data.colleges)) {
      console.log("[getEligibleCutoffs] Found data.colleges with", data.colleges.length, "items");
      return data.colleges;
    }
    if (Array.isArray(data.data)) {
      console.log("[getEligibleCutoffs] Found data.data with", data.data.length, "items");
      return data.data;
    }
    console.warn("[getEligibleCutoffs] No recognized array field in response. Full response:", JSON.stringify(data).substring(0, 500));
  }
  console.warn("[getEligibleCutoffs] Returning empty array — no results found in response");
  return [];
}

export async function sendChatQuery(query: string): Promise<ChatResponse> {
  const res = await fetch(buildApiUrl("/v1/chat").toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const detail = await parseErrorDetail(res);
    throw new ApiError(res.status, `Chat failed (${res.status})`, detail);
  }

  return res.json();
}

export const CATEGORIES = [
  "GOPEN",
  "LOPEN",
  "GOBCH",
  "LOBCH",
  "GSEBC",
  "LSEBC",
  "GSC",
  "LSC",
  "GST",
  "LST",
  "GVJN",
  "LVJN",
  "GNT1",
  "LNT1",
  "GNT2",
  "LNT2",
  "GNT3",
  "LNT3",
  "GOBC",
  "LOBC",
  "GEWS",
  "LEWS",
  "TFWS",
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
