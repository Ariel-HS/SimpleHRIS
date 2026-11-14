import { Navigate, Route, Routes } from "react-router-dom"
import AdminLayout from "./components/AdminLayout"
import Navbar from "./components/Navbar"
import { GuestOnly, RequireRole } from "./components/RouteGuards"
import Guest from "./pages/Guest"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StaffHome from "./pages/StaffHome"
import AttendanceDetail from "./pages/admin/AttendanceDetail"
import Dashboard from "./pages/admin/Dashboard"
import EmployeeProfile from "./pages/admin/EmployeeProfile"
import Employees from "./pages/admin/Employees"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="p-6 max-sm:p-4">
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path="/" element={<Guest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<RequireRole role="staff" />}>
            <Route path="/staff" element={<StaffHome />} />
          </Route>

          <Route element={<RequireRole role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/employees" element={<Employees />} />
              <Route path="/admin/employees/:id" element={<EmployeeProfile />} />
              <Route path="/admin/employees/:id/attendance/:date" element={<AttendanceDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
