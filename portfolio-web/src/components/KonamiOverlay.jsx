import React, { useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import useBodyLock from '../hooks/useBodyLock'

// ---------------------------------------------------------------
//  KonamiOverlay
// ---------------------------------------------------------------
//  The reward for typing the Konami Code.
//
//  It does four things at once, all of them CSS-only so there is
//  no extra JavaScript running while it is open:
//    1. turns the whole page into a CRT monitor (scanlines + flicker)
//    2. swaps the font to a chunky terminal one
//    3. shows a fake BIOS boot message
//    4. traps your typing so it looks like a real machine
//
//  Add the class "konami" to <html> and the CSS does the rest.
// ---------------------------------------------------------------
export default function KonamiOverlay({ open, onClose }) {
  const { play } = useSettings()

  // A ref to the latest onClose, so the effect below does not have
  // to re-run every time the parent passes a new function.
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  // Holds the keydown handler so the cleanup can remove it.
  const handlerRef = useRef(null)

  // Lock scrolling behind it.
  useBodyLock(open)

  useEffect(() => {
    if (!open) return

    play('success')
    document.documentElement.classList.add('konami')

    // We wait a moment before listening, so the last key of the
    // Konami code does not instantly close the overlay again.
    const timer = setTimeout(() => {
      handlerRef.current = () => closeRef.current()
      window.addEventListener('keydown', handlerRef.current)
    }, 600)

    return () => {
      clearTimeout(timer)

      if (handlerRef.current) {
        window.removeEventListener('keydown', handlerRef.current)
        handlerRef.current = null
      }

      document.documentElement.classList.remove('konami')
    }
  }, [open, play])

  if (!open) return null

  return (
    <div className="konami" role="dialog" aria-label="Retro mode" onClick={onClose}>
      <div className="crt">
        {/* ---------- fake BIOS boot text ---------- */}
        <pre className="crt-text">
{`AWARD BIOS v6.0  (C) 1998 PORTFOLIO SYSTEMS

CPU  : Student Microprocessor @ 4.20 GHz
MEM  : 640K base / 65536K extended
GPU  : ANSI-compatible text renderer

DETECTING ..........

  OK   HIDDEN QUEST: UNLOCKED
  OK   RETRO MODE: ENABLED
  OK   DEVELOPER SKILL: MAX

PRESS ANY KEY TO RETURN TO 2026`}
        </pre>

        {/* ---------- blinking cursor ---------- */}
        <span className="crt-caret" />
      </div>
    </div>
  )
}
