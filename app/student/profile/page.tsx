import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (user.error || !user.data.user.email) {
    // FIXME: better error handling
    return notFound();
  }

  const { data: student, error } = await supabase.from('Students')
    .select(`
      id,
      firstname,
      lastname,
      creditPoints,
      ...Users!inner(
        email
      )
    `)
    .eq('Users.email', user.data.user?.email)
    .single();

  if (error || !student) {
    console.log(error)
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Nume : {student.firstname} {student.lastname}
        </CardTitle>
        <CardDescription>
          Student &bull; Credit points: {student.creditPoints}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold">Detalii</h3>
        <div className="my-2 py-2 px-3 rounded border">
          Email: {student.email}
        </div>
        <ul>
          <li>
            <Button asChild variant="link">
              <Link href="#">Schimbă parola »</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link href="#">Schimbă adresa de email »</Link>
            </Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}