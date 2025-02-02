import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";


export default async function Page() {

  const supabase = await createClient();  

  const { data: subjects, error } = await supabase
  .from("Subjects")
  .select("*");

  return (
    <section className="my-3">
      <div className="flex items-center justify-between h-9">
        <h2 className="text-xl font-bold">Materii</h2>
        <Button size="sm" variant="default" asChild>
          <Link href="/admin/content/create-subject">
            Adaugă materie
          </Link>
        </Button>
      </div>
      {subjects?.map(s => (
        <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`subject-${s.id}`}>
          <span>{s.name}</span>
          <Button size="sm" className="ml-auto" variant="secondary" asChild>
            <Link key={s.id} href={`/admin/content/view-subject/${s.id}`}>
              Capitole
            </Link>
          </Button>
        </div>
      ))}
      {subjects?.length == 0 && (
        <div className="text-muted-foreground my-2">Nu există nicio materie.</div>
      )}
    </section>
  );
}
