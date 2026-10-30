import Card from "@/shared/components/ui/card"
import Input from "@/shared/components/ui/input"
import Label from "@/shared/components/ui/label"
import Button from "@/shared/components/ui/button"
import { typeName, type Naming } from "../lib/tokens"
import { ratios, type TypeStep } from "../lib/typeScale"

type Props = {
  typeScale: TypeStep[]
  naming: Naming
  baseSize: string
  ratio: number
  baseInvalid: boolean
  onBaseSizeChange: (value: string) => void
  onRatioChange: (value: number) => void
}

export default function TypographyPanel({
  typeScale,
  naming,
  baseSize,
  ratio,
  baseInvalid,
  onBaseSizeChange,
  onRatioChange,
}: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-end gap-6 border-b p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="base-size">기본 글자 크기</Label>
          <div className="relative w-32">
            <Input
              id="base-size"
              type="number"
              min={10}
              max={32}
              value={baseSize}
              aria-invalid={baseInvalid}
              aria-describedby="base-size-hint"
              onChange={(event) => onBaseSizeChange(event.target.value)}
              className="pr-9 tabular-nums"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              px
            </span>
          </div>
          <p
            id="base-size-hint"
            className={
              baseInvalid
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {baseInvalid
              ? "10–32 사이 숫자를 입력해 주세요."
              : "본문 기준, 보통 14–16px"}
          </p>
        </div>
        <div className="space-y-2">
          <Label id="ratio-label">스케일 비율</Label>
          <div
            role="group"
            aria-labelledby="ratio-label"
            className="flex gap-2"
          >
            {ratios.map(({ value, label }) => (
              <Button
                key={value}
                variant={ratio === value ? "default" : "outline"}
                aria-pressed={ratio === value}
                onClick={() => onRatioChange(value)}
                className="tabular-nums"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <ul className="divide-y">
        {typeScale
          .map((step, index) => ({ step, index }))
          .reverse()
          .map(({ step, index }) => {
            return (
              <li
                key={step.key}
                className="grid items-center gap-x-6 gap-y-1 px-5 py-4 sm:px-6 @2xl:grid-cols-[12rem_1fr]"
              >
                <div className="text-xs text-muted-foreground">
                  <code className="font-medium text-foreground">
                    {typeName(step, index, naming)}
                  </code>
                  <p className="tabular-nums">
                    {step.size}px / {step.lineHeight}px · {step.weight}
                  </p>
                </div>
                <p
                  className="truncate"
                  style={{
                    fontSize: step.size,
                    lineHeight: step.lineHeight + "px",
                    fontWeight: step.weight,
                    letterSpacing: step.letterSpacing + "em",
                  }}
                >
                  디자인 시스템 Aa 123
                </p>
              </li>
            )
          })}
      </ul>
    </Card>
  )
}
