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
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  submissionData: TestSubmission
}

export default function GradeTest({ submissionData } : Props) {
  const [grading, setGrading] = useState<Array<Grading>>(submissionData.questions.map(q => ({
    id: q.id,
    points: NaN,
    feedback: ''
  })));
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const gradedQuestions = grading.reduce((total, g) => !isNaN(g.points) ? total + 1 : total, 0);
  const testGrade = computeTestGrade(submissionData, grading);
  const router = useRouter();

  return (
    <>
      {error && (
        <Alert variant="destructive" className="bg-white mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>A apărut o eroare</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg sticky top-0 flex items-center z-20">
        <CardHeader>
            <CardTitle>
              Test {submissionData.test.name}
            </CardTitle>
            <CardDescription>
              Trimis de {submissionData.student.firstname} {submissionData.student.lastname}
            </CardDescription>
        </CardHeader>
        <div className="ml-auto text-end pr-6 flex items-center gap-3">
          <span>{gradedQuestions} / {submissionData.questions.length} exerciții</span>
          <span>Notă: {testGrade.toFixed(2)}%</span>
          <Button 
            disabled={gradedQuestions !== submissionData.questions.length || isSubmitting}
            onClick={async () => {
              setSubmitting(true);
              setError(null);
              const resp = await gradeTestAction(submissionData.submissionId, grading);
              if (resp.error) {
                setSubmitting(false);
                setError(resp.error);
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
        {submissionData.questions.map((q, i) => (
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
                    required
                    className="bg-white"
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
                    {q.correctAnswer}
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
                className="bg-white"
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