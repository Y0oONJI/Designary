import { useState } from "react"
import { ArrowRight, Calculator, Check, Copy, RotateCcw } from "lucide-react"
import PageHeader from "@/shared/components/PageHeader"
import Button from "@/shared/components/ui/button"
import Card from "@/shared/components/ui/card"
import Input from "@/shared/components/ui/input"
import Label from "@/shared/components/ui/label"
import Separator from "@/shared/components/ui/separator"
import Tabs from "@/shared/components/ui/tabs"
import TabsList from "@/shared/components/ui/tabs-list"
import TabsTrigger from "@/shared/components/ui/tabs-trigger"
import TabsContent from "@/shared/components/ui/tabs-content"
import useClipboard from "@/shared/hooks/useClipboard"
import { cn } from "@/shared/lib/utils"
import { quickMultiples, snapToFour } from "./lib/snapToFour"

const commonValues = [4, 8, 12, 16, 24, 32, 48, 64]

export default function FourMultipleSnapTool() {
  const { copied, copy } = useClipboard()
  const [singleInput, setSingleInput] = useState("")
  const [calcResult, setCalcResult] = useState<number | null>(null)
  const [invalid, setInvalid] = useState(false)

  const handleSingleClear = () => {
    setSingleInput("")
    setCalcResult(null)
    setInvalid(false)
  }

  return (
    <>
      <PageHeader
        title="4의 배수 스냅 툴"
        description="숫자를 클릭해 복사하거나, 가장 가까운 4의 배수를 계산하세요."
      />
      <Tabs defaultValue="quick">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList aria-label="스냅 툴 모드">
            <TabsTrigger value="quick">
              <Copy aria-hidden="true" />
              빠른 복사
            </TabsTrigger>
            <TabsTrigger value="calculate">
              <Calculator aria-hidden="true" />
              계산하기
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="quick">
          <Card>
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">자주 쓰는 간격</h2>
              </div>
              <div className="grid grid-cols-4 gap-2 @lg:grid-cols-8">
                {commonValues.map((num) => (
                  <Button
                    key={num}
                    variant="secondary"
                    aria-label={num + " 복사"}
                    onClick={() => copy(String(num), "common-" + num)}
                    className={cn(
                      "h-10 border border-transparent bg-accent/60 px-2 text-sm tabular-nums text-accent-foreground hover:border-ring/40 hover:bg-accent",
                      copied === "common-" + num && "border-primary bg-accent",
                    )}
                  >
                    {copied === "common-" + num ? (
                      <Check aria-hidden="true" />
                    ) : (
                      num
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">전체 값</h2>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 @lg:grid-cols-8 @4xl:grid-cols-12">
                {quickMultiples.map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    aria-label={
                      num + " 복사" + (copied === String(num) ? " 완료" : "")
                    }
                    onClick={() => copy(String(num))}
                    className={cn(
                      "h-10 border-border px-2 font-normal tabular-nums",
                      copied === String(num) &&
                        "border-primary bg-accent text-primary",
                    )}
                  >
                    {copied === String(num) ? (
                      <Check aria-hidden="true" />
                    ) : (
                      num
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="calculate">
          <Card className="overflow-hidden">
            <div className="grid @2xl:grid-cols-2">
              <form
                className="space-y-6 p-5 sm:p-6 @3xl:p-8"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault()
                  const result = snapToFour(singleInput)
                  setCalcResult(result)
                  setInvalid(result === null)
                }}
              >
                <div className="space-y-3">
                  <Label htmlFor="single-input">변환할 숫자</Label>
                  <div className="relative">
                    <Input
                      id="single-input"
                      type="number"
                      step="any"
                      aria-invalid={invalid}
                      aria-describedby={
                        invalid
                          ? "single-input-error single-input-hint"
                          : "single-input-hint"
                      }
                      value={singleInput}
                      onChange={(event) => {
                        setSingleInput(event.target.value)
                        setCalcResult(null)
                        setInvalid(false)
                      }}
                      placeholder="예: 37"
                      className="h-12 pr-12 text-base tabular-nums"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      px
                    </span>
                  </div>
                  {invalid && (
                    <p
                      id="single-input-error"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      유효한 숫자를 입력해 주세요.
                    </p>
                  )}
                  <p
                    id="single-input-hint"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    음수와 소수도 입력할 수 있어요. 결과는 0–700 범위로
                    제한하며, 중간값은 올림합니다.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    계산하기
                    <ArrowRight aria-hidden="true" />
                  </Button>
                  <Button variant="outline" onClick={handleSingleClear}>
                    <RotateCcw aria-hidden="true" />
                    초기화
                  </Button>
                </div>
              </form>
              <div
                className="flex min-h-72 flex-col items-center justify-center border-t bg-muted/35 p-6 @2xl:border-l @2xl:border-t-0"
                aria-live="polite"
                aria-atomic="true"
              >
                {calcResult !== null ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      가장 가까운 4의 배수
                    </p>
                    <p className="my-4 flex items-baseline gap-2">
                      <span className="text-5xl font-medium tracking-tight tabular-nums text-primary">
                        {calcResult}
                      </span>
                      <span className="text-sm text-muted-foreground">px</span>
                    </p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        copy(String(calcResult), "result-" + calcResult)
                      }
                      aria-label={calcResult + " 복사"}
                    >
                      {copied === "result-" + calcResult ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <Copy aria-hidden="true" />
                      )}
                      {copied === "result-" + calcResult
                        ? "복사했어요"
                        : "결과 복사"}
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    숫자를 입력하면 결과가 표시됩니다.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
