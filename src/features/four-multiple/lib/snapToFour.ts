// Preserve the range supplied with the original tool: quick copy 4–696,
// calculated results clamped to 0–700.
export const quickMultiples = Array.from({ length: 174 }, (_, i) => (i + 1) * 4)

export function snapToFour(input: string): number | null {
  if (!input.trim()) return null
  const value = Number(input)
  if (!Number.isFinite(value)) return null
  return Math.min(700, Math.max(0, Math.round(value / 4) * 4))
}
