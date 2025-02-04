import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editSubjectAction } from "@/lib/actions/contentActions";
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

export default async function AdminEditSubjectPage({ params }: PageProps) {
  const { subjectId } = await params;
  const subject = await getSubjectContent(subjectId);
  if (!subject) {
    return notFound();
  }

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Editează materia {subject.name}</h2>
      </div>
      <form action={editSubjectAction.bind(null, subjectId)} className="mx-10 mt-5 bg-white p-6 border rounded">
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="name">Nume materie</Label>
          <Input placeholder="Nume materie" id="name" name="name" defaultValue={subject.name} required />
        </div>
        <SubmitButton type="submit">Modifică materie</SubmitButton>
      </form>
    </section>
  );
}
