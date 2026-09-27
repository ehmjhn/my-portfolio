import React, { useEffect, useRef, useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { themes } from '../data/themes'

// ---------------------------------------------------------------
//  ThemeMenu
// ---------------------------------------------------------------
//  A small dropdown that lets you pick one of the four themes.
//
//  It closes itself when you click outside, or press Escape.
//  We do that with one document-level listener instead of adding
//  an overlay div, so there is nothing to style or click through.
// ---------------------------------------------------------------
export default function ThemeMenu() {
  const { settings, setTheme, play } = useSettings()
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  // --- click outside / Escape to close ---
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      // boxRef.current is the menu. If the click landed outside it,
      // close the menu.
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const active = themes.find((t) => t.id === settings.theme)

  return (
    <div className="theme-menu" ref={boxRef}>
      <button
        className="icon-btn"
        onClick={() => {
          setOpen((v) => !v)
          play('click')
        }}
        aria-label="Change theme"
        aria-expanded={open}
        title="Theme: press T to cycle"
        data-cursor="THEME"
      >
        <span className="theme-glyph" style={{ '--g': `var(--c-${active.id === 'neon' ? 'pink' : 'cyan'})` }}>
          {active?.icon}
        </span>
      </button>

      {open && (
        <div className="theme-pop" role="menu">
          <span className="theme-pop-title">Themes</span>

          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-opt ${settings.theme === theme.id ? 'on' : ''}`}
              role="menuitemradio"
              aria-checked={settings.theme === theme.id}
              onClick={() => {
                setTheme(theme.id)
                play('success')
                setOpen(false)
              }}
            >
              <span className="theme-swatch">
                <i style={{ background: theme.browser }} />
                <i className={`swatch-dot dot-${theme.id}`} />
              </span>
              <span className="theme-name">{theme.name}</span>
              {settings.theme === theme.id && <span className="theme-check">✓</span>}
            </button>
          ))}

          <div className="theme-pop-foot">
            <kbd>T</kbd> to cycle
          </div>
        </div>
      )}
    </div>
  )
}
