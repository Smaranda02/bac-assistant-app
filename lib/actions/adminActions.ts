"use server"

import { createClient } from "@/utils/supabase/server";
import { Roles, UserMetadata } from "../controllers/authController";
import { revalidatePath } from "next/cache";

export async function confirmTeacherAction(teacherId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || (user.user_metadata as UserMetadata).role !== Roles.Admin) {
    return;
  }

  const confirmTeacherQuery = await supabase.from("Teachers")
    .update({
      confirmed: true 
    })
    .eq("id", teacherId);

  if (confirmTeacherQuery.error) {
    console.log("Confirm teacher account", confirmTeacherQuery.error);
    return;
  }

  return revalidatePath("/admin/confirm-teachers");
}
