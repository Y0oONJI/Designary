import { useState } from "react"
import { ArrowLeftRight, Check, Copy } from "lucide-react"
import InfoTip from "@/shared/components/InfoTip"
import PageHeader from "@/shared/components/PageHeader"
import Button from "@/shared/components/ui/button"
import Card from "@/shared/components/ui/card"
import Input from "@/shared/components/ui/input"
import Label from "@/shared/components/ui/label"
import Separator from "@/shared/components/ui/separator"
import useClipboard from "@/shared/hooks/useClipboard"
import { cn } from "@/shared/lib/utils"
import { formatNumber, parseNumber, pxToRem, remToPx } from "./lib/convert"

const commonPx = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64]

export default function PxRemConverter() {
  const { copied, copy } = useClipboard()
  const [baseInput, setBaseInput] = useState("16")
  const [source, setSource] = useState<"px" | "rem">("px")
  const [value, setValue] = useState("24")

  const parsedBase = parseNumber(baseInput)
  const base = parsedBase !== null && parsedBase > 0 ? parsedBase : null
  const parsedValue = parseNumber(value)
  const valueInvalid = value.trim() !== "" && parsedValue === null

  const converted =
    base !== null && parsedValue !== null
      ? source === "px"
        ? formatNumber(pxToRem(parsedValue, base))
        : formatNumber(remToPx(parsedValue, base))
      : ""
  const px = source === "px" ? value : converted
  const rem = source === "rem" ? value : converted

  const edit = (next: "px" | "rem", text: string) => {
    setSource(next)
    setValue(text)
  }

  const results = [
    { unit: "px", text: px },
    { unit: "rem", text: rem },
  ]

  return (
    <>
      <PageHeader
        title="px ↔ rem 변환기"
        description="1rem이 몇 px인지 정하고 px와 rem을 서로 변환하세요. 결과는 눌러서 복사해요."
      />
      <Card className="overflow-hidden">
        <div className="grid @2xl:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-6 p-5 sm:p-6 @3xl:p-8">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="rem-base">1rem의 크기</Label>
                <InfoTip label="1rem의 크기 설명">
                  <p>
                    rem은 사이트의 기본 글자 크기(html font-size)를 1로 보는
                    단위예요. 기본값이 16px이면 1rem = 16px, 24px =
                    1.5rem이에요.
                  </p>
                  <p className="mt-2">
                    프로젝트에서 html 글자 크기를 바꿨다면 그 값을 넣어 주세요.
                    아래 px/rem 칸과 자주 쓰는 값이 모두 이 기준으로 계산돼요.
                  </p>
                </InfoTip>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums">1rem =</span>
                <div className="relative w-32">
                  <Input
                    id="rem-base"
                    type="number"
                    min={1}
                    value={baseInput}
                    aria-invalid={base === null}
                    aria-describedby="rem-base-hint"
                    onChange={(event) => setBaseInput(event.target.value)}
                    className="pr-9 tabular-nums"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
              </div>
              <p
                id="rem-base-hint"
                className={cn(
                  "text-xs",
                  base === null ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {base === null
                  ? "0보다 큰 숫자를 입력해 주세요."
                  : "브라우저 기본값은 16px이에요. 보통은 그대로 두면 돼요."}
              </p>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <div className="space-y-2">
                <Label htmlFor="px-value">px</Label>
                <Input
                  id="px-value"
                  type="number"
                  step="any"
                  value={px}
                  aria-invalid={source === "px" && valueInvalid}
                  onChange={(event) => edit("px", event.target.value)}
                  className="h-12 text-base tabular-nums"
                />
              </div>
              <ArrowLeftRight
                aria-hidden="true"
                className="mb-4 size-4 text-muted-foreground"
              />
              <div className="space-y-2">
                <Label htmlFor="rem-value">rem</Label>
                <Input
                  id="rem-value"
                  type="number"
                  step="any"
                  value={rem}
                  aria-invalid={source === "rem" && valueInvalid}
                  onChange={(event) => edit("rem", event.target.value)}
                  className="h-12 text-base tabular-nums"
                />
              </div>
            </div>
            {valueInvalid && (
              <p role="alert" className="text-xs text-destructive">
                유효한 숫자를 입력해 주세요.
              </p>
            )}
          </div>
          <Separator orientation="vertical" className="hidden @2xl:block" />
          <div
            className="flex min-h-48 flex-col justify-center gap-3 border-t bg-muted/35 p-6 @2xl:border-t-0"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-sm text-muted-foreground">변환 결과</p>
            {results.map(({ unit, text }) => (
              <Button
                key={unit}
                variant="outline"
                disabled={!converted}
                aria-label={
                  converted ? text + unit + " 복사" : unit + " 결과 없음"
                }
                onClick={() => copy(text + unit, "result-" + unit)}
                className="h-14 w-full justify-between px-5 font-normal tabular-nums"
              >
                <span className="text-sm text-muted-foreground">{unit}</span>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="truncate text-xl font-medium">
                    {converted ? text + unit : "–"}
                  </span>
                  {copied === "result-" + unit ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <Separator />
        <div className="p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold">자주 쓰는 값</h2>
          {base === null ? (
            <p className="text-xs text-muted-foreground">
              1rem의 크기를 먼저 입력해 주세요.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 @lg:grid-cols-4 @4xl:grid-cols-6">
              {commonPx.map((size) => {
                const text = formatNumber(pxToRem(size, base)) + "rem"
                return (
                  <Button
                    key={size}
                    variant="outline"
                    aria-label={`${size}px ${text} 복사`}
                    onClick={() =>
                      copy(text, "common-" + size, `${size}px = ${text}`)
                    }
                    className={cn(
                      "h-10 justify-between font-normal tabular-nums",
                      copied === "common-" + size &&
                        "border-primary bg-accent text-primary",
                    )}
                  >
                    <span className="text-muted-foreground">{size}px</span>
                    {copied === "common-" + size ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <span className="font-medium text-foreground">
                        {text}
                      </span>
                    )}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
