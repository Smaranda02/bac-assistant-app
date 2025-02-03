import { createClient } from "@/utils/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user || !user.data.user?.email) {
    return null;
  }

  const userQuery = await supabase.from("Users")
    .select(`
      *,
      teacher:Teachers(*),
      student:Students(*)
    `)
    .eq("email", user.data.user.email)
    .single();

  if (userQuery.error) {
    console.log("Get current user", userQuery.error);
  }

  return userQuery.data;
}

export async function getAllUsers() {
  const supabase = await createClient();

  const teachersQuery = await supabase.from("Teachers")
    .select(`
      *,
      subject:Subjects!inner(name),
      createdTests:PracticeTests(id)
    `, {
      count:"exact"
    });
  console.log(teachersQuery.data);

  const studentsQuery = await supabase.from("Students").select("*");

  if (teachersQuery.error) {
    console.log("Get all teachers", teachersQuery.error);
    return null;
  }

  if (studentsQuery.error) {
    console.log("Get all students", studentsQuery.error);
    return null;
  }

  return {
    students: studentsQuery.data,
    teachers: teachersQuery.data
  }
}
