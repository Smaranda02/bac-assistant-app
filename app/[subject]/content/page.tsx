import TestModal from "@/components/testModal/TestModal";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function SubjectPage({params}: {params: { subject: string }; }) {
  const supabase = await createClient();

  const subjectId = decodeURIComponent((await params).subject);

  const { data: subject, error } = await supabase
    .from("Subjects")
    .select("name")
    .eq("id", subjectId)
    .single();

  const { data: materials, error: chaptersError } = await supabase
    .from("Materials")
    .select("id, chapterId, SubjectChapters(id, name)")
    .eq("subjectId", subjectId);

  const { data: tests, error: testErrors } = await supabase
    .from("PracticeTests")
    .select("id, name")
    .eq("subjectId", subjectId);

    // console.log(tests)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{subject?.name}</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Capitole</h2>
        {materials && materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {material.SubjectChapters?.name || "No chapter name"}
                </h3>
                <Link
                  href={`/${subjectId}/content/${material.SubjectChapters?.id}`}
                >
                  <p className="text-blue-600 hover:underline mt-4 block">
                    Vizualizeaza continutul pentru acest capitol
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Nu exista capitole disponibile pentru aceasta materie.
          </p>
        )}
      </div>

      <h1 className="mt-20 text-3xl font-bold mb-6">
        Teste pentru {subject?.name}
      </h1>
      {tests && tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {test.name}
              </h3>

              <TestModal test={test} /> 

            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tests available for this subject.</p>
      )}
    </div>
  );
}
