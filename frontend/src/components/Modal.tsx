import { useEffect, useRef, type ReactNode } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

// Thin wrapper around the native <dialog> element (focus trap + Esc included).
export default function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(440px,calc(100%-2rem))] rounded-xl border border-slate-200 bg-white p-0 text-slate-900 backdrop:bg-black/45 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      {open && (
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
