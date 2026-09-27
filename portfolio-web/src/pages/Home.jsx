import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { profile, typingWords, stats, projects, quickFacts } from '../data/resume'
import TypingText from '../components/TypingText'
import CountUp from '../components/CountUp'
import Reveal from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import Terminal from '../components/Terminal'
import { useSettings } from '../context/SettingsContext'
import usePageTitle from '../hooks/usePageTitle'

// A few "real looking" lines of code for the hero window.
// This is decorative, but it is the kind of detail that makes a
// developer portfolio feel like it was made by a developer.
const codeLines = [
  { t: <><span className="k">const</span> <span className="n">developer</span> <span className="k">=</span> {'{'} </> },
  { t: <><span className="p">name</span>: <span className="s">'{profile.shortName}'</span>,</> },
  { t: <><span className="p">role</span>: <span className="s">'IT Student'</span>,</> },
  { t: <><span className="p">focus</span>: <span className="s">'Web & Mobile'</span>,</> },
  { t: <><span className="p">stack</span>: [<span className="s">'React'</span>, <span className="s">'PHP'</span>, <span className="s">'Java'</span>],</> },
  { t: <><span className="p">database</span>: [<span className="s">'MySQL'</span>, <span className="s">'Firebase'</span>],</> },
  { t: <><span className="p">graduating</span>: <span className="n">2027</span>,</> },
  { t: <><span className="p">available</span>: <span className="k">true</span></> },
  { t: <>{'}'}</> },
]

export default function Home() {
  const navigate = useNavigate()
  const { play } = useSettings()

  usePageTitle(
    '',
    `Portfolio of ${profile.name}, BS Information Technology student specializing in ${profile.specialization}.`
  )

  // The three most recent projects, shown as a quick teaser.
  const featured = projects.slice(0, 3)

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="hero">
        {/* A soft grid + glow behind the whole hero */}
        <div className="hero-bg" aria-hidden="true" />

        <div className="wrap hero-grid">
          {/* ---------- left: the text ---------- */}
          <div className="hero-text">
            <Reveal>
              <span className="badge">
                <span className="dot" />
                {quickFacts.status}
              </span>
            </Reveal>

            <Reveal delay={80}>
              {/* The greeting uses the nickname, with the full name
                  from the CV right underneath it. */}
              <h1>
                Hi, I&apos;m
                <span className="grad"> {profile.shortName}</span>
                <span className="hero-sub">{profile.role}</span>
                <span className="hero-name">{profile.name}</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="typed-line">
                <span className="typed-prefix">I build </span>
                <span className="grad">
                  <TypingText words={typingWords} />
                </span>
              </p>
            </Reveal>

            <Reveal delay={210}>
              <p className="lead">{profile.objective}</p>
            </Reveal>

            <Reveal delay={270}>
              <div className="hero-cta">
                <MagneticButton
                  className="btn btn-primary"
                  label="SEE"
                  onClick={() => {
                    play('click')
                    navigate('/projects')
                  }}
                >
                  View My Projects <span className="arrow">&rarr;</span>
                </MagneticButton>

                <MagneticButton
                  className="btn btn-ghost"
                  label="HIRE"
                  strength={0.24}
                  onClick={() => {
                    play('click')
                    navigate('/contact')
                  }}
                >
                  Hire Me
                </MagneticButton>
              </div>
            </Reveal>

            {/* A row of quick links with copy-to-clipboard */}
            <Reveal delay={330}>
              <div className="hero-links">
                <CopyLink text={profile.email} label="Email" icon="@" />
                <a href={profile.github} target="_blank" rel="noreferrer" className="hero-link">
                  <span className="hl-ico">{'</>'}</span> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hero-link">
                  <span className="hl-ico">in</span> LinkedIn
                </a>
              </div>
            </Reveal>
          </div>

          {/* ---------- right: the animation ---------- */}
          <div className="hero-visual">
            {/* The rings drift slowly, purely with CSS animation */}
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
            <div className="orb" aria-hidden="true">
              <i />
            </div>

            {/* The fake code editor window */}
            <div className="code-card">
              <div className="code-bar">
                <span className="code-dots"><i /><i /><i /></span>
                <span className="code-file">developer.js</span>
                <span className="code-lang">JavaScript</span>
              </div>
              <div className="code-body">
                {codeLines.map((line, i) => (
                  <div key={i} className="code-line">
                    <span className="code-num">{i + 1}</span>
                    <code>{line.t}</code>
                  </div>
                ))}
              </div>
              {/* The little blinking cursor on the last line */}
              <div className="code-foot">
                <span className="code-status">&#9679; ready</span>
                <span className="code-caret" />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- the numbers strip ---------- */}
        <div className="wrap">
          <div className="stats stats-strip">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <div className="card stat">
                  <b className="grad">
                    <CountUp value={stat.value} />
                    {stat.suffix}
                  </b>
                  <span>{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= FEATURED WORK ========================= */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="sec-tag">Featured Work</span>
            <h2 className="sec-title">
              Systems I&apos;ve <span className="grad">built</span>
            </h2>
            <p className="sec-sub">
              Real academic projects, designed and coded from the database up.
            </p>
          </Reveal>

          <div className="proj-grid">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 100}>
                {/* The whole card is a Link, so it is a real
                    navigable URL and keyboard accessible. */}
                <Link to={`/projects/${project.id}`} className="card proj-card">
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
                    {project.stack.slice(0, 4).map((tech) => (
                      <span className="pill" key={tech}>
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="pill pill-more">+{project.stack.length - 4}</span>
                    )}
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

          <Reveal delay={200}>
            <div className="center-cta">
              <Link to="/projects" className="btn btn-ghost">
                See all projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======================== THE TERMINAL ========================= */}
      <Reveal>
        <div className="wrap term-head">
          <span className="sec-tag">Ask Me Anything</span>
          <h2 className="sec-title">
            Prefer a <span className="grad">command line?</span>
          </h2>
          <p className="sec-sub">
            This terminal answers questions using only the data in this site. No API, no
            server, no AI. Just a small search engine.
          </p>
        </div>
      </Reveal>

      <Terminal />
    </>
  )
}

// ---------------------------------------------------------------
//  CopyLink
// ---------------------------------------------------------------
//  Click to copy, then it says "Copied!" for two seconds.
//  navigator.clipboard is the modern way, and we guard it because
//  it does not exist on http:// sites.
// ---------------------------------------------------------------
function CopyLink({ text, label, icon }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button className="hero-link copy" onClick={copy} data-cursor="COPY">
      <span className="hl-ico">{copied ? '✓' : icon}</span>
      {copied ? 'Copied!' : label}
    </button>
  )
}
