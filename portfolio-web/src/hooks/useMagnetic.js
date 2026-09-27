import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------
//  useMagnetic
// ---------------------------------------------------------------
//  Makes an element get pulled slightly toward the mouse when the
//  mouse gets close. Small movement, big "this is alive" feeling.
//
//  How it works, step by step:
//   1. Find the element's rectangle on screen (getBoundingClientRect).
//   2. Work out how far the mouse is from the middle of it.
//   3. If the mouse is inside an expanded "magnet zone" around the
//      element, move the element a fraction of that distance.
//   4. When the mouse leaves, animate it back to the middle.
//
//  We move it with direct style writes inside requestAnimationFrame
//  instead of setState, because doing this 60 times a second through
//  React state would be slow and would re-render the whole component.
//
//  Usage:  const [magneticProps, magneticRef] = useMagnetic(0.35)
//          <button ref={magneticRef} {...magneticProps}>
// ---------------------------------------------------------------
export default function useMagnetic(strength = 0.3) {
  const ref = useRef(null)

  // We hand these back so you can spread them onto the element:
  // onMouseMove / onMouseLeave.
  const [handlers, setHandlers] = useState({})

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Only run this on devices with a real mouse.
    // On touch devices there is no hover, so it would just add jitter.
    const canHover =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (!canHover) return

    let frame = 0 // holds the pending animation frame id
    let current = { x: 0, y: 0 } // where we want to move to
    let applied = { x: 0, y: 0 } // where we actually are right now

    // This runs on every frame. Instead of jumping straight to the
    // target, we move a small step toward it each frame. That is what
    // makes it feel smooth and "sticky" instead of jumpy.
    const glide = () => {
      applied.x += (current.x - applied.x) * 0.18
      applied.y += (current.y - applied.y) * 0.18

      node.style.transform = `translate3d(${applied.x}px, ${applied.y}px, 0)`

      // Keep going only while there is still distance left to cover.
      const stillMoving =
        Math.abs(current.x - applied.x) > 0.1 || Math.abs(current.y - applied.y) > 0.1

      frame = stillMoving ? requestAnimationFrame(glide) : 0
    }

    const onMove = (event) => {
      const box = node.getBoundingClientRect()

      // Centre of the element, in screen coordinates.
      const centerX = box.left + box.width / 2
      const centerY = box.top + box.height / 2

      const dx = event.clientX - centerX
      const dy = event.clientY - centerY

      // The magnet zone: how far away the mouse still counts.
      // We add 60px around the element so the pull starts early.
      const zoneX = box.width / 2 + 60
      const zoneY = box.height / 2 + 60

      // Outside the zone? Stop pulling.
      if (Math.abs(dx) > zoneX || Math.abs(dy) > zoneY) {
        current = { x: 0, y: 0 }
        if (!frame) frame = requestAnimationFrame(glide)
        return
      }

      // Inside the zone: move only a fraction of the distance,
      // and never more than 14px so it does not fly away.
      current = {
        x: Math.max(-14, Math.min(14, dx * strength)),
        y: Math.max(-14, Math.min(14, dy * strength)),
      }

      if (!frame) frame = requestAnimationFrame(glide)
    }

    const onLeave = () => {
      current = { x: 0, y: 0 } // glide back to the middle
      if (!frame) frame = requestAnimationFrame(glide)
    }

    // Hand the handlers back so MagneticButton can spread them onto
    // the element. Note the key is "onMouseMove" (the React prop
    // name) while the function itself is called "onMove".
    setHandlers({
      onMouseMove: onMove,
      onMouseLeave: onLeave,
    })

    return () => {
      cancelAnimationFrame(frame)
      node.style.transform = ''
    }
  }, [strength])

  return [handlers, ref]
}
