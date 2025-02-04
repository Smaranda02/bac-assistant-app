"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTestAction, TestQuestion } from "@/lib/actions/testActions";
import { AlertCircle, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateTestPage() {
  const [name, setName] = useState<string>("");
  const [questions, setQuestions] = useState<Array<TestQuestion>>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addTestHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = await createTestAction({
      name,
      questions
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/teacher");
    }
  }
  
  const addQuestionHandler = () => {
    setQuestions([...questions, {
      question: "",
      answer: "",
      points: 0
    }])
  }

  return (
    <form onSubmit={addTestHandler}>
      {error && (
        <Alert variant="destructive" className="bg-white mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>A apărut o eroare</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg sticky top-0 z-20">
        <CardHeader className="pb-4">
          <CardTitle>
            Creare test
          </CardTitle>
          <CardDescription className="flex pt-4 gap-2">
            <Input
              placeholder="Nume test"
              title="Nume test"
              name="test-name"
              id="test-name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <Button variant="outline" onClick={addQuestionHandler}>Adaugă exercițiu</Button>
            <Button type="submit">Adaugă test</Button>
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-5">
        {questions.map((question, index) => (
          <Card key={index} className="my-3 bg-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                Exercițiul {index + 1}
                <Button
                  size="icon"
                  variant="secondary"
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
              <div className="grid w-full items-center gap-1.5 mb-3">
                <Label htmlFor={`${index}-points`}>Punctaj</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Punctaj"
                  name={`${index}-points`}
                  id={`${index}-points`}
                  value={isNaN(question.points) ? "" : question.points}
                  required
                  className="bg-white"
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
                  required
                  className="min-h-16"
                  onChange={(e) => {
                    setQuestions(questions.map((q, i) => (index == i) ? {...q, question: e.target.value} : {...q}))
                  }}
                />
              </div>
              <div className="grid w-full items-center gap-1.5 mt-3">
                <Label htmlFor={`${index}-answer`}>Răspuns barem</Label>
                <Textarea
                  placeholder="Răspuns"
                  name={`${index}-answer`}
                  id={`${index}-answer`}
                  value={question.answer}
                  required
                  className="min-h-16"
                  onChange={(e) => {
                    setQuestions(questions.map((q, i) => (index == i) ? {...q, answer: e.target.value} : {...q}))
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </form>
  );
}
