import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminCreateChapterPage() {
  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content/view-subject/${1}`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Adaugă capitol în materia</h2>
      </div>
      <form className="mx-10 mt-5">
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="name">Nume capitol</Label>
          <Input placeholder="Nume capitol" id="name" name="name" />
        </div>
        <Button type="submit">Adaugă capitol</Button>
      </form>
    </section>
  );
}
