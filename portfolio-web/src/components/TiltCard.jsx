import React, { useEffect, useRef, useState } from 'react'

/**
 * Makes a card follow the mouse a little (3D tilt effect).
 * Works on touch devices too because we check for a real mouse pointer.
 */
export default function TiltCard({ children, max = 9, className = '' }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const canHover =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (!canHover) return

    const onMove = (event) => {
      const box = node.getBoundingClientRect()
      const x = event.clientX - box.left
      const y = event.clientY - box.top

      // how far from the center the pointer is, as a -0.5 to 0.5 value
      const px = x / box.width - 0.5
      const py = y / box.height - 0.5

      setStyle({
        transform: `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-6px)`,
      })
    }

    const onLeave = () => {
      setStyle({ transform: 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)' })
    }

    node.addEventListener('mousemove', onMove)
    node.addEventListener('mouseenter', () => setHovering(true))
    node.addEventListener('mouseleave', () => {
      setHovering(false)
      onLeave()
    })

    return () => {
      node.removeEventListener('mousemove', onMove)
      node.removeEventListener('mouseleave', onLeave)
    }
  }, [max])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: 'transform 0.18s ease-out',
        transformStyle: 'preserve-3d',
        boxShadow: hovering ? '0 26px 60px rgba(0,0,0,0.5)' : undefined,
      }}
    >
      {children}
    </div>
  )
}
