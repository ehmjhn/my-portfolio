import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

// ---------------------------------------------------------------
//  PageHeader
// ---------------------------------------------------------------
//  The heading block at the top of every inner page, so they all
//  look the same. Keeping it in one component means the spacing
//  and the animation only have to be fixed in one place.
//
//  It also shows the "breadcrumb" of where you are in the site,
//  which is how you know a real router is running underneath.
// ---------------------------------------------------------------
export default function PageHeader({ tag, title, sub, accent = 'cyan' }) {
  return (
    <div className="page-head">
      <Reveal>
        <div className="crumbs">
          <Link to="/">home</Link>
          <span>/</span>
          <b style={{ color: `var(--c-${accent})` }}>{tag.toLowerCase()}</b>
        </div>
      </Reveal>

      <Reveal delay={70}>
        <h1 className="page-title">{title}</h1>
      </Reveal>

      {sub && (
        <Reveal delay={140}>
          <p className="page-sub">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}
