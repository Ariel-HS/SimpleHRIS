import { useEffect, useState } from "react"
import Calendar from "../components/Calendar"
import TodayAttendance from "../components/TodayAttendance"
import { ErrorText } from "../components/ui"
import { useRequiredAuth } from "../context/AuthContext"
import { startOfMonth, toMonthKey } from "../utils/date"
import type { Attendance } from "../types"
import { ATTENDANCE_API_BASE_URL } from "../config"

export default function StaffHome() {
  const { user, token } = useRequiredAuth()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const monthKey = toMonthKey(month)

  const [monthlyAttendance, setMonthlyAttendance] = useState<Attendance[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState<boolean>(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [todayLoading, setTodayLoading] = useState<boolean>(false);
  const [todayError, setTodayError] = useState<string | null>(null);

  async function fetchMonthlyAttendance() {
    setMonthlyLoading(true);
    setMonthlyError(null);

    try {
      const userId = user.id;

      const response = await fetch(`${ATTENDANCE_API_BASE_URL}/month/${userId}?month=${monthKey}`, {
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

  async function fetchTodayAttendance() {
    setTodayLoading(true);
    setTodayError(null);

    try {
      const userId = user.id;

      const response = await fetch(`${ATTENDANCE_API_BASE_URL}/day/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      })

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      setTodayAttendance(text ? (JSON.parse(text) as Attendance) : null);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setTodayError(err.message);
      }
    } finally {
      setTodayLoading(false);
    }
  }

  useEffect(() => {
    fetchMonthlyAttendance();
    fetchTodayAttendance();
  }, [token]);

  const reload = () => {
    fetchMonthlyAttendance();
    fetchTodayAttendance();
  };

  function handleSubmitted() {
    reload();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[minmax(0,1fr)_340px] md:items-start">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My attendance</h1>
        {monthlyError && <ErrorText>{monthlyError}</ErrorText>}
        <Calendar month={month} onMonthChange={setMonth} attendanceList={monthlyAttendance} loading={monthlyLoading} />
      </div>
      <TodayAttendance attendance={todayAttendance} loading={todayLoading} error={todayError} onSubmitted={handleSubmitted} />
    </div>
  )
}

