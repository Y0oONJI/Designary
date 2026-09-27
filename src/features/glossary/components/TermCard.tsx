import type { Term } from "../types"

type Props = {
  term: Term
  copied: boolean
  onCopy: () => void
}

export default function TermCard({ term, copied, onCopy }: Props) {
  return (
    <button
      onClick={onCopy}
      aria-label={`${term.en} 복사${copied ? " 완료" : ""}`}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-left transition-all duration-100 hover:border-gray-300 hover:bg-white"
    >
      <p className="flex items-center gap-1.5 font-mono text-base font-semibold leading-tight text-gray-900">
        {term.en}
        {copied && <span className="text-sm font-normal text-gray-400">✓</span>}
      </p>
      <p className="mt-1 text-sm leading-tight text-gray-400">{term.ko}</p>
    </button>
  )
}
