// 'use client';

import { createClient } from "@/utils/supabase/server";

export default async function TestPage({ params }: { params: { test: string } }) {

  const supabase = await createClient();
  const testId = decodeURIComponent(params.test);
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
    // const teacherName = teacher ? `${teacher.firstname} ${teacher.lastname}` : "Unknown Teacher";

    const handleSubmit = async () => {
      isSubmitting = true;
    }

  return (
    <>
      <main className="container mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Test {testDetails?.name}</h1>
          <p className="text-lg text-gray-600 font-medium">Creat de : {`${testDetails?.Teachers?.firstname} ${testDetails?.Teachers?.lastname}`}</p>
        </div>

        <div className="text-gray-500 text-sm">
          <p>
            Creat pe :{" "}
            <span className="font-semibold">{new Date(testDetails?.created_at || '1970-01-01').toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      <div className="space-y-8">
          {(testQuestions ?? []).length > 0 ? (
            testQuestions?.map((question, index) => (
              <div
                key={question.id}
                className="flex flex-col md:flex-row items-start md:items-center bg-gray-100 p-6 rounded-lg shadow"
              >
                {/* Left: Question */}
                <div className="flex-1 mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold mb-2">Intrebare {index + 1}</h2>
                  <p className="text-gray-800">{question.question}</p>
                  {/* Student Input */}
                  <input
                    type="text"
                    placeholder="Scrie raspunsul aici..."
                    className="mt-4 w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Right: Points */}
                <div className="md:w-1/4 flex justify-end items-center">
                  <p className="text-sm font-medium text-gray-600">
                    Puncte: <span className="text-xl font-bold text-blue-600">{question.points}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Nu sunt intrebari disponibile pentru acest test</p>
          )}
        </div>

        <div className="text-center mt-8">
        <button
          // onClick={handleSubmit}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Trimite raspunsurile
        </button>
      </div>
    </main>
    </>
  );
}
