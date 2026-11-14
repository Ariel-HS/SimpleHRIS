export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ")

type Variant = "primary" | "ghost" | "danger"
type Size = "md" | "sm"

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-400"

const variants: Record<Variant, string> = {
  primary:
    "bg-teal-700 text-white enabled:hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950 dark:enabled:hover:bg-teal-300",
  ghost:
    "border border-slate-300 text-slate-900 enabled:hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:enabled:hover:bg-slate-800",
  danger:
    "border border-red-600 text-red-700 enabled:hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:enabled:hover:bg-red-950",
}

const sizes: Record<Size, string> = {
  md: "px-4 py-2",
  sm: "px-2.5 py-1 text-sm",
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
}: { variant?: Variant; size?: Size; block?: boolean } = {}) {
  return cn(base, variants[variant], sizes[size], block && "w-full")
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 " +
  "focus-visible:border-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 " +
  "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:border-teal-400 dark:focus-visible:ring-teal-400/40"

export const linkClass = "text-teal-700 hover:underline dark:text-teal-400"
export const mutedClass = "text-slate-500 dark:text-slate-400"
export const thClass = "px-2.5 py-3 text-left text-sm font-semibold text-slate-500 dark:text-slate-400"
export const tdClass = "px-2.5 py-3"
export const trClass = "border-b border-slate-200 last:border-0 dark:border-slate-800"
