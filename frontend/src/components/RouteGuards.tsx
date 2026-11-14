import { Navigate, Outlet } from "react-router-dom"
import { useAuth, homeForRole } from "../context/AuthContext"

// For pages only guests should see (guest home, login, register).
// Logged-in users get sent to their own home page.
export function GuestOnly() {
  const { user } = useAuth()
  return user ? <Navigate to={homeForRole(user.role)} replace /> : <Outlet />
}

// For pages restricted to one role.
export function RequireRole({ role }: { role: 'admin' | 'staff' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={homeForRole(user.role)} replace />
  return <Outlet />
}
