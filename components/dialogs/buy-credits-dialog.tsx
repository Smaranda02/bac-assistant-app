"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buyCredits } from "@/lib/actions/studentActions";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { creditPrices } from "@/lib/config";

type Props = {
  studentId: number;
  children: ReactNode;
}



export default function BuyCreditsDialog({ studentId, children }: Props) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cumpără puncte credit</DialogTitle>
          <DialogDescription>
            Punctele credit nu sunt transmisibile și nu pot fi returnate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={async (e) => {
          const formData = new FormData(e.currentTarget);
          const points = formData.get("points");

          if (points) {
            setLoading(true);
            await buyCredits(studentId, Number(points));
            setLoading(false);
            router.replace("#");
          }

          e.preventDefault();
        }}>
          {creditPrices.map(({amount, price}, index) => (
            <div key={`credits-${index}`} className="my-2">
              <input type="radio" name="points" value={amount} id={`credits-${index}`} className="hidden peer" defaultChecked={index === 0} disabled={isLoading}/>
              <label htmlFor={`credits-${index}`} className="p-2 rounded-md border flex justify-between items-center peer-checked:border-black">
                <span>{amount} credite</span>
                <span className="text-gray-500">{price} lei</span>
              </label>
            </div>
          ))}
          <Button type="submit" disabled={isLoading} className="w-full my-3">Cumpără</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}