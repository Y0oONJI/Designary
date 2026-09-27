import { useState } from "react"
import useToast from "@/shared/hooks/useToast"
import { copyToClipboard } from "@/shared/lib/clipboard"
import { quickMultiples, snapToFour } from "./lib/snapToFour"

export default function FourMultipleSnapTool() {
  const toast = useToast()
  const [mode, setMode] = useState<"quick" | "calculate">("quick")
  const [singleInput, setSingleInput] = useState("")
  const [calcResult, setCalcResult] = useState<number | null>(null)

  const handleSingleCalc = () => {
    const result = snapToFour(singleInput)
    setCalcResult(result)
    if (result === null) toast.error("유효한 숫자를 입력해 주세요.")
  }

  const handleSingleClear = () => {
    setSingleInput("")
    setCalcResult(null)
  }

  const handleChipClick = async (value: number) => {
    try {
      await copyToClipboard(String(value))
      toast.success(`${value} 복사됨!`)
    } catch {
      toast.error("복사하지 못했어요. 다시 시도해 주세요.")
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12"
      style={{
        backgroundColor: "#f5f5f7",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif',
      }}
    >
      <div
        className="w-full bg-white shadow-lg"
        style={{
          maxWidth: "840px",
          borderRadius: "16px",
          padding: "32px 24px",
        }}
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
              4의 배수 스냅 툴
            </h1>
          </div>
          <p style={{ fontSize: "15px", color: "#6b7280" }}>
            4의 배수 숫자를 간편하게 구할때 사용하는 툴입니다.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            aria-pressed={mode === "quick"}
            onClick={() => setMode("quick")}
            className="transition-colors"
            style={{
              borderRadius: "999px",
              padding: "6px 12px",
              border: `1px solid ${mode === "quick" ? "#111827" : "#d1d5db"}`,
              backgroundColor: mode === "quick" ? "#111827" : "#f9fafb",
              color: mode === "quick" ? "#ffffff" : "#4b5563",
              cursor: "pointer",
            }}
          >
            빠른 복사
          </button>
          <button
            aria-pressed={mode === "calculate"}
            onClick={() => setMode("calculate")}
            className="transition-colors"
            style={{
              borderRadius: "999px",
              padding: "6px 12px",
              border: `1px solid ${
                mode === "calculate" ? "#111827" : "#d1d5db"
              }`,
              backgroundColor: mode === "calculate" ? "#111827" : "#f9fafb",
              color: mode === "calculate" ? "#ffffff" : "#4b5563",
              cursor: "pointer",
            }}
          >
            계산하기
          </button>
        </div>

        {mode === "quick" && (
          <div>
            <p
              className="block mb-3"
              style={{ fontSize: "14px", color: "#374151" }}
            >
              클릭해서 복사하기
            </p>
            <div className="flex flex-wrap gap-2">
              {quickMultiples.map((num) => (
                <button
                  key={num}
                  aria-label={`${num} 복사`}
                  onClick={() => handleChipClick(num)}
                  className="transition-colors bg-gray-50 hover:bg-gray-200"
                  style={{
                    borderRadius: "999px",
                    padding: "6px 14px",
                    border: "1px solid #d1d5db",
                    color: "#374151",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "calculate" && (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              handleSingleCalc()
            }}
            noValidate
          >
            <div>
              <label
                htmlFor="single-input"
                className="block mb-2"
                style={{ fontSize: "14px", color: "#374151" }}
              >
                숫자 입력
              </label>
              <input
                id="single-input"
                type="number"
                step="any"
                aria-describedby="single-input-hint"
                value={singleInput}
                onChange={(e) => {
                  setSingleInput(e.target.value)
                  setCalcResult(null)
                }}
                placeholder="예: 37"
                className="w-full transition-colors focus:outline-none"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  padding: "10px 14px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#111827")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              <p
                id="single-input-hint"
                style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}
              >
                음수/소수도 입력 가능합니다. 결과는 0–700 범위로 제한하며,
                중간값은 올림합니다.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="transition-colors hover:opacity-90"
                style={{
                  borderRadius: "999px",
                  padding: "10px 24px",
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                계산하기
              </button>
              <button
                type="button"
                onClick={handleSingleClear}
                className="transition-colors"
                style={{
                  borderRadius: "999px",
                  padding: "10px 24px",
                  backgroundColor: "transparent",
                  color: "#4b5563",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                초기화
              </button>
            </div>

            {calcResult !== null ? (
              <button
                type="button"
                aria-label={`${calcResult} 복사`}
                onClick={() => handleChipClick(calcResult)}
                className="w-full cursor-pointer transition-colors bg-white hover:bg-gray-50"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <span
                  className="block"
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  가장 가까운 4의 배수 (0–700)
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#111827",
                  }}
                >
                  {calcResult}
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "8px",
                  }}
                >
                  클릭해서 복사하기
                </span>
              </button>
            ) : (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  borderRadius: "10px",
                  padding: "24px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                여기에 계산 결과 카드가 표시될 예정입니다.
              </div>
            )}
          </form>
        )}
      </div>

      <div
        style={{
          marginTop: "8px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "12px",
        }}
      >
        Copyright © 2026 OiN0oJY. All rights reserved.
      </div>
    </div>
  )
}
