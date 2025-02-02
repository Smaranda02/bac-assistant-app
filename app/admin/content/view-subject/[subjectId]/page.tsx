import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminViewSubjectPage({params}: {params: { subjectId: string } }) {

  const supabase = await createClient();
  const subjectId = decodeURIComponent((await params).subjectId);

  const { data: subject, error } = await supabase
    .from("Subjects")
    .select("name")
    .eq("id", subjectId)
    .single();

  const { data: chapters, error: chaptersError } = await supabase
    .from("SubjectChapters")
    .select("id, name")
    .eq("subjectId", subjectId)
    ;

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href="/admin/content" className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Capitole pentru materia {subject?.name}</h2>
        <Button size="sm" variant="default" asChild>
          <Link href={`/admin/content/create-chapter/${subjectId}`}>
            Adaugă capitol
          </Link>
        </Button>
      </div>
      {chapters?.map(c => (
        <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`subject-${c.id}`}>
          <span>{c.name}</span>
          <Button size="sm" className="ml-auto" variant="secondary" asChild>
            <Link href={`/admin/content/view-chapter/${c.id}`}>
              Documente
            </Link>
          </Button>
        </div>
      ))}
      {chapters?.length == 0 && (
        <div className="text-muted-foreground my-2">Nu există niciun capitol.</div>
      )}
    </section>
  )
}