import React from 'react'
import useScrollProgress from '../hooks/useScrollProgress'

// ---------------------------------------------------------------
//  ScrollProgress
// ---------------------------------------------------------------
//  The thin gradient line stuck to the very top of the window
//  that fills up as you read the page.
//
//  It has no state of its own: the hook does the scroll listening,
//  and we just turn the number into a width.
// ---------------------------------------------------------------
export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div className="progress-track" aria-hidden="true">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}
