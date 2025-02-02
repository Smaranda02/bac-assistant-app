import { createClient } from "@/utils/supabase/server";

export async function addCredits(studentId: number, amount: number) {
  const supabase = await createClient();
  const studentQuery = await supabase.from("Students").select("creditPoints").eq("id", studentId).single();

  if (studentQuery.error) {
    console.log(studentQuery.error);
    return false;
  }

  const result = await supabase.from("Students")
    .update({
      creditPoints: studentQuery.data.creditPoints + amount
    })
    .eq("id", studentId);

  if (result.error) {
    console.log(result.error);
    return false;
  }

  return true;
}
