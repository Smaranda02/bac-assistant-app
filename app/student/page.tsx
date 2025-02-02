import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TestModal from "@/components/testModal/TestModal";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/controllers/userController";
import { getStudentTestResults } from "@/lib/controllers/studentController";
import { getRecentTests } from "@/lib/controllers/testController";
import { getSubjects } from "@/lib/controllers/contentController";

export default async function StudentHome() {
  const user = await getCurrentUser();
  if (!user || !user.student) {
    return notFound();
  }

  const subjects = await getSubjects();
  const testResults = await getStudentTestResults(user.student.id);
  const recentTests = await getRecentTests();
  
  return (
    <>
      <section className="bg-secondary mb-4 py-5 px-4 rounded shadow">
        <p className="text-xl font-bold my-2">Bine ai venit, {user.student.firstname} {user.student.lastname}!</p>
        <p className="my-2">Aici poți să consulți materialele de studiu pentru aprofundarea cunoștințelor și să susții teste de verificare.</p>
        <p className="my-2">Testele trimise sunt evaluate de un profesor care îți va acorda feedback pentru fiecare exercițiu.</p>
        <p className="my-2">Răspunsurile corecte sunt răsplătite cu puncte credit suplimentare.</p>
        {/* <ul className="px-3 pt-2">
          <li>
            <Link href="#content" className="text-sm font-medium hover:underline hover:underline-offset-4">Materiale de studiu »</Link>
          </li>
          <li>
            <Link href="#testResults" className="text-sm font-medium hover:underline hover:underline-offset-4">Rezultate teste »</Link>
          </li>
          <li>
            <Link href="#recentTests" className="text-sm font-medium hover:underline hover:underline-offset-4">Ultimele teste adăugate »</Link>
          </li>
        </ul> */}
      </section>

      <section className="my-3" id="content">
        <h3 className="font-bold text-lg mb-2">Materiale de studiu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject) => (
              <Link key={subject.id} href={`/${subject.id}/content`}>
                <Card className="hover:shadow-lg cursor-pointer transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription className="text-base">
                      Explorează conținutul pentru <strong>{subject.name}</strong>.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>Nicio materie disponibilă.</p>
            </div>
          )}
        </div>
      </section>

      <section className="my-3" id="testResults">
        <h2 className="text-lg font-bold mb-2">Rezultate teste</h2>
        {testResults.map(t => (
          <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`test-${t.submissionId}`}>
            <div className="mr-auto py-1">
              <div className="font-bold">{t.name}</div>
              <div className="text-sm text-muted-foreground" title={(new Date(t.submittedAt).toLocaleString())}>
                Susținut pe {formatDate(t.submittedAt)}
              </div>
            </div>
            <Badge variant="secondary">{t.subjectName}</Badge>
            <Badge variant="secondary">Notă: {t.grade}%</Badge>
            <Badge variant="secondary" className="bg-green-300 hover:bg-green-300">+ {t.creditsReceived ?? 0} puncte credit</Badge>
            <Button size="sm" className="ml-4" variant="secondary" asChild>
              <Link href={`/student/view-test-feedback/${t.submissionId}`}>
                Vizualizare
              </Link>
            </Button>
          </div>
        ))}
        {testResults.length == 0 && (
          <p className="text-muted-foreground">Niciun test disponibil.</p>
        )}
      </section>

      <section className="my-3" id="recentTests">
        <h2 className="text-lg font-bold mb-2">Ultimele teste adăugate</h2>
        {recentTests.map(t => (
           <div className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`recent-test-${t.id}`}>
            <div className="mr-auto py-1">
              <div className="font-bold">{t.name}</div>
              <div className="text-sm text-muted-foreground" title={(new Date(t.created_at).toLocaleString())}>
                Creat pe {formatDate(t.created_at)}, de către {}
              </div>
            </div>
            <Badge variant="secondary">{t.subject.name}</Badge>
            <TestModal test={t}>
              <Button size="sm" className="ml-4" variant="secondary">Susține test</Button>
            </TestModal>
          </div>
        ))}
        {recentTests.length === 0 && (
          <p className="text-muted-foreground">Nu există teste adăugate în ultimele 48 de ore.</p>
        )}
      </section>
    </>
  );
}
