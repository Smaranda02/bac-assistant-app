import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSubjectAction } from "@/lib/actions/contentActions";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminCreateSubjectPage() {
  return (
    <section className="my-3">
      <div className="flex items-center mb-2 h-9">
        <Link href={`/admin/content`} className="mx-2 p-0.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft></ChevronLeft>
        </Link>
        <h2 className="text-xl font-bold mr-auto">Adaugă materie</h2>
      </div>
      <form action={createSubjectAction} className="mx-10 mt-5 bg-white p-6 border rounded">
        <div className="mb-3 grid items-center gap-1.5">
          <Label htmlFor="name">Nume materie</Label>
          <Input placeholder="Nume materie" id="name" name="name" required />
        </div>
        <SubmitButton type="submit">Adaugă materie</SubmitButton>
      </form>
    </section>
  );
}
