import { getTestData } from "@/lib/controllers/testController"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

type PageParams = {
  testId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function ViewTestPage({ params }: PageProps) {
  const { testId } = await params;
  const testData = await getTestData(testId);

  if (!testData) {
    return notFound();
  }

  return (
    <>
      <Card className="shadow-lg flex items-center z-20">
        <CardHeader>
            <CardTitle>
              Test {testData.name}
            </CardTitle>
            <CardDescription>
              Creat de {testData.teacher.firstname} {testData.teacher.lastname}
            </CardDescription>
        </CardHeader>
        <div className="ml-auto text-end pr-6 flex items-center gap-3">
          <span>{testData.questions.length} exerciții</span>
        </div>
      </Card>
      <div className="mt-4">
        {testData.questions.map((q, i) => (
          <Card key={i} className="my-3 bg-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                Exercițiul {i + 1}
              </CardTitle>
              <CardDescription>
                <span className="flex-1 text-nowrap ml-1">({q.points} puncte)</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                {q.question}
              </div>
              <div className="border rounded my-2 bg-background">
                <div className="border-b py-1 px-3">
                  Barem
                </div>
                <pre className="py-2 px-3">
                  {q.answer}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
