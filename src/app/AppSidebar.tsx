import {
  ArrowLeftRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Contrast,
  Grid2X2,
  Palette,
  Ruler,
  X,
} from "lucide-react"
import Button from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { tools, type ToolId } from "./tools"

const toolIcons = {
  glossary: BookOpen,
  "four-multiple": Ruler,
  "px-rem": ArrowLeftRight,
  "contrast-checker": Contrast,
  "design-system-starter": Palette,
}

type Props = {
  activeTool: ToolId
  collapsed?: boolean
  mobile?: boolean
  onToolChange: (id: ToolId) => void
  onToggle: () => void
  className?: string
}

export default function AppSidebar({
  activeTool,
  collapsed = false,
  mobile = false,
  onToolChange,
  onToggle,
  className,
}: Props) {
  const toggleLabel = mobile
    ? "메뉴 닫기"
    : collapsed
      ? "사이드바 펼치기"
      : "사이드바 접기"
  const ToggleIcon = mobile ? X : collapsed ? ChevronRight : ChevronLeft

  return (
    <aside
      aria-label="도구 사이드바"
      className={cn(
        "relative flex flex-col border-r bg-secondary/60",
        collapsed ? "w-16" : "w-60",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b",
          collapsed
            ? "justify-center px-2"
            : mobile
              ? "gap-2 pl-4 pr-14"
              : "gap-2 px-4",
        )}
      >
        <div
          className="flex min-w-0 items-center gap-2.5"
          title={collapsed ? "Designary" : undefined}
        >
          <Grid2X2
            className="size-6 shrink-0 text-primary"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span
            className={cn(
              "text-lg font-semibold tracking-tight",
              collapsed && "sr-only",
            )}
          >
            Designary
          </span>
        </div>
      </div>
      <nav aria-label="디자인 도구" className="flex flex-col gap-1 p-2 pt-4">
        {tools.map(({ id, label }) => {
          const Icon = toolIcons[id]
          const selected = activeTool === id
          return (
            <Button
              key={id}
              variant="ghost"
              aria-label={label}
              aria-pressed={selected}
              aria-controls={"tool-" + id}
              title={collapsed ? label : undefined}
              onClick={() => onToolChange(id)}
              className={cn(
                "h-11 w-full border border-transparent hover:bg-card/70",
                collapsed ? "justify-center px-0" : "justify-start gap-3 px-3",
                selected &&
                  "border-border bg-card text-foreground hover:bg-card hover:text-foreground",
              )}
            >
              <Icon
                className={cn(selected && "text-primary")}
                aria-hidden="true"
              />
              <span className={collapsed ? "sr-only" : undefined}>{label}</span>
            </Button>
          )
        })}
      </nav>
      {mobile ? (
        <div className="absolute right-3 top-4">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={onToggle}
          >
            <ToggleIcon aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          onClick={onToggle}
          className="absolute -right-3 top-16 z-10 size-6 -translate-y-1/2 rounded-full text-muted-foreground [&_svg]:size-3.5"
        >
          <ToggleIcon aria-hidden="true" />
        </Button>
      )}
    </aside>
  )
}
