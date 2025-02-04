"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { SubmitButton } from "../forms/submit-button";

type Props = ComponentProps<typeof Button> & {
  itemName: string;
  action: () => Promise<any>;
};

export function DeleteDialog({
  children,
  itemName,
  action,
  ...props
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive" {...props}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmare ștergere</DialogTitle>
          <DialogDescription>Ești sigur că dorești să ștergi {itemName}?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">Renunță</Button>
          </DialogClose>
          {/* <DialogClose asChild> */}
            <form action={action}>
            {/* <Button type="submit" variant="destructive" size="sm" className={pending ? "bg-red-300" : "" } aria-disabled={pending} disabled={pending}>Șterge</Button> */}
            <SubmitButton variant="destructive" size="sm">Șterge</SubmitButton>
            </form>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
