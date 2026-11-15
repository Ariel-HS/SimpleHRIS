import { useCallback, useState } from "react"

type Theme = "light" | "dark"
const STORAGE_KEY = "theme"

// Light is the default. The saved choice is applied before first paint by the inline
// script in index.html
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  )

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // TODO: Storage can be unavailable (private mode); 
    }
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
