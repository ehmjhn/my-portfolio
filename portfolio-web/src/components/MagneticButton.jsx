import React from 'react'
import useMagnetic from '../hooks/useMagnetic'

// ---------------------------------------------------------------
//  MagneticButton
// ---------------------------------------------------------------
//  A button that gets pulled toward the mouse when you get close.
//  It is a thin wrapper around the useMagnetic hook, so pages
//  can just write:
//
//    <MagneticButton className="btn btn-primary">Hire me</MagneticButton>
//
//  and get the effect for free.
// ---------------------------------------------------------------
export default function MagneticButton({
  children,
  className = '',
  strength = 0.32,
  label = '',
  ...rest
}) {
  const [handlers, ref] = useMagnetic(strength)

  return (
    <button
      ref={ref}
      className={`magnetic ${className}`}
      // The word shown inside the cursor ring while hovering.
      data-cursor={label || undefined}
      {...handlers}
      {...rest}
    >
      <span className="magnetic-inner">{children}</span>
    </button>
  )
}
