import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createMaterialAction } from "@/lib/actions/contentActions";
import { getChapterContent } from "@/lib/controllers/contentController";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/forms/submit-button";

type PageParams = {
  chapterId: number;
}

type PageProps = {
  params: Promise<PageParams>;
}

export default async function AdminCreateDocumentPage({ params }: PageProps) {
  const { chapterId } = await params;
  const chapter = await getChapterContent(chapterId);
  if (!chapter) {
    return notFound();
  }

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-chapter/${chapterId}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Încarcă document în capitolul {chapter.name}</h2>
      </div>
      <form action={createMaterialAction.bind(null, chapterId)} className="mx-10 mt-5 bg-white p-6 border rounded">
        <input type="hidden" name="chapterId" value={chapterId} />
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="title">Titlu</Label>
          <Input type="text" name="title" id="title" />
        </div>

        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="content">Conținut</Label>
          <Input type="file" name="content" id="content" required />
        </div>

        <SubmitButton type="submit">Salvează documentul</SubmitButton>
      </form>
    </section>
  );
}
