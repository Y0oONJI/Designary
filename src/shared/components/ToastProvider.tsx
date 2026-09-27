import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { ToastContext } from "../hooks/useToast"

type Notice = {
  id: number
  kind: "success" | "error"
  message: string
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const sequence = useRef(0)

  const dismiss = useCallback(() => {
    clearTimeout(timer.current)
    setNotice(null)
  }, [])

  const show = useCallback((kind: Notice["kind"], message: string) => {
    clearTimeout(timer.current)
    setNotice({ id: ++sequence.current, kind, message })
    timer.current = setTimeout(() => setNotice(null), 3000)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const api = useMemo(
    () => ({
      success: (message: string) => show("success", message),
      error: (message: string) => show("error", message),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center">
        <div role="status" aria-live="polite" aria-atomic="true">
          {notice && (
            <div
              key={notice.id}
              className={`pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
                notice.kind === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              <span aria-hidden="true">
                {notice.kind === "success" ? "✓" : "!"}
              </span>
              <span>{notice.message}</span>
              <button
                type="button"
                onClick={dismiss}
                aria-label="알림 닫기"
                className="cursor-pointer rounded px-2 py-1 hover:bg-black/5"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
