import { useState } from "react"
import type { Attendance } from "../types"
import { formatMonth, isWeekend, startOfMonth, toISODate } from "../utils/date"
import { STATUS_LABELS, STATUS_STYLES } from "../utils/status"
import { Button, Card } from "./ui"
import { cn } from "./styles"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface CalendarProps {
  month: Date
  onMonthChange: (month: Date) => void
  attendanceList?: Attendance[]
  /** When set, enabled days become buttons. Weekends and future dates are never clickable. */
  onDateClick?: (isoDate: string) => void
  loading?: boolean
}

export default function Calendar({ month, onMonthChange, attendanceList = [], onDateClick, loading }: CalendarProps) {
  const [now] = useState(() => new Date()) // fixed at mount; avoids impure Date() in render
  const first = startOfMonth(month)
  const year = first.getFullYear()
  const m = first.getMonth()
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const offset = first.getDay() // week starts on Sunday
  const todayISO = toISODate(now)
  const byDate = Object.fromEntries(attendanceList.map((r) => [r.date, r]))

  const isCurrentMonth = toISODate(first) >= toISODate(startOfMonth(now))
  const shift = (delta: number) => onMonthChange(new Date(year, m + delta, 1))

  const cells = []
  for (let i = 0; i < offset; i++) cells.push(<div key={`pad-${i}`} />)

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, m, day)
    const iso = toISODate(date)
    const disabled = iso > todayISO 
        // || isWeekend(date) // NOTE: Comment this to test on weekends
    const status = disabled ? null : byDate[iso]?.status ?? null
    const clickable = Boolean(onDateClick) && !disabled

    const className = cn(
      "flex min-h-[72px] flex-col items-start gap-1 rounded-lg border p-2 text-left max-sm:min-h-14 max-sm:p-1",
      disabled
        ? "border-transparent bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500"
        : status
          ? STATUS_STYLES[status].cell
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
      iso === todayISO && "ring-2 ring-teal-600 dark:ring-teal-400",
      clickable && "cursor-pointer hover:border-teal-600 dark:hover:border-teal-400"
    )

    const content = (
      <>
        <span className="font-semibold">{day}</span>
        {status && <span className="text-xs font-semibold max-sm:hidden">{STATUS_LABELS[status]}</span>}
      </>
    )

    cells.push(
      clickable ? (
        <button key={iso} type="button" className={className} onClick={() => onDateClick?.(iso)}>
          {content}
        </button>
      ) : (
        <div key={iso} className={className} aria-disabled={disabled || undefined}>
          {content}
        </div>
      )
    )
  }

  return (
    <Card aria-busy={loading}>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => shift(-1)} aria-label="Previous month">
          ←
        </Button>
        <h2 className="text-lg font-semibold">{formatMonth(first)}</h2>
        <Button variant="ghost" size="sm" onClick={() => shift(1)} disabled={isCurrentMonth} aria-label="Next month">
          →
        </Button>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className={cn("grid grid-cols-7 gap-1.5", loading && "opacity-50")}>{cells}</div>

      <ul className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
        {(Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-full", STATUS_STYLES[s].dot)} /> {STATUS_LABELS[s]}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-400 dark:bg-slate-600" /> Weekend / upcoming
        </li>
      </ul>
    </Card>
  )
}
