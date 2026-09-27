import React, { useEffect, useState } from 'react'
import useScrollProgress from '../hooks/useScrollProgress'
import { useSettings } from '../context/SettingsContext'

// ---------------------------------------------------------------
//  BackToTop
// ---------------------------------------------------------------
//  A round button that appears after you scroll past a screen and
//  takes you back up. It also shows a ring that fills as you read,
//  which is a small detail that makes it feel connected to the
//  page instead of just being a floating arrow.
// ---------------------------------------------------------------
export default function BackToTop() {
  const progress = useScrollProgress()
  const { play } = useSettings()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // onScroll fires for every scroll event, so we only setState
    // when the answer actually changes. Without this guard the
    // component would re-render hundreds of times a second.
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`to-top ${show ? 'show' : ''}`}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        play('click')
      }}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      data-cursor="TOP"
    >
      {/* This circle is drawn with stroke-dasharray. The dash is
          100 long, and we show only the first "progress" of it,
          which is what draws the filling ring. */}
      <svg className="to-top-ring" viewBox="0 0 40 40" aria-hidden="true">
        <circle className="ring-bg" cx="20" cy="20" r="17" />
        <circle
          className="ring-fill"
          cx="20"
          cy="20"
          r="17"
          style={{ strokeDashoffset: 100 - progress }}
        />
      </svg>

      <span className="to-top-arrow">&uarr;</span>
    </button>
  )
}
