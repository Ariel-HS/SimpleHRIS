import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Calendar from "../../components/Calendar"
import EmployeeDialog from "../../components/EmployeeDialog"
import { linkClass } from "../../components/styles"
import { Button, Card, DetailList, DetailRow, ErrorText } from "../../components/ui"
import { useRequiredAuth } from "../../context/AuthContext"
import { startOfMonth, toMonthKey } from "../../utils/date"
import type { Attendance, User } from "../../types"
import { USER_API_BASE_URL, ATTENDANCE_API_BASE_URL } from "../../config"

export default function EmployeeProfile() {
  const { id = "" } = useParams()
  const { token } = useRequiredAuth()
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [editing, setEditing] = useState(false)
  const monthKey = toMonthKey(month)

  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [monthlyAttendance, setMonthlyAttendance] = useState<Attendance[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState<boolean>(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${USER_API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: User = await response.json();
      setEmployee(data)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchMonthlyAttendance() {
    setMonthlyLoading(true);
    setMonthlyError(null);

    try {
      const response = await fetch(`${ATTENDANCE_API_BASE_URL}/month/${id}?month=${monthKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: Attendance[] = await response.json();
      setMonthlyAttendance(data)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMonthlyError(err.message);
      }
    } finally {
      setMonthlyLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    fetchMonthlyAttendance();
  }, [token]);

  const reload = () => {
    fetchData();

    // NOTE: Currently only employee data updates exist
    // fetchMonthlyAttendance();
  };

  const e = employee;

  return (
    <div className="space-y-4">
      <Link to="/admin/employees" className={`inline-block text-sm ${linkClass}`}>
        ← Employees
      </Link>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{e?.name ?? "Employee"}</h1>
        {e && (
          <Button variant="ghost" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      {e && (
        <Card>
          <DetailList>
            <DetailRow label="Name">{e.name}</DetailRow>
            <DetailRow label="Email">{e.email}</DetailRow>
            <DetailRow label="Role">
              <span className="capitalize">{e.role}</span>
            </DetailRow>
          </DetailList>
        </Card>
      )}

      <h2 className="pt-2 text-lg font-semibold">Attendance</h2>
      {monthlyError && <ErrorText>{monthlyError}</ErrorText>}
      <Calendar
        month={month}
        onMonthChange={setMonth}
        attendanceList={monthlyAttendance}
        loading={monthlyLoading}
        onDateClick={(date) => navigate(`/admin/employees/${id}/attendance/${date}`)}
      />

      <EmployeeDialog open={editing} employee={e} onClose={() => setEditing(false)} onSaved={reload} />
    </div>
  )
}
