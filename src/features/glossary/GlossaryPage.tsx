import TermCard from "./components/TermCard"
import { useState } from "react"
import { categories } from "./data/categories"
import useClipboard from "@/shared/hooks/useClipboard"

export default function GlossaryPage() {
  const { copied, error, copy: handleCopy } = useClipboard()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = search.trim()
    ? categories
        .map((cat) => ({
          ...cat,
          terms: cat.terms.filter(
            (t) =>
              t.en.toLowerCase().includes(search.trim().toLowerCase()) ||
              t.ko.includes(search.trim()),
          ),
        }))
        .filter((c) => c.terms.length > 0)
    : activeCategory
      ? categories.filter((c) => c.id === activeCategory)
      : categories

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 pt-5 pb-3">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="font-mono text-base font-semibold text-gray-900 tracking-tight">
              UI State Cheatsheet
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              클릭하면 바로 복사 · 피그마 작업할 때 참고용
            </p>
          </div>

          {/* Search */}
          <input
            aria-label="UI 용어 검색"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActiveCategory(null)
            }}
            placeholder="검색 (한글 or 영어)"
            className="w-full sm:w-72 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors mb-3"
          />

          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setActiveCategory(null)
                setSearch("")
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !activeCategory && !search
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id === activeCategory ? null : cat.id)
                  setSearch("")
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p role="status" className="px-5 text-sm text-red-600">
        {error}
      </p>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-6 pb-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <p className="text-sm">검색 결과가 없어요</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                  {cat.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {cat.terms.map((term) => {
                    const uid = `${cat.id}-${term.en}`
                    const isCopied = copied === uid
                    return (
                      <TermCard
                        key={uid}
                        term={term}
                        copied={isCopied}
                        onCopy={() => handleCopy(term.en, uid)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
