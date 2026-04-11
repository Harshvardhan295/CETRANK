const DEFAULT_API_BASE_URL = "/api";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL).replace(
  /\/+$/,
  "",
);

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
    cities: getStringList(data?.cities ?? data?.Cities),
    divisions: getStringList(data?.divisions ?? data?.Divisions),
    universities: getStringList(
      data?.universities ??
        data?.Universities ??
        data?.home_universities ??
        data?.homeUniversities,
    ),
  };
}

export async function getEligibleCutoffs(request: CutoffRequest): Promise<CollegeResult[]> {
  const res = await fetch(buildApiUrl("/v1/get-cutoffs").toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const detail = await parseErrorDetail(res);
    throw new ApiError(
      res.status,
      `Failed to fetch eligible cutoffs (${res.status})`,
      detail,
    );
  }

  const data = await res.json();

  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.results)) {
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
    if (Array.isArray(data.colleges)) return data.colleges;
    if (Array.isArray(data.data)) return data.data;
  }
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
