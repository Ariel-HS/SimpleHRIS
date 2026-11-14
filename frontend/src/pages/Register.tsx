import { useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, ErrorText, Field, Input } from "../components/ui"
import { linkClass, mutedClass } from "../components/styles"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    if (form.password.length < 8) return setError("Password must be at least 8 characters.")
    if (form.password !== form.confirm) return setError("Passwords do not match.")

    setLoading(true)
    try {
      await register({ email: form.email, password: form.password })
      navigate("/login", { state: { registered: true } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto my-12 w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 max-sm:my-6 max-sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-5 text-2xl font-bold">Create account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email">
          <Input type="email" value={form.email} onChange={update("email")} autoComplete="email" required />
        </Field>
        <Field label="Password">
          <Input type="password" value={form.password} onChange={update("password")} autoComplete="new-password" required />
        </Field>
        <Field label="Confirm password">
          <Input type="password" value={form.confirm} onChange={update("confirm")} autoComplete="new-password" required />
        </Field>
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" block disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className={`mt-5 text-center text-sm ${mutedClass}`}>
        Already have an account?{" "}
        <Link to="/login" className={linkClass}>
          Log in
        </Link>
      </p>
    </div>
  )
}
