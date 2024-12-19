"use client"

import { type TestSubmission } from "@/lib/controllers/testController"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useState } from "react";
import { gradeTestAction, Grading } from "@/lib/actions/testActions";
import { computeTestGrade } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Props = {
  testData: TestSubmission
}

export default function GradeTest({ testData } : Props) {
  const [grading, setGrading] = useState<Array<Grading>>(testData.questions.map(q => ({
    id: q.id,
    points: NaN,
    feedback: ''
  })));
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const gradedQuestions = grading.reduce((total, g) => !isNaN(g.points) ? total + 1 : total, 0);
  const testGrade = computeTestGrade(testData, grading);
  const router = useRouter();

  return (
    <>
      <Card className="shadow-lg sticky top-0 flex items-center z-20">
        <CardHeader>
            <CardTitle>
              Test {testData.name}
            </CardTitle>
            <CardDescription>
              Trimis de {testData.student.firstname} {testData.student.lastname}
            </CardDescription>
        </CardHeader>
        <div className="ml-auto text-end pr-6 flex items-center gap-3">
          <span>{gradedQuestions} / {testData.questions.length} exerciții</span>
          <span>Notă: {testGrade.toFixed(2)}%</span>
          <Button 
            disabled={gradedQuestions !== testData.questions.length || isSubmitting}
            onClick={async () => {
              setSubmitting(true);
              const resp = await gradeTestAction(testData.id, testData.student.id, testGrade, grading);
              if (resp.error) {
                setSubmitting(false);
                console.error(resp.error);
                // FIXME: show error
              } else {
                router.push("/teacher");
              }
            }}
          >
            Finalizare
          </Button>
        </div>
      </Card>
      <div className="mt-4">
        {testData.questions.map((q, i) => (
          <Card key={i} className="my-3 bg-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                Exercițiul {i + 1}
                <div className="w-1/4 flex items-center ml-auto text-base font-normal">
                  <Input
                    type="number"
                    min="0"
                    max={q.points}
                    step="0.01"
                    value={isNaN(grading[i].points) ? '' : grading[i].points}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || value <= q.points) {
                        setGrading(grading.map((g, j) => i == j ? {...g, points: parseFloat(e.target.value)} : {...g}))
                      }
                    }}
                  />
                  <span className="flex-1 text-nowrap ml-1">({q.points} puncte)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                {q.question}
              </div>
              <Collapsible className="border rounded my-2 bg-background">
                <CollapsibleTrigger className="border-b w-full text-start py-1 px-3 flex justify-between">
                  <span>Barem</span>
                  <span>+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 px-3">
                  <pre>
                    {q.answer}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
              <Collapsible className="border rounded my-2 bg-background" defaultOpen={true}>
                <CollapsibleTrigger className="border-b w-full text-start py-1 px-3 flex justify-between">
                  <span>Răspuns trimis</span>
                  <span>+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-2 px-3">
                  <pre>
                    {q.studentAnswer}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
              <Input
                placeholder="Observații suplimentare"
                disabled={isSubmitting}
                value={grading[i].feedback}
                onChange={(e) => {
                  setGrading(grading.map((g, j) => i == j ? {...g, feedback: e.target.value} : {...g}))
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}