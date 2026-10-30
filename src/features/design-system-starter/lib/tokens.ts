import { readableOn } from "./color"
import type { Palette, ScaleName, Step } from "./palette"
import type { TypeStep } from "./typeScale"

export type Naming = "tailwind" | "role"
export type Mode = "light" | "dark"

type NamingOption = {
  value: Naming
  label: string
  sample: string
}

export const namingOptions: NamingOption[] = [
  {
    value: "tailwind",
    label: "Tailwind식",
    sample: "primary-500 · background",
  },
  { value: "role", label: "역할식", sample: "brand-500 · surface-page" },
]

const scaleLabels: Record<Naming, Record<ScaleName, string>> = {
  tailwind: {
    primary: "primary",
    neutral: "neutral",
    success: "success",
    warning: "warning",
    error: "error",
    info: "info",
  },
  role: {
    primary: "brand",
    neutral: "neutral",
    success: "positive",
    warning: "caution",
    error: "negative",
    info: "info",
  },
}

export const scaleName = (scale: ScaleName, naming: Naming) =>
  scaleLabels[naming][scale]

const textKeys = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"]

export const typeName = (step: TypeStep, index: number, naming: Naming) =>
  naming === "tailwind" ? textKeys[index] : step.key

type Ref = {
  scale: ScaleName
  step: Step
}

type SemanticDef = {
  names: Record<Naming, string>
  group: string
  light: Ref | "on-primary" | "white"
  dark: Ref | "on-primary" | "white"
}

const ref = (scale: ScaleName, step: Step): Ref => ({ scale, step })

const baseDefs: SemanticDef[] = [
  {
    names: { tailwind: "background", role: "surface-page" },
    group: "배경·텍스트",
    light: ref("neutral", 50),
    dark: ref("neutral", 900),
  },
  {
    names: { tailwind: "card", role: "surface-card" },
    group: "배경·텍스트",
    light: "white",
    dark: ref("neutral", 800),
  },
  {
    names: { tailwind: "border", role: "line-default" },
    group: "배경·텍스트",
    light: ref("neutral", 200),
    dark: ref("neutral", 700),
  },
  {
    names: { tailwind: "foreground", role: "content-default" },
    group: "배경·텍스트",
    light: ref("neutral", 900),
    dark: ref("neutral", 50),
  },
  {
    names: { tailwind: "muted-foreground", role: "content-muted" },
    group: "배경·텍스트",
    light: ref("neutral", 600),
    dark: ref("neutral", 400),
  },
  {
    names: { tailwind: "primary", role: "action-primary" },
    group: "프라이머리",
    light: ref("primary", 500),
    dark: ref("primary", 400),
  },
  {
    names: { tailwind: "primary-hover", role: "action-primary-hover" },
    group: "프라이머리",
    light: ref("primary", 600),
    dark: ref("primary", 300),
  },
  {
    names: { tailwind: "primary-active", role: "action-primary-pressed" },
    group: "프라이머리",
    light: ref("primary", 700),
    dark: ref("primary", 200),
  },
  {
    names: { tailwind: "accent", role: "action-primary-subtle" },
    group: "프라이머리",
    light: ref("primary", 50),
    dark: ref("primary", 900),
  },
  {
    names: { tailwind: "primary-foreground", role: "content-on-action" },
    group: "프라이머리",
    light: "on-primary",
    dark: "on-primary",
  },
]

const statuses = ["success", "warning", "error", "info"] as const

const statusDefs: SemanticDef[] = statuses.flatMap((status) => {
  const tw = status
  const role = scaleLabels.role[status]
  const group = {
    success: "성공",
    warning: "경고",
    error: "오류",
    info: "정보",
  }[status]
  return [
    {
      names: { tailwind: `${tw}-bg`, role: `${role}-surface` },
      group,
      light: ref(status, 50),
      dark: ref(status, 900),
    },
    {
      names: { tailwind: `${tw}-border`, role: `${role}-line` },
      group,
      light: ref(status, 200),
      dark: ref(status, 700),
    },
    {
      names: { tailwind: `${tw}-text`, role: `${role}-content` },
      group,
      light: ref(status, 700),
      dark: ref(status, 300),
    },
  ]
})

type ResolvedColor = {
  hex: string
  ref: Ref | null
}

export type SemanticToken = {
  names: Record<Naming, string>
  group: string
  light: ResolvedColor
  dark: ResolvedColor
}

export function buildSemanticTokens(palette: Palette): SemanticToken[] {
  const resolve = (value: SemanticDef["light"], mode: Mode) => {
    if (value === "white") return { hex: "#ffffff", ref: null }
    if (value === "on-primary") {
      const primary = palette.primary[mode === "light" ? 500 : 400]
      return { hex: readableOn(primary), ref: null }
    }
    return { hex: palette[value.scale][value.step], ref: value }
  }
  return [...baseDefs, ...statusDefs].map((def) => ({
    names: def.names,
    group: def.group,
    light: resolve(def.light, "light"),
    dark: resolve(def.dark, "dark"),
  }))
}
