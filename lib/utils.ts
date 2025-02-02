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

export function formatDate(date: string) {
  const dateObj = new Date(date);

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}
