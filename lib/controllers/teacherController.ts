import { createClient } from "@/utils/supabase/server";

export async function getTeacherTests(teacherId: number) {
  const supabase = await createClient();
  const query = await supabase.from("PracticeTests")
    .select(`
      id,
      name,
      created_at
    `)
    .eq("teacherId", teacherId)
    .order("created_at", {
      ascending: true
    });
  
  if (query.error) {
    console.log(query.error);
    return [];
  }

  return query.data;
}

export async function getTeacherUngradedSubmissions(teacherId: number) {
  const supabase = await createClient();
  const query = await supabase.from("StudentsTests")
    .select(`
      submissionId,
      submittedAt,
      student:Students!inner(
        id,
        firstname,
        lastname
      ),
      test:PracticeTests!inner(
        id,
        name,
        teacherId
      ),
      grade
    `)
    .eq('PracticeTests.teacherId', teacherId)
    .is('grade', null)
    .order('submittedAt', {
      ascending: true
    });
  
    if (query.error) {
      console.log(query.error);
      return [];
    }

    return query.data;
}