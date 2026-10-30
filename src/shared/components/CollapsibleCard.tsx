import { useId, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import Card from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"

export default function CollapsibleCard({
  title,
  description,
  open,
  onOpenChange,
  children,
}: {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const panelId = useId()

  return (
    <Card>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl p-5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:p-6"
      >
        <span>
          <span className="block text-sm font-semibold">{title}</span>
          {description && (
            <span className="mt-1 block text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <div id={panelId} hidden={!open} className="px-5 pb-5 sm:px-6 sm:pb-6">
        {children}
      </div>
    </Card>
  )
}
