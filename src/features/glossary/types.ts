export type Term = {
  en: string
  ko: string
  example?: string
}

export type Category = {
  id: string
  label: string
  terms: Term[]
}
