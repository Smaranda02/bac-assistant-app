"use client"; 

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { testCredits } from "@/lib/config";

type Props = {
  test: {
    id: number;
    name: string;
  };
  children: ReactNode;
}

export default function TestCreditsConfirmationDialog({ test, children } : Props) {
  const router = useRouter();

  const handleConfirm = () => {
    router.push(`/student/take-test/${test.id}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmare</DialogTitle>
        <DialogDescription>
          Pentru susținerea testului <strong>{test.name}</strong> vei folosi <strong>{testCredits}</strong> puncte credit.<br/>
          Ești sigur că vrei să continui?
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Renunță</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Continuă</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
