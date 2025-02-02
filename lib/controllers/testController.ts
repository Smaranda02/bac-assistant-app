import { createClient } from "@/utils/supabase/server";

export type TestSubmission = {
  submissionId: number;
  test: {
    id: number;
    name: string;
    teacherId: number;
  };
  student: {
    id: number;
    firstname: string | null;
    lastname: string | null;
  };
  questions: {
    id: number;
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    points: number;
  }[];
}

export async function getTestData(testId: number) {
  const supabase = await createClient();
  const testQuery = await supabase.from("PracticeTests")
    .select(`
      id,
      name,
      teacher:Teachers!inner(
        firstname,
        lastname
      ),
      questions:QuestionsAnswers!inner(
        id,
        question,
        answer,
        points
      )
    `)
    .eq("id", testId)
    .single();
  
  if (testQuery.error) {
    console.log(testQuery.error)
    return null;
  }

  return testQuery.data;
}

export async function getTestSubmission(submissionId: number): Promise<TestSubmission | null> {
  const supabase = await createClient();

  const testQuery = await supabase.from("StudentsTests")
    .select(`
      submissionId,
      submittedAt,
      test:PracticeTests!inner(
        id,
        name,
        teacherId
      ),
      student:Students!inner(
        id,
        firstname,
        lastname
      ),
      questions:QuestionsAnswersStudents!inner(
        studentAnswer:answer,
        ...QuestionsAnswers!inner(
          id,
          question,
          correctAnswer:answer,
          points
        )
      )
    `)
    .eq('submissionId', submissionId)
    .single();

  if (testQuery.error) {
    console.error(testQuery.error);
    return null;
  }

  return testQuery.data;
}
