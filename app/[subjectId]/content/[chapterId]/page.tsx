import Link from "next/link";
import { getChapterContent } from "@/lib/controllers/contentController";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getFileName } from "@/lib/utils";

type PageParams = {
  subjectId: number;
  chapterId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function ChapterPage({ params }: PageProps) {
  const { subjectId, chapterId } = await params;

  const chapter = await getChapterContent(chapterId)
  if (!chapter) {
    return notFound();
  }

  return (
    <>
      <div className="mt-6 mb-6 flex items-center">
        <Link href={`/${subjectId}/content`}>
          <ChevronLeft className="h-9 w-9 p-1 hover:bg-gray-200 rounded-full mr-2"></ChevronLeft>
        </Link>
        <h1 className="text-3xl font-bold">Capitol {chapter.name}</h1>
      </div>
      {chapter.documents.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {chapter.documents.map((material, index) => (
            <Link
                key={index}
                href={material.contentURL}
                target="_blank"
                rel="noopener noreferrer"
              >
              <div className="p-5 cursor-pointer bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800">
                  Document {material.name}
                </h3>
                <Button variant="secondary" className="w-full my-4 mb-0">Deschide documentul</Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-2">
          <p>Nu există materiale disponibile pentru acest capitol.</p>
        </div>
      )}
    </>
  );
}