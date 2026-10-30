import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { copyToClipboard } from "@/shared/lib/clipboard"

function setup(options: {
  legacy?: () => boolean
  modern?: (text: string) => Promise<void>
}) {
  const state = { appended: false, removed: false, restored: false }
  const textarea = {
    value: "",
    style: {},
    setAttribute() {},
    focus() {},
    select() {},
    remove() {
      state.removed = true
    },
  }
  class FakeElement {
    focus() {
      state.restored = true
    }
  }
  vi.stubGlobal("HTMLElement", FakeElement)
  vi.stubGlobal("document", {
    activeElement: new FakeElement(),
    createElement: () => textarea,
    body: {
      appendChild() {
        state.appended = true
      },
    },
    execCommand: options.legacy ?? (() => true),
  })
  vi.stubGlobal(
    "navigator",
    options.modern ? { clipboard: { writeText: options.modern } } : {},
  )
  return { state, textarea }
}

const cleanedUp = { appended: true, removed: true, restored: true }

beforeEach(() => vi.unstubAllGlobals())
afterEach(() => vi.unstubAllGlobals())

test("클립보드 API가 있으면 그것만 쓰고 포커스를 건드리지 않는다", async () => {
  const modern = vi.fn(async () => {})
  const env = setup({ modern })
  await copyToClipboard("36")
  expect(modern).toHaveBeenCalledWith("36")
  expect(env.state.appended).toBe(false)
})

test("클립보드 API가 없으면 옛 방식으로 정확한 값을 복사하고 포커스를 되돌린다", async () => {
  const env = setup({})
  await copyToClipboard("36")
  expect(env.textarea.value).toBe("36")
  expect(env.state).toEqual(cleanedUp)
})

test("클립보드 API가 거절되면 옛 방식으로 다시 시도한다", async () => {
  const env = setup({
    modern: async () => {
      throw new Error("denied")
    },
  })
  await copyToClipboard("700")
  expect(env.textarea.value).toBe("700")
  expect(env.state).toEqual(cleanedUp)
})

test("둘 다 실패하면 성공으로 처리하지 않고 첫 오류를 던진다", async () => {
  for (const legacy of [
    () => false,
    () => {
      throw new Error("blocked")
    },
  ]) {
    const env = setup({
      legacy,
      modern: async () => {
        throw new Error("denied")
      },
    })
    await expect(copyToClipboard("4")).rejects.toThrow(/denied/)
    expect(env.state).toEqual(cleanedUp)
  }
  setup({ legacy: () => false })
  await expect(copyToClipboard("4")).rejects.toThrow(/Clipboard unavailable/)
})
