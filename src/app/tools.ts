import { lazy } from "react"

export const tools = [
  {
    id: "four-multiple",
    label: "4의 배수 툴",
    component: lazy(
      () => import("@/features/four-multiple/FourMultipleSnapTool"),
    ),
  },
  {
    id: "glossary",
    label: "UI 용어 사전",
    component: lazy(() => import("@/features/glossary/GlossaryPage")),
  },
  {
    id: "px-rem",
    label: "px ↔ rem 변환기",
    component: lazy(() => import("@/features/px-rem/PxRemConverter")),
  },
  {
    id: "contrast-checker",
    label: "컬러 대비 검사기",
    component: lazy(
      () => import("@/features/contrast-checker/ContrastChecker"),
    ),
  },
  {
    id: "design-system-starter",
    label: "디자인 시스템 스타터",
    component: lazy(
      () => import("@/features/design-system-starter/DesignSystemStarter"),
    ),
  },
] as const

export type ToolId = typeof tools[number]["id"]
