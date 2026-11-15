const rawApiUrl = import.meta.env.VITE_API_URL

if (!rawApiUrl) {
  throw new Error("VITE_API_URL is not set. Copy .env.example to .env and restart the dev server.")
}

export const API_URL = rawApiUrl.replace(/\/+$/, "") // strip trailing slashes

export const AUTH_API_BASE_URL = `${API_URL}/auth`
export const USER_API_BASE_URL = `${API_URL}/user`
export const ATTENDANCE_API_BASE_URL = `${API_URL}/attendance`
