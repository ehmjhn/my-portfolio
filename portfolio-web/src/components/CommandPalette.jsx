import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import useBodyLock from '../hooks/useBodyLock'
import { fuzzySearch } from '../lib/fuzzy'
import { projects, profile, certifications } from '../data/resume'
import { themes } from '../data/themes'
import Highlight from './Highlight'

// ---------------------------------------------------------------
//  Command Palette  (Ctrl + K)
// ---------------------------------------------------------------
//  This is the "search anything" box you get in VS Code, Linear,
//  and Raycast. Instead of clicking through menus, you type what
//  you want and hit Enter.
//
//  The whole thing is three pieces:
//   1. buildCommands()  -> turns the site data into a flat list
//   2. fuzzySearch()    -> filters + ranks that list
//   3. the JSX below    -> renders it and handles the keyboard
//
//  It is a real <input>, so it works with screen readers, phone
//  keyboards, and copy/paste for free.
// ---------------------------------------------------------------

const GROUPS = {
  Navigate: '#22d3ee',
  Project: '#a78bfa',
  Theme: '#f472b6',
  Toggle: '#34d399',
  Contact: '#fb923c',
  Easter: '#facc15',
}

// Build the full command list from live site data, so the palette
// can never go out of date when you add a project.
function buildCommands({ settings, setTheme, toggleSound, toggleCursor, toggleMotion, openShortcuts }) {
  const list = []

  // --- 1. Navigation ---
  const pages = [
    { to: '/', label: 'Home', hint: 'Back to the top' },
    { to: '/about', label: 'About', hint: 'My story and skills' },
    { to: '/projects', label: 'Projects', hint: 'All four systems' },
    { to: '/journey', label: 'Journey', hint: 'Education and activity' },
    { to: '/lab', label: 'Lab', hint: 'Things I built for fun' },
    { to: '/contact', label: 'Contact', hint: 'Hire me or say hi' },
  ]

  pages.forEach((page) => {
    list.push({
      id: `nav-${page.to}`,
      group: 'Navigate',
      label: page.label,
      hint: page.hint,
      keywords: `${page.hint} go to page`,
      icon: '>',
      run: () => {}, // filled in by the caller, it needs navigate()
      navigate: page.to,
    })
  })

  // --- 2. Every project, straight to its case study ---
  projects.forEach((project) => {
    list.push({
      id: `project-${project.id}`,
      group: 'Project',
      label: project.title,
      hint: project.subtitle,
      keywords: `${project.subtitle} ${project.stack.join(' ')} ${project.year} case study`,
      icon: '◆',
      navigate: `/projects/${project.id}`,
    })
  })

  // --- 3. Switch theme directly ---
  themes.forEach((theme) => {
    list.push({
      id: `theme-${theme.id}`,
      group: 'Theme',
      label: `Theme: ${theme.name}`,
      hint: theme.id === settings.theme ? 'Currently active' : `Switch to ${theme.name.toLowerCase()}`,
      keywords: `colour color palette dark light ${theme.id}`,
      icon: '◐',
      active: theme.id === settings.theme,
      run: () => setTheme(theme.id),
    })
  })

  // --- 4. Toggles, showing their current state in the label ---
  const onOff = (value) => (value ? 'ON' : 'OFF')

  list.push({
    id: 'toggle-sound',
    group: 'Toggle',
    label: `Sound Effects: ${onOff(settings.sound)}`,
    hint: 'Web Audio clicks, no files',
    keywords: 'audio mute unmute noise click',
    icon: '♪',
    run: toggleSound,
  })
  list.push({
    id: 'toggle-cursor',
    group: 'Toggle',
    label: `Custom Cursor: ${onOff(settings.cursor)}`,
    hint: 'Blob cursor with magnetic hover',
    keywords: 'mouse pointer blob follow',
    icon: '✦',
    run: toggleCursor,
  })
  list.push({
    id: 'toggle-motion',
    group: 'Toggle',
    label: `Animations: ${onOff(settings.motion)}`,
    hint: 'Turn off to reduce motion',
    keywords: 'animation reduce motion accessibility',
    icon: '◈',
    run: toggleMotion,
  })
  list.push({
    id: 'toggle-shortcuts',
    group: 'Toggle',
    label: 'Keyboard Shortcuts',
    hint: 'Show every shortcut (or press ?)',
    keywords: 'keys cheatsheet help guide',
    icon: '⌨',
    run: openShortcuts,
  })

  // --- 5. Quick contact actions ---
  list.push({
    id: 'copy-email',
    group: 'Contact',
    label: 'Copy email address',
    hint: profile.email,
    keywords: 'clipboard mail contact copy',
    icon: '@',
    run: () => navigator.clipboard?.writeText(profile.email),
  })
  list.push({
    id: 'email-me',
    group: 'Contact',
    label: 'Send an email',
    hint: 'Opens your mail app',
    keywords: 'contact hire message',
    icon: '✉',
    run: () => {
      window.location.href = `mailto:${profile.email}`
    },
  })
  list.push({
    id: 'github',
    group: 'Contact',
    label: 'Open GitHub',
    hint: 'See the source code',
    keywords: 'repo code source git',
    icon: '',
    run: () => window.open(profile.github, '_blank', 'noreferrer'),
  })
  list.push({
    id: 'linkedin',
    group: 'Contact',
    label: 'Open LinkedIn',
    hint: 'Professional profile',
    keywords: 'work job profile network',
    icon: 'in',
    run: () => window.open(profile.linkedin, '_blank', 'noreferrer'),
  })

  // --- 6. Joke entry points, because why not ---
  list.push({
    id: 'cert-count',
    group: 'Easter',
    label: `I have ${certifications.length} certifications`,
    hint: 'Salesforce, Cisco, and more',
    keywords: 'cert awards',
    icon: '*',
    run: () => {},
    navigate: '/journey',
  })
  list.push({
    id: 'konami',
    group: 'Easter',
    label: 'Try the Konami Code',
    hint: 'Up Up Down Down Left Right Left Right B A',
    keywords: 'easter egg cheat code retro crt hidden',
    icon: '↑',
    run: () => window.dispatchEvent(new CustomEvent('konami:try')),
  })

  return list
}

