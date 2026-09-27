import { useState } from "react"
import ToastProvider from "@/shared/components/ToastProvider"
import { tools, type ToolId } from "./tools"

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>("four-multiple")

  return (
    <ToastProvider>
      <header className="border-b border-gray-200 bg-white">
        <nav
          aria-label="디자인 도구"
          className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-5 py-3"
        >
          <span className="mr-3 font-mono font-semibold">Designary</span>
          {tools.map(({ id, label }) => (
            <button
              key={id}
              aria-pressed={id === activeTool}
              onClick={() => setActiveTool(id)}
              className={`cursor-pointer rounded-full px-3 py-2 text-sm transition-colors ${
                id === activeTool
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {tools.map(({ id, component: Tool }) => (
          <div key={id} hidden={activeTool !== id}>
            <Tool />
          </div>
        ))}
      </main>
    </ToastProvider>
  )
}
