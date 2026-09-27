// ===========================================================
//  A tiny fuzzy search helper.
// ===========================================================
//  This is what makes the command palette feel smart. Typing
//  "chro" still finds "Chronica", and typing "cmm" finds
//  "CMS" even though the letters are not next to each other.
//
//  How the score works, simply:
//   - +10  if the letter matches the very next one we need
//          (characters in a row = a much better match)
//   - +6   if the letter starts a new word  (so "c" in "Content CMS")
//   - +2   if the letter matches, but with a jump
//   - -1   for every letter we had to skip over
//
//  The best match for a query gets a 0.4 * score bonus, so exact
//  full-text hits always win over partial ones.
// ===========================================================

// Lowercase, and turn anything that is not a letter or number into
// a space, so punctuation never breaks the search.
function clean(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, ' ')
}

// Search one piece of text against the query.
// Returns { score, index: [matched positions] } or null.
export function fuzzyMatch(query, text) {
  if (!query) {
    return { score: 0, index: [] }
  }

  const q = clean(query).replace(/\s/g, '')
  const t = clean(text)
  if (!q) return { score: 0, index: [] }

  let score = 0
  let tIndex = 0 // where we are in the text
  let previousMatch = -2 // so the first match counts as "consecutive"
  const index = []

  for (let qIndex = 0; qIndex < q.length; qIndex += 1) {
    const letter = q[qIndex]
    const found = t.indexOf(letter, tIndex)

    // We needed this letter but there is no more of it.
    if (found === -1) return null

    const isConsecutive = found === previousMatch + 1

    if (isConsecutive) {
      score += 10
    } else {
      // Did we have to jump over characters to get here?
      score -= Math.min(found - tIndex, 5)
      // Is this the start of a word? (previous char is a space)
      if (found === 0 || /\s/.test(t[found - 1])) {
        score += 6
      } else {
        score += 2
      }
    }

    // Matching a lot of a short word is better than a sliver of
    // a long one, so we add a small bonus for tight matches.
    if (found === tIndex && qIndex === 0) score += 4

    index.push(found)
    previousMatch = found
    tIndex = found + 1
  }

  // Reward matches that cover a large share of the text.
  score += (index.length / Math.max(t.length, 1)) * 20

  // Small bonus for a full exact match of the whole string.
  if (t === q) score += 40

  return { score, index }
}

// Search a whole list of items.
// Each item can have a "keywords" string that is searched too,
// and we keep whichever of the item's fields scored highest.
//
// items: [{ id, label, hint, keywords, ...rest }]
export function fuzzySearch(query, items) {
  if (!query.trim()) {
    return items.map((item) => ({ item, score: 0, index: [] }))
  }

  const results = []

  items.forEach((item) => {
    const labelMatch = fuzzyMatch(query, item.label)
    if (!labelMatch) return

    // Search the hidden keywords as a second chance, at half weight.
    let extra = 0
    if (item.keywords) {
      const keyMatch = fuzzyMatch(query, item.keywords)
      if (keyMatch) extra = keyMatch.score * 0.4
    }

    results.push({
      item,
      score: labelMatch.score + extra,
      index: labelMatch.index,
    })
  })

  // Strongest match first. Ties keep their original order.
  return results.sort((a, b) => b.score - a.score)
}

// The matching character positions, as a simple boolean array.
// A <Highlight> component turns this into the bold letters you see
// in the palette. Keeping this file free of JSX makes the search
// logic easy to test on its own.
export function toMatchMap(index, textLength) {
  const map = new Array(textLength).fill(false)
  if (!index) return map
  index.forEach((i) => {
    if (i >= 0 && i < textLength) map[i] = true
  })
  return map
}
