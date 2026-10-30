function legacyCopy(text: string) {
  const previousFocus = document.activeElement
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0"
  textarea.setAttribute("readonly", "")
  document.body.appendChild(textarea)
  let copied = false
  try {
    textarea.focus({ preventScroll: true })
    textarea.select()
    copied = document.execCommand("copy")
  } catch {
    copied = false
  } finally {
    textarea.remove()
    if (previousFocus instanceof HTMLElement)
      previousFocus.focus({ preventScroll: true })
  }
  if (!copied) throw new Error("Clipboard unavailable")
}

// 포커스를 건드리지 않는 클립보드 API를 먼저 쓰고, 막힌 환경에서만 옛 방식으로 다시 시도한다
export async function copyToClipboard(text: string): Promise<void> {
  let failure: unknown = new Error("Clipboard unavailable")
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (error) {
      failure = error
    }
  }
  try {
    legacyCopy(text)
  } catch {
    throw failure
  }
}
