import { createClient } from "@/utils/supabase/server";

export async function getSubjectById(id: number) {
  const supabase = await createClient();
  const { data: subject, error } = await supabase
    .from("Subjects")
    .select("name")
    .eq("id", id)
    .single();
  return subject?.name;
}

