"use server";

import { updateStudentCredits } from "../controllers/studentController";


export async function buyCredits(studentId: number, amount: number) {
  const result = await updateStudentCredits(studentId, amount);
  return result;
}
