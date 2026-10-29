import FourMultipleSnapTool from "@/features/four-multiple/FourMultipleSnapTool"
import GlossaryPage from "@/features/glossary/GlossaryPage"

export const tools = [
  { id: "glossary", label: "UI 용어 사전", component: GlossaryPage },
  {
    id: "four-multiple",
    label: "4의 배수 툴",
    component: FourMultipleSnapTool,
  },
] as const

export type ToolId = typeof tools[number]["id"]
