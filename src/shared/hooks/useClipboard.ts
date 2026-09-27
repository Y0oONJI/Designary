import { useEffect, useRef, useState } from "react"
import { copyToClipboard } from "../lib/clipboard"

export default function useClipboard() {
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const request = useRef(0)

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      request.current += 1
    },
    [],
  )

  async function copy(text: string, id = text) {
    const current = ++request.current
    clearTimeout(timer.current)
    setCopied(null)
    setError("")
    try {
      await copyToClipboard(text)
      if (request.current !== current) return
      setCopied(id)
      timer.current = setTimeout(() => setCopied(null), 1200)
    } catch {
      if (request.current === current)
        setError("복사하지 못했어요. 다시 시도해 주세요.")
    }
  }

  return { copied, error, copy }
}
