import React from 'react'
import { Link } from 'react-router-dom'
import { education, certifications, projects, organizations } from '../data/resume'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ActivityGraph from '../components/ActivityGraph'
import usePageTitle from '../hooks/usePageTitle'

export default function Journey() {
  usePageTitle(
    'Journey',
    'Education, certifications, and a year of activity as an IT student.'
  )

  return (
    <>
      <PageHeader
        tag="Journey"
        accent="green"
        title={
          <>
            Where I&apos;ve <span className="grad">been</span>
          </>
        }
        sub="School, certifications, competitions, and an honest look at how busy each month actually was."
      />

      {/* ======================= EDUCATION ======================= */}
      <section className="sec">
        <div className="wrap edu-grid">
          <Reveal>
            <div className="card edu-card">
              <div className="school">
                <span className="ico">&#127891;</span>
                <div>
                  <h3>{education.school}</h3>
                  <p className="campus">{education.campus}</p>
                </div>
              </div>

              <div className="degree-row">
                <b>{education.degree}</b>
                <span className="pill">{education.expected}</span>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{education.track}</p>

              <p className="edu-label">Relevant Coursework</p>
              <div className="course-list">
                {education.coursework.map((c) => (
                  <span className="pill" key={c}>
                    {c}
                  </span>
                ))}
              </div>

              <div className="award">
                <span>&#9733;</span> {education.achievement}
              </div>
            </div>
          </Reveal>

          {/* ---------- certifications ---------- */}
          <Reveal delay={120}>
            <p className="edu-label">Certifications &amp; Achievements</p>
            <div className="cert-list">
              {certifications.map((cert) => (
                <div className="cert" key={cert.title}>
                  <span className="ico">{cert.icon}</span>
                  <div>
                    <h4>{cert.title}</h4>
                    <p>
                      {cert.issuer} &middot; {cert.meta}
                    </p>
                    <p className="cert-note">{cert.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== STUDENT ORGANIZATIONS ==================== */}
      <section className="sec sec-tight">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="sec-tag">Involvement</span>
            <h2 className="sec-title">
              Student <span className="grad">organizations</span>
            </h2>
            <p className="sec-sub">
              Two organizations I was an active member of, and what I actually got out of
              them beyond the hours.
            </p>
          </Reveal>

          <div className="org-grid">
            {organizations.map((org, i) => (
              <Reveal key={org.id} delay={i * 110}>
                <div className="card org-card">
                  <div className="org-head">
                    <span className="org-icon">{org.icon}</span>
                    <div>
                      <h3>{org.abbr}</h3>
                      <p className="org-full">{org.name}</p>
                    </div>
                  </div>

                  <div className="org-meta">
                    <span className="pill">{org.role}</span>
                    <span className="pill pill-live">
                      <span className="dot" />
                      {org.period}
                    </span>
                  </div>

                  <ul className="org-points">
                    {org.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE ACTIVITY GRAPH ==================== */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="sec-tag">Activity</span>
            <h2 className="sec-title">
              A year of <span className="grad">showing up</span>
            </h2>
            <p className="sec-sub">
              The same style of graph GitHub uses for commits, filled in with the months I
              actually shipped something. Only real dates from my CV are here, so quiet
              months are genuinely quiet.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="card heat-card">
              <ActivityGraph />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== PROJECT TIMELINE ====================== */}
      <section className="sec sec-tight">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="sec-tag">Timeline</span>
            <h2 className="sec-title">
              Project <span className="grad">history</span>
            </h2>
          </Reveal>

          {/* A vertical line with dots, the classic timeline look.
              The line itself is a CSS ::before on the container. */}
          <div className="timeline">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 100}>
                <Link to={`/projects/${project.id}`} className="tl-item">
                  <span className="tl-dot" />
                  <span className="tl-year">{project.year}</span>
                  <div className="tl-body">
                    <h3>{project.title}</h3>
                    <p className="sub">{project.subtitle}</p>
                    <p className="tl-desc">{project.short}</p>
                    <div className="tag-row">
                      {project.stack.slice(0, 5).map((tech) => (
                        <span className="pill" key={tech}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
