"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CancelTestModal({ test } : any) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const testCreditPoints = 10;

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    router.push(`/student`);
  };

  return (
    <>
      <div className="text-center mt-8">
        <button onClick={openDialog} className="text-blue-700 hover:underline mt-4 block">
          Paraseste testul
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Confirmare abandonare test</DialogTitle>
          <DialogDescription>
            Ești sigur că vrei să parasesti testul? Progresul facut va fi pierdut.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Anulează</Button>
            <Button onClick={handleConfirm}>Confirma iesirea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
