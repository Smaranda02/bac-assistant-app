import { createClient } from "@/utils/supabase/server";

export async function getStudentTestResults(studentId: number) {
  const supabase = await createClient();
  const gradedTests = await supabase.from("StudentsTests")
    .select(`
      *,
      ...PracticeTests!inner(
        name,
        ...Subjects!inner(subjectName:name)
      )
    `)
    .eq("studentId", studentId)
    .not("grade", "is", null);

  if (gradedTests.error) {
    console.log("Graded tests", gradedTests.error);
    return [];
  }

  return gradedTests.data;
}
