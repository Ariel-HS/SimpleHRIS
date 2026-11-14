import { Link, useNavigate } from "react-router-dom"
import { useAuth, homeForRole } from "../context/AuthContext"
import { buttonClasses, mutedClass } from "./styles"
import { Button } from "./ui"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <Link to={user ? homeForRole(user.role) : "/"} className="text-xl font-bold tracking-wide">
        HRIS
      </Link>
      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <span className={`text-sm ${mutedClass}`}>{user.name}</span>
            <Button variant="ghost" onClick={handleLogout}>
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
