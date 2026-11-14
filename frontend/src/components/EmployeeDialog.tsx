import { useState } from "react"
import type { User, EmployeeInput, Role } from "../types"
import Modal from "./Modal"
import { Button, ErrorText, Field, Input, Select } from "./ui"
import { useRequiredAuth } from "../context/AuthContext"

const USER_API_BASE_URL = "http://localhost:3000/api/user"

interface FormProps {
  employee?: User | null
  onClose: () => void
  onSaved: () => void
}

function EmployeeForm({ employee, onClose, onSaved }: FormProps) {
  const { token } = useRequiredAuth()
  const [form, setForm] = useState<EmployeeInput>({
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    role: employee?.role ?? "staff",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      if (employee) {
        const employeeId = employee.id
        await fetch(`${USER_API_BASE_URL}/${employeeId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(form)
        });
      } else {
        await fetch(`${USER_API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(form)
        });
      }

      onSaved()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(msg)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </Field>
      {!employee &&
      <Field label="Email">
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </Field>
      }
      <Field label="Role">
        <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </Select>
      </Field>
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : employee ? "Save changes" : "Create"}
        </Button>
      </div>
    </form>
  )
}

interface DialogProps extends FormProps {
  open: boolean
}

// `employee` = existing employee to edit, or null/undefined to create a new one.
export default function EmployeeDialog({ open, employee, onClose, onSaved }: DialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={employee ? "Edit employee" : "Create employee"}>
      <EmployeeForm employee={employee} onClose={onClose} onSaved={onSaved} />
    </Modal>
  )
}
