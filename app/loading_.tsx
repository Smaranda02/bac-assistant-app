import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full mx-auto mt-8">
      <Skeleton className="w-[600px] h-[25px] rounded-full mx-auto mb-8" />
      <Skeleton className="w-[600px] h-[10px] rounded-full mx-auto my-4" />
      <Skeleton className="w-[600px] h-[10px] rounded-full mx-auto my-4" />
      <Skeleton className="w-[600px] h-[10px] rounded-full mx-auto my-4" />
    </div>
  )
}