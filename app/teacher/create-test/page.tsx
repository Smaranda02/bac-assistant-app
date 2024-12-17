"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTestAction, TestQuestion } from "@/lib/actions/testActions";
import { AlertCircle, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function CreateTestPage()
{
  const [name, setName] = useState<string>("");
  const [questions, setQuestions] = useState<Array<TestQuestion>>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>A apărut o eroare</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="sticky top-0 flex gap-2 bg-background py-2 border-b">
        <Input
          placeholder="Nume test"
          title="Nume test"
          name="test-name"
          id="test-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          title="Adaugă exercițiu"
          variant="outline"
          onClick={() => {
            setQuestions([...questions, {
              question: "",
              answer: "",
              points: 0
            }])
          }}
        >
          +
        </Button>
        <Button
          onClick={async () => {
            setError(null);

            const result = await createTestAction({
              name,
              questions
            });

            if (result.error) {
              setError(result.error)
            } else {
              router.push("/teacher")
            }
          }}
        >
          Adaugă test
        </Button>
      </div>
      <div className="mt-5">
        {questions.map((question, index) => (
          <Card key={index} className="my-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="font-bold mt-4 mb-2">Exercițiul {index + 1}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => {
                    setQuestions(questions.filter((_, i) => index != i))
                  }}
                >
                  <XIcon/>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-1.5 my-3">
                <Label htmlFor={`${index}-points`}>Punctaj</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Punctaj"
                  name={`${index}-points`}
                  id={`${index}-points`}
                  value={isNaN(question.points) ? 0 : question.points}
                  onChange={(e) => {
                    setQuestions(questions.map((q, i) => (index == i) ? {...q, points: parseFloat(e.target.value)} : {...q}))
                  }}
                />
              </div>
              <div className="grid w-full items-center gap-1.5 my-3">
                <Label htmlFor={`${index}-question`}>Cerință</Label>
                <Textarea
                  placeholder="Cerință"
                  name={`${index}-question`}
                  id={`${index}-question`}
                  value={question.question}
                  onChange={(e) => {
                    setQuestions(questions.map((q, i) => (index == i) ? {...q, question: e.target.value} : {...q}))
                  }}
                />
              </div>
              <div className="grid w-full items-center gap-1.5 my-3">
                <Label htmlFor={`${index}-answer`}>Răspuns barem</Label>
                <Textarea
                  placeholder="Răspuns"
                  name={`${index}-answer`}
                  id={`${index}-answer`}
                  value={question.answer}
                  onChange={(e) => {
                    setQuestions(questions.map((q, i) => (index == i) ? {...q, answer: e.target.value} : {...q}))
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
