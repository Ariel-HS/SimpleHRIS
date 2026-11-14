import { NavLink, Outlet } from "react-router-dom"
import { cn } from "./styles"

const link = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-3.5 py-2.5 font-medium",
    isActive
      ? "bg-teal-700 text-white dark:bg-teal-400 dark:text-teal-950"
      : "hover:bg-white dark:hover:bg-slate-900"
  )

export default function AdminLayout() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <aside>
        <nav aria-label="Admin" className="flex gap-1 md:sticky md:top-4 md:flex-col">
          <NavLink to="/admin" end className={link}>
            Home
          </NavLink>
          <NavLink to="/admin/employees" className={link}>
            Employees
          </NavLink>
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
