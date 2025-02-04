import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { editMaterialAction } from "@/lib/actions/contentActions";
import { getDocument } from "@/lib/controllers/contentController";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/forms/submit-button";

type PageParams = {
  documentId: number;
}

type PageProps = {
  params: Promise<PageParams>;
}

export default async function AdminEditDocumentPage({ params }: PageProps) {
  const { documentId } = await params;
  const document = await getDocument(documentId);
  if (!document) {
    return notFound();
  }

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-chapter/${document.chapterId}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Modifică documentul {document.name}</h2>
      </div>
      <form action={editMaterialAction.bind(null, documentId)} className="mx-10 mt-5 bg-white p-6 border rounded">
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="title">Titlu</Label>
          <Input type="text" name="title" id="title" defaultValue={document.name} required />
        </div>
        <div className="mb-3">
          <Button variant="link" asChild>
            <Link href={document.contentURL} target="_blank">Deschide documentul »</Link>
          </Button>
        </div>

        <SubmitButton type="submit">Salvează documentul</SubmitButton>
      </form>
    </section>
  );
}
