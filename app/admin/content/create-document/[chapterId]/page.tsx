import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getChapterById } from "@/lib/controllers/chapterController";
import { addMaterial } from "@/lib/controllers/materialsController";


type PageParams = {
  chapterId: number;
}

type PageProps = {
  params: Promise<PageParams>;
}

async function createMaterial(formData: FormData) {
  'use server';
  
  const chapterId = formData.get('chapterId') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as File;
  console.log(content);
  // insert the content into the database
  await addMaterial({
    chapterId: parseInt(chapterId),
    title,
    content
  });
  console.log(`Material ${title} added to chapter ${chapterId}`);
}


export default async function AdminCreateDocumentPage({ params }: PageProps) {
  const { chapterId } = await params;
  const chapter = await getChapterById(chapterId);
  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-chapter/${1}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Încarcă document în capitolul</h2>
      </div>
      <form action={createMaterial} className="mx-10 mt-5">
        <input type="hidden" name="chapterId" value={chapterId} />
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="title">Titlu</Label>
          <Input type="text" name="title" id="title" required />
        </div>

        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="content">Conținut</Label>

          <Input type="file" name="content" id="content" required />
        </div>

        <Button type="submit">Salvează documentul</Button>
      </form>
    </section>
  );
}
