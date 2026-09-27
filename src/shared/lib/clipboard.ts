export async function copyToClipboard(text: string): Promise<void> {
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
  if (copied) return
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  throw new Error("Clipboard unavailable")
}
