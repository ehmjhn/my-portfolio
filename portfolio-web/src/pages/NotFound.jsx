import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import usePageTitle from '../hooks/usePageTitle'
import { projects } from '../data/resume'

// ---------------------------------------------------------------
//  NotFound
// ---------------------------------------------------------------
//  Shown by <Route path="*"> in App.jsx, so it catches literally
//  any URL that does not match a real page.
// ---------------------------------------------------------------
export default function NotFound() {
  usePageTitle('404 — Page not found')

  const navigate = useNavigate()
  const { play } = useSettings()

  // A few real links, so a lost visitor has somewhere to go
  // instead of a dead end.
  const suggestions = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <section className="sec nf">
      <div className="wrap">
        <div className="nf-inner">
          {/* The big 404. Each character has its own idle animation
              with a different delay, so they never all shift at the
              same time. */}
          <h1 className="nf-code" aria-hidden="true">
            <span>4</span>
            <i>0</i>
            <span>4</span>
          </h1>

          <h2 className="sec-title">
            This page does not <span className="grad">exist</span>
          </h2>

          <p className="page-sub">
            The address you followed is not part of this site. Here is where you probably
            wanted to go.
          </p>

          <div className="nf-links">
            {suggestions.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="btn btn-ghost"
                onClick={() => play('click')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              play('click')
              navigate(-1) // -1 means "go back one page in history"
            }}
          >
            Go back
          </button>

          {/* A tiny bit of fun: every project is a valid URL, so
              we can list the real ones. */}
          <p className="nf-hint">
            Or try a real page:{' '}
            {projects.map((project, i) => (
              <React.Fragment key={project.id}>
                <Link to={`/projects/${project.id}`} className="nf-project">
                  {project.title}
                </Link>
                {i < projects.length - 1 ? ' · ' : ''}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
