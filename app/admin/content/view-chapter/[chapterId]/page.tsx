import { Button } from "@/components/ui/button";
import { getChapterContent } from "@/lib/controllers/contentController";
import { getFileName } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type PageParams = {
  chapterId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function AdminViewChapterPage({ params }: PageProps) {
  const { chapterId } = await params;
  const chapter = await getChapterContent(chapterId);
  if (!chapter) {
    return null;
  }

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-subject/${chapter.subjectId}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Documente în capitolul {chapter.name}</h2>
        <Button size="sm" variant="default" asChild>
          <Link href={`/admin/content/create-document/${chapter.subjectId}`}>
            Adaugă document
          </Link>
        </Button>
      </div>
      {chapter.documents.map(d => (
        <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`subject-${d.id}`}>
          <span>{d.name}</span>
          <Button size="sm" className="ml-auto" variant="secondary" asChild>
            <Link href={d.contentURL}>
              Vizualizare
            </Link>
          </Button>
        </div>
      ))}
      {chapter.documents.length == 0 && (
        <div className="text-muted-foreground text-center my-4">Nu există niciun document.</div>
      )}
    </section>
  )
}
