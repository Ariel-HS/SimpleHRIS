export type Role = "admin" | "staff"
export type AttendanceStatus = "on-time" | "late" | "absent"

export interface User {
    id: number;
    name: string
    email: string
    role: Role

    attendances?: Attendance[];
}

export interface Photo {
    id: string;
    imgSrc: string; 
    mimeType: string;
    attendance?: Attendance;
}

export interface Attendance {
    id: number;
    user: User; 
    date: string; // Serialized from Date to ISO string by JSON
    time: string;
    status: AttendanceStatus;
    photo?: Photo;
}

export interface RegisterInput {
    email: string
    password: string
}

export type EmployeeInput = Pick<User, "name" | "email" | "role">

// /** One day in a monthly calendar. `date` is "YYYY-MM-DD", `checkInTime` is "HH:mm". */
// export interface AttendanceRecord {
//   date: string
//   status: AttendanceStatus | null
//   checkInTime: string | null
// }

// /** A single day's attendance, including the photo proof. */
// export interface AttendanceDetailData {
//   date?: string
//   status: AttendanceStatus | null
//   checkInTime: string | null
//   photoUrl: string | null
// }

// /** One row of the admin dashboard (today's attendance of one employee). */
// export interface TodayRecord {
//   employeeId: string
//   name: string
//   email: string
//   status: AttendanceStatus | null
//   checkInTime: string | null
// }
