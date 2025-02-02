import { getCurrentUser } from "@/lib/controllers/userController";
import { ReactNode } from "react";
import TestCreditsConfirmationDialog from "./test-credits-confirmation-dialog";
import InsufficientCreditsDialog from "./insufficient-credits-dialog";
import { testCredits } from "@/lib/config";

type Props = {
  test: {
    id: number;
    name: string;
  };
  children: ReactNode;
}

export default async function TakeTestDialog({ test, children }: Props) {
  const user = await getCurrentUser();
  if (!user || !user.student) {
    return null;
  }

  return (user.student.creditPoints >= testCredits) ? (
    <TestCreditsConfirmationDialog test={test}>{children}</TestCreditsConfirmationDialog>
  ) : (
    <InsufficientCreditsDialog>{children}</InsufficientCreditsDialog>
  )
}