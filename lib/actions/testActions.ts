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
