import { CircleCheck, CircleAlert, X } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

export default function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      closeButton
      containerAriaLabel="알림"
      duration={2400}
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        error: <CircleAlert className="size-4 text-destructive" />,
        close: <X className="size-3" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-lg border border-border bg-popover px-4 py-3 font-sans text-sm text-popover-foreground shadow-lg",
          title: "font-medium",
          closeButton:
            "absolute -right-2 -top-2 flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-popover text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring",
        },
      }}
      {...props}
    />
  )
}