export default function CommandPalette({ open, onClose, onOpenShortcuts }) {
  const { settings, setTheme, toggleSound, toggleCursor, toggleMotion, play } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0) // which row is highlighted
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Stop the page scrolling behind the palette.
  useBodyLock(open)

  // Build the list of everything you can do.
  const commands = useMemo(
    () =>
      buildCommands({
        settings,
        setTheme,
        toggleSound,
        toggleCursor,
        toggleMotion,
        openShortcuts: onOpenShortcuts,
      }),
    [settings, setTheme, toggleSound, toggleCursor, toggleMotion, onOpenShortcuts]
  )

  // Filter with the fuzzy search. memo means this only re-runs
  // when the query or the list actually changes.
  const results = useMemo(() => fuzzySearch(query, commands), [query, commands])

  // Keep the highlighted row inside the visible range.
  const visible = results.slice(0, 60)

  // Clear the query every time it opens, so it never greets you
  // with your last search.
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      play('open')
      // Wait a frame so the input exists before we focus it.
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      play('close')
    }
  }, [open, play])

  // Run whatever is highlighted.
  const runCommand = (command) => {
    if (!command) return

    play('click')
    command.run?.()

    // If the command has a destination, go there.
    if (command.navigate) {
      // Do not "navigate" to the page we are already on, that
      // would do nothing but waste a render.
      if (command.navigate !== location.pathname) navigate(command.navigate)
    }

    onClose()
  }

  // ----- keyboard handling -----
  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      play('hover')
      setActive((i) => (i + 1) % Math.max(visible.length, 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      play('hover')
      setActive((i) => (i - 1 + visible.length) % Math.max(visible.length, 1))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      runCommand(visible[active]?.item)
    }
  }

  // Scroll the highlighted row into view when it changes, so the
  // keyboard alone is enough to reach the bottom of a long list.
  useEffect(() => {
    const node = listRef.current?.querySelector('.cmd-row.sel')
    node?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div className="palette-backdrop" onClick={onClose} role="presentation">
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- the search row ---------- */}
        <div className="palette-top">
          <span className="palette-glyph">&gt;_</span>
          <input
            ref={inputRef}
            className="palette-input"
            value={query}
            placeholder="Search commands, projects, themes..."
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0) // always jump back to the top of the results
            }}
            onKeyDown={onKeyDown}
            aria-label="Type a command"
            autoComplete="off"
            spellCheck="false"
          />
          <button className="palette-esc" onClick={onClose}>
            esc
          </button>
        </div>

        {/* ---------- the results ---------- */}
        <div className="palette-list" ref={listRef} role="listbox">
          {visible.length === 0 && (
            <p className="palette-empty">
              No command matches <b>{query}</b>.
            </p>
          )}

          {visible.map((result, index) => {
            const command = result.item
            const isNewGroup = index === 0 || visible[index - 1].item.group !== command.group

            return (
              <React.Fragment key={command.id}>
                {/* Small heading whenever the group changes */}
                {isNewGroup && (
                  <div className="cmd-group" style={{ '--g': GROUPS[command.group] }}>
                    {command.group}
                  </div>
                )}

                <button
                  className={`cmd-row ${index === active ? 'sel' : ''}`}
                  role="option"
                  aria-selected={index === active}
                  // Mouse move selects, so the keyboard and mouse
                  // never fight over which row is active.
                  onMouseMove={() => setActive(index)}
                  onClick={() => runCommand(command)}
                >
                  <span className="cmd-icon">{command.icon}</span>

                  <span className="cmd-text">
                    <b>
                      <Highlight text={command.label} match={result.index} />
                    </b>
                    {command.hint && <small>{command.hint}</small>}
                  </span>

                  {command.active && <span className="cmd-badge">active</span>}

                  {index === active && <span className="cmd-enter">↵</span>}
                </button>
              </React.Fragment>
            )
          })}
        </div>

        {/* ---------- the legend at the bottom ---------- */}
        <div className="palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
          <span className="palette-count">{visible.length} commands</span>
        </div>
      </div>
    </div>
  )
}
