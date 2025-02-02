"use server";

import { addCredits } from "../controllers/creditsController";


export async function buyCredits(studentId: number, amount: number) {
  const result = await addCredits(studentId, amount);
  return result;
}
