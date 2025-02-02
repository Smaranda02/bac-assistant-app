import CancelTestModal from "@/components/cancelTestModel/CancelTestModel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitAnswersAction } from "@/lib/actions/testActions";
import { testCredits } from "@/lib/config";
import { getCurrentUser } from "@/lib/controllers/userController";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TestPage({ params }: { params: Promise<{ test: string }> }) {
  const supabase = await createClient();
  const { test } = await params;
  const testId = decodeURIComponent(test);
  const user = await getCurrentUser();
  if (!user || !user.student) {
    return notFound();
  }

  if (user.student.creditPoints < testCredits) {
    return (
      <Alert variant="destructive" className="bg-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Puncte credit insuficiente</AlertTitle>
        <AlertDescription>Pentru a susține un test ai nevoie de {testCredits} puncte credit.</AlertDescription>
        <AlertDescription>
          Poți cumpăra mai multe puncte credite de pe {" "}
          <Link href="/student/profile" className="font-medium hover:underline underline-offset-4">pagina de profil</Link>.
        </AlertDescription>
      </Alert>
    )
  }
  
  const testQuery = await supabase
    .from("PracticeTests")
    .select(`
      id,
      name,
      created_at,
      teacher:Teachers!inner(id, firstname, lastname),
      questions:QuestionsAnswers!inner(id, question, answer, points)
    `)
    .eq("id", testId)
    .single();

  if (testQuery.error) {
    console.log(testQuery.error);
    return notFound();
  }
  const testDetails = testQuery.data;
  const testQuestions = testQuery.data.questions;

  return (
    <main className="container mx-auto mt-10 px-4">
      {/* Test Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Test: {testDetails?.name}</h1>
          <p className="text-lg text-gray-600">
            Creat de: {testDetails.teacher.firstname} {testDetails.teacher.lastname}
          </p>
        </div>
        <p className="text-gray-500 text-sm">
          Creat pe:{" "}
          <span className="font-semibold">
            {formatDate(testDetails.created_at)}
          </span>
        </p>
      </div>

      {/* Form for Submitting Answers */}
      <form action={submitAnswersAction.bind(null, parseInt(testId))} className="space-y-8 mt-8">
        {testQuestions.map((question, index) => (
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
        ))}

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
