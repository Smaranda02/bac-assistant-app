import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherProfilePage() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (user.error || !user.data.user.email) {
    // FIXME: better error handling
    return notFound();
  }

  const { data: teacher, error } = await supabase.from('Teachers')
    .select(`
      id,
      firstname,
      lastname,
      ...Subjects(
        subject:name
      ),
      ...Users!inner(
        email
      )
    `)
    .eq('Users.email', user.data.user?.email)
    .single();

  if (error || !teacher) {
    console.log(error)
    return notFound();
  }

  const { data: teacherTests, error: dbError } = await supabase.from("PracticeTests")
    .select(`
      id,
      name
    `)
    .eq("teacherId", teacher.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {teacher.firstname} {teacher.lastname}
        </CardTitle>
        <CardDescription>
          Profesor &bull; {teacher.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold">Contact</h3>
        <div className="my-2 py-2 px-3 rounded border">
          Email: {teacher.email}
        </div>
        <h3 className="text-lg font-semibold">Teste create</h3>
        {teacherTests?.map(t => (
          <Link href={`/teacher/view-test/${t.id}`} key={t.id}>
            <div className="my-2 py-2 px-3 rounded border">
              {t.name}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
