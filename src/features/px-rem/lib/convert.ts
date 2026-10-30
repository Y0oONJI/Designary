export function parseNumber(input: string): number | null {
  if (!input.trim()) return null
  const value = Number(input)
  return Number.isFinite(value) ? value : null
}

export const pxToRem = (px: number, base: number) => px / base

export const remToPx = (rem: number, base: number) => rem * base

export const formatNumber = (value: number) => String(+value.toFixed(4))
