import { Button } from "@/components/ui/button";
import { getTeacherTests, getTeacherUngradedSubmissions } from "@/lib/controllers/teacherController";
import { getCurrentUser } from "@/lib/controllers/userController";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherHome() {
  const user = await getCurrentUser();
  if (!user || !user.teacher) {
    return notFound();
  }
  const teacher = user.teacher;
  const teacherTests = await getTeacherTests(teacher.id);
  const submissions = await getTeacherUngradedSubmissions(teacher.id);

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
        {submissions.map(s => (
          <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`submission-${s.submissionId}`}>
            <div className="mr-auto py-1">
              <div className="font-bold">{s.test.name}</div>
              <div className="text-sm text-muted-foreground" title={(new Date(s.submittedAt).toLocaleString())}>
                Trimis de {s.student.firstname} {s.student.lastname} la {formatDate(s.submittedAt)}
              </div>
            </div>
            <Button size="sm" className="ml-auto" variant="secondary" asChild>
              <Link href={`/teacher/grade-test/${s.submissionId}/`}>
                Evaluează
              </Link>
            </Button>
          </div>
        ))}
        {submissions.length == 0 && (
          <div className="text-muted-foreground my-2">Niciun test trimis.</div>
        )}
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
        {teacherTests.map(t => (
          <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`test-${t.id}`}>
            <div className="mr-auto py-1">
              <div className="font-bold">{t.name}</div>
              <div className="text-sm text-muted-foreground" title={(new Date(t.created_at).toLocaleString())}>
                Creat la {formatDate(t.created_at)}
              </div>
            </div>
            <Button size="sm" className="ml-auto" variant="secondary" asChild>
              <Link href={`/teacher/view-test/${t.id}`}>
                Vizualizare
              </Link>
            </Button>
          </div>
        ))}
        {teacherTests.length == 0 && (
          <div className="text-muted-foreground my-2">Niciun test creat.</div>
        )}
      </section>
    </>
  )
}