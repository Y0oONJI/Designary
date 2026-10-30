import { Suspense, useEffect, useRef, useState } from "react"
import { Menu } from "lucide-react"
import ToastProvider from "@/shared/components/ToastProvider"
import Button from "@/shared/components/ui/button"
import Separator from "@/shared/components/ui/separator"
import AppSidebar from "./AppSidebar"
import { tools, type ToolId } from "./tools"

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>(tools[0].id)
  // 한 번 연 도구만 불러오고, 이후에는 입력 상태를 유지하려고 숨기기만 한다
  const [visited, setVisited] = useState<ReadonlySet<ToolId>>(
    () => new Set([tools[0].id]),
  )
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const mobileMenu = useRef<HTMLDialogElement>(null)

  // 데스크톱 폭으로 넓어지면 모바일 메뉴를 닫는다
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) mobileMenu.current?.close()
    }
    query.addEventListener("change", closeOnDesktop)
    return () => query.removeEventListener("change", closeOnDesktop)
  }, [])

  const selectTool = (id: ToolId) => {
    setActiveTool(id)
    setVisited((current) =>
      current.has(id) ? current : new Set(current).add(id),
    )
    mobileMenu.current?.close()
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  return (
    <ToastProvider>
      <div className="flex min-h-svh">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          본문으로 건너뛰기
        </a>
        <AppSidebar
          activeTool={activeTool}
          collapsed={sidebarCollapsed}
          onToolChange={selectTool}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
          className="sticky top-0 hidden h-svh shrink-0 md:flex"
        />
        <dialog
          ref={mobileMenu}
          onClick={(event) => {
            if (event.target === event.currentTarget)
              mobileMenu.current?.close()
          }}
          aria-label="디자인 도구 메뉴"
          className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-60 max-w-[calc(100vw-2rem)] border-0 bg-background p-0 text-foreground shadow-xl backdrop:bg-foreground/30"
        >
          <AppSidebar
            mobile
            activeTool={activeTool}
            onToolChange={selectTool}
            onToggle={() => mobileMenu.current?.close()}
            className="h-full w-full"
          />
        </dialog>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card px-4 md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="디자인 도구 메뉴 열기"
              aria-haspopup="dialog"
              onClick={() => mobileMenu.current?.showModal()}
            >
              <Menu aria-hidden="true" />
            </Button>
            <span className="text-base font-semibold">Designary</span>
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="@container mx-auto w-full max-w-6xl flex-1 px-5 py-9 outline-none sm:px-8 sm:py-12"
          >
            {tools.map(({ id, component: Tool }) =>
              visited.has(id) ? (
                <div key={id} id={"tool-" + id} hidden={activeTool !== id}>
                  <Suspense
                    fallback={
                      <p
                        role="status"
                        className="text-sm text-muted-foreground"
                      >
                        불러오는 중…
                      </p>
                    }
                  >
                    <Tool />
                  </Suspense>
                </div>
              ) : null,
            )}
          </main>
          <footer className="mx-auto w-full max-w-6xl px-5 pb-6 sm:px-8">
            <Separator />
            <p className="pt-5 text-xs text-muted-foreground">
              © 2026 OiN0oJY. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </ToastProvider>
  )
}
