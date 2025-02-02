import GradeTest from "@/components/tests/grade-test";
import { getTestSubmission } from "@/lib/controllers/testController";
import { notFound } from "next/navigation";

type PageParams = {
  submissionId: number;
}
type PageProps = {
  params: Promise<PageParams>;
}

export default async function GradeTestPage({ params, }: PageProps) {
  const { submissionId } = await params;
  const submissionData = await getTestSubmission(submissionId);
  
  if (!submissionData) {
    return notFound();
  }

  return (
    <GradeTest submissionData={submissionData} />
  );
}