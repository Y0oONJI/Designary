import { useMemo, useState } from "react"
import { Check, Copy } from "lucide-react"
import Button from "@/shared/components/ui/button"
import Card from "@/shared/components/ui/card"
import useClipboard from "@/shared/hooks/useClipboard"
import { buildExport, type ExportFormat } from "../lib/exporters"
import type { Palette } from "../lib/palette"
import type { Naming, SemanticToken } from "../lib/tokens"
import type { TypeStep } from "../lib/typeScale"

type FormatOption = {
  value: ExportFormat
  label: string
  hint: string
}

const formats: FormatOption[] = [
  { value: "tailwind", label: "Tailwind v4", hint: "index.css에 붙여넣기" },
  { value: "css", label: "CSS 변수", hint: "프레임워크 없이 사용" },
  { value: "json", label: "JSON", hint: "Design Tokens 형식, 토큰 플러그인용" },
]

type Props = {
  palette: Palette
  semantic: SemanticToken[]
  typeScale: TypeStep[]
  naming: Naming
}

export default function ExportPanel(props: Props) {
  const { copied, copy } = useClipboard()
  const [format, setFormat] = useState<ExportFormat>("tailwind")
  const { palette, semantic, typeScale, naming } = props
  const code = useMemo(
    () => buildExport(format, { palette, semantic, typeScale, naming }),
    [format, palette, semantic, typeScale, naming],
  )
  const current = formats.find((item) => item.value === format)!

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5 sm:px-6">
        <div
          role="group"
          aria-label="내보내기 형식"
          className="flex flex-wrap gap-2"
        >
          {formats.map(({ value, label }) => (
            <Button
              key={value}
              size="sm"
              variant={format === value ? "default" : "outline"}
              aria-pressed={format === value}
              onClick={() => setFormat(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            copy(code, "export-" + format, current.label + " 코드를")
          }
        >
          {copied === "export-" + format ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          전체 복사
        </Button>
      </div>
      <p className="border-b px-5 py-3 text-xs text-muted-foreground sm:px-6">
        {current.hint}
      </p>
      <pre
        tabIndex={0}
        aria-label={current.label + " 코드"}
        className="max-h-[32rem] overflow-auto bg-muted/35 p-5 text-xs leading-relaxed outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:px-6"
      >
        <code>{code}</code>
      </pre>
    </Card>
  )
}
