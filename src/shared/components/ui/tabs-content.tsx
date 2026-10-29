import type { ComponentProps } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/shared/lib/utils"

export default function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none focus-visible:rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/30",
        className,
      )}
      {...props}
    />
  )
}
