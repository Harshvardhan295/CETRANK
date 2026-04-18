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

export interface UserDetails {
  user_gender: string;
  user_category: string;
  user_minority_list: string[];
  user_home_university: string;
  division?: string[];
  city?: string[];
  percentile_cet: number;
  percentile_ai: number;
  is_tech: boolean;
  is_civil: boolean;
  is_mechanical: boolean;
  is_electrical: boolean;
  is_electronic: boolean;
  is_other: boolean;
  is_ews: boolean;
  calculated_bounds?: {
    min_percentile_cet: number;
    max_percentile_cet: number;
    min_percentile_ai: number;
    max_percentile_ai: number;
  };
}

export interface CutoffResponse {
  user_details: UserDetails;
  count: number;
  results: CollegeResult[];
}

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
  merit_rank?: number | string;
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
  divisions: Record<string, string[]>;
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

  const rawDivisions = data?.divisions || data?.Divisions || {};
  let divisions: Record<string, string[]> = {};

  if (Array.isArray(rawDivisions)) {
    // Fallback for old array format (though unlikely based on user feedback)
    rawDivisions.forEach((d: string) => {
      divisions[d] = [];
    });
  } else if (typeof rawDivisions === "object") {
    divisions = rawDivisions;
  }

  return {
    cities: pickFirstStringList(data?.cities, data?.Cities).sort(),
    divisions,
    universities: pickFirstStringList(
      data?.universities,
      data?.Universities,
      data?.home_universities,
      data?.homeUniversities,
    ).sort(),
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

export async function getEligibleCutoffs(request: CutoffRequest): Promise<CutoffResponse> {
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
    // If it's just an array, we synthesize a response object
    return {
      results: data,
      count: data.length,
      user_details: {
        ...request,
        is_electronic: request.is_electronic,
        is_other: request.is_other,
        is_civil: request.is_civil,
        is_mechanical: request.is_mechanical,
        is_electrical: request.is_electrical,
        is_tech: request.is_tech,
        is_ews: request.is_ews,
        percentile_cet: request.percentile_cet,
        percentile_ai: request.percentile_ai,
      } as UserDetails
    };
  }

  if (data && typeof data === "object") {
    const results = Array.isArray(data.results) ? data.results : 
                    Array.isArray(data.colleges) ? data.colleges :
                    Array.isArray(data.data) ? data.data : [];

    const responseCategory =
      typeof data.user_details?.user_category === "string" && data.user_details.user_category
        ? data.user_details.user_category
        : request.user_category;

    const mappedResults = results.map((result: any) =>
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

    return {
      results: mappedResults,
      count: data.count ?? mappedResults.length,
      user_details: data.user_details || {
        ...request,
        is_electronic: request.is_electronic,
        is_other: request.is_other,
        is_civil: request.is_civil,
        is_mechanical: request.is_mechanical,
        is_electrical: request.is_electrical,
        is_tech: request.is_tech,
        is_ews: request.is_ews,
        percentile_cet: request.percentile_cet,
        percentile_ai: request.percentile_ai,
      }
    };
  }

  console.warn("[getEligibleCutoffs] Returning empty response — no results found");
  return {
    results: [],
    count: 0,
    user_details: request as unknown as UserDetails
  };
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
  "Autonomous",
  "Autonomous Institute",
  "Deemed to be University",
  "Dr. Babasaheb Ambedkar Marathwada University",
  "Dr. Babasaheb Ambedkar Technological University,Lonere",
  "Gondwana University",
  "Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon",
  "Mumbai University",
  "Punyashlok Ahilyadevi Holkar Solapur University",
  "Rashtrasant Tukadoji Maharaj Nagpur University",
  "SNDT Women's University",
  "Sant Gadge Baba Amravati University",
  "Savitribai Phule Pune University",
  "Shivaji University",
  "Swami Ramanand Teerth Marathwada University, Nanded",
];

export const BRANCH_FILTERS = [
  { key: "is_tech", label: "Computer / IT" },
  { key: "is_electronic", label: "Electronics" },
  { key: "is_electrical", label: "Electrical" },
  { key: "is_mechanical", label: "Mechanical" },
  { key: "is_civil", label: "Civil" },
  { key: "is_other", label: "Other" },
] as const;
