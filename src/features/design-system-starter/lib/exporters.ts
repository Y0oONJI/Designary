import { steps, scaleNames, type Palette } from "./palette"
import { scaleName, typeName, type Naming, type SemanticToken } from "./tokens"
import type { TypeStep } from "./typeScale"

export type ExportFormat = "tailwind" | "css" | "json"

type Input = {
  palette: Palette
  semantic: SemanticToken[]
  typeScale: TypeStep[]
  naming: Naming
}

const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`
const em = (value: number) => `${value}em`

const primitiveVar = (scale: string, step: number) => `--color-${scale}-${step}`

function semanticValue(
  token: SemanticToken,
  mode: "light" | "dark",
  naming: Naming,
) {
  const entry = token[mode]
  return entry.ref
    ? `var(${primitiveVar(scaleName(entry.ref.scale, naming), entry.ref.step)})`
    : entry.hex
}

function primitiveLines({ palette, naming }: Input, indent: string) {
  return scaleNames.flatMap((scale) =>
    steps.map(
      (step) =>
        `${indent}${primitiveVar(scaleName(scale, naming), step)}: ${palette[scale][step]};`,
    ),
  )
}

function semanticLines(input: Input, mode: "light" | "dark", indent: string) {
  return input.semantic.map(
    (token) =>
      `${indent}--${token.names[input.naming]}: ${semanticValue(token, mode, input.naming)};`,
  )
}

function toTailwind(input: Input) {
  const { semantic, typeScale, naming } = input
  const text = typeScale.flatMap((step, index) => {
    const name = typeName(step, index, naming)
    return [
      `  --text-${name}: ${rem(step.size)};`,
      `  --text-${name}--line-height: ${rem(step.lineHeight)};`,
      `  --text-${name}--font-weight: ${step.weight};`,
      `  --text-${name}--letter-spacing: ${em(step.letterSpacing)};`,
    ]
  })
  const mapped = semantic.map(
    (token) =>
      `  --color-${token.names[naming]}: var(--${token.names[naming]});`,
  )
  return [
    "@theme {",
    ...primitiveLines(input, "  "),
    "",
    ...text,
    "}",
    "",
    ":root {",
    ...semanticLines(input, "light", "  "),
    "}",
    "",
    ".dark {",
    ...semanticLines(input, "dark", "  "),
    "}",
    "",
    "@theme inline {",
    ...mapped,
    "}",
    "",
  ].join("\n")
}

function toCss(input: Input) {
  const { typeScale, naming } = input
  const text = typeScale.flatMap((step, index) => {
    const name = typeName(step, index, naming)
    return [
      `  --font-size-${name}: ${step.size}px;`,
      `  --line-height-${name}: ${step.lineHeight}px;`,
      `  --font-weight-${name}: ${step.weight};`,
      `  --letter-spacing-${name}: ${em(step.letterSpacing)};`,
    ]
  })
  return [
    ":root {",
    ...primitiveLines(input, "  "),
    "",
    ...semanticLines(input, "light", "  "),
    "",
    ...text,
    "}",
    "",
    ".dark {",
    ...semanticLines(input, "dark", "  "),
    "}",
    "",
  ].join("\n")
}

function toJson({ palette, semantic, typeScale, naming }: Input) {
  const primitive = Object.fromEntries(
    scaleNames.map((scale) => [
      scaleName(scale, naming),
      Object.fromEntries(
        steps.map((step) => [
          step,
          { $type: "color", $value: palette[scale][step] },
        ]),
      ),
    ]),
  )
  const modeTokens = (mode: "light" | "dark") =>
    Object.fromEntries(
      semantic.map((token) => {
        const entry = token[mode]
        return [
          token.names[naming],
          {
            $type: "color",
            $value: entry.ref
              ? `{color.primitive.${scaleName(entry.ref.scale, naming)}.${entry.ref.step}}`
              : entry.hex,
          },
        ]
      }),
    )
  const typography = Object.fromEntries(
    typeScale.map((step, index) => [
      typeName(step, index, naming),
      {
        $type: "typography",
        $value: {
          fontSize: `${step.size}px`,
          lineHeight: `${step.lineHeight}px`,
          fontWeight: step.weight,
          letterSpacing: em(step.letterSpacing),
        },
      },
    ]),
  )
  return (
    JSON.stringify(
      {
        color: {
          primitive,
          semantic: { light: modeTokens("light"), dark: modeTokens("dark") },
        },
        typography,
      },
      null,
      2,
    ) + "\n"
  )
}

export function buildExport(format: ExportFormat, input: Input) {
  if (format === "tailwind") return toTailwind(input)
  if (format === "css") return toCss(input)
  return toJson(input)
}
