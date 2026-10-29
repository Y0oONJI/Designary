import type { ComponentProps } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/shared/lib/utils"

export default function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}
