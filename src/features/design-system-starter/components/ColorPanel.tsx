import { useState } from "react"
import { Check, ChevronsDownUp, ChevronsUpDown } from "lucide-react"
import CollapsibleCard from "@/shared/components/CollapsibleCard"
import Button from "@/shared/components/ui/button"
import useClipboard from "@/shared/hooks/useClipboard"
import { cn } from "@/shared/lib/utils"
import { contrastRatio, gradeContrast, readableOn } from "@/shared/lib/color"
import { scaleNames, steps, type Palette } from "../lib/palette"
import {
  scaleName,
  type Mode,
  type Naming,
  type SemanticToken,
} from "../lib/tokens"
import ThemePreview from "./ThemePreview"

type Props = {
  palette: Palette
  semantic: SemanticToken[]
  naming: Naming
}

// 팔레트 견본은 사용자가 만든 색이라 인라인 스타일로 칠한다
export default function ColorPanel({ palette, semantic, naming }: Props) {
  const { copied, copy } = useClipboard()
  const pairs = new Map(semantic.map((token) => [token.names.tailwind, token]))
  const groups = [...new Set(semantic.map((token) => token.group))]
  const [open, setOpen] = useState({
    primitive: true,
    semantic: true,
    preview: true,
  })
  const allOpen = Object.values(open).every(Boolean)
  const toggle = (key: keyof typeof open) => (value: boolean) =>
    setOpen((current) => ({ ...current, [key]: value }))
  const toggleAll = () =>
    setOpen({ primitive: !allOpen, semantic: !allOpen, preview: !allOpen })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          {allOpen ? (
            <ChevronsDownUp aria-hidden="true" />
          ) : (
            <ChevronsUpDown aria-hidden="true" />
          )}
          {allOpen ? "모두 접기" : "모두 펼치기"}
        </Button>
      </div>
      <CollapsibleCard
        title="프리미티브 컬러"
        description="단계별 원본 색이에요. 칸을 누르면 HEX가 복사돼요."
        open={open.primitive}
        onOpenChange={toggle("primitive")}
      >
        <div className="space-y-6">
          {scaleNames.map((scale) => (
            <div key={scale} className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                {scaleName(scale, naming)}
              </h3>
              <div className="grid grid-cols-5 gap-2 @3xl:grid-cols-10">
                {steps.map((step) => {
                  const hex = palette[scale][step]
                  const text = readableOn(hex)
                  const grade = gradeContrast(contrastRatio(hex, text))
                  const id = `${scale}-${step}`
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={`${scaleName(scale, naming)} ${step} ${hex} 복사`}
                      onClick={() =>
                        copy(
                          hex,
                          id,
                          `${scaleName(scale, naming)}-${step} ${hex}`,
                        )
                      }
                      style={{ backgroundColor: hex, color: text }}
                      className="flex h-20 cursor-pointer flex-col justify-between rounded-md border p-2 text-left text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
                    >
                      <span className="flex items-center justify-between font-medium tabular-nums">
                        {step}
                        {copied === id && (
                          <Check className="size-3" aria-hidden="true" />
                        )}
                      </span>
                      <span className="tabular-nums">
                        {hex}
                        <span className="block opacity-80">{grade}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleCard>
      <CollapsibleCard
        title="시맨틱 컬러"
        description="역할별로 프리미티브를 가리키는 최소 구성이에요. 다크 모드 값도 함께 만들어요."
        open={open.semantic}
        onOpenChange={toggle("semantic")}
      >
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                {group}
              </h3>
              <ul className="divide-y rounded-md border">
                {semantic
                  .filter((token) => token.group === group)
                  .map((token) => (
                    <li
                      key={token.names.tailwind}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 text-xs"
                    >
                      <code className="min-w-40 flex-1 font-medium">
                        {token.names[naming]}
                      </code>
                      {(["light", "dark"] as Mode[]).map((mode) => {
                        const entry = token[mode]
                        const pairHex = pairs.get(token.pair ?? "")?.[mode].hex
                        const ratio = pairHex
                          ? contrastRatio(entry.hex, pairHex)
                          : null
                        const grade = ratio ? gradeContrast(ratio) : null
                        const label = entry.ref
                          ? `${scaleName(entry.ref.scale, naming)}-${entry.ref.step}`
                          : entry.hex
                        return (
                          <button
                            key={mode}
                            type="button"
                            aria-label={`${token.names[naming]} ${
                              mode === "light" ? "라이트" : "다크"
                            } ${entry.hex}${
                              grade ? ` 대비 ${grade}` : ""
                            } 복사`}
                            onClick={() =>
                              copy(
                                entry.hex,
                                token.names.tailwind + mode,
                                `${token.names[naming]} ${entry.hex}`,
                              )
                            }
                            className={cn(
                              "flex w-64 cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-left outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/30",
                            )}
                          >
                            <span
                              style={{ backgroundColor: entry.hex }}
                              className="flex size-5 shrink-0 items-center justify-center rounded border"
                            >
                              {copied === token.names.tailwind + mode && (
                                <Check
                                  className="size-3"
                                  style={{ color: readableOn(entry.hex) }}
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                            <span className="tabular-nums text-muted-foreground">
                              {mode === "light" ? "라이트" : "다크"} · {label}
                            </span>
                            {ratio !== null && grade && (
                              <span
                                className={cn(
                                  "ml-auto tabular-nums font-medium",
                                  grade === "Fail"
                                    ? "text-destructive"
                                    : "text-foreground",
                                )}
                              >
                                {grade} {ratio.toFixed(1)}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </CollapsibleCard>
      <CollapsibleCard
        title="라이트·다크 미리보기"
        open={open.preview}
        onOpenChange={toggle("preview")}
      >
        <div className="grid gap-4 @2xl:grid-cols-2">
          <ThemePreview mode="light" semantic={semantic} />
          <ThemePreview mode="dark" semantic={semantic} />
        </div>
      </CollapsibleCard>
    </div>
  )
}
