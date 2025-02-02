import { getGradedSubmission } from "@/lib/controllers/testController"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/controllers/userController";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type PageParams = {
  submissionId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function ViewTestFeedbackPage({ params }: PageProps) {
  const { submissionId } = await params;
  const user = await getCurrentUser();

  if (!user || !user.student) {
    return notFound();
  }
  const submissionData = await getGradedSubmission(submissionId, user.student.id);

  if (!submissionData || !submissionData.grade || !submissionData.gradedAt) {
    return notFound();
  }

  return (
    <>
      <Card className="shadow-lg">
          <div className="flex items-center">
            <CardHeader className="pb-4">
              <CardTitle>
                Test {submissionData.test.name}
              </CardTitle>
              <CardDescription>
                Evaluat de {submissionData.test.teacher.firstname} {submissionData.test.teacher.lastname} la {formatDate(submissionData.gradedAt)}
              </CardDescription>
            </CardHeader>
            <div className="ml-auto text-end pr-6 flex items-center gap-3">
              <span>{submissionData.questions.length} exerciții, Notă: {submissionData.grade.toFixed(2)}%</span>
            </div>
          </div>
          <div className="mx-5 pb-4 flex gap-2 items-center">
            <Link href={`/${submissionData.test.subject.id}/content`} className="contents">
              <Badge variant="secondary" className="hover:bg-gray-300">
                {submissionData.test.subject.name}
              </Badge>
            </Link>
            <Badge className="bg-green-300 hover:bg-green-300" variant="secondary">+ {submissionData.creditsReceived ?? 0} puncte credit</Badge>
          </div>
      </Card>
      <div className="mt-4">
        {submissionData.questions.map((q, i) => (
          <Card key={i} className="my-3 bg-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                Exercițiul {i + 1}
                <div className="flex items-center ml-auto text-base font-normal">
                  <span>{q.points} / {q.totalPoints} puncte</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                {q.question}
              </div>
              <Collapsible className="border rounded my-2 bg-background" defaultOpen={true}>
                <CollapsibleTrigger className="border-b w-full text-start py-1 px-3 flex justify-between">
                  <span>Răspunsul tău</span>
                  <span>+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 px-3">
                  <pre>
                    {q.studentAnswer}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
              <Collapsible className="border rounded my-2 bg-background" defaultOpen={true}>
                <CollapsibleTrigger className="border-b w-full text-start py-1 px-3 flex justify-between">
                  <span>Feedback</span>
                  <span>+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 px-3">
                  <pre>
                    {q.feedback}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
