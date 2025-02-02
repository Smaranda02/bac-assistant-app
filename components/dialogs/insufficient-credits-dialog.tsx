"use client"; 

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  children: ReactNode;
}

export default function InsufficientCreditsDialog({ children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Puncte credit insuficiente</DialogTitle>
        <DialogDescription>
          Nu ai suficiente puncte credit pentru a susține acest test.<br/>
          Poți cumpăra mai multe puncte credit din {" "}
          <Link href={"/student/profile"} className="text-black hover:underline underline-offset-4">pagina de profil »</Link>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Am înțeles</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
