import { useState } from "react"
import { useRequiredAuth } from "../context/AuthContext"
import type { Attendance } from "../types"
import { formatLongDate, isWeekend } from "../utils/date"
import CameraCapture from "./CameraCapture"
import StatusBadge from "./StatusBadge"
import { mutedClass } from "./styles"
import { Button, Card, DetailList, DetailRow, ErrorText } from "./ui"

interface Props {
    attendance: Attendance | null
    loading: boolean
    error: string | null
    onSubmitted: () => void
}

const ATTENDANCE_API_BASE_URL = "http://localhost:3000/api/attendance";

export default function TodayAttendance({ attendance, loading, error, onSubmitted }: Props) {
    const { user, token } = useRequiredAuth()
    const [photo, setPhoto] = useState<Blob | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    const [now] = useState(() => new Date())
    const checkedIn = Boolean(attendance?.time)

    async function handleSubmit() {
        if (!photo) return
        setSubmitError("")
        setSubmitting(true)
        try {
            const userId = user.id;

            const formData = new FormData();
            formData.append('selfie', photo, 'selfie.jpg');

            const response = await fetch(`${ATTENDANCE_API_BASE_URL}/check-in/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // const data: Attendance = await response.json();
            setPhoto(null)
            onSubmitted()
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setSubmitError(msg)
        } finally {
            setSubmitting(false)
        }
    }

    let body
    if (loading) {
        body = <p className={mutedClass}>Loading…</p>
    } else if (error) {
        body = <ErrorText>{error}</ErrorText>
    } else if (attendance && checkedIn) {
        body = (
            <div className="space-y-4">
                <DetailList>
                    <DetailRow label="Status">
                        <StatusBadge status={attendance.status} />
                    </DetailRow>
                    <DetailRow label="Checked in at">{attendance.time}</DetailRow>
                </DetailList>
                {attendance.photo?.imgSrc && (
                    <img src={attendance.photo.imgSrc} alt="Your attendance proof" className="aspect-[4/3] w-full rounded-lg object-cover" />
                )}
            </div>
        )
    // NOTE: Comment this to test on weekends
    } else if (isWeekend(now)) {
        body = <p className={mutedClass}>No attendance is needed on weekends.</p>
    } else {
        body = (
            <div className="space-y-3">
                <DetailList>
                    <DetailRow label="Status">
                        <StatusBadge status={null} />
                    </DetailRow>
                </DetailList>
                <CameraCapture onCapture={setPhoto} disabled={submitting} />
                {submitError && <ErrorText>{submitError}</ErrorText>}
                <Button block onClick={handleSubmit} disabled={!photo || submitting}>
                    {submitting ? "Submitting…" : "Submit attendance"}
                </Button>
                {!photo && <p className={`text-sm ${mutedClass}`}>Take a picture first to enable submit.</p>}
            </div>
        )
    }

    return (
        <Card className="max-md:order-first md:sticky md:top-4">
            <h2 className="text-lg font-semibold">Today</h2>
            <p className={`mb-4 ${mutedClass}`}>{formatLongDate(now)}</p>
            {body}
        </Card>
    )
}
