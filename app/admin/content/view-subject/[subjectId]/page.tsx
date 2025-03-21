import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getSubjectContent } from "@/lib/controllers/contentController";
import { notFound } from "next/navigation";
import { deleteChapterAction } from "@/lib/actions/contentActions";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";

type PageParams = {
  subjectId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function AdminViewSubjectPage({ params }: PageProps) {
  const { subjectId } = await params;
  const subject = await getSubjectContent(subjectId);
  if (!subject) {
    return notFound();
  }

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href="/admin/content" className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Capitole pentru materia {subject.name}</h2>
        <Button size="sm" variant="default" asChild>
          <Link href={`/admin/content/create-chapter/${subjectId}`}>
            Adaugă capitol
          </Link>
        </Button>
      </div>
      {subject.chapters.map(c => (
        <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`subject-${c.id}`}>
          <span>{c.name}</span>
          <Button size="sm" className="ml-auto" variant="secondary" asChild>
            <Link href={`/admin/content/view-chapter/${c.id}`}>
              Vezi Documente
            </Link>
          </Button>
          <Button size="sm" className="" variant="secondary">
            <Link href={`/admin/content/edit-chapter/${c.id}`}>
              Editează
            </Link>
          </Button>
          <DeleteDialog itemName={`capitolul ${c.name}`} action={deleteChapterAction.bind(null, c.id)}>
            Șterge
          </DeleteDialog>
        </div>
      ))}
      {subject.chapters.length == 0 && (
        <div className="text-muted-foreground text-center my-4">Nu există niciun capitol.</div>
      )}
    </section>
  )
}