import { Check, Copy } from "lucide-react"
import Button from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import type { Term } from "../types"

type Props = {
  term: Term
  copied: boolean
  onCopy: () => void
}

export default function TermCard({ term, copied, onCopy }: Props) {
  return (
    <Button
      variant="outline"
      onClick={onCopy}
      aria-label={term.en + " 복사" + (copied ? " 완료" : "")}
      className={cn(
        "group h-auto min-h-24 w-full justify-between gap-3 whitespace-normal rounded-xl border-border px-5 py-4 text-left hover:border-ring/50",
        copied && "border-primary bg-accent text-accent-foreground",
      )}
    >
      <span className="min-w-0">
        <span className="block break-words text-sm font-medium">
          {term.en}
        </span>
        <span className="mt-1.5 block text-xs font-normal leading-relaxed text-muted-foreground">
          {term.ko}
        </span>
      </span>
      {copied ? (
        <Check className="text-success" aria-hidden="true" />
      ) : (
        <Copy
          className="text-muted-foreground/50 transition-colors group-hover:text-primary group-focus-visible:text-primary"
          aria-hidden="true"
        />
      )}
    </Button>
  )
}
