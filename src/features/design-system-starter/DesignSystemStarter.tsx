import { useMemo, useState } from "react"
import { Palette as PaletteIcon, Type, FileCode } from "lucide-react"
import PageHeader from "@/shared/components/PageHeader"
import Button from "@/shared/components/ui/button"
import Card from "@/shared/components/ui/card"
import Input from "@/shared/components/ui/input"
import Label from "@/shared/components/ui/label"
import Tabs from "@/shared/components/ui/tabs"
import TabsList from "@/shared/components/ui/tabs-list"
import TabsTrigger from "@/shared/components/ui/tabs-trigger"
import TabsContent from "@/shared/components/ui/tabs-content"
import ColorPanel from "./components/ColorPanel"
import ExportPanel from "./components/ExportPanel"
import TypographyPanel from "./components/TypographyPanel"
import { normalizeHex } from "./lib/color"
import { generatePalette } from "./lib/palette"
import { buildSemanticTokens, namingOptions, type Naming } from "./lib/tokens"
import { generateTypeScale } from "./lib/typeScale"

const defaultPrimary = "#2272eb"

export default function DesignSystemStarter() {
  const [hexInput, setHexInput] = useState(defaultPrimary)
  const [primary, setPrimary] = useState(defaultPrimary)
  const [naming, setNaming] = useState<Naming>("tailwind")
  const [baseSize, setBaseSize] = useState("16")
  const [ratio, setRatio] = useState(1.2)

  const baseNumber = Number(baseSize)
  const baseInvalid = !(baseNumber >= 10 && baseNumber <= 32)
  const [validBase, setValidBase] = useState(16)

  const palette = useMemo(() => generatePalette(primary), [primary])
  const semantic = useMemo(() => buildSemanticTokens(palette), [palette])
  const typeScale = useMemo(
    () => generateTypeScale(validBase, ratio),
    [validBase, ratio],
  )
  const hexInvalid = normalizeHex(hexInput) === null

  const updateHex = (value: string) => {
    setHexInput(value)
    const hex = normalizeHex(value)
    if (hex && value.trim().replace(/^#/, "").length === 6) setPrimary(hex)
  }

  const commitHex = () => {
    const hex = normalizeHex(hexInput)
    if (!hex) return
    setPrimary(hex)
    setHexInput(hex)
  }

  const updateBase = (value: string) => {
    setBaseSize(value)
    const next = Number(value)
    if (next >= 10 && next <= 32) setValidBase(next)
  }

  return (
    <>
      <PageHeader
        title="디자인 시스템 스타터"
        description="프라이머리 컬러 하나로 컬러 스케일, 시맨틱 컬러, 타입 스케일 초안을 만들고 코드로 내보내세요."
      />
      <Card className="mb-6 flex flex-wrap items-start gap-x-8 gap-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="primary-hex">프라이머리 컬러 (500)</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="프라이머리 컬러 선택"
              value={primary}
              onChange={(event) => updateHex(event.target.value)}
              className="size-10 shrink-0 cursor-pointer rounded-md border border-input bg-card p-1"
            />
            <Input
              id="primary-hex"
              value={hexInput}
              aria-invalid={hexInvalid}
              aria-describedby="primary-hex-hint"
              onChange={(event) => updateHex(event.target.value)}
              onBlur={commitHex}
              placeholder="#2272eb"
              className="w-32 tabular-nums"
            />
          </div>
          <p
            id="primary-hex-hint"
            className={
              hexInvalid
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {hexInvalid
              ? "#RRGGBB 형식으로 입력해 주세요."
              : "이 색이 primary-500이 돼요."}
          </p>
        </div>
        <div className="space-y-2">
          <Label id="naming-label">이름 규칙</Label>
          <div
            role="group"
            aria-labelledby="naming-label"
            className="flex flex-wrap gap-2"
          >
            {namingOptions.map(({ value, label }) => (
              <Button
                key={value}
                variant={naming === value ? "default" : "outline"}
                aria-pressed={naming === value}
                onClick={() => setNaming(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {namingOptions.find((option) => option.value === naming)!.sample}
          </p>
        </div>
      </Card>
      <Tabs defaultValue="color">
        <TabsList aria-label="디자인 시스템 스타터 섹션">
          <TabsTrigger value="color">
            <PaletteIcon aria-hidden="true" />
            컬러
          </TabsTrigger>
          <TabsTrigger value="type">
            <Type aria-hidden="true" />
            타이포
          </TabsTrigger>
          <TabsTrigger value="export">
            <FileCode aria-hidden="true" />
            내보내기
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="color"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <ColorPanel palette={palette} semantic={semantic} naming={naming} />
        </TabsContent>
        <TabsContent
          value="type"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <TypographyPanel
            typeScale={typeScale}
            naming={naming}
            baseSize={baseSize}
            ratio={ratio}
            baseInvalid={baseInvalid}
            onBaseSizeChange={updateBase}
            onRatioChange={setRatio}
          />
        </TabsContent>
        <TabsContent
          value="export"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <ExportPanel
            palette={palette}
            semantic={semantic}
            typeScale={typeScale}
            naming={naming}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}
