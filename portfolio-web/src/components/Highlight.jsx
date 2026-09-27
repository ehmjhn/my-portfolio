import React from 'react'
import { toMatchMap } from '../lib/fuzzy'

// ---------------------------------------------------------------
//  Highlight
// ---------------------------------------------------------------
//  Wraps the characters that the fuzzy search matched in <mark>,
//  which is styled with the accent color. This is the same idea
//  as VS Code showing you why a search result matched.
// ---------------------------------------------------------------
export default function Highlight({ text, match }) {
  // No query typed yet, so nothing to highlight.
  if (!match || match.length === 0) return <>{text}</>

  const flags = toMatchMap(match, text.length)
  const parts = []
  let buffer = ''

  text.split('').forEach((char, i) => {
    if (flags[i]) {
      if (buffer) {
        parts.push(buffer)
        buffer = ''
      }
      parts.push(
        <mark className="hl" key={i}>
          {char}
        </mark>
      )
    } else {
      buffer += char
    }
  })

  if (buffer) parts.push(buffer)

  return <>{parts}</>
}
