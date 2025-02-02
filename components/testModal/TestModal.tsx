"use client"; 

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  test: {
    id: number;
    name: string;
  };
  children: ReactNode;
}

export default function TestModal({ test, children } : Props) {
  const router = useRouter();
  const testCreditPoints = 10;

  const handleConfirm = () => {
    router.push(`/student/take-test/${test.id}`);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirmare</DialogTitle>
          <DialogDescription>
            Testul <strong>{test.name}</strong> costă <strong>{testCreditPoints}</strong> credit points.
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
    </>
  );
}
