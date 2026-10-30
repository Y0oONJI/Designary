import type { Mode, SemanticToken } from "../lib/tokens"

export default function ThemePreview({
  mode,
  semantic,
}: {
  mode: Mode
  semantic: SemanticToken[]
}) {
  const byName = new Map(semantic.map((token) => [token.names.tailwind, token]))
  const color = (name: string) => byName.get(name)![mode].hex
  const statuses = [
    ["success", "성공"],
    ["warning", "경고"],
    ["error", "오류"],
    ["info", "정보"],
  ] as const

  return (
    <div
      role="img"
      aria-label={`${mode === "light" ? "라이트" : "다크"} 모드 미리보기`}
      style={{
        backgroundColor: color("background"),
        color: color("foreground"),
        borderColor: color("border"),
      }}
      className="space-y-3 rounded-xl border p-4"
    >
      <p className="text-xs" style={{ color: color("muted-foreground") }}>
        {mode === "light" ? "라이트" : "다크"} 미리보기
      </p>
      <div
        style={{ backgroundColor: color("card"), borderColor: color("border") }}
        className="space-y-3 rounded-lg border p-4"
      >
        <p className="text-base font-semibold">카드 제목</p>
        <p className="text-sm" style={{ color: color("muted-foreground") }}>
          보조 설명은 이렇게 보여요.
        </p>
        <div className="flex flex-wrap gap-2">
          <span
            style={{
              backgroundColor: color("primary"),
              color: color("primary-foreground"),
            }}
            className="rounded-md px-3 py-1.5 text-sm font-medium"
          >
            기본 버튼
          </span>
          <span
            style={{
              backgroundColor: color("accent"),
              color: color("accent-foreground"),
            }}
            className="rounded-md px-3 py-1.5 text-sm font-medium"
          >
            보조 버튼
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(([status, label]) => (
            <span
              key={status}
              style={{
                backgroundColor: color(`${status}-bg`),
                borderColor: color(`${status}-border`),
                color: color(`${status}-text`),
              }}
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
