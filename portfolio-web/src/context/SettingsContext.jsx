import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { playSound } from '../lib/sound'
import { themes, themeById, DEFAULT_THEME } from '../data/themes'

// ---------------------------------------------------------------
//  SettingsContext
// ---------------------------------------------------------------
//  This is the one place that remembers how the user wants the site
//  to behave: which theme, are sound effects on, is the custom
//  cursor on, do we allow animations.
//
//  We use useReducer instead of four separate useStates because
//  every change goes through the same reducer, so it is easy to
//  read what can happen and to add new settings later.
// ---------------------------------------------------------------

// Where the context "lives". Components read it with useSettings().
const SettingsContext = createContext(null)

// The starting values. These are only defaults — the real values
// come from localStorage (see the useState call in the provider).
const initialState = {
  theme: DEFAULT_THEME,
  sound: false, // off by default, because surprise noise is rude
  cursor: true, // the custom blob cursor
  motion: true, // reveal animations, blob drift, etc.
}

// Every legal change is a "type" + a payload.
// This is the whole brain of the settings system.
function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      // Guard: ignore theme names that do not exist.
      if (!themeById[action.value]) return state
      return { ...state, theme: action.value }

    case 'CYCLE_THEME': {
      // Step to the next theme in the list. Wraps around at the end.
      // direction -1 walks backwards, which is what Shift+T does.
      const step = action.back ? -1 : 1
      const index = themes.findIndex((t) => t.id === state.theme)
      const next = themes[(index + step + themes.length) % themes.length]
      return { ...state, theme: next.id }
    }

    case 'TOGGLE':
      // Generic flip. { type: 'TOGGLE', key: 'sound' } flips settings.sound
      return { ...state, [action.key]: !state[action.key] }

    default:
      return state
  }
}

export function SettingsProvider({ children }) {
  // useReducer needs its third argument to load the saved state
  // on first render. We pass a small function that reads
  // localStorage and merges it on top of the defaults.
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (defaults) => {
      try {
        const savedTheme = window.localStorage.getItem('theme')
        const savedSound = window.localStorage.getItem('sound')
        const savedCursor = window.localStorage.getItem('cursor')
        const savedMotion = window.localStorage.getItem('motion')

        // Each one falls back to the default if missing or invalid.
        return {
          theme: themeById[savedTheme] ? savedTheme : defaults.theme,
          sound: savedSound === null ? defaults.sound : savedSound === 'true',
          cursor: savedCursor === null ? defaults.cursor : savedCursor === 'true',
          motion: savedMotion === null ? defaults.motion : savedMotion === 'true',
        }
      } catch {
        return defaults // localStorage blocked, just use defaults
      }
    }
  )

  // Save every setting whenever it changes, so the choices stick
  // even after a full page refresh.
  useEffect(() => {
    try {
      window.localStorage.setItem('theme', state.theme)
      window.localStorage.setItem('sound', String(state.sound))
      window.localStorage.setItem('cursor', String(state.cursor))
      window.localStorage.setItem('motion', String(state.motion))
    } catch {
      // ignore
    }
  }, [state])

  // Put the theme on the <html> element as a class, e.g.
  // <html class="theme-neon">. The CSS then does the rest.
  useEffect(() => {
    const root = document.documentElement

    // Remove the old theme class first so only one stays.
    themes.forEach((t) => root.classList.remove(`theme-${t.id}`))
    root.classList.add(`theme-${state.theme}`)

    // Tell mobile browsers which color to use for the address bar.
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', themeById[state.theme].browser)
  }, [state.theme])

  // The custom cursor and animations are both turned off by
  // toggling classes on <html>. CSS reads those classes.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('no-cursor', !state.cursor)
    root.classList.toggle('no-motion', !state.motion)
  }, [state.cursor, state.motion])

  // If the user has "Reduce motion" turned on in their OS settings,
  // we respect it automatically and switch animations off for them.
  const [reduced] = useMotionPreference()

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.add('no-motion')
    }
  }, [reduced])

  // Small helpers so components can call play() instead of
  // remembering to check the sound setting first.
  const play = (name) => {
    if (state.sound) playSound(name)
  }

  // useMemo keeps this object stable so components that read the
  // context do not re-render for no reason.
  const value = useMemo(
    () => ({
      settings: state,
      dispatch,
      play,
      setTheme: (id) => dispatch({ type: 'SET_THEME', value: id }),
      nextTheme: (back = false) => {
        dispatch({ type: 'CYCLE_THEME', back })
        // Use play(), not playSound(), so this stays silent when
        // the visitor has sound effects turned off.
        play('click')
      },
      toggleSound: () => {
        // Flip first, then play — so the preview is the new state.
        dispatch({ type: 'TOGGLE', key: 'sound' })
        if (!state.sound) playSound('success')
      },
      toggleCursor: () => dispatch({ type: 'TOGGLE', key: 'cursor' }),
      toggleMotion: () => dispatch({ type: 'TOGGLE', key: 'motion' }),
    }),
    [state]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// Custom hook: does the OS ask for reduced motion?
function useMotionPreference() {
  const [reduced, setReduced] = React.useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    // Listen for the user changing the setting while the page is open.
    const onChange = (event) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return [reduced]
}

// The hook every component uses to read settings.
// It throws a clear error if someone uses it outside the Provider.
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings() must be used inside <SettingsProvider>')
  }
  return ctx
}
