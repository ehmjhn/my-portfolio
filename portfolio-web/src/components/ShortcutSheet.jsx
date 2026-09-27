import React, { useEffect, useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import useBodyLock from '../hooks/useBodyLock'

// ---------------------------------------------------------------
//  ShortcutSheet  (press ?)
// ---------------------------------------------------------------
//  The cheatsheet that lists every keyboard shortcut on the site.
//
//  The list is data, not markup, so adding a shortcut means adding
//  one line to `shortcuts` below. The key reader at the bottom
//  turns "Ctrl+K" into separate little <kbd> chips automatically.
// ---------------------------------------------------------------

const shortcuts = [
  { section: 'Search', items: [
    { keys: 'Ctrl + K', desc: 'Open the command palette' },
    { keys: '/', desc: 'Also opens the command palette' },
    { keys: 'Esc', desc: 'Close any panel' },
  ] },
  { section: 'Navigate', items: [
    { keys: 'g then h', desc: 'Go to Home' },
    { keys: 'g then a', desc: 'Go to About' },
    { keys: 'g then p', desc: 'Go to Projects' },
    { keys: 'g then j', desc: 'Go to Journey' },
    { keys: 'g then l', desc: 'Go to Lab' },
    { keys: 'g then c', desc: 'Go to Contact' },
  ] },
  { section: 'Look', items: [
    { keys: 't', desc: 'Cycle to the next theme' },
    { keys: 'Shift + T', desc: 'Cycle themes backwards' },
    { keys: 's', desc: 'Toggle sound effects' },
    { keys: 'c', desc: 'Toggle the custom cursor' },
    { keys: 'm', desc: 'Toggle animations' },
  ] },
  { section: 'Fun', items: [
    { keys: '?', desc: 'Open this shortcut list' },
    { keys: 'Up Up Down Down', desc: 'Part of the Konami Code' },
    { keys: 'B then A', desc: 'Finishes the Konami Code' },
  ] },
]

// Split "Ctrl + K" into ['Ctrl', 'K'] and render each as a <kbd>.
function renderKeys(keys) {
  return keys.split(/\s*\+\s*|\s+then\s+/).map((key, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className="kbd-plus">+</span>}
      <kbd>{key}</kbd>
    </React.Fragment>
  ))
}

export default function ShortcutSheet({ open, onClose }) {
  const { play } = useSettings()
  const [copied, setCopied] = useState(false)

  useBodyLock(open)

  useEffect(() => {
    if (open) play('open')
  }, [open, play])

  if (!open) return null

  return (
    <div className="palette-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <div>
            <span className="sec-tag">Reference</span>
            <h3>Keyboard Shortcuts</h3>
          </div>
          <button className="sheet-close" onClick={onClose} aria-label="Close shortcuts">
            esc
          </button>
        </div>

        <p className="sheet-note">
          This site is fully navigable without a mouse. Shortcuts stop working while you
          are typing in the terminal or a form.
        </p>

        <div className="sheet-grid">
          {shortcuts.map((group) => (
            <div className="sheet-group" key={group.section}>
              <h4>{group.section}</h4>
              {group.items.map((item) => (
                <div className="sheet-row" key={item.keys}>
                  <span className="sheet-keys">{renderKeys(item.keys)}</span>
                  <span className="sheet-desc">{item.desc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="sheet-foot">
          <span className="sheet-tip">
            Tip: press <kbd>?</kbd> anywhere to bring this back up.
          </span>
        </div>
      </div>
    </div>
  )
}

export { shortcuts }
