import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------
//  useKonamiCode
// ---------------------------------------------------------------
//  The Konami Code is an old cheat code from the NES:
//    Up Up Down Down Left Right Left Right B A
//
//  If a visitor types it in the correct order, we can trigger
//  something fun (here: a retro CRT overlay).
//
//  How it works:
//   - We keep a ref called "progress" that remembers how many of
//     the keys they have typed correctly SO FAR.
//   - Every key press is compared with the next key we expect.
//     Correct -> go up one. Wrong -> reset to 0.
//   - When progress reaches the end, we call onSuccess().
//
//  A ref is used (not state) because we do not want to re-render
//  React 20 times while someone is just mashing arrow keys.
// ---------------------------------------------------------------
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export default function useKonamiCode(onSuccess) {
  const [found, setFound] = useState(false)
  const progressRef = useRef(0)

  useEffect(() => {
    const onKeyDown = (event) => {
      // Do not steal keys from a text field. If the user is typing
      // in the terminal or the command palette, leave them alone.
      const tag = document.activeElement?.tagName
      const isTyping =
        tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable
      if (isTyping) return

      const expected = KONAMI_SEQUENCE[progressRef.current]
      const pressed = event.key.toLowerCase()

      if (pressed === expected.toLowerCase()) {
        progressRef.current = progressRef.current + 1

        // All ten keys correct.
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0 // reset so they can do it again
          setFound(true)
          onSuccess?.()
        }
      } else {
        // Wrong key. Instead of going straight to 0, we check one
        // thing first: maybe they were actually right about THIS key
        // but wrong earlier. This handles overlapping sequences
        // (like "up up" containing a second "up").
        progressRef.current = pressed === KONAMI_SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onSuccess])

  return found
}

export { KONAMI_SEQUENCE }
