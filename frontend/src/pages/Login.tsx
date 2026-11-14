import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, ErrorText, Field, Input, Notice } from "../components/ui"
import { linkClass, mutedClass } from "../components/styles"
import { useAuth, homeForRole } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(homeForRole(user.role), { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto my-12 w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 max-sm:my-6 max-sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-5 text-2xl font-bold">Log in</h1>
      {location.state?.registered && (
        <div className="mb-4">
          <Notice>Account created. Log in to continue.</Notice>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" block disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <p className={`mt-5 text-center text-sm ${mutedClass}`}>
        Don’t have an account?{" "}
        <Link to="/register" className={linkClass}>
          Register
        </Link>
      </p>
    </div>
  )
}
