export type Term = {
  en: string
  ko: string
  // 한글 발음 표기나 다른 이름으로도 검색되게 하는 별칭
  keywords?: string[]
}

export type GroupId = "state" | "component" | "style" | "interaction"

export type Group = {
  id: GroupId
  label: string
}

export type Category = {
  id: string
  label: string
  group: GroupId
  terms: Term[]
}
