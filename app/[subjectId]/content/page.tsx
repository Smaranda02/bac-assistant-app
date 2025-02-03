import TakeTestDialog from "@/components/dialogs/take-test-dialog";
import { Button } from "@/components/ui/button";
import { getSubjectContent } from "@/lib/controllers/contentController";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageParams = {
  subjectId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function SubjectPage({ params }: PageProps) {
  const { subjectId } = await params;
  const subject = await getSubjectContent(subjectId);
  if (!subject) {
    return notFound();
  }

  return (
    <>
      {/* <h1 className="text-3xl font-bold mt-8 mb-6">{subject.name}</h1> */}
      <div className="mt-6 mb-6 flex items-center">
        <Link href={`/`}>
          <ChevronLeft className="h-9 w-9 p-1 hover:bg-gray-200 rounded-full mr-2" />
        </Link>
        <h1 className="text-3xl font-bold">{subject.name}</h1>
      </div>
      <section className="my-4">
        <h2 className="text-2xl font-semibold mb-4">Capitole</h2>
        {subject.chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/${subjectId}/content/${chapter.id}`}
              >
                <div className="p-5 cursor-pointer bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {chapter.name}
                  </h3>
                  <Button variant="secondary" className="w-full my-4 mb-0">Vizualizează conținut</Button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-2">
            Nu există capitole disponibile pentru aeastă materie.
          </p>
        )}
      </section>

      <section className="my-4">
        <h2 className="text-2xl font-semibold mb-4">Teste</h2>
        {subject.tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.tests.map((test) => (
              <TakeTestDialog
                key={test.id}
                test={test}
              >
                <div className="p-5 cursor-pointer bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {test.name}
                  </h3>
                  <Button variant="secondary" className="w-full my-4 mb-0">Susține test</Button>
                </div>
              </TakeTestDialog>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-2">
            <p>Nu există teste disponibile pentru această materie.</p>
          </div>
        )}
      </section>
    </>
  );
}
