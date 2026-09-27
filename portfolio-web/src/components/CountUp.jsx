import React, { useEffect, useRef, useState } from 'react'

/**
 * Counts up from 0 to the target number once the card scrolls into view.
 */
export default function CountUp({ value, duration = 1600 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0

    const run = () => {
      const start = performance.now()

      const tick = (now) => {
        const passed = now - start
        const percent = Math.min(passed / duration, 1)
        // easeOutExpo makes it slow down nicely at the end
        const eased = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent)

        setDisplay(Math.round(eased * value))

        if (percent < 1) frame = requestAnimationFrame(tick)
      }

      frame = requestAnimationFrame(tick)
    }

    if (!('IntersectionObserver' in window)) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return <span ref={ref}>{display.toLocaleString()}</span>
}
