"use server";

import { createClient } from "@/utils/supabase/server";
import { computeTestGrade } from "../utils";
import { getTestSubmission } from "../controllers/testController";
import { getCurrentUser } from "../controllers/userController";
import { notFound, redirect } from "next/navigation";
import { testCredits } from "../config";

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

  const studentCreditsUpdate = await supabase.from("Students")
    .update({
      creditPoints: user.student.creditPoints - testCredits
    })
    .eq("id", user.student.id);

  if (studentCreditsUpdate.error) {
    console.log("Update student credits", studentCreditsUpdate.error);
    return; // FIXME: redirect cu query params pentru erori
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
    return; // FIXME: redirect cu query params pentru erori
  }

  const answersInsert = await supabase.from("QuestionsAnswersStudents").insert(
    answers.map((ans) => ({
      submissionId : submissionInsert.data.submissionId,
      questionId: ans.questionId,
      answer: ans.answer,
    })));

  if (answersInsert.error) {
    console.error("Error inserting answers:", answersInsert.error);
    return; // FIXME: redirect cu query params pentru erori
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
  
  // FIXME: compute grade on backend for better security
  const submissionData = await getTestSubmission(submissionId);
  if (!submissionData) {
  return { error: "Parametri incorecți" };
  }

  const grade = computeTestGrade(submissionData, grading);

  const gradeQuery = await supabase.from("StudentsTests")
    .update({
      grade
    })
    .eq("submissionId", submissionId);

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
    .eq("submissionId", submissionId)
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
