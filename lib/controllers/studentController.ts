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
    .not("grade", "is", null)
    .order("gradedAt", {
      ascending: false
    });

  if (gradedTests.error) {
    console.log("Graded tests", gradedTests.error);
    return [];
  }

  return gradedTests.data;
}

export async function updateStudentCredits(studentId: number, amount: number) {
  const supabase = await createClient();
  
  // Query student for current credits
  const studentQuery = await supabase.from("Students")
    .select("creditPoints")
    .eq("id", studentId)
    .single();

  if (studentQuery.error) {
    console.log("Student credits query", studentQuery.error);
    return false;
  }

  if (studentQuery.data.creditPoints - amount < 0) {
    console.log("Invalid credits amount");
    return false;
  }

  // Update student credits
  const result = await supabase.from("Students")
    .update({
      creditPoints: studentQuery.data.creditPoints + amount
    })
    .eq("id", studentId);

  if (result.error) {
    console.log("Update student credits", result.error);
    return false;
  }

  return true;
}
