import React, { useState } from 'react'
import { about, skills, services, profile } from '../data/resume'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import usePageTitle from '../hooks/usePageTitle'

export default function About() {
  usePageTitle('About', `About ${profile.name}, a BS Information Technology student.`)

  return (
    <>
      <PageHeader
        tag="About"
        accent="cyan"
        title={
          <>
            A student who likes <span className="grad">shipping things</span>
          </>
        }
        sub="Not just coursework screenshots. Four systems designed, built, and documented end to end."
      />

      {/* ========================= THE STORY ========================= */}
      <section className="sec">
        <div className="wrap about-grid">
          <Reveal>
            <div className="card about-story">
              <p className="about-lede">{about.summary}</p>

              <ul className="check-list">
                {about.highlights.map((item) => (
                  <li key={item}>
                    <span className="check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* A small "currently" note, greyed out so it reads
                  as secondary information. */}
              <div className="note-box">
                <b>Right now</b>
                <p>{about.currentlyLearning}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="services">
              {services.map((service) => (
                <div className="service" key={service.title}>
                  <span className="ico">{service.icon}</span>
                  <div>
                    <h4>{service.title}</h4>
                    <p>{service.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======================== THE THREE PILLARS ======================== */}
      <section className="sec sec-tight">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="sec-tag">How I Work</span>
            <h2 className="sec-title">
              Three things I do <span className="grad">every time</span>
            </h2>
          </Reveal>

          <div className="pillar-grid">
            {about.pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 100}>
                <div className="card pillar">
                  <span className="pillar-num grad">{pillar.icon}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SKILLS ============================ */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="sec-tag">Technical Skills</span>
            <h2 className="sec-title">
              The <span className="grad">toolbox</span> I build with
            </h2>
            <p className="sec-sub">
              The bars fill in as you scroll. Click any skill to see what I actually used it for.
            </p>
          </Reveal>

          <div className="skills-grid">
            {skills.map((group, i) => (
              <Reveal key={group.group} delay={i * 90}>
                <SkillGroup group={group} color={group.color} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== APPROACH + LEARNING ===================== */}
      <section className="sec sec-tight">
        <div className="wrap about-grid">
          <Reveal>
            <TiltCard className="card">
              <span className="sec-tag">Currently learning</span>
              <h3 style={{ margin: '10px 0 12px' }}>This semester</h3>
              <div className="tag-row">
                {['Django', 'pfSense', 'Windows Server', 'InfoSec', 'Capstone'].map((tag) => (
                  <span className="pill" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={120}>
            <TiltCard className="card">
              <span className="sec-tag">My approach</span>
              <h3 style={{ margin: '10px 0 12px' }}>How a project starts</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{about.approach}</p>
              <div className="tag-row" style={{ marginTop: 16 }}>
                <span className="pill">ERD first</span>
                <span className="pill">Smallest version</span>
                <span className="pill">Then polish</span>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </>
  )
}

// ---------------------------------------------------------------
//  SkillGroup
// ---------------------------------------------------------------
//  One card of skills. The bars animate the first time the card
//  scrolls into view, and clicking a skill reveals the note about
//  what it was used for.
//
//  IntersectionObserver is the modern way to know when something
//  is on screen. The old way was scroll + getBoundingClientRect,
//  which fires hundreds of times a second and is much heavier.
// ---------------------------------------------------------------
function SkillGroup({ group, color }) {
  const [filled, setFilled] = useState(false)
  const [open, setOpen] = useState(null)

  // We use a ref to the node so the effect can read it without
  // re-running when the ref object identity changes.
  const [node, setNode] = useState(null)

  React.useEffect(() => {
    if (!node) return

    // If the browser does not support it, just show the bars filled.
    if (!('IntersectionObserver' in window)) {
      setFilled(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFilled(true)
          observer.disconnect() // stop watching, we only need it once
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return (
    <div className="card skill-group" ref={setNode} style={{ '--c': `var(--c-${color})` }}>
      <h3>{group.group}</h3>
      <p className="skill-blurb">{group.blurb}</p>

      <div className="skill-list">
        {group.items.map((item, i) => (
          <div className="skill-item" key={item.name}>
            <button
              className="skill-row"
              onClick={() => setOpen((prev) => (prev === item.name ? null : item.name))}
              aria-expanded={open === item.name}
            >
              <div className="top">
                <span>{item.name}</span>
                <b>{item.level}%</b>
              </div>

              <div className="bar">
                <i
                  className={filled ? 'fill' : ''}
                  style={{ '--w': `${item.level}%`, transitionDelay: `${i * 90}ms` }}
                />
              </div>
            </button>

            {/* The note only exists in the DOM when open, which
                keeps the page small. */}
            {open === item.name && <p className="skill-note">{item.note}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
