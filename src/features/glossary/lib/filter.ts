import type { Category, GroupId, Term } from "../types"

export type Filters = {
  query: string
  group: GroupId | null
  category: string | null
}

function matches(term: Term, query: string) {
  return (
    term.en.toLowerCase().includes(query) ||
    term.ko.toLowerCase().includes(query) ||
    (term.keywords ?? []).some((keyword) =>
      keyword.toLowerCase().includes(query),
    )
  )
}

export function filterCategories(
  categories: Category[],
  { query, group, category }: Filters,
) {
  const normalized = query.trim().toLowerCase()
  return categories
    .filter((item) => !group || item.group === group)
    .filter((item) => !category || item.id === category)
    .map((item) => ({
      ...item,
      terms: item.terms.filter(
        (term) => !normalized || matches(term, normalized),
      ),
    }))
    .filter((item) => item.terms.length > 0)
}
