import { useEffect, useState, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import EmployeeDialog from "../../components/EmployeeDialog"
import Modal from "../../components/Modal"
import { inputClass, linkClass, mutedClass, tdClass, thClass, trClass } from "../../components/styles"
import { Button, Card, ErrorText } from "../../components/ui"
import { useRequiredAuth } from "../../context/AuthContext"
import type { User } from "../../types"

const USER_API_BASE_URL = "http://localhost:3000/api/user"

export default function Employees() {
    const { user, token } = useRequiredAuth()
    const navigate = useNavigate()
    const [employeeList, setEmployeeList] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("")
    const [dialog, setDialog] = useState<{ employee: User | null } | null>(null)
    const [toDelete, setToDelete] = useState<User | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState("")

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${USER_API_BASE_URL}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: User[] = await response.json();
            setEmployeeList(data)
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [token]);

    const reload = () => {
        fetchData();
    };

    const query = search.trim().toLowerCase()
    const employees = employeeList.filter(
        (e) => e.name.toLowerCase().includes(query) || e.email.toLowerCase().includes(query)
    )

    async function confirmDelete() {
        if (!toDelete) return
        setDeleting(true)
        setDeleteError("")
        try {
            await fetch(`${USER_API_BASE_URL}/${toDelete.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
            });
            setToDelete(null)
            reload()
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setDeleteError(msg)
        } finally {
            setDeleting(false)
        }
    }

    // Keep row-click navigation from firing when an operation button is clicked.
    const stop = (fn: () => void) => (e: MouseEvent) => {
        e.stopPropagation()
        fn()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Employees</h1>

      <div className="flex gap-3 max-sm:flex-col">
        <input
          type="search"
          placeholder="Search by name or email"
          aria-label="Search employees"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-sm`}
        />
        <Button onClick={() => setDialog({ employee: null })}>Create</Button>
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse max-sm:block">
            <thead className="max-sm:hidden">
              <tr className={trClass}>
                <th className={thClass}>Name</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Role</th>
                <th className={thClass}>Operations</th>
              </tr>
            </thead>
            <tbody className="max-sm:block">
              {employees.map((e) => {
              const isCurrentUser = e.id === user.id

              return (
                <tr
                  key={e.id}
                  className={`${trClass} cursor-pointer hover:bg-slate-50 max-sm:block max-sm:py-3 dark:hover:bg-slate-800/50`}
                  onClick={() => navigate(`/admin/employees/${e.id}`)}
                >
                  <td data-label="Name" className={`${tdClass} max-sm:flex max-sm:items-start max-sm:justify-between max-sm:gap-4 max-sm:px-0 max-sm:py-1.5 max-sm:text-right max-sm:[overflow-wrap:anywhere] max-sm:before:shrink-0 max-sm:before:text-left max-sm:before:text-sm max-sm:before:text-slate-500 max-sm:before:content-[attr(data-label)] dark:max-sm:before:text-slate-400`}>
                    <Link to={`/admin/employees/${e.id}`} onClick={(ev) => ev.stopPropagation()} className={linkClass}>
                      {e.name}
                    </Link>
                  </td>
                  <td data-label="Email" className={`${tdClass} max-sm:flex max-sm:items-start max-sm:justify-between max-sm:gap-4 max-sm:px-0 max-sm:py-1.5 max-sm:text-right max-sm:[overflow-wrap:anywhere] max-sm:before:shrink-0 max-sm:before:text-left max-sm:before:text-sm max-sm:before:text-slate-500 max-sm:before:content-[attr(data-label)] dark:max-sm:before:text-slate-400`}>{e.email}</td>
                  <td data-label="Role" className={`${tdClass} capitalize max-sm:flex max-sm:items-start max-sm:justify-between max-sm:gap-4 max-sm:px-0 max-sm:py-1.5 max-sm:text-right max-sm:[overflow-wrap:anywhere] max-sm:before:shrink-0 max-sm:before:text-left max-sm:before:text-sm max-sm:before:text-slate-500 max-sm:before:content-[attr(data-label)] dark:max-sm:before:text-slate-400`}>{e.role}</td>
                  <td className={`${tdClass} max-sm:block max-sm:px-0 max-sm:pb-0`}>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={stop(() => setDialog({ employee: e }))}
                        disabled={isCurrentUser || e.id === 1}
                        >
                          {isCurrentUser ? ("Own Account (Cannot Edit)")
                          : e.id === 1 ? ("Can't edit superadmin")
                          : ("Edit")}
                      </Button>
                      <Button
                        disabled={isCurrentUser || e.id === 1}
                        variant="danger"
                        size="sm"
                        onClick={stop(() => {
                          setDeleteError("")
                          setToDelete(e)
                        })}
                      >
                        {isCurrentUser ? ("Own Account (Cannot Delete)")
                        : e.id === 1 ? ("Can't delete superadmin")
                        : ("Delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              )})}
              {!loading && employees.length === 0 && (
                <tr className="max-sm:block">
                  <td colSpan={4} className={`${tdClass} ${mutedClass} max-sm:block max-sm:px-0`}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <EmployeeDialog
        open={dialog !== null}
        employee={dialog?.employee}
        onClose={() => setDialog(null)}
        onSaved={reload}
      />

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} title="Delete employee">
        <div className="space-y-4">
          <p>
            Delete <strong>{toDelete?.name}</strong>? This cannot be undone.
          </p>
          {deleteError && <ErrorText>{deleteError}</ErrorText>}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
