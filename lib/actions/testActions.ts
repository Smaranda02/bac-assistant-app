"use server";

import { createClient } from "@/utils/supabase/server";

export type Test = {
  name: string;
  questions: Array<TestQuestion>
}

export type TestQuestion = {
  question: string;
  answer: string;
  points: number;
}

export async function createTestAction(test: Test) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user || !user.data.user) {
    return { error: "Utilizator invalid" };
  }

  const teacher = await supabase.from("Teachers")
    .select("id, Users!inner(email), subjectId")
    .eq("Users.email", user.data.user.email!);

  if (!teacher.data || teacher.data.length != 1) {
    return { error: "Utilizator invalid" };
  }

  const {
    error: dbError,
    data: testData
  } = await supabase.from("PracticeTests")
    .insert([
      {
        name: test.name,
        subjectId: teacher.data[0].subjectId,
        teacherId: teacher.data[0].id
      }
    ])
    .select("id");

  if (dbError || !testData || testData.length != 1) {
    console.log(dbError);
    return { error: "Eroare la adăugarea testului" };
  }

  const { error: dbQuestionsError } = await supabase.from("QuestionsAnswers")
    .insert(
      test.questions.map(item => 
        ({...item, testId: testData[0].id })
      )
    );

  if (dbQuestionsError) {
    return { error: "Eroare la adăugarea testului" };
  }

  return { success: "Testul a fost adăugat cu succes" };
}

export type Grading = {
  id: number;
  points: number;
  feedback: string;
}

export async function gradeTestAction(testId: number, studentId: number, grade: number, grading: Array<Grading>) {
  const supabase = await createClient(); 
  
  // FIXME: compute grade on backend for better security
  const gradeQuery = await supabase.from("StudentsTests")
    .update({
      testId,
      studentId,
      grade
    })
    .eq("studentId", studentId)
    .eq("testId", testId);

  // FIXME: error handling
  // if (gradeQuery.error) {
  //   return { error: "Testul a fost deja evaluat" };
  // }

  // FIXME: backend check for grading integrity (not already graded and invalid points)  
  const pending = grading.map(g => supabase.from("QuestionsAnswersStudents")
    .update({
      points: g.points,
      feedback: g.feedback
    })
    .eq("questionId", g.id)
    .eq("studentId", studentId)
  );

  const results = await Promise.allSettled([...pending, gradeQuery]);

  // Check for error conditions
  if (results.some(r => r.status === "rejected" || r.value.error)) {
    // FIXME: rolling back partial operation
    console.log(results);
    return { error: "Eroare la salvare evaluare" };
  }

  return { success: "Evaluarea a fost trimisă cu succes" };
}
