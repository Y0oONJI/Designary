import { describe, expect, test } from "vitest"
import { contrastRatio, hexToOklch } from "@/shared/lib/color"
import { buildExport } from "@/features/design-system-starter/lib/exporters"
import {
  generatePalette,
  scaleNames,
  steps,
} from "@/features/design-system-starter/lib/palette"
import { buildSemanticTokens } from "@/features/design-system-starter/lib/tokens"
import { generateTypeScale } from "@/features/design-system-starter/lib/typeScale"

const primaries = [
  "#2272eb",
  "#ffd400",
  "#ffff00",
  "#111111",
  "#e11d48",
  "#16a34a",
]

describe("팔레트", () => {
  test("입력한 색이 500 단계가 된다", () => {
    for (const hex of primaries) {
      expect(generatePalette(hex).primary[500]).toBe(hex)
    }
  })

  test("단계가 높아질수록 어두워진다", () => {
    for (const hex of primaries) {
      const palette = generatePalette(hex)
      for (const scale of scaleNames) {
        const lightness = steps.map(
          (step) => hexToOklch(palette[scale][step]).l,
        )
        for (let i = 1; i < lightness.length; i++) {
          expect(
            lightness[i],
            `${hex} ${scale} ${steps[i]}`,
          ).toBeLessThanOrEqual(lightness[i - 1] + 1e-3)
        }
      }
    }
  })
})

describe("시맨틱 토큰", () => {
  test("글자와 배경 짝은 라이트·다크 모두 AA(4.5:1) 이상이다", () => {
    for (const hex of primaries) {
      const tokens = buildSemanticTokens(generatePalette(hex))
      const byName = new Map(tokens.map((t) => [t.names.tailwind, t]))
      for (const token of tokens) {
        if (!token.pair) continue
        for (const mode of ["light", "dark"] as const) {
          const ratio = contrastRatio(
            token[mode].hex,
            byName.get(token.pair)![mode].hex,
          )
          expect(
            ratio,
            `${hex} ${token.names.tailwind} ${mode}`,
          ).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })
})

describe("내보내기", () => {
  const palette = generatePalette("#2272eb")
  const semantic = buildSemanticTokens(palette)
  const typeScale = generateTypeScale(16, 1.2)

  test("Tailwind v4 형식에 필요한 블록이 모두 있다", () => {
    const css = buildExport("tailwind", {
      palette,
      semantic,
      typeScale,
      naming: "tailwind",
    })
    for (const part of [
      "@theme {",
      "--color-primary-500: #2272eb;",
      ":root {",
      ".dark {",
      "@theme inline {",
      "--color-background: var(--background);",
      "--text-base: 1rem;",
    ]) {
      expect(css, part).toContain(part)
    }
  })

  test("역할식 이름 규칙이 적용된다", () => {
    const css = buildExport("css", {
      palette,
      semantic,
      typeScale,
      naming: "role",
    })
    expect(css).toContain("--color-brand-500: #2272eb;")
    expect(css).toContain("--surface-page:")
    expect(css).not.toContain("--color-primary-500")
  })

  test("JSON의 별칭은 실제 존재하는 토큰을 가리킨다", () => {
    const json = JSON.parse(
      buildExport("json", { palette, semantic, typeScale, naming: "tailwind" }),
    )
    expect(json.color.primitive.primary["500"].$value).toBe("#2272eb")
    const alias: string = json.color.semantic.light.primary.$value
    const [, scale, step] = alias.match(/^\{color\.primitive\.(\w+)\.(\d+)\}$/)!
    expect(json.color.primitive[scale][step].$value).toBe("#2272eb")
  })
})

describe("타입 스케일", () => {
  test("본문은 기준 크기이고, 크기는 커지며, 줄 높이는 4의 배수다", () => {
    const scale = generateTypeScale(16, 1.25)
    expect(scale.find((s) => s.key === "body")!.size).toBe(16)
    for (let i = 1; i < scale.length; i++) {
      expect(scale[i].size).toBeGreaterThan(scale[i - 1].size)
    }
    for (const step of scale) {
      expect(step.lineHeight % 4).toBe(0)
      expect(step.lineHeight).toBeGreaterThanOrEqual(step.size)
    }
  })
})
