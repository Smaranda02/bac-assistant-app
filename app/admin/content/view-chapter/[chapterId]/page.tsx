import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const documents = [
  {name: "Algebră", id: 0},
  {name: "Geometrie", id: 1}
]

export default function AdminViewSubjectPage() {
  return (
    <section className="my-3">
      <div className="flex items-center mb-2">
        <Link href={`/admin/content/view-subject/${1}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Documente în capitolul x</h2>
        <Button size="sm" variant="default" asChild>
          <Link href={`/admin/content/create-document/${1}`}>
            Adaugă document
          </Link>
        </Button>
      </div>
      {documents.map(d => (
        <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`subject-${d.id}`}>
          <span>{d.name}</span>
          <Button size="sm" className="ml-auto" variant="secondary" asChild>
            <Link href={``}>
              Vizualizare
            </Link>
          </Button>
        </div>
      ))}
      {documents.length == 0 && (
        <div className="text-muted-foreground my-2">Nu există niciun document.</div>
      )}
    </section>
  )
}
