import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { linkClass, mutedClass, tdClass, thClass, trClass } from "../../components/styles"
import { formatLongDate } from "../../utils/date"
import { Card, ErrorText } from "../../components/ui"
import type { Attendance } from "../../types"
import StatusBadge from "../../components/StatusBadge"
import type { AttendanceStatus } from "../../types"
import { STATUS_LABELS, STATUS_STYLES } from "../../utils/status"
import { useRequiredAuth } from "../../context/AuthContext"
import { ATTENDANCE_API_BASE_URL } from "../../config"

export default function Dashboard() {
    const { token } = useRequiredAuth()
    const [now] = useState(() => new Date())
    const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${ATTENDANCE_API_BASE_URL}/today`, {
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
                setAttendanceList(data)
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, [token]);

    const count = (status: AttendanceStatus | null) => 
        attendanceList.filter((r) => (r.status ?? null) === status).length

    const summary: { label: string; value: number; className: string }[] = [
    ...(Object.keys(STATUS_LABELS) as AttendanceStatus[]).map((s) => ({
        label: STATUS_LABELS[s],
        value: count(s),
        className: STATUS_STYLES[s].text,
    })),
    { label: "Not checked in", value: count(null), className: mutedClass },
    ]

    return (
        <div className="space-y-4">
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className={mutedClass}>{formatLongDate(now)}</p>
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {summary.map((s) => (
            <Card key={s.label} className="flex flex-col gap-1">
                <span className={`text-3xl font-bold ${s.className}`}>{loading ? "–" : s.value}</span>
                <span className={`text-sm ${mutedClass}`}>{s.label}</span>
            </Card>
            ))}
        </div>

        <Card>
            <h2 className="mb-3 text-lg font-semibold">Today’s attendance</h2>
            <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr className={trClass}>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Check-in time</th>
                    <th className={thClass}>Status</th>
                </tr>
                </thead>
                <tbody>
                {attendanceList.map((r) => (
                    <tr key={r.user.id} className={trClass}>
                    <td className={tdClass}>
                        <Link to={`/admin/employees/${r.user.id}`} className={linkClass}>
                        {r.user.name}
                        </Link>
                    </td>
                    <td className={tdClass}>{r.time ?? "—"}</td>
                    <td className={tdClass}>
                        <StatusBadge status={r.status} />
                    </td>
                    </tr>
                ))}
                {!loading && attendanceList.length === 0 && (
                    <tr>
                    <td colSpan={3} className={`${tdClass} ${mutedClass}`}>
                        No staff found.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </Card>
        </div>
    )
}
