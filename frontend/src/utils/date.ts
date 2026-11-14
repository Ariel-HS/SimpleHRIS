export const pad = (n: number) => String(n).padStart(2, "0")

// Local-time helpers (avoid toISOString, which shifts to UTC).
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const toMonthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
export const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6

export function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export const formatMonth = (d: Date) => d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })

export const formatLongDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

