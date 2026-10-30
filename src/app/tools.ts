import ContrastChecker from "@/features/contrast-checker/ContrastChecker"
import DesignSystemStarter from "@/features/design-system-starter/DesignSystemStarter"
import FourMultipleSnapTool from "@/features/four-multiple/FourMultipleSnapTool"
import GlossaryPage from "@/features/glossary/GlossaryPage"
import PxRemConverter from "@/features/px-rem/PxRemConverter"

export const tools = [
  {
    id: "four-multiple",
    label: "4의 배수 툴",
    component: FourMultipleSnapTool,
  },
  { id: "glossary", label: "UI 용어 사전", component: GlossaryPage },
  { id: "px-rem", label: "px ↔ rem 변환기", component: PxRemConverter },
  {
    id: "contrast-checker",
    label: "컬러 대비 검사기",
    component: ContrastChecker,
  },
  {
    id: "design-system-starter",
    label: "디자인 시스템 스타터",
    component: DesignSystemStarter,
  },
] as const

export type ToolId = typeof tools[number]["id"]
