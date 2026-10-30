import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Info } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export default function InfoTip({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false)
      } else if (!root.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", close)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", close)
    }
  }, [open])

  return (
    <span ref={root} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30"
      >
        <Info className="size-4" aria-hidden="true" />
      </button>
      <span
        id={panelId}
        role="note"
        hidden={!open}
        className="absolute left-0 top-full z-10 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-lg border bg-card p-3 text-xs font-normal leading-relaxed text-card-foreground shadow-md"
      >
        {children}
      </span>
    </span>
  )
}
