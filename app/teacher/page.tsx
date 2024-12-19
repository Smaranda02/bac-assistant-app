import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server"
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherHome() {
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
      subject:Subjects!inner(
        id,
        name
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
      name,
      created_at
    `)
    .eq("teacherId", teacher.id);

  const { data: submissions, error: dbSubmissionsError } = await supabase.from("StudentsTests")
    .select(`
      student:Students!inner(
        id,
        firstname,
        lastname
      ),
      test:PracticeTests!inner(
        id,
        name,
        teacherId
      ),
      grade
    `)
    .eq('PracticeTests.teacherId', teacher.id)
    .is('grade', null);

  return (
    <>
      <section className="bg-secondary mb-4 py-5 px-4 rounded shadow">
        <p className="text-xl font-bold my-2">Bine ai venit, {teacher.firstname} {teacher.lastname}!</p>
        <p>Aici poți să vezi testele create de tine și rezolvările trimise de elevi la acestea.</p>
      </section>
      {/* FIXME: nu stiu exact cum sa integrez butonul asta ca nu prea se vede bine */}
      {/* <Button variant="link" asChild>
        <Link href={`${teacher.subject.id}/content`}>
          Materialele pentru materia {teacher.subject.name} »
        </Link>
      </Button> */}
      <section className="my-3" id="submissions">
        <h3 className="font-bold text-lg">Teste de evaluat</h3>
        {submissions?.map(s => (
          <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center" key={`submission-${s.test.id}-${s.student.id}`}>
            <span>{s.test.name}</span>
            <span className="text-muted-foreground">Trimis de {s.student.firstname} {s.student.lastname}</span>
            <Button size="sm" className="ml-auto" variant="secondary" asChild>
              <Link href={`/teacher/grade-test/${s.test.id}/${s.student.id}`}>
                Evaluează
              </Link>
            </Button>
          </div>
        ))}
      </section>
      <section className="my-3" id="tests">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Teste create</h3>
          <Button size="sm" variant="default" asChild>
            <Link href="/teacher/create-test">
              Adaugă test
            </Link>
          </Button>
        </div>
        {teacherTests?.map(t => (
          <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center" key={`test-${t.id}`}>
            <span>{t.name}</span>
            <span className="text-muted-foreground">Creat la {new Date(t.created_at || '1970-01-01').toLocaleDateString()}</span>
            <Button size="sm" className="ml-auto" variant="secondary" asChild>
              <Link href={`/teacher/view-test/${t.id}`}>
                Vizualizare
              </Link>
            </Button>
          </div>
        ))}
      </section>
    </>
  )
}