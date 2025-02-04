"use server";

import { createClient } from "@/utils/supabase/server";
import { computeTestGrade } from "../utils";
import { getTestSubmission } from "../controllers/testController";
import { getCurrentUser } from "../controllers/userController";
import { notFound, redirect } from "next/navigation";
import { rewardCredits, testCredits } from "../config";
import { updateStudentCredits } from "../controllers/studentController";

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
  const user = await getCurrentUser();

  if (!user || !user.teacher) {
    return { error: "Utilizator invalid" };
  }

  if (!test.name || test.name.length == 0) {
    return { error: "Titlul este obligatoriu" };
  }

  if (test.questions.length === 0) {
    return { error: "Testul trebuie să conțină măcar un exercițiu" };
  }

  if (test.questions.some(q => !q.answer || !q.question || isNaN(q.points))) {
    return { error: "Câmpurile întrebării sunt obligatorii" };
  }

  const { error: dbError, data: testData } = await supabase.from("PracticeTests")
    .insert({
      name: test.name,
      subjectId: user.teacher.subjectId,
      teacherId: user.teacher.id
    })
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
    console.log(dbQuestionsError);
    return { error: "Eroare la adăugarea testului" };
  }

  return { success: "Testul a fost adăugat cu succes" };
}

export async function submitAnswersAction(testId: number, formData: FormData) {
  const supabase = await createClient();
  const answers = [];
  const formEntries = Array.from(formData.entries());
  const user = await getCurrentUser();

  if (!user || !user.student || user.student.creditPoints < testCredits) {
    return notFound();
  }

  for (const [key, value] of formEntries) {
    if (key.startsWith("answer_")) {
      answers.push({
        questionId: Number(key.replace("answer_", "")), // Extract the numeric ID from the key
        answer: value.toString()
      });
    }
  }

  const updateCreditsResult = await updateStudentCredits(user.student.id, -testCredits);
  if (!updateCreditsResult) {
    return redirect(`/student/take-test/${testId}?error=${encodeURIComponent("Nu s-au putut actualiza punctele credit. Te rugăm să reîncerci mai târziu.")}`);
  }

  const submissionInsert = await supabase.from("StudentsTests")
    .insert({
      studentId: user.student.id,
      testId
    })
    .select(`submissionId`)
    .single();

  if (submissionInsert.error) {
    console.log(submissionInsert.error);
    return redirect(`/student/take-test/${testId}?error=${encodeURIComponent("Nu s-au putut trimite răspunsurile. Te rugăm să reîncerci mai târziu.")}`);
  }

  const answersInsert = await supabase.from("QuestionsAnswersStudents").insert(
    answers.map((ans) => ({
      submissionId : submissionInsert.data.submissionId,
      questionId: ans.questionId,
      answer: ans.answer,
    })));

  if (answersInsert.error) {
    console.log("Error inserting answers:", answersInsert.error);
    return redirect(`/student/take-test/${testId}?error=${encodeURIComponent("Nu s-au putut trimite răspunsurile. Te rugăm să reîncerci mai târziu.")}`);
  }
  
  return redirect("/student");
}

export type Grading = {
  id: number;
  points: number;
  feedback: string;
}

export async function gradeTestAction(submissionId: number, grading: Array<Grading>) {
  const supabase = await createClient(); 
  
  const submissionData = await getTestSubmission(submissionId);
  if (!submissionData) {
    return { error: "Parametri incorecți" };
  }

  const grade = computeTestGrade(submissionData, grading);
  const creditsReceived = Math.floor((grade / 100) * rewardCredits);

  const gradeQuery = await supabase.from("StudentsTests")
    .update({
      grade,
      gradedAt: (new Date(Date.now())).toISOString(),
      creditsReceived
    })
    .eq("submissionId", submissionId);

  const pending = grading.map(g => supabase.from("QuestionsAnswersStudents")
    .update({
      points: g.points,
      feedback: g.feedback
    })
    .eq("questionId", g.id)
    .eq("submissionId", submissionId)
  );

  const results = await Promise.allSettled([...pending, gradeQuery]);

  // Check for error conditions
  if (results.some(r => r.status === "rejected" || r.value.error)) {
    console.log(results);
    return { error: "Eroare la salvare evaluare" };
  }

  // Update student credits based on received grade
  await updateStudentCredits(submissionData.student.id, creditsReceived);

  return { success: "Evaluarea a fost trimisă cu succes" };
}
