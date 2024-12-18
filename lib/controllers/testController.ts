import { createClient } from "@/utils/supabase/server";

export type TestSubmission = {
  id: number;
  student: {
    id: number;
    firstname: string | null;
    lastname: string | null;
  };
  questions: {
    studentAnswer: string;
    id: number;
    question: string;
    answer: string;
    points: number;
  }[];
  name: string;
  teacherId: number;
}

export async function getTestSubmission(testId: number, studentId: number): Promise<TestSubmission | null> {
  const supabase = await createClient();
  const studentQuery =  await supabase.from("Students")
    .select(`id, firstname, lastname`)
    .eq("id", studentId)
    .single();

  if (studentQuery.error) {
    console.error(studentQuery.error);
  }

  const testQuery = await supabase.from("PracticeTests")
    .select(`
      id,
      name,
      teacherId,
      questions:QuestionsAnswers!inner(
        id,
        question,
        answer,
        points,
        studentAnswer:QuestionsAnswersStudents!inner(
          answer
        )
      )
    `)
    .eq("id", testId)
    .eq(
      "questions.QuestionsAnswersStudents.studentId",
      studentId,
    )
    .single();

  if (testQuery.error) {
    console.error(testQuery.error);
  }

  if (!studentQuery.data || !testQuery.data) {
    return null;
  }

  // Map studentAnswer to one to one relationship
  return {
    ...testQuery.data,
    student: {
      ...studentQuery.data
    },
    questions: testQuery.data.questions.map(q => ({...q, studentAnswer: q.studentAnswer[0].answer}))
  }
}
