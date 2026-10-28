import { useEffect, useState } from 'react'

const STORAGE_KEY = 'upornot-theme'
const THEME_COLORS = { dark: '#0f172a', light: '#f8fafc' }

// public/theme-init.js has already set data-bs-theme before React loads
function readInitialTheme() {
  return document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next) // remember the user's choice
      } catch {
        // private mode / storage blocked: theme still works for this visit
      }
      return next
    })
  }

  return { theme, toggleTheme }
}
