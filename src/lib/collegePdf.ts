import { jsPDF } from "jspdf";
import type { CollegeResult, CutoffRequest } from "@/lib/api";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const TABLE_X = 8.5;
const TABLE_Y = 26;
const TABLE_WIDTH = 595;
const TABLE_HEADER_HEIGHT = 18;
const TABLE_BODY_HEIGHT = 696;
const CELL_PADDING_X = 6;
const CELL_LINE_HEIGHT = 12;
const MIN_ROW_HEIGHT = 30;
const ROW_BASE_HEIGHT = 18;
const WATERMARK_PATH = "/logoup_cetrank.png";

const COLUMNS = [
  {
    header: "Code",
    width: 45,
    keys: ["college_code", "College_Code", "institute_code", "Institute_Code", "code", "Code"],
  },
  {
    header: "College Name",
    width: 140,
    keys: ["college_name", "College", "Name", "name"],
  },
  {
    header: "Branch",
    width: 90,
    keys: ["branch_name", "Branch", "branch", "course_name"],
  },
  {
    header: "Branch Code",
    width: 80,
    keys: ["branch_code", "Branch_Code", "choice_code", "ChoiceCode", "choiceCode"],
  },
  {
    header: "Category",
    width: 55,
    keys: ["category", "Category", "seat_type", "SeatType", "reservation_category", "user_category"],
  },
  {
    header: "Rank",
    width: 55,
    keys: ["rank", "Rank", "merit_no", "Merit_No", "merit", "Merit", "cap_rank", "CAP_Rank"],
  },
  {
    header: "Percentile",
    width: 65,
    keys: [],
  },
  {
    header: "City",
    width: 65,
    keys: ["city", "City"],
  },
] as const;

type TableColumn = (typeof COLUMNS)[number];
type TableRow = {
  cells: string[][];
  height: number;
};

const normalizeText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getCollegeField = (college: CollegeResult, keys: readonly string[]) => {
  for (const key of keys) {
    const value = college[key];
    if (value !== null && value !== undefined && value !== "") {
      return normalizeText(String(value));
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

  return normalizeText(String(cutoffValue));
};

const loadImageWithOpacity = (src: string, opacity: number) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas context is unavailable."));
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = opacity;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => reject(new Error(`Failed to load PDF background from ${src}.`));
    image.src = src;
  });

const buildRowValues = (college: CollegeResult) =>
  COLUMNS.map((column) => {
    if (column.header === "Percentile") {
      return formatCutoff(college);
    }

    return getCollegeField(college, column.keys) || "-";
  });

const buildTableRow = (doc: jsPDF, college: CollegeResult): TableRow => {
  const values = buildRowValues(college);

  const cells = values.map((value, index) => {
    const column = COLUMNS[index];
    const wrapped = doc.splitTextToSize(value || "-", column.width - CELL_PADDING_X * 2);
    return wrapped.length > 0 ? wrapped : ["-"];
  });

  const maxLines = Math.max(...cells.map((lines) => lines.length));
  const height = Math.max(MIN_ROW_HEIGHT, ROW_BASE_HEIGHT + maxLines * CELL_LINE_HEIGHT);

  return { cells, height };
};

const paginateRows = (rows: TableRow[]) => {
  const pages: TableRow[][] = [];
  let currentPage: TableRow[] = [];
  let usedHeight = 0;

  for (const row of rows) {
    const nextHeight = usedHeight + row.height;

    if (currentPage.length > 0 && nextHeight > TABLE_BODY_HEIGHT) {
      pages.push(currentPage);
      currentPage = [row];
      usedHeight = row.height;
      continue;
    }

    currentPage.push(row);
    usedHeight = nextHeight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[]];
};

const drawWatermark = (doc: jsPDF, watermarkDataUrl?: string) => {
  if (!watermarkDataUrl) {
    return;
  }

  doc.addImage(watermarkDataUrl, "PNG", 56, 146, 500, 500, undefined, "FAST");
};

const drawHeader = (doc: jsPDF, tableHeight: number) => {
  doc.setFillColor(128, 128, 128);
  doc.rect(TABLE_X, TABLE_Y, TABLE_WIDTH, TABLE_HEADER_HEIGHT, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(245, 245, 245);

  let cursorX = TABLE_X;
  for (const column of COLUMNS) {
    doc.text(column.header, cursorX + CELL_PADDING_X, TABLE_Y + 12);
    cursorX += column.width;
  }

  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.rect(TABLE_X, TABLE_Y, TABLE_WIDTH, tableHeight);
};

const drawGrid = (doc: jsPDF, pageRows: TableRow[]) => {
  let y = TABLE_Y + TABLE_HEADER_HEIGHT;

  for (const row of pageRows) {
    y += row.height;
    doc.line(TABLE_X, y, TABLE_X + TABLE_WIDTH, y);
  }

  let x = TABLE_X;
  for (const column of COLUMNS.slice(0, -1)) {
    x += column.width;
    doc.line(x, TABLE_Y, x, y);
  }
};

const drawRows = (doc: jsPDF, pageRows: TableRow[]) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  let rowTop = TABLE_Y + TABLE_HEADER_HEIGHT;

  for (const row of pageRows) {
    let cellX = TABLE_X;

    row.cells.forEach((lines, index) => {
      const column = COLUMNS[index];
      const textY = rowTop + row.height - 10 - (lines.length - 1) * CELL_LINE_HEIGHT;

      doc.text(lines, cellX + CELL_PADDING_X, textY, {
        lineHeightFactor: CELL_LINE_HEIGHT / 10,
      });

      cellX += column.width;
    });

    rowTop += row.height;
  }
};

export const downloadCollegeListPdf = async ({
  results,
}: {
  results: CollegeResult[];
  filters?: CutoffRequest | null;
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const tableRows = results.map((college) => buildTableRow(doc, college));
  const pages = paginateRows(tableRows);

  let watermarkDataUrl: string | undefined;
  try {
    watermarkDataUrl = await loadImageWithOpacity(WATERMARK_PATH, 0.2);
  } catch (error) {
    console.warn("Unable to load the PDF background image.", error);
  }

  pages.forEach((pageRows, pageIndex) => {
    if (pageIndex > 0) {
      doc.addPage();
    }

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

    drawWatermark(doc, watermarkDataUrl);

    const tableHeight =
      TABLE_HEADER_HEIGHT + pageRows.reduce((total, row) => total + row.height, 0);

    drawHeader(doc, tableHeight);
    drawRows(doc, pageRows);
    drawGrid(doc, pageRows);
  });

  const dateTag = new Date().toISOString().slice(0, 10);
  doc.save(`cetrank-college-list-${dateTag}.pdf`);
};
