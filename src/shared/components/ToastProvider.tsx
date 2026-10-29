import type { ReactNode } from "react"
import { toast } from "sonner"
import { ToastContext } from "../hooks/useToast"
import Toaster from "./ui/sonner"

const api = {
  success: (message: string) => {
    toast.success(message, { id: "feedback" })
  },
  error: (message: string) => {
    toast.error(message, { id: "feedback" })
  },
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}
