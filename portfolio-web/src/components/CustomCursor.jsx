import React, { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------
//  CustomCursor
// ---------------------------------------------------------------
//  Two shapes that follow your mouse:
//
//    dot   -> a small solid dot that tracks almost exactly
//    ring  -> a bigger hollow ring that lags behind, so you get
//             a soft "trail" effect for free
//
//  The ring grows and turns into a "VIEW" label when you hover
//  anything clickable.
//
//  Important: we never use setState to move it. We write the
//  transform straight onto the DOM node inside requestAnimationFrame.
//  If we used React state, this would re-render the whole app 60
//  times per second and the page would feel laggy. This is the
//  single most important performance lesson in this whole file.
// ---------------------------------------------------------------

// Elements that should make the cursor react.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, .magnetic, .cmd-row'

export default function CustomCursor() {
  // The two DOM nodes we move around.
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState('idle') // idle | hover | text | down
  const [label, setLabel] = useState('')

  useEffect(() => {
    // Only show the cursor on devices with a real mouse.
    // On a phone there is no hover, and a floating blob would
    // just be in the way.
    const canHover =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(hover: hover) and (pointer: fine)').matches

    setEnabled(canHover)
    if (!canHover) return

    // Where the mouse really is, and where our shapes are.
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dot = { ...mouse }
    const ring = { ...mouse }

    let frame = 0
    let visible = false

    // The main loop. Runs every animation frame until we clean up.
    const loop = () => {
      // "Lerp" = move a fraction of the remaining distance.
      // Higher number = snappier, lower = more floaty.
      dot.x += (mouse.x - dot.x) * 0.9
      dot.y += (mouse.y - dot.y) * 0.9

      // The ring follows more slowly, which creates the trail.
      ring.x += (mouse.x - ring.x) * 0.16
      ring.y += (mouse.y - ring.y) * 0.16

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }

      frame = requestAnimationFrame(loop)
    }

    const onMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY

      // Fade in the first time the mouse moves, so it does not
      // sit in the middle of the screen on load.
      if (!visible) {
        visible = true
        document.documentElement.classList.add('cursor-live')
      }

      // What are we hovering over? askEvent.target gives us the
      // element directly under the pointer.
      const target = event.target
      const tag = target?.tagName

      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
        setState('text')
        setLabel('')
      } else if (target?.closest?.(INTERACTIVE)) {
        // Some elements carry a data-cursor="..." attribute so we
        // can show a custom word, e.g. data-cursor="OPEN".
        setState('hover')
        setLabel(target.closest('[data-cursor]')?.dataset.cursor || '')
      } else {
        setState('idle')
        setLabel('')
      }
    }

    const onDown = () => setState((s) => (s === 'text' ? 'text' : 'down'))
    const onUp = () => setState((s) => (s === 'text' ? 'text' : 'hover'))
    const onLeave = () => document.documentElement.classList.remove('cursor-live')
    const onEnter = () => document.documentElement.classList.add('cursor-live')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    frame = requestAnimationFrame(loop)

    // Clean up everything when the component unmounts.
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  // If the user toggles the custom cursor off, hide it.
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('has-cursor')
    } else {
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* The big soft ring (rendered first so the dot sits on top) */}
      <div ref={ringRef} className={`cur-ring s-${state}`} aria-hidden="true">
        {label && <span className="cur-label">{label}</span>}
      </div>

      {/* The precise little dot */}
      <div ref={dotRef} className={`cur-dot s-${state}`} aria-hidden="true" />
    </>
  )
}
