"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TestModal({ test } : any) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const testCreditPoints = 10;

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    router.push(`/student/take-test/${test.id}`);
  };

  return (
    <>
      <button onClick={openDialog} className="text-blue-600 hover:underline mt-4 block">
        Vizualizeaza Test
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Confirmare</DialogTitle>
          <DialogDescription>
            Testul <strong>{test.name}</strong> costă <strong>{testCreditPoints}</strong> credit points.
            Ești sigur că vrei să continui?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Anulează</Button>
            <Button onClick={handleConfirm}>Continuă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
