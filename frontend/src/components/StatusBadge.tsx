import type { AttendanceStatus } from "../types"
import { STATUS_LABELS, STATUS_STYLES } from "../utils/status"

export default function StatusBadge({ status }: { status: AttendanceStatus | null | undefined }) {
  const classes = "inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-semibold"
  if (!status) {
    return (
      <span className={`${classes} bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`}>
        Not checked in
      </span>
    )
  }
  return <span className={`${classes} ${STATUS_STYLES[status].badge}`}>{STATUS_LABELS[status] ?? status}</span>
}
