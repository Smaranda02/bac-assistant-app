import CancelTestModal from "@/components/cancelTestModel/CancelTestModel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { submitAnswersAction } from "@/lib/actions/testActions";
import { testCredits } from "@/lib/config";
import { getTestData } from "@/lib/controllers/testController";
import { getCurrentUser } from "@/lib/controllers/userController";
import { formatDate } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageParams = {
  test: number;
}
type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<{ error?: string }>;
}

export default async function TestPage({ params, searchParams }: PageProps) {
  const { test: testId } = await params;
  const { error: errorMessage } = await searchParams;

  const user = await getCurrentUser();
  const testData = await getTestData(testId);

  if (!user || !user.student || !testData) {
    return notFound();
  }

  const testDetails = testData;
  const testQuestions = testData.questions;

  // Insufficient credits
  if (user.student.creditPoints < testCredits) {
    return (
      <Alert variant="destructive" className="bg-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Puncte credit insuficiente</AlertTitle>
        <AlertDescription>Pentru a susține un test ai nevoie de {testCredits} puncte credit.</AlertDescription>
        <AlertDescription>
          Poți cumpăra mai multe puncte credite de pe {" "}
          <Link href="/student/profile" className="font-medium hover:underline underline-offset-4">pagina de profil</Link>.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      {errorMessage && (
        <Alert variant="destructive" className="bg-white mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>A apărut o eroare</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {/* Test Header */}
      <Card className="shadow-lg">
          <div className="flex items-center">
            <CardHeader className="pb-4">
              <CardTitle>
                Test {testDetails.name}
              </CardTitle>
              <CardDescription>
                Creat de {testDetails.teacher.firstname} {testDetails.teacher.lastname} la {formatDate(testDetails.created_at)}
              </CardDescription>
            </CardHeader>
            <div className="ml-auto text-end pr-6 flex items-center gap-3">
              <span>{testDetails.questions.length} exerciții</span>
            </div>
          </div>
          <div className="mx-5 pb-4 flex gap-2 items-center">
            <Badge variant="secondary">
              {testDetails.subject.name}
            </Badge>
          </div>
      </Card>

      {/* Form for Submitting Answers */}
      <form action={submitAnswersAction.bind(null, testId)} className="space-y-8 mt-8">
        {testQuestions.map((question, index) => (
          <Card key={question.id} className="my-3 bg-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                Exercițiul {index + 1}
                <div className="flex items-center ml-auto text-base font-normal">
                  <span>{question.points} puncte</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                {question.question}
              </div>
              <div>
                <Input
                  type="text"
                  name={`answer_${question.id}`} // Unique name for each input
                  placeholder="Scrie răspunsul aici..."
                  className="w-full"
                  required
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit">Trimite răspunsurile</Button>
        </div>
      </form>

      {/* <div className="text-center mt-8">
        <CancelTestModal></CancelTestModal>
      </div> */}
    </>
  );
}
