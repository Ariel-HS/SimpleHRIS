import { Link, useNavigate } from "react-router-dom"
import { useAuth, homeForRole } from "../context/AuthContext"
import { buttonClasses, mutedClass } from "./styles"
import ThemeToggle from "./ThemeToggle"
import { Button } from "./ui"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <Link to={user ? homeForRole(user.role) : "/"} className="shrink-0 text-xl font-bold tracking-wide">
        SimpleHRIS
      </Link>
      <nav className="flex min-w-0 items-center gap-3">
        <ThemeToggle />
        {user ? (
          <>
            <span className={`max-w-28 truncate text-sm sm:max-w-none ${mutedClass}`}>{user.name}</span>
            <Button variant="ghost" className="shrink-0 whitespace-nowrap" onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <Link to="/login" className={buttonClasses({ variant: "primary" })}>
            Log in
          </Link>
        )}
      </nav>
    </header>
  )
}
