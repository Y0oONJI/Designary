import type { ComponentProps } from "react"
import { cn } from "@/shared/lib/utils"

export default function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  )
}
