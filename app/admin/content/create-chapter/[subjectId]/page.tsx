import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { addChapter } from "@/lib/controllers/chapterController";
import { getSubjectById } from "@/lib/controllers/subjectController";
import { redirect } from "next/navigation";

type PageParams = {
  subjectId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

async function createChapter(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const subjectId = parseInt(formData.get('subjectId') as string);
  
  await addChapter({
    name,
    subjectId: subjectId
  });
  console.log(`Chapter ${name} added to subject ${subjectId}`);

  redirect(`/admin/content/view-subject/${subjectId}`);
}


export default async function AdminCreateChapterPage({ params }: PageProps) {
  const { subjectId } = await params;
  const subject = await getSubjectById(subjectId);

  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-subject/${subjectId}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Adaugă capitol în materia {subject}</h2>
      </div>
      <form action={createChapter} className="flex flex-col gap-3">
      <input type="hidden" name="subjectId" value={subjectId} />
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="name">Nume capitol</Label>
          <Input placeholder="Nume capitol" id="name" name="name" />
        </div>
        <Button type="submit">Adaugă capitol</Button>
      </form>
    </section>
  );
}
