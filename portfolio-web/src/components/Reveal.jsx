import React, { useEffect, useRef, useState } from 'react'

/**
 * Fades + slides its children in the first time they scroll into view.
 * Put <Reveal delay={100}> around any block to animate it.
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // if the browser cannot observe, just show everything right away
    if (!('IntersectionObserver' in window)) {
      node.classList.add('show')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.style.transitionDelay = `${delay}ms`
            node.classList.add('show')
            observer.unobserve(node) // only animate once
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
