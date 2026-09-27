import React, { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { profile } from '../data/resume'
import ThemeMenu from './ThemeMenu'

// ---------------------------------------------------------------
//  Navbar
// ---------------------------------------------------------------
//  Uses NavLink from react-router-dom instead of plain <a>.
//  The nice part: NavLink automatically knows which page is
//  active and gives it a className. We do not need any state or
//  scroll-spy code to highlight the current page anymore.
//
//  Every link is a real URL, so you can:
//    - bookmark /projects
//    - share /projects/chronica with someone
//    - press the browser Back button and it actually works
// ---------------------------------------------------------------

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/journey', label: 'Journey' },
  { to: '/lab', label: 'Lab' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { settings, toggleSound, play } = useSettings()
  const location = useLocation()

  // Add a background once you scroll past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes, otherwise
  // the menu stays open on top of the page you just navigated to.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="wrap nav-inner">
          {/* ---------- logo ---------- */}
          <Link to="/" className="logo" onClick={() => play('click')} data-cursor="HOME">
            <span className="logo-mark">{profile.initials}</span>
            <span className="logo-text">
              {profile.shortName.split(' ')[0]}
              <span className="grad">.dev</span>
            </span>
          </Link>

          {/* ---------- desktop links ---------- */}
          <nav className="nav-links" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                // "end" means "/" only matches exactly, otherwise it
                // would stay active on every single page.
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ---------- actions on the right ---------- */}
          <div className="nav-actions">
            {/* The command palette trigger. It shows the shortcut
                so people discover the feature on their own. */}
            <button
              className="palette-trigger"
              onClick={onOpenPalette}
              data-cursor="SEARCH"
              aria-label="Open command palette"
            >
              <span className="pt-search">⌕</span>
              <span className="pt-text">Search</span>
              <kbd>Ctrl K</kbd>
            </button>

            <ThemeMenu />

            {/* Sound toggle */}
            <button
              className={`icon-btn ${settings.sound ? 'on' : ''}`}
              onClick={() => {
                toggleSound()
                play('hover')
              }}
              aria-label="Toggle sound effects"
              aria-pressed={settings.sound}
              title="Sound effects (S)"
              data-cursor={settings.sound ? 'SOUND ON' : 'SOUND OFF'}
            >
              {settings.sound ? '♪' : '♩'}
            </button>

            {/* Mobile menu button */}
            <button
              className="icon-btn burger"
              onClick={() => {
                setMenuOpen((v) => !v)
                play('click')
              }}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`burger-lines ${menuOpen ? 'x' : ''}`}>
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- mobile dropdown ---------- */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}

        <div className="mobile-shortcuts">
          <span>Shortcuts</span>
          <button onClick={onOpenPalette}>
            <kbd>Ctrl K</kbd> Command palette
          </button>
          <button onClick={() => toggleSound()}>
            <kbd>S</kbd> Sound: {settings.sound ? 'on' : 'off'}
          </button>
        </div>
      </div>
    </>
  )
}
