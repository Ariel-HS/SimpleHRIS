import { Link, useParams } from "react-router-dom"
import StatusBadge from "../../components/StatusBadge"
import { linkClass, mutedClass } from "../../components/styles"
import { Card, DetailList, DetailRow, ErrorText } from "../../components/ui"
import { useRequiredAuth } from "../../context/AuthContext"
import { formatLongDate, parseISODate } from "../../utils/date"
import { useEffect, useState } from "react"
import type { Attendance } from "../../types"
import { ATTENDANCE_API_BASE_URL } from "../../config"

export default function AttendanceDetail() {
    const { id = "", date = "" } = useParams()
    const { token } = useRequiredAuth()

    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // const { data, loading, error } = useAsync(() => employeesApi.day(token, id, date), [token, id, date])

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${ATTENDANCE_API_BASE_URL}/day/${id}?day=${date}`, {
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
                setAttendance(text ? (JSON.parse(text) as Attendance) : null);
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

    return (
        <div className="space-y-4">
            <Link to={`/admin/employees/${id}`} className={`inline-block text-sm ${linkClass}`}>
                ← Employee profile
            </Link>
            <h1 className="text-2xl font-bold">{formatLongDate(parseISODate(date))}</h1>

            {loading && <p className={mutedClass}>Loading…</p>}
            {error && <ErrorText>{error}</ErrorText>}
            
            {attendance && (
                <Card className="max-w-xl space-y-5">
                    <DetailList>
                        <DetailRow label="Check-in time">{attendance.time ?? "—"}</DetailRow>
                        <DetailRow label="Status">
                            <StatusBadge status={attendance.status} />
                        </DetailRow>
                    </DetailList>
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">Photo proof</h2>
                        {attendance.photo?.imgSrc ? (
                            <img
                                src={attendance.photo.imgSrc}
                                alt="Attendance proof"
                                className="w-full max-w-md rounded-lg border border-slate-200 dark:border-slate-800"
                            />
                        ) : (
                            <p className={mutedClass}>No photo submitted.</p>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
