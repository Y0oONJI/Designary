import { createContext, useContext } from "react"

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export default function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error("useToast requires ToastProvider")
  return toast
}
