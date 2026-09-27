import { useEffect, useState } from 'react'

// ---------------------------------------------------------------
//  useScrollProgress
// ---------------------------------------------------------------
//  Returns a number from 0 to 100: how far down the page you are.
//
//  It is used for the thin gradient bar at the very top of the
//  site, and for shrinking the navbar.
//
//  Performance note: we listen with { passive: true }, which tells
//  the browser "we will never call preventDefault() here", so it
//  does not have to wait for our code before scrolling. That is
//  what keeps scrolling smooth.
// ---------------------------------------------------------------
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      // Total scrollable distance on this page.
      const total = document.documentElement.scrollHeight - window.innerHeight

      // Guard against dividing by zero on very short pages.
      const next = total > 0 ? (window.scrollY / total) * 100 : 0

      setProgress(Math.min(100, Math.max(0, next)))
    }

    onScroll() // run once so the bar is correct on first paint

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}
