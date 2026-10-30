export type Oklch = {
  l: number
  c: number
  h: number
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "")
  if (/^[0-9a-f]{3}$/i.test(raw)) {
    return (
      "#" +
      [...raw]
        .map((char) => char + char)
        .join("")
        .toLowerCase()
    )
  }
  if (/^[0-9a-f]{6}$/i.test(raw)) return "#" + raw.toLowerCase()
  return null
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

const toLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

const fromLinear = (channel: number) =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055

function linearToOklab(r: number, g: number, b: number) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

function oklabToLinear(l: number, a: number, b: number) {
  const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
    -1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
    -0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp,
  ]
}

export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = hexToRgb(hex).map((channel) => toLinear(channel / 255))
  const lab = linearToOklab(r, g, b)
  const c = Math.hypot(lab.a, lab.b)
  const h =
    c < 1e-4 ? 0 : ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360
  return { l: lab.l, c, h }
}

function oklchToLinear({ l, c, h }: Oklch) {
  const radians = (h * Math.PI) / 180
  return oklabToLinear(l, c * Math.cos(radians), c * Math.sin(radians))
}

const inGamut = (rgb: number[]) => rgb.every((v) => v >= -0.0005 && v <= 1.0005)

// sRGB 범위를 벗어나면 명도·색조는 두고 채도만 줄여 가장 가까운 색을 찾는다
export function oklchToHex(color: Oklch): string {
  let { c } = color
  if (!inGamut(oklchToLinear({ ...color, c }))) {
    let low = 0
    let high = c
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2
      if (inGamut(oklchToLinear({ ...color, c: mid }))) low = mid
      else high = mid
    }
    c = low
  }
  const channels = oklchToLinear({ ...color, c }).map((value) =>
    Math.round(clamp01(fromLinear(clamp01(value))) * 255),
  )
  return "#" + channels.map((v) => v.toString(16).padStart(2, "0")).join("")
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((channel) => toLinear(channel / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

export type ContrastGrade = "AAA" | "AA" | "AA Large" | "Fail"

export function gradeContrast(ratio: number): ContrastGrade {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}

export function readableOn(background: string) {
  return contrastRatio(background, "#ffffff") >=
    contrastRatio(background, "#000000")
    ? "#ffffff"
    : "#000000"
}

// 글자색의 색조와 채도는 두고 명도만 움직여 목표 대비를 넘는 가장 가까운 색을 찾는다
export function suggestForeground(
  foreground: string,
  background: string,
  target: number,
): string | null {
  const { l, c, h } = hexToOklch(foreground)
  const direction = luminance(background) > 0.5 ? -1 : 1
  for (let i = 1; i <= 100; i++) {
    const next = l + direction * i * 0.01
    if (next < 0 || next > 1) break
    const hex = oklchToHex({ l: next, c, h })
    if (contrastRatio(hex, background) >= target) return hex
  }
  return null
}
