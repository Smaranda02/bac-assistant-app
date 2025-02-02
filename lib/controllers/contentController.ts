import { createClient } from "@/utils/supabase/server";

export async function getSubjects() {
  const supabase = await createClient();
  
  const subjects = await supabase.from("Subjects")
    .select("*");
  
  if (subjects.error) {
    console.log("Subjects", subjects.error);
    return [];
  }

  return subjects.data;
}
