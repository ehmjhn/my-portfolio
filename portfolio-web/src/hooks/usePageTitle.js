import { useEffect } from 'react'
import { profile } from '../data/resume'

// ---------------------------------------------------------------
//  usePageTitle
// ---------------------------------------------------------------
//  Changes the text in the browser tab when you open a new page.
//  Also updates the meta description for SEO.
//
//  The name comes from data/resume.js, so if the name ever changes
//  you only have to edit it in one place.
//
//  Usage:  usePageTitle('Projects', 'Academic projects I built')
// ---------------------------------------------------------------
export default function usePageTitle(title, description = '') {
  useEffect(() => {
    const base = profile.name
    document.title = title ? `${title} — ${base}` : `${base} | IT Portfolio`

    if (!description) return

    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [title, description])
}
