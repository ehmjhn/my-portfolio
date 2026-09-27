import { useState, useEffect } from 'react'

// ---------------------------------------------------------------
//  useLocalStorage
// ---------------------------------------------------------------
//  A normal useState, except the value is also written to
//  localStorage. So when you refresh the page, the setting (like
//  your chosen theme) is still there.
//
//  Usage:  const [theme, setTheme] = useLocalStorage('theme', 'midnight')
// ---------------------------------------------------------------
export default function useLocalStorage(key, initialValue) {
  // The function we pass to useState only runs ONCE, on mount.
  // That is the right place to read localStorage.
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)

      // Nothing saved yet -> use the default, and save it for next time.
      if (saved === null) {
        window.localStorage.setItem(key, JSON.stringify(initialValue))
        return initialValue
      }

      // JSON.parse turns the saved text back into a real value
      return JSON.parse(saved)
    } catch {
      // localStorage can throw (private browsing, storage disabled).
      // If that happens we just fall back to the default.
      return initialValue
    }
  })

  // Every time the value changes, save it again.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Same as above: saving failed, but the UI still works.
    }
  }, [key, value])

  return [value, setValue]
}
