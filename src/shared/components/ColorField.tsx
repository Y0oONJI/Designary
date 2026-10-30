import { useId, useState } from "react"
import Input from "@/shared/components/ui/input"
import Label from "@/shared/components/ui/label"
import { normalizeHex } from "@/shared/lib/color"
import { cn } from "@/shared/lib/utils"

export default function ColorField({
  label,
  value,
  hint,
  onChange,
}: {
  label: string
  value: string
  hint?: string
  onChange: (hex: string) => void
}) {
  const id = useId()
  const [text, setText] = useState(value)
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    // 사용자가 입력 중인 값이 이미 같은 색이면 글자를 바꾸지 않는다
    if (normalizeHex(text) !== value) setText(value)
  }
  const invalid = normalizeHex(text) === null

  // 타이핑 도중 "#227" 같은 축약형이 적용되지 않도록 6자리일 때만 바로 반영한다
  const handleChange = (next: string) => {
    setText(next)
    const hex = normalizeHex(next)
    if (hex && next.trim().replace(/^#/, "").length === 6) onChange(hex)
  }

  const commit = () => {
    const hex = normalizeHex(text)
    if (!hex) return
    setText(hex)
    onChange(hex)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label + " 선택"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-md border border-input bg-card p-1"
        />
        <Input
          id={id}
          value={text}
          aria-invalid={invalid}
          aria-describedby={id + "-hint"}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={commit}
          placeholder="#2272eb"
          className="w-28 tabular-nums"
        />
      </div>
      <p
        id={id + "-hint"}
        className={cn(
          "text-xs",
          invalid ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {invalid ? "#RRGGBB 형식으로 입력해 주세요." : hint}
      </p>
    </div>
  )
}
