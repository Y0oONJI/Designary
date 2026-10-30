import { hexToOklch, oklchToHex, type Oklch } from "@/shared/lib/color"

export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
export type Step = typeof steps[number]
export type Scale = Record<Step, string>

export const scaleNames = [
  "primary",
  "neutral",
  "success",
  "warning",
  "error",
  "info",
] as const
export type ScaleName = typeof scaleNames[number]
export type Palette = Record<ScaleName, Scale>

// 500을 기준으로 밝은 쪽은 0.98, 어두운 쪽은 0.24 명도를 향해 단계별 비율만큼 이동한다
const lightMix: Partial<Record<Step, number>> = {
  50: 0.96,
  100: 0.88,
  200: 0.74,
  300: 0.52,
  400: 0.28,
}
const darkMix: Partial<Record<Step, number>> = {
  600: 0.18,
  700: 0.38,
  800: 0.58,
  900: 0.78,
}
const chromaRatio: Record<Step, number> = {
  50: 0.14,
  100: 0.28,
  200: 0.5,
  300: 0.75,
  400: 0.92,
  500: 1,
  600: 0.95,
  700: 0.85,
  800: 0.7,
  900: 0.55,
}

const lightEnd = 0.98
const darkEnd = 0.24
// 아주 밝거나 어두운 색도 단계가 한 색으로 뭉치지 않도록 최소한의 이동폭을 둔다
const minTravel = 0.14

export function buildScale(base: Oklch): Scale {
  const scale = {} as Scale
  const lightTarget = Math.min(1, Math.max(lightEnd, base.l + minTravel))
  const darkTarget = Math.max(0.04, Math.min(darkEnd, base.l - minTravel))
  for (const step of steps) {
    const light = lightMix[step]
    const dark = darkMix[step]
    const l =
      light !== undefined
        ? base.l + (lightTarget - base.l) * light
        : dark !== undefined
          ? base.l + (darkTarget - base.l) * dark
          : base.l
    scale[step] = oklchToHex({ l, c: base.c * chromaRatio[step], h: base.h })
  }
  return scale
}

function buildNeutral(hue: number): Scale {
  const levels: Record<Step, number> = {
    50: 0.98,
    100: 0.96,
    200: 0.92,
    300: 0.87,
    400: 0.71,
    500: 0.55,
    600: 0.44,
    700: 0.37,
    800: 0.27,
    900: 0.2,
  }
  const scale = {} as Scale
  for (const step of steps) {
    scale[step] = oklchToHex({ l: levels[step], c: 0.014, h: hue })
  }
  return scale
}

const statusBases = {
  success: { l: 0.6, c: 0.15, h: 150 },
  warning: { l: 0.78, c: 0.15, h: 75 },
  error: { l: 0.6, c: 0.2, h: 25 },
  info: { l: 0.62, c: 0.14, h: 235 },
} satisfies Record<string, Oklch>

export function generatePalette(primaryHex: string): Palette {
  const primary = hexToOklch(primaryHex)
  return {
    primary: buildScale(primary),
    neutral: buildNeutral(primary.h),
    success: buildScale(statusBases.success),
    warning: buildScale(statusBases.warning),
    error: buildScale(statusBases.error),
    info: buildScale(statusBases.info),
  }
}
