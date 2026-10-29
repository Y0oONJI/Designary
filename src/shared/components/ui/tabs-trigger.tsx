import type { ComponentProps } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/shared/lib/utils"

export default function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-full flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}
