import CancelTestModal from "@/components/cancelTestModel/CancelTestModel";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
// import { submitAnswersAction } from "@/lib/actions/submitAnswersActions";
import { redirect } from "next/navigation";


async function submitAnswersAction (testId: number, formData: FormData) {

  'use server'

  const supabase = await createClient();
  const answers = [];
  const formEntries = Array.from(formData.entries());

  const {data: {user} } = await supabase.auth.getUser();

  const studentEmail = user?.user_metadata?.email;
  
    const {data: userDetails, error: err} = await supabase 
    .from("Users")
    .select("id")
    .eq("email", studentEmail)
    .single();

    const userId = userDetails?.id || 0;

    const {data: userData, error: userError} = await supabase 
      .from("Students")
      .select("id")
      .eq("userId", userId)
      .single();

    const studentId = userData?.id || 0;

  for (const [key, value] of formEntries) {
    if (key.startsWith("answer_")) {
      const questionId = Number(key.replace("answer_", "")); // Extract the numeric ID from the key
      answers.push({ questionId, answer: value as string });
    }
  }

  const { data: submission, error:dbInsertError } = await supabase.from("StudentsTests")
    .insert({
      studentId: studentId,
      testId
    })
    .select(`submissionId`)
    .single();

  // FIXME: error checking
  if (dbInsertError) {
    console.log(dbInsertError);
    return;
  }

  const { error:dbError } = await supabase.from("QuestionsAnswersStudents").insert(
    answers.map((ans) => ({
      submissionId : submission.submissionId,
      questionId: ans.questionId,
      answer: ans.answer,
    })));

  if (dbError) {
    console.error("Error inserting answers:", dbError.message);
    //add redirect to page with error 
  }
  
  else {
    redirect("/generic-pages/submission-success");
  }
}


export default async function TestPage({ params }: { params: Promise<{ test: string }> }) {

  const supabase = await createClient();
  const {test} = await params;
  const testId = decodeURIComponent(test);
  let isSubmitting = false;
  
  const { data: testDetails, error } = await supabase
      .from("PracticeTests")
      .select("id, name, created_at, Teachers(id, firstname, lastname)")
      .eq("id", testId)
      .single();

  const {data: testQuestions, error: testError} = await supabase 
      .from("QuestionsAnswers")
      .select("id, question, answer, points")
      .eq("testId", testId);

    // const { name: testName, created_at: createdAt, Teachers: teacher } = testDetails;
    // const teacherName = teacher ? `${teacher.firstname} ${teacher.lastname}` : "Unknown Teacher"


  return (
    <main className="container mx-auto mt-10 px-4">
      {/* Test Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Test: {testDetails?.name}</h1>
          <p className="text-lg text-gray-600">
            Creat de:{" "}
            {testDetails?.Teachers
              ? `${testDetails.Teachers.firstname} ${testDetails.Teachers.lastname}`
              : "Necunoscut"}
          </p>
        </div>
        <p className="text-gray-500 text-sm">
          Creat pe:{" "}
          <span className="font-semibold">
            {new Date(testDetails?.created_at || "1970-01-01").toLocaleDateString()}
          </span>
        </p>
      </div>

      {/* Form for Submitting Answers */}
      <form action={submitAnswersAction.bind(null, parseInt(testId))} className="space-y-8 mt-8">
        {(testQuestions ?? []).length > 0  ? (
          testQuestions?.map((question, index) => (
            <div
              key={question.id}
              className="flex flex-col md:flex-row items-start bg-gray-100 p-6 rounded-lg shadow"
            >

              <div className="flex-1 mb-4 md:mb-0">
                <h2 className="text-lg font-semibold mb-2">
                  Întrebare {index + 1}
                </h2>
                <p className="text-gray-800">{question.question}</p>

                <input
                  type="text"
                  name={`answer_${question.id}`} // Unique name for each input
                  placeholder="Scrie răspunsul aici..."
                  className="mt-4 w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:w-1/4 flex justify-end items-center">
                <p className="text-sm font-medium text-gray-600">
                  Puncte:{" "}
                  <span className="text-xl font-bold text-blue-600">
                    {question.points}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Nu sunt întrebări disponibile pentru acest test.
          </p>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
          >
            Trimite răspunsurile
          </button>
        </div>
      </form>

      <div className="text-center mt-8">
        <CancelTestModal></CancelTestModal>
      </div>
    </main>
  );
}
