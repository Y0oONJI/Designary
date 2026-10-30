import { expect, test } from "vitest"
import {
  contrastRatio,
  normalizeHex,
  suggestForeground,
} from "@/shared/lib/color"
import {
  formatNumber,
  parseNumber,
  pxToRem,
  remToPx,
} from "@/features/px-rem/lib/convert"

test("명암비가 WCAG 기준값과 맞는다", () => {
  expect(contrastRatio("#000000", "#ffffff").toFixed(2)).toBe("21.00")
  expect(contrastRatio("#ffffff", "#ffffff").toFixed(2)).toBe("1.00")
  expect(contrastRatio("#767676", "#ffffff").toFixed(2)).toBe("4.54")
  expect(contrastRatio("#777777", "#ffffff")).toBeLessThan(4.5)
})

test("HEX는 3자리와 6자리만 받아들인다", () => {
  expect(normalizeHex("#ABC")).toBe("#aabbcc")
  expect(normalizeHex("2272EB")).toBe("#2272eb")
  for (const bad of ["", "#12", "#12345", "zzzzzz", "#1234567"]) {
    expect(normalizeHex(bad), bad).toBeNull()
  }
})

test("제안한 글자색은 목표 명암비를 넘는다", () => {
  const hex = suggestForeground("#aaaaaa", "#ffffff", 4.5)
  expect(hex).not.toBeNull()
  expect(contrastRatio(hex!, "#ffffff")).toBeGreaterThanOrEqual(4.5)
  expect(suggestForeground("#ffffff", "#ffffff", 22)).toBeNull()
})

test("중간 밝기 배경에서는 어두운 쪽 색을 제안한다", () => {
  const hex = suggestForeground("#999999", "#808080", 4.5)
  expect(hex).not.toBeNull()
  expect(contrastRatio(hex!, "#808080")).toBeGreaterThanOrEqual(4.5)
})

test("px와 rem을 기준 크기에 맞춰 변환한다", () => {
  expect(pxToRem(24, 16)).toBe(1.5)
  expect(remToPx(1.5, 10)).toBe(15)
  expect(formatNumber(10 / 3)).toBe("3.3333")
  expect(parseNumber("")).toBeNull()
  expect(parseNumber("abc")).toBeNull()
  expect(parseNumber("1e309")).toBeNull()
  expect(parseNumber(" 12 ")).toBe(12)
})
