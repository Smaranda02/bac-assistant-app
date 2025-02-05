import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TestSubmission } from "./controllers/testController";
import { Grading } from "./actions/testActions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeTestGrade(testData: TestSubmission, questionPoints: Array<Grading>) {
  const gradedPoints = questionPoints.reduce((total, g) => !isNaN(g.points) ? total + g.points : total, 0)
  const totalPoints = testData.questions.reduce((total, q) => total + q.points, 0);

  return gradedPoints * 100 / totalPoints;
}

export function getFileName(url: string | null) {
  if (!url) {
    return "Unknown file";
  } 

  const fullName =  url.split('/').pop() || "Unknown file";
  const cleanName = fullName.split('.')[0];
  const noSpaceFileName = cleanName.replace(/%20/g, "_");
  return noSpaceFileName || "Unknown file";
};

export function formatDate(date: string) {
  const dateObj = new Date(date);

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

interface DataItem {
  data: string;  // ISO date format, e.g., "2025-01-01"
}

interface GroupedData {
  week: string;
  total: number;
}

interface MergedData {
  week: string;
  total1: number;
  total2: number;
}

export function getISOWeekYear(dateStr: string): string {
  const date = new Date(dateStr);

  // Move to Thursday of the current week (ISO 8601 starts with Monday)
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  // Start of the year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  // Compute ISO week number
  const weekNumber = Math.ceil(((date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000) + 1) / 7);

  return `${date.getUTCFullYear()}-W${weekNumber}`;
}

export function groupByWeekAndSum(data: DataItem[]): GroupedData[] {
  const groupedData: Record<string, GroupedData> = {};

  data.forEach(item => {
    const weekKey = getISOWeekYear(item.data);

    if (!groupedData[weekKey]) {
      groupedData[weekKey] = { week: weekKey, total: 0 };
    }
    groupedData[weekKey].total++;
  });

  return Object.values(groupedData);
}

// Generate the last N weeks including current
export function generateLastNWeeks(n: number): string[] {
  const today = new Date();
  const weeks: string[] = [];
  for (let i = 0; i < n; i++) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i * 7);
    weeks.unshift(getISOWeekYear(pastDate.toString())); // Insert at the start for ascending order
  }
  return weeks;
}

// Include all last N weeks with empty data filled
export function fillMissingWeeks(data: MergedData[], weeks: string[]): MergedData[] {
  const dataMap: Record<string, MergedData> = data.reduce((acc, item) => {
    acc[item.week] = item;
    return acc;
  }, {} as Record<string, MergedData>);

  return weeks.map(week => dataMap[week] || { week, total1: 0, total2: 0 });
}

export function getMonthRangeString(firstWeek: string, lastWeek: string, locale: string = "en-US"): string {
  // Extract year and week from strings
  const [firstYear, firstWeekNo] = firstWeek.split("-W").map(Number);
  const [lastYear, lastWeekNo] = lastWeek.split("-W").map(Number);

  // Get date objects from ISO year and week
  const getDateFromISOWeek = (year: number, week: number): Date => {
    const date = new Date(year, 0, (week - 1) * 7);
    const dayOffset = 4 - (date.getUTCDay() || 7); // Ensure Monday alignment
    date.setUTCDate(date.getUTCDate() + dayOffset);
    return date;
  };

  const startDate = getDateFromISOWeek(firstYear, firstWeekNo);
  const endDate = getDateFromISOWeek(lastYear, lastWeekNo);

  // Format months and years in the given locale
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });

  const startString = monthFormatter.format(startDate);
  const endString = monthFormatter.format(endDate);

  return `${startString} - ${endString}`;
}

export function mergeWeeklyData(
  data1: GroupedData[],
  data2: GroupedData[],
  key1: keyof MergedData,
  key2: keyof MergedData
): MergedData[] {
  const mergedMap: Record<string, MergedData> = {};

  // Process the first dataset
  data1.forEach(item => {
    if (!mergedMap[item.week]) {
      mergedMap[item.week] = { week: item.week, total1: 0, total2: 0 };
    }
    (mergedMap[item.week][key1] as number) += item.total;
  });

  // Process the second dataset
  data2.forEach(item => {
    if (!mergedMap[item.week]) {
      mergedMap[item.week] = { week: item.week, total1: 0, total2: 0 };
    }
    (mergedMap[item.week][key2] as number) = item.total;
  });

  return Object.values(mergedMap);
}
