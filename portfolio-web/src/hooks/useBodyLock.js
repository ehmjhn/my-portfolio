import { useEffect } from 'react'

// ---------------------------------------------------------------
//  useBodyLock
// ---------------------------------------------------------------
//  Stops the page behind a popup from scrolling while it is open.
//
//  We cannot simply set overflow:hidden on the body, because that
//  makes the scrollbar disappear and the whole page shifts left.
//  The fix is to replace the scrollbar with padding of the same
//  width. window.innerWidth includes the scrollbar, clientWidth
//  does not, so the difference is exactly the scrollbar width.
//
//  Usage:  useBodyLock(open)
// ---------------------------------------------------------------
export default function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // The cleanup function runs when the popup closes (or the page
    // unmounts), putting everything back the way it was.
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
    }
  }, [locked])
}
