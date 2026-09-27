import React, { useState } from 'react'
import { profile, quickFacts } from '../data/resume'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import { useSettings } from '../context/SettingsContext'
import usePageTitle from '../hooks/usePageTitle'

// ---------------------------------------------------------------
//  Contact
// ---------------------------------------------------------------
//  There is no backend here, and that is a deliberate choice.
//
//  Instead of pretending a form works, this page builds a
//  pre-filled mailto: link. The visitor clicks Send, their own
//  email app opens with everything already typed in, and they just
//  press the send button. Nothing is stored, nothing is sent to a
//  third party, and it always works.
//
//  A real production site would post to a form service instead,
//  but for a student portfolio this is the honest solution.
// ---------------------------------------------------------------

// Turn the form values into a mailto: URL.
function buildMailto(form) {
  const subject = `Portfolio inquiry from ${form.name}`

  const body = [
    form.message,
    '',
    '---',
    `From: ${form.name}`,
    `Email: ${form.email}`,
  ].join('\n')

  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  usePageTitle('Contact', 'Get in touch about freelance and sideline work.')

  const { play } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [note, setNote] = useState(null) // { type: 'ok' | 'err', text: '' }

  // One handler for all three fields. We pass the field name in.
  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setNote(null) // clear the old warning as soon as they edit
  }

  const onSubmit = (event) => {
    event.preventDefault()

    // --- validation, before we open their email app ---
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setNote({ type: 'err', text: 'Please fill in all three fields first.' })
      play('error')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setNote({ type: 'err', text: 'That email address does not look right.' })
      play('error')
      return
    }

    // Everything passed, so open the mail app.
    window.location.href = buildMailto(form)
    play('success')
    setNote({ type: 'ok', text: 'Opening your email app. Just hit send and I will reply shortly.' })
  }

  const contactRows = [
    { icon: '@', label: 'Email', value: profile.email, href: `mailto:${profile.email}`, copy: profile.email },
    { icon: '#', label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: '~', label: 'Location', value: profile.address },
    { icon: 'S', label: 'School', value: quickFacts.school },
  ]

  return (
    <>
      <PageHeader
        tag="Contact"
        accent="violet"
        title={
          <>
            Let&apos;s build <span className="grad">something</span>
          </>
        }
        sub={`${quickFacts.status}. ${quickFacts.responseTime}.`}
      />

      <section className="sec">
        <div className="wrap contact-grid">
          {/* ---------- the form ---------- */}
          <Reveal>
            <form className="card contact-form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={form.name}
                  onChange={update('name')}
                  autoComplete="name"
                />
              </div>

              <div className="field">
                <label htmlFor="email">Your email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="juan@company.com"
                  value={form.email}
                  onChange={update('email')}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about the project you need built..."
                  value={form.message}
                  onChange={update('message')}
                />
              </div>

              {/* This button is a real <button type="submit">, so
                  pressing Enter inside any field also works. */}
              <MagneticButton className="btn btn-primary full" type="submit" strength={0.22}>
                Send Message <span className="arrow">&rarr;</span>
              </MagneticButton>

              {note && (
                <p className={`form-msg ${note.type === 'err' ? 'err' : 'ok'}`} role="status">
                  <span>{note.type === 'ok' ? '✓' : '!'}</span> {note.text}
                </p>
              )}

              <p className="form-privacy">
                No server involved. This opens your own email app with the message already
                filled in, so nothing is stored anywhere.
              </p>
            </form>
          </Reveal>

          {/* ---------- the details ---------- */}
          <Reveal delay={120}>
            <div className="info-list">
              {contactRows.map((row) => {
                const inner = (
                  <>
                    <span className="ico">{row.icon}</span>
                    <div>
                      <small>{row.label}</small>
                      <b>{row.value}</b>
                    </div>
                    {row.copy && <span className="info-copy">copy</span>}
                  </>
                )

                // Rows with an href become links, the rest are plain.
                if (row.href) {
                  return (
                    <a
                      className="info"
                      key={row.label}
                      href={row.href}
                      onClick={play('click')}
                      onContextMenu={() => {
                        navigator.clipboard?.writeText(row.copy)
                        play('success')
                      }}
                    >
                      {inner}
                    </a>
                  )
                }

                return (
                  <div className="info" key={row.label}>
                    {inner}
                  </div>
                )
              })}
            </div>

            <div className="socials">
              <a
                className="social"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                onClick={play('click')}
              >
                {'</>'} GitHub
              </a>
              <a
                className="social"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={play('click')}
              >
                in LinkedIn
              </a>
              <a className="social" href={`mailto:${profile.email}`} onClick={play('click')}>
                @ Email
              </a>
            </div>

            <div className="availability">
              <span className="dot" />
              <div>
                <b>{quickFacts.status}</b>
                <p>{quickFacts.availability}. Based in {quickFacts.location}.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
