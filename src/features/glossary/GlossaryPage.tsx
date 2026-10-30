import { useRef, useState } from "react"
import { Search, X } from "lucide-react"
import PageHeader from "@/shared/components/PageHeader"
import Button from "@/shared/components/ui/button"
import Card from "@/shared/components/ui/card"
import Input from "@/shared/components/ui/input"
import Separator from "@/shared/components/ui/separator"
import useClipboard from "@/shared/hooks/useClipboard"
import TermCard from "./components/TermCard"
import { categories, groups } from "./data/categories"
import { filterCategories } from "./lib/filter"
import type { GroupId } from "./types"

export default function GlossaryPage() {
  const { copied, copy } = useClipboard()
  const [activeGroup, setActiveGroup] = useState<GroupId | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const searchInput = useRef<HTMLInputElement>(null)
  const groupCategories = categories.filter(
    (category) => category.group === activeGroup,
  )
  const filtered = filterCategories(categories, {
    query: search,
    group: activeGroup,
    category: activeCategory,
  })
  const resultCount = filtered.reduce(
    (total, category) => total + category.terms.length,
    0,
  )

  const resetFilters = () => {
    setSearch("")
    setActiveGroup(null)
    setActiveCategory(null)
  }

  const selectGroup = (group: GroupId | null) => {
    setActiveGroup(group)
    setActiveCategory(null)
  }

  return (
    <>
      <PageHeader
        title="UI 용어 사전"
        description="UI 용어를 검색하고 클릭해 영문 이름을 복사하세요."
      />
      <Card className="mb-8 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              ref={searchInput}
              type="search"
              aria-label="UI 용어 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="한글 또는 영어로 검색하세요"
              className="pl-9 pr-10 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="검색어 지우기"
                className="absolute right-1 top-1"
                onClick={() => {
                  setSearch("")
                  searchInput.current?.focus()
                }}
              >
                <X aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
        <Separator className="my-5" />
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="용어 대분류"
        >
          <Button
            variant={!activeGroup ? "default" : "secondary"}
            size="sm"
            aria-pressed={!activeGroup}
            onClick={() => selectGroup(null)}
          >
            전체
          </Button>
          {groups.map((group) => (
            <Button
              key={group.id}
              variant={activeGroup === group.id ? "default" : "secondary"}
              size="sm"
              aria-pressed={activeGroup === group.id}
              onClick={() => selectGroup(group.id)}
            >
              {group.label}
            </Button>
          ))}
        </div>
        {activeGroup && (
          <div
            className="mt-3 flex flex-wrap gap-2 border-t pt-3"
            role="group"
            aria-label="용어 세부 분류"
          >
            {groupCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                aria-pressed={activeCategory === category.id}
                onClick={() =>
                  setActiveCategory(
                    category.id === activeCategory ? null : category.id,
                  )
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        )}
      </Card>
      <div className="mb-5 flex min-h-8 items-center justify-between gap-3">
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          {search.trim()
            ? "검색 결과"
            : activeCategory || activeGroup
              ? "분류별 용어"
              : "전체 용어"}
          <span className="font-medium text-foreground">{resultCount}</span>
        </p>
        {(search || activeGroup || activeCategory) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X aria-hidden="true" />
            필터 초기화
          </Button>
        )}
      </div>
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center px-5 py-16 text-center">
          <h2 className="text-base font-semibold">검색 결과가 없어요</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            다른 검색어를 입력하거나 분류를 바꿔보세요.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              resetFilters()
              searchInput.current?.focus()
            }}
          >
            전체 용어 보기
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {filtered.map((category) => (
            <section
              key={category.id}
              aria-labelledby={"category-" + category.id}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <h2
                  id={"category-" + category.id}
                  className="text-sm font-semibold"
                >
                  <span className="mr-2 font-normal text-muted-foreground">
                    {groups.find((group) => group.id === category.group)?.label}
                  </span>
                  {category.label}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3">
                {category.terms.map((term) => {
                  const uid = category.id + "-" + term.en
                  return (
                    <TermCard
                      key={uid}
                      term={term}
                      copied={copied === uid}
                      onCopy={() => copy(term.en, uid)}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
