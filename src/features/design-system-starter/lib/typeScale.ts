export type TypeStep = {
  key: string
  exponent: number
  size: number
  lineHeight: number
  weight: number
  letterSpacing: number
}

export const ratios = [
  { value: 1.125, label: "1.125" },
  { value: 1.2, label: "1.2" },
  { value: 1.25, label: "1.25" },
  { value: 1.333, label: "1.333" },
] as const

const stepDefs = [
  { key: "caption", exponent: -2 },
  { key: "small", exponent: -1 },
  { key: "body", exponent: 0 },
  { key: "title-sm", exponent: 1 },
  { key: "title", exponent: 2 },
  { key: "heading", exponent: 3 },
  { key: "display-sm", exponent: 4 },
  { key: "display", exponent: 5 },
] as const

const roundToFour = (value: number) => Math.round(value / 4) * 4

export function generateTypeScale(baseSize: number, ratio: number): TypeStep[] {
  return stepDefs.map(({ key, exponent }) => {
    const size = Math.round(baseSize * ratio ** exponent)
    const lineRatio =
      size <= 16 ? 1.5 : size <= 24 ? 1.4 : size <= 36 ? 1.3 : 1.2
    return {
      key,
      exponent,
      size,
      lineHeight: Math.max(roundToFour(size * lineRatio), size),
      weight: exponent <= 0 ? 400 : exponent <= 2 ? 600 : 700,
      letterSpacing: size >= 32 ? -0.02 : size >= 24 ? -0.01 : 0,
    }
  })
}
