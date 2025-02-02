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

export async function getStudent(email: string) {
  const supabase = await createClient();
  const { data: student, error } = await supabase.from('Students')
    .select(`
      id,
      firstname,
      lastname,
      creditPoints,
      ...Users!inner(
        email
      )
    `)
    .eq('Users.email', email)
    .single();

  if (error || !student) {
    console.log(error)
    return null;
  }

  return student;
}
