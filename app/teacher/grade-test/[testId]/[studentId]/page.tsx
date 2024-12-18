import GradeTest from "@/components/tests/grade-test";
import { getTestSubmission } from "@/lib/controllers/testController";
import { notFound } from "next/navigation";

type PageParams = {
  testId: number;
  studentId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function GradeTestPage({ params, }: PageProps) {
  const { testId, studentId } = await params;
  const submissionData = await getTestSubmission(testId, studentId);
  
  if (!submissionData) {
    return notFound();
  }

  return (
    <GradeTest testData={submissionData} />
  );
}