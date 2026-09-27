import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

// ---------------------------------------------------------------
//  useKeyboardShortcuts
// ---------------------------------------------------------------
//  One hook that owns every global keybinding on the site, so the
//  App component stays clean and all the key logic lives in one
//  readable place.
//
//  Two kinds of shortcut:
//
//   1. Single keys:  t, s, c, m, ?, /
//   2. Two-key sequences:  g then h   (like a real code editor,
//      where "g" puts you in "goto" mode)
//
//  We always ignore keys while the user is typing in a field, so
//  pressing "s" inside the terminal does not toggle sound.
// ---------------------------------------------------------------

// Which page each "g then X" sequence goes to.
const GOTO = {
  h: '/',
  a: '/about',
  p: '/projects',
  j: '/journey',
  l: '/lab',
  c: '/contact',
}

export default function useKeyboardShortcuts({ onOpenPalette, onOpenShortcuts }) {
  const { nextTheme, toggleSound, toggleCursor, toggleMotion, play } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()

  // Are we in the middle of a "g then something" sequence?
  const pendingGoto = useRef(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      // ---- 1. Never hijack keys while typing in a field ----
      const tag = document.activeElement?.tagName
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable

      // ---- 2. Ctrl+K and "/" always work, even while typing ----
      // Ctrl+K is checked with event.ctrlKey so a plain "k" is free.
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenPalette()
        return
      }

      if (isTyping) {
        pendingGoto.current = false
        return
      }

      // Ignore anything with a modifier we did not ask for, so we
      // do not fight browser shortcuts like Ctrl+R or Cmd+S.
      if (event.ctrlKey || event.metaKey || event.altKey) return

      const key = event.key

      // ---- 3. Slash opens the palette, unless the user is
      //         trying to type a "/" somewhere ----
      if (key === '/') {
        event.preventDefault()
        onOpenPalette()
        return
      }

      // ---- 4. "?" opens the shortcut sheet ----
      if (key === '?') {
        event.preventDefault()
        onOpenShortcuts()
        return
      }

      // ---- 5. Two-key sequences: g then h / a / p / j / l / c ----
      if (pendingGoto.current) {
        const destination = GOTO[key.toLowerCase()]
        pendingGoto.current = false

        if (destination) {
          event.preventDefault()
          play('click')

          // Scrolling to the top after a route change feels right,
          // because a new page should start at its beginning.
          if (destination !== location.pathname) {
            navigate(destination)
            window.scrollTo({ top: 0 })
          }
          return
        }
      }

      // "g" on its own arms the goto sequence.
      if (key.toLowerCase() === 'g') {
        pendingGoto.current = true

        // If they do nothing for 1.2s, forget about it.
        setTimeout(() => {
          pendingGoto.current = false
        }, 1200)
        return
      }

      // ---- 6. Single-key toggles ----
      switch (key.toLowerCase()) {
        case 't':
          // Shift+T walks the themes backwards instead of forwards.
          event.preventDefault()
          nextTheme(event.shiftKey)
          break

        case 's':
          event.preventDefault()
          toggleSound()
          break

        case 'c':
          event.preventDefault()
          toggleCursor()
          break

        case 'm':
          event.preventDefault()
          toggleMotion()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    onOpenPalette,
    onOpenShortcuts,
    navigate,
    location.pathname,
    nextTheme,
    toggleSound,
    toggleCursor,
    toggleMotion,
    play,
  ])
}
