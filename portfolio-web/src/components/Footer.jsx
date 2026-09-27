import React from 'react'
import { Link } from 'react-router-dom'
import { profile, quickFacts } from '../data/resume'

// ---------------------------------------------------------------
//  Footer
// ---------------------------------------------------------------
//  The links here are real <Link> components, so they route
//  without a full page reload, exactly like the navbar does.
// ---------------------------------------------------------------
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* A soft glowing line at the very top of the footer */}
      <div className="footer-glow" />

      <div className="wrap footer-inner">
        <div className="footer-col footer-brand">
          <div className="logo">
            <span className="logo-mark">{profile.initials}</span>
            <span className="logo-text">
              {profile.shortName.split(' ')[0]}
              <span className="grad">.dev</span>
            </span>
          </div>
          <p>{quickFacts.status}</p>
          <p className="footer-loc">{quickFacts.location}</p>
        </div>

        <div className="footer-col">
          <h4>Sections</h4>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/journey">Journey</Link>
          <Link to="/lab">Lab</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Elsewhere</h4>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>Phone</a>
        </div>

        <div className="footer-col">
          <h4>Built with</h4>
          <span>React 18 + Vite</span>
          <span>React Router 7</span>
          <span>Hand-written CSS</span>
          <span>Zero UI libraries</span>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p>
          &copy; {year} <b>RIOUME Solutions</b>. All rights reserved.
        </p>
        <p className="footer-cred">
          Press <kbd>?</kbd> for keyboard shortcuts
        </p>
      </div>
    </footer>
  )
}
