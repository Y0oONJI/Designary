import { describe, expect, test } from "vitest"
import { categories, groups } from "@/features/glossary/data/categories"
import { filterCategories } from "@/features/glossary/lib/filter"

const search = (query: string) =>
  filterCategories(categories, { query, group: null, category: null }).flatMap(
    (category) => category.terms.map((term) => term.en),
  )

describe("용어 데이터", () => {
  test("분류 id는 유일하고 모두 존재하는 대분류에 속한다", () => {
    const ids = categories.map((category) => category.id)
    expect(new Set(ids).size).toBe(ids.length)
    const groupIds = new Set(groups.map((group) => group.id))
    for (const category of categories) {
      expect(groupIds.has(category.group), category.id).toBe(true)
    }
  })

  test("같은 분류 안에는 같은 영문 용어가 두 번 들어가지 않는다", () => {
    for (const category of categories) {
      const names = category.terms.map((term) => term.en.toLowerCase())
      expect(new Set(names).size, category.id).toBe(names.length)
    }
  })

  test("모든 용어에 영문 이름과 한글 설명이 있다", () => {
    for (const category of categories) {
      for (const term of category.terms) {
        expect(term.en.trim(), category.id).not.toBe("")
        expect(term.ko.trim(), term.en).not.toBe("")
      }
    }
  })

  test("모든 대분류에 세부 분류가 하나 이상 있다", () => {
    for (const group of groups) {
      expect(categories.some((category) => category.group === group.id)).toBe(
        true,
      )
    }
  })
})

describe("검색", () => {
  test("한글 발음으로도 찾는다", () => {
    expect(search("프라이머리")).toContain("primary")
    expect(search("세컨더리")).toContain("secondary")
    expect(search("터셔리")).toContain("tertiary")
    expect(search("호버")).toContain("hover")
    expect(search("스켈레톤")).toContain("skeleton")
  })

  test("영어와 한글 설명으로도 찾고 대소문자는 구분하지 않는다", () => {
    expect(search("PRIMARY")).toContain("primary")
    expect(search("마우스 올렸을")).toContain("hover")
  })

  test("대분류와 세부 분류로 좁힌다", () => {
    const state = filterCategories(categories, {
      query: "",
      group: "state",
      category: null,
    })
    expect(state.every((category) => category.group === "state")).toBe(true)
    const one = filterCategories(categories, {
      query: "",
      group: "style",
      category: "hierarchy",
    })
    expect(one.map((category) => category.id)).toEqual(["hierarchy"])
  })
})
