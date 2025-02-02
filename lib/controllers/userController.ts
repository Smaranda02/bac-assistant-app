import { createClient } from "@/utils/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user || !user.data.user?.email) {
    return null;
  }

  const {data: userData, error} = await supabase.from("Users")
    .select(`
      *,
      teacher:Teachers(*),
      student:Students(*)
    `)
    .eq("email", user.data.user.email)
    .single();

  if (error) {
    console.log(error);
  }

  return userData;
}
