import type { CollegeResult, CutoffRequest } from "@/lib/api";
import { BRANCH_FILTERS } from "@/lib/api";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const CONTENT_START_Y = 742;
const CONTENT_MARGIN_X = 48;
const CONTENT_LINE_HEIGHT = 14;
const MAX_LINE_CHARS = 86;
const MAX_LINES_PER_PAGE = 46;

const getCollegeField = (college: CollegeResult, keys: string[]) => {
  for (const key of keys) {
    const value = college[key];
    if (value !== null && value !== undefined && value !== "") {
      return String(value);
    }
  }

  return "";
};

const formatCutoff = (college: CollegeResult) => {
  const cutoffValue =
    college.CET_Percentile ??
    college.cet_percentile ??
    college.cutoff_percentile ??
    college.Percentile ??
    college.percentile;

  if (cutoffValue === null || cutoffValue === undefined || cutoffValue === "") {
    return "-";
  }

  return String(cutoffValue);
};

const normalizeAscii = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapePdfText = (value: string) =>
  normalizeAscii(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const wrapText = (value: string, maxChars: number) => {
  const normalized = normalizeAscii(value);

  if (!normalized) {
    return [""];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (!word) {
      continue;
    }

    if (word.length > maxChars) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars));
      }

      continue;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
};

const formatFilters = (filters?: CutoffRequest | null) => {
  if (!filters) {
    return [];
  }

  const percentileRange =
    filters.min_percentile_cet !== undefined || filters.max_percentile_cet !== undefined
      ? `${filters.min_percentile_cet ?? 0} - ${filters.max_percentile_cet ?? 100}`
      : "Not specified";

  const selectedBranches = BRANCH_FILTERS.filter(({ key }) => Boolean(filters[key])).map(
    ({ label }) => label,
  );

  const filterLines = [
    `Profile: ${filters.user_category || "-"} | ${filters.user_home_university || "-"} | ${filters.gender || "Male"}`,
    `CET percentile range: ${percentileRange}`,
    `Cities: ${filters.cities?.length ? filters.cities.join(", ") : "Any"}`,
    `Divisions: ${filters.divisions?.length ? filters.divisions.join(", ") : "Any"}`,
    `Minority tags: ${filters.user_minority_list?.length ? filters.user_minority_list.join(", ") : "None"}`,
    `Branch focus: ${selectedBranches.length ? selectedBranches.join(", ") : "All branches"}`,
    `EWS considered: ${filters.is_ews ? "Yes" : "No"}`,
  ];

  return filterLines.flatMap((line) => wrapText(line, MAX_LINE_CHARS));
};

const buildCollegeLines = (results: CollegeResult[]) =>
  results.flatMap((college, index) => {
    const collegeName = getCollegeField(college, ["college_name", "College", "Name", "name"]) || "Unknown College";
    const branchName = getCollegeField(college, ["branch_name", "Branch", "branch"]) || "-";
    const city = getCollegeField(college, ["city", "City"]) || "-";
    const category = getCollegeField(college, ["category", "Category", "seat_type", "SeatType"]) || "-";
    const year = getCollegeField(college, ["year", "Year"]) || "-";
    const round = getCollegeField(college, ["round", "Round", "round_no"]) || "-";
    const university = getCollegeField(college, ["home_university", "University"]) || "-";
    const status = getCollegeField(college, ["status"]) || "-";
    const cutoff = formatCutoff(college);

    return [
      ...wrapText(`${index + 1}. ${collegeName}`, MAX_LINE_CHARS),
      ...wrapText(`   Branch: ${branchName}`, MAX_LINE_CHARS),
      ...wrapText(
        `   City: ${city} | Category: ${category} | Round: ${round} | Year: ${year} | Cutoff: ${cutoff}`,
        MAX_LINE_CHARS,
      ),
      ...wrapText(`   University: ${university} | Status: ${status}`, MAX_LINE_CHARS),
      "",
    ];
  });

const paginateLines = (lines: string[]) => {
  const pages: string[][] = [];

  for (let index = 0; index < lines.length; index += MAX_LINES_PER_PAGE) {
    pages.push(lines.slice(index, index + MAX_LINES_PER_PAGE));
  }

  return pages.length > 0 ? pages : [[]];
};

const buildPageContent = ({
  lines,
  pageNumber,
  totalPages,
  generatedAt,
  totalResults,
}: {
  lines: string[];
  pageNumber: number;
  totalPages: number;
  generatedAt: string;
  totalResults: number;
}) => {
  const contentLines = lines.map((line) => `(${escapePdfText(line)}) Tj`).join("\nT*\n");

  return [
    "q",
    "BT",
    "/F1 18 Tf",
    `${CONTENT_MARGIN_X} ${PAGE_HEIGHT - 52} Td`,
    "(CETRANK College List) Tj",
    "ET",
    "BT",
    "/F1 10 Tf",
    `${CONTENT_MARGIN_X} ${PAGE_HEIGHT - 72} Td`,
    `(${escapePdfText(`Generated on ${generatedAt} | Total colleges: ${totalResults}`)}) Tj`,
    "ET",
    "BT",
    "/F1 9 Tf",
    `${PAGE_WIDTH - 120} ${PAGE_HEIGHT - 52} Td`,
    `(${escapePdfText(`Page ${pageNumber} of ${totalPages}`)}) Tj`,
    "ET",
    "0.85 w",
    `${CONTENT_MARGIN_X} ${PAGE_HEIGHT - 82} m`,
    `${PAGE_WIDTH - CONTENT_MARGIN_X} ${PAGE_HEIGHT - 82} l`,
    "S",
    "BT",
    "/F2 10 Tf",
    `${CONTENT_LINE_HEIGHT} TL`,
    `${CONTENT_MARGIN_X} ${CONTENT_START_Y} Td`,
    contentLines || "() Tj",
    "ET",
    "Q",
  ].join("\n");
};

const createPdf = (pageContents: string[]) => {
  const objects: string[] = [];
  const pageReferences: string[] = [];

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>";

  let objectNumber = 5;

  for (const pageContent of pageContents) {
    const contentObjectNumber = objectNumber++;
    const pageObjectNumber = objectNumber++;

    objects[contentObjectNumber] = `<< /Length ${pageContent.length} >>\nstream\n${pageContent}\nendstream`;
    objects[pageObjectNumber] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;
    pageReferences.push(`${pageObjectNumber} 0 R`);
  }

  objects[2] = `<< /Type /Pages /Count ${pageReferences.length} /Kids [${pageReferences.join(" ")}] >>`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefPosition = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;
  return pdf;
};

export const downloadCollegeListPdf = ({
  results,
  filters,
}: {
  results: CollegeResult[];
  filters?: CutoffRequest | null;
}) => {
  const generatedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const introLines = [
    "Profile Summary",
    ...formatFilters(filters),
    "",
    "Generated Colleges",
    "",
  ];
  const collegeLines = buildCollegeLines(results);
  const pages = paginateLines([...introLines, ...collegeLines]);
  const pageContents = pages.map((lines, index) =>
    buildPageContent({
      lines,
      pageNumber: index + 1,
      totalPages: pages.length,
      generatedAt,
      totalResults: results.length,
    }),
  );
  const pdfContent = createPdf(pageContents);
  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const dateTag = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `cetrank-college-list-${dateTag}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
