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

export async function getRecentTests() {
  const supabase = await createClient();
  const recentTests = await supabase.from("PracticeTests")
    .select(`
      id,
      name,
      created_at,
      subject:Subjects!inner(
        id,
        name
      )
    `)
    .gte("created_at", new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString());

  if (recentTests.error) {
    console.log("Recent tests", recentTests.error);
    return [];
  }

  return recentTests.data;
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
    console.log(testQuery.error);
    return null;
  }

  return testQuery.data;
}

export async function getGradedSubmission(submissionId: number, studentId: number) {
  const supabase = await createClient();
  const testQuery = await supabase.from("StudentsTests")
    .select(`
      submissionId,
      grade,
      gradedAt,
      creditsReceived,
      test:PracticeTests!inner(
        id,
        name,
        teacher:Teachers!inner(
          firstname,
          lastname
        ),
        subject:Subjects!inner(
          id,
          name
        )
      ),
      questions:QuestionsAnswersStudents!inner(
        studentAnswer:answer,
        feedback,
        points,
        ...QuestionsAnswers!inner(
          id,
          question,
          correctAnswer:answer,
          totalPoints:points
        )
      )
    `)
    .eq('submissionId', submissionId)
    .eq('studentId', studentId)
    .single();

  if (testQuery.error) {
    console.log(testQuery.error);
    return null;
  }

  if (!testQuery.data.grade || !testQuery.data.gradedAt) {
    return null;
  }

  return testQuery.data;
}
