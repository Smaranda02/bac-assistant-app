import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const chapters = [
  {name: "Algebră", id: 0},
  {name: "Geometrie", id: 1}
]

export default function AdminViewSubjectPage() {
  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href="/admin/content" className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Capitole pentru materia x</h2>
        <Button size="sm" variant="default" asChild>
          <Link href={`/admin/content/create-chapter/${1}`}>
            Adaugă capitol
          </Link>
        </Button>
      </div>
      {chapters.map(c => (
        <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`subject-${c.id}`}>
          <span>{c.name}</span>
          <Button size="sm" className="ml-auto" variant="secondary" asChild>
            <Link href={`/admin/content/view-chapter/${1}`}>
              Documente
            </Link>
          </Button>
        </div>
      ))}
      {chapters.length == 0 && (
        <div className="text-muted-foreground my-2">Nu există niciun capitol.</div>
      )}
    </section>
  )
}