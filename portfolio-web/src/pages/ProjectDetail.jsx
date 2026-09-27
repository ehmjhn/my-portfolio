import React, { useEffect, useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { projects } from '../data/resume'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import usePageTitle from '../hooks/usePageTitle'
import { useSettings } from '../context/SettingsContext'

// ---------------------------------------------------------------
//  ProjectDetail  —  /projects/:id
// ---------------------------------------------------------------
//  This is a "dynamic route". One component handles every
//  project's page, and the :id part of the URL tells it which one.
//
//  The interesting parts:
//
//   1. useParams() reads :id out of the URL, so /projects/chronica
//      and /projects/library both land here with different data.
//
//   2. If someone types a project that does not exist, we return
//      <Navigate to="/404"> instead of rendering an empty page.
//
//   3. Left and Right arrow keys move between projects, so you can
//      browse the whole set without touching the mouse.
//
//   4. Every project on this page comes from data/resume.js, so
//      adding a fifth project needs zero changes here.
// ---------------------------------------------------------------

export default function ProjectDetail() {
  // Pull :id out of the URL. Example: /projects/chronica -> "chronica"
  const { id } = useParams()
  const navigate = useNavigate()

  const { play } = useSettings()
  const [copied, setCopied] = useState(false)

  // Find the project whose id matches the URL.
  const index = projects.findIndex((p) => p.id === id)
  const project = index >= 0 ? projects[index] : null

  usePageTitle(project ? project.title : 'Not found', project?.short)

  // Scroll back to the top when you jump between projects,
  // otherwise you land halfway down the next page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  // Left / Right arrow keys browse between projects.
  useEffect(() => {
    if (!project) return

    const onKey = (event) => {
      // Do nothing if the user has a modifier held, or is typing.
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      // "+1" wraps from the last project back to the first, so
      // you can keep going round in a circle.
      let nextIndex = null
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % projects.length
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + projects.length) % projects.length

      if (nextIndex !== null) {
        play('click')
        // Using the router (instead of window.location) keeps the
        // browser Back button working correctly.
        navigate(`/projects/${projects[nextIndex].id}`)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, project, play, navigate])

  // The project that comes before and after this one, so we can
  // show "Previous" and "Next" links at the bottom.
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  // No match: send the visitor to the real 404 page.
  if (!project) return <Navigate to="/404" replace />

  return (
    <article className="detail">
      {/* ========================= THE HERO ========================= */}
      <header className="detail-hero">
        <div className="wrap">
          <Reveal>
            <div className="crumbs">
              <Link to="/">home</Link>
              <span>/</span>
              <Link to="/projects">projects</Link>
              <span>/</span>
              <b style={{ color: 'var(--c-violet)' }}>{project.id}</b>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="detail-title-row">
              <span className="proj-icon big">{project.icon}</span>
              <div>
                <h1 className="page-title">{project.title}</h1>
                <p className="page-sub">
                  {project.subtitle} &middot; {project.year} &middot; {project.role}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="detail-lede">{project.overview}</p>
          </Reveal>

          <Reveal delay={200}>
            <div className="tag-row">
              {project.stack.map((tech) => (
                <span className="pill pill-lg" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* The numbers, pulled out of the same data */}
        <div className="wrap">
          <div className="stats stats-2">
            {project.gains.map((g) => (
              <Reveal key={g.label}>
                <div className="card stat">
                  <b className="grad">
                    <CountUp value={g.value} />%
                  </b>
                  <span>{g.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      {/* ==================== CHALLENGE / SOLUTION ==================== */}
      <section className="sec">
        <div className="wrap">
          <div className="cs-grid">
            <Reveal>
              <div className="card cs-card cs-problem">
                <span className="cs-label">The Problem</span>
                <p>{project.challenge}</p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card cs-card cs-solution">
                <span className="cs-label">What I Built</span>
                <p>{project.solution}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================== DETAILS ========================== */}
      <section className="sec sec-tight">
        <div className="wrap detail-grid">
          {/* ---- left: the longer write up ---- */}
          <div>
            <Reveal className="block-head">
              <span className="sec-tag">The Full Story</span>
            </Reveal>

            {project.description.map((para, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className="detail-para">{para}</p>
              </Reveal>
            ))}

            <Reveal>
              <div className="block-head mt">
                <span className="sec-tag">Key Features</span>
              </div>
              <ul className="feature-list">
                {project.features.map((f) => (
                  <li key={f}>
                    <span className="check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ---- right: the sticky notes column ---- */}
          <aside className="detail-side">
            <Reveal delay={100}>
              <div className="card sticky-card">
                <span className="sec-tag">Tech Notes</span>

                {project.techNotes.map((note) => (
                  <div className="tech-note" key={note.label}>
                    <b>{note.label}</b>
                    <p>{note.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="card sticky-card">
                <span className="sec-tag">Stack</span>
                <div className="tag-row">
                  {project.stack.map((tech) => (
                    <span className="pill" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-ghost full"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `${project.title} — ${project.stack.join(', ')} (${project.year})`
                    )
                    play('success')
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1800)
                  }}
                >
                  {copied ? 'Copied!' : 'Copy stack as text'}
                </button>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ==================== PREV / NEXT NAVIGATION ==================== */}
      <section className="sec sec-tight">
        <div className="wrap">
          <Reveal>
            <div className="prev-next">
              <Link to={`/projects/${prev.id}`} className="pn-card" data-cursor="PREV">
                <span className="pn-dir">&larr; Previous</span>
                <b>{prev.title}</b>
              </Link>

              <Link to="/projects" className="pn-all">
                All projects
              </Link>

              <Link to={`/projects/${next.id}`} className="pn-card pn-right" data-cursor="NEXT">
                <span className="pn-dir">Next &rarr;</span>
                <b>{next.title}</b>
              </Link>
            </div>
          </Reveal>

          <p className="pn-hint">Tip: use the left and right arrow keys to browse projects.</p>
        </div>
      </section>
    </article>
  )
}
