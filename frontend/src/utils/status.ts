import type { AttendanceStatus } from "../types"

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  "on-time": "On time",
  late: "Late",
  absent: "Absent",
}

// Full class strings so Tailwind can detect them.
export const STATUS_STYLES: Record<
  AttendanceStatus,
  { badge: string; cell: string; dot: string; text: string }
> = {
  "on-time": {
    badge: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    cell: "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
    dot: "bg-green-600 dark:bg-green-400",
    text: "text-green-700 dark:text-green-400",
  },
  late: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    cell: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
  },
  absent: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    cell: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-600 dark:bg-red-400",
    text: "text-red-700 dark:text-red-400",
  },
}
