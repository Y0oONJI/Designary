import { useState } from "react"
import { ArrowLeftRight, Check, Copy, X } from "lucide-react"
import ColorField from "@/shared/components/ColorField"
import PageHeader from "@/shared/components/PageHeader"
import Button from "@/shared/components/ui/button"
import Card from "@/shared/components/ui/card"
import Separator from "@/shared/components/ui/separator"
import useClipboard from "@/shared/hooks/useClipboard"
import { contrastRatio, suggestForeground } from "@/shared/lib/color"
import { cn } from "@/shared/lib/utils"

const groups = [
  {
    title: "일반 텍스트",
    description: "본문, 라벨 등 일반 크기의 글자",
    levels: [
      { level: "AA", required: 4.5 },
      { level: "AAA", required: 7 },
    ],
  },
  {
    title: "큰 텍스트",
    description: "24px 이상, 또는 굵은 글씨 18.66px 이상",
    levels: [
      { level: "AA", required: 3 },
      { level: "AAA", required: 4.5 },
    ],
  },
  {
    title: "UI·그래픽",
    description: "버튼 테두리, 아이콘, 차트 같은 요소",
    levels: [{ level: "AA", required: 3 }],
  },
]

function verdict(ratio: number) {
  if (ratio >= 7) return { text: "AAA 통과", pass: true }
  if (ratio >= 4.5) return { text: "AA 통과", pass: true }
  if (ratio >= 3) return { text: "큰 텍스트만 통과", pass: false }
  return { text: "기준 미달", pass: false }
}

// 반올림으로 4.499가 4.5로 보이지 않도록 소수 둘째 자리에서 내린다
const formatRatio = (ratio: number) =>
  (Math.floor(ratio * 100) / 100).toFixed(2)

export default function ContrastChecker() {
  const { copied, copy } = useClipboard()
  const [foreground, setForeground] = useState("#191f28")
  const [background, setBackground] = useState("#ffffff")

  const ratio = contrastRatio(foreground, background)
  const ratioText = formatRatio(ratio) + ":1"
  const result = verdict(ratio)
  const suggestion =
    ratio < 4.5 ? suggestForeground(foreground, background, 4.5) : null

  const swap = () => {
    setForeground(background)
    setBackground(foreground)
  }

  return (
    <>
      <PageHeader
        title="컬러 대비 검사기"
        description="글자색과 배경색을 고르면 명암비와 WCAG 2.x AA/AAA 충족 여부를 알려줘요."
      />
      <Card className="overflow-hidden">
        <div className="grid @2xl:grid-cols-2">
          <div className="space-y-6 p-5 sm:p-6 @3xl:p-8">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-5">
              <ColorField
                label="글자색"
                value={foreground}
                onChange={setForeground}
              />
              <Button
                variant="outline"
                size="icon"
                aria-label="글자색과 배경색 바꾸기"
                onClick={swap}
                className="mt-6"
              >
                <ArrowLeftRight aria-hidden="true" />
              </Button>
              <ColorField
                label="배경색"
                value={background}
                onChange={setBackground}
              />
            </div>
            {suggestion && (
              <div className="rounded-md border bg-muted/35 p-4 text-sm">
                <p className="mb-3 text-muted-foreground">
                  일반 텍스트 AA(4.5:1)를 넘기려면 글자색을 이렇게 바꿔 보세요.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    style={{ backgroundColor: suggestion }}
                    className="size-6 rounded border"
                  />
                  <code className="tabular-nums">{suggestion}</code>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatRatio(contrastRatio(suggestion, background))}:1
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setForeground(suggestion)}
                  >
                    적용
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div
            style={{ backgroundColor: background, color: foreground }}
            className="flex min-h-56 flex-col justify-center gap-3 border-t p-6 @2xl:border-l @2xl:border-t-0 @3xl:p-8"
          >
            <p className="text-3xl font-semibold">큰 텍스트 Aa</p>
            <p className="text-sm leading-relaxed">
              일반 텍스트 미리보기예요. 디자인 시스템은 읽히는 색에서 시작해요.
            </p>
            <span
              style={{ borderColor: foreground }}
              className="w-fit rounded-md border-2 px-3 py-1.5 text-sm font-medium"
            >
              UI 컴포넌트
            </span>
          </div>
        </div>
        <Separator />
        <div className="p-5 sm:p-6" aria-live="polite">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="flex items-baseline gap-3">
                <span className="text-4xl font-medium tracking-tight tabular-nums">
                  {ratioText}
                </span>
                <span className="text-sm text-muted-foreground">명암비</span>
              </p>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-semibold",
                  result.pass
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {result.text}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              aria-label={ratioText + " 복사"}
              onClick={() => copy(ratioText, "ratio")}
            >
              {copied === "ratio" ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              복사
            </Button>
          </div>
          <div className="grid gap-3 @2xl:grid-cols-3">
            {groups.map(({ title, description, levels }) => (
              <div key={title} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mb-4 mt-1 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <ul className="space-y-2">
                  {levels.map(({ level, required }) => {
                    const pass = ratio >= required
                    return (
                      <li
                        key={level}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-sm font-medium">
                          {level}
                          <span className="ml-2 font-normal tabular-nums text-muted-foreground">
                            {required}:1
                          </span>
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold",
                            pass
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive",
                          )}
                        >
                          {pass ? (
                            <Check className="size-4" aria-hidden="true" />
                          ) : (
                            <X className="size-4" aria-hidden="true" />
                          )}
                          {pass ? "통과" : "실패"}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
