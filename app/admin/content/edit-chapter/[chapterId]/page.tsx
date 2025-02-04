import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { editChapterAction } from "@/lib/actions/contentActions";
import { getChapterContent, getSubjectContent } from "@/lib/controllers/contentController";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/forms/submit-button";

type PageParams = {
  chapterId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function AdminEditChapterPage({ params }: PageProps) {
  const { chapterId } = await params;
  const chapter = await getChapterContent(chapterId);
  if (!chapter) {
    return notFound();
  }

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-subject/${chapterId}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Editează capitolul {chapter.name}</h2>
      </div>
      <form action={editChapterAction.bind(null, chapterId)} className="mx-10 mt-5 bg-white p-6 border rounded">
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="name">Nume capitol</Label>
          <Input placeholder="Nume capitol" id="name" name="name" defaultValue={chapter.name} required />
        </div>
        <SubmitButton>Modifică capitol</SubmitButton>
      </form>
    </section>
  );
}
