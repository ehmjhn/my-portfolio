import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/resume'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import usePageTitle from '../hooks/usePageTitle'

// Build the filter buttons from the tech actually used in each
// project, so you never have to update two separate lists.
function buildFilters(list) {
  const all = new Set()
  list.forEach((p) => p.stack.forEach((tech) => all.add(tech)))
  return ['All', ...all]
}

export default function Projects() {
  usePageTitle('Projects', 'Four complete systems I designed, built, and documented.')

  const [filter, setFilter] = useState('All')

  // useMemo stops these re-running on every keystroke elsewhere
  // on the page. Cheap, but good habit to build early.
  const filters = useMemo(() => buildFilters(projects), [])

  const visible = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter((p) => p.stack.includes(filter))
  }, [filter])

  return (
    <>
      <PageHeader
        tag="Projects"
        accent="violet"
        title={
          <>
            Systems I&apos;ve <span className="grad">built</span>
          </>
        }
        sub="Four complete projects from coursework. Each one went from database design to finished interface. Open any card for the full case study."
      />

      <section className="sec">
        <div className="wrap">
          {/* ---------- filter chips ---------- */}
          <Reveal>
            <div className="filters" role="group" aria-label="Filter by technology">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'on' : ''}`}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  // When you are on the "All" chip, say "go back to
                  // all" in the tooltip. A small nicety.
                  title={filter === f ? `Showing ${f} — click to clear` : `Filter by ${f}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          {/* ---------- the cards ---------- */}
          <div className="proj-grid proj-grid-full">
            {visible.map((project, i) => (
              <Reveal key={project.id} delay={i * 80}>
                <Link
                  to={`/projects/${project.id}`}
                  className={`card proj-card ${project.featured ? 'featured' : ''}`}
                  data-cursor="OPEN"
                >
                  <div className="proj-top">
                    <span className="proj-icon">{project.icon}</span>
                    <div>
                      <h3>{project.title}</h3>
                      <p className="sub">{project.subtitle}</p>
                    </div>
                    <span className="year">{project.year}</span>
                  </div>

                  <p className="desc">{project.short}</p>

                  <div className="tag-row">
                    {project.stack.map((tech) => (
                      <span className="pill" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="gains">
                    {project.gains.map((g) => (
                      <span className="gain" key={g.label}>
                        <b>{g.value}%</b> {g.label}
                      </span>
                    ))}
                  </div>

                  <span className="proj-cta">Read case study &rarr;</span>
                </Link>
              </Reveal>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="empty-note">No projects use that technology yet.</p>
          )}

          <Reveal>
            <div className="more-row">
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                More projects coming as Capstone Project 1 finishes.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
