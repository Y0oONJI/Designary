import { expect, test } from "vitest"
import {
  quickMultiples,
  snapToFour,
} from "@/features/four-multiple/lib/snapToFour"

test("가까운 4의 배수로 반올림하고 원래 범위(0–700)로 제한한다", () => {
  const cases: [string, number | null][] = [
    ["37", 36],
    ["38", 40],
    ["37.9", 36],
    ["0", 0],
    ["-20", 0],
    ["696", 696],
    ["699", 700],
    ["999", 700],
    [" 12 ", 12],
    ["", null],
    [" ", null],
    ["abc", null],
    ["Infinity", null],
    ["1e309", null],
  ]
  for (const [input, expected] of cases) {
    expect(snapToFour(input), input).toBe(expected)
  }
})

test("빠른 복사 값은 4–696의 4의 배수 174개다", () => {
  expect(quickMultiples).toHaveLength(174)
  expect(quickMultiples[0]).toBe(4)
  expect(quickMultiples.at(-1)).toBe(696)
  expect(quickMultiples.every((n) => n % 4 === 0)).toBe(true)
})
