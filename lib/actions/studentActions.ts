"use server";

import { revalidatePath } from "next/cache";
import { updateStudentCredits } from "../controllers/studentController";


export async function buyCredits(studentId: number, amount: number) {
  const result = await updateStudentCredits(studentId, amount);
  revalidatePath('/student/profile')
  return result;
}
