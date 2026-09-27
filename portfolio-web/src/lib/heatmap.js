// ===========================================================
//  Turns the timeline in resume.js into a GitHub-style grid.
// ===========================================================
//  GitHub shows a contribution graph: columns are weeks, rows are
//  days of the week, and each square is shaded by how busy you
//  were. We build the exact same thing from our own data.
//
//  Why it is a separate file: this is pure data work with no
//  React in it, which means it is easy to reason about (and to
//  test) on its own.
// ===========================================================

// Month names, used for the labels under the grid.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Day names starting on Sunday, to match the GitHub layout.
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// "2026-04" -> month index 3 (April is the 4th month, so 3)
function monthIndexOf(monthKey) {
  return Number(monthKey.split('-')[1]) - 1
}

function yearOf(monthKey) {
  return Number(monthKey.split('-')[0])
}

// Group the timeline by year, so we can render one grid per year.
//
// More than one thing can happen in the same month, so instead of
// dropping the extra entries we collect them: the month keeps a
// single shade (the busiest intensity) and a `labels` list that the
// tooltip joins together.
export function groupByYear(timeline) {
  const grouped = {}

  timeline.forEach((entry) => {
    const year = yearOf(entry.month)
    if (!grouped[year]) grouped[year] = {}

    const yearBucket = grouped[year]
    const existing = yearBucket[entry.month]

    if (!existing) {
      // First thing in this month. Copied, not referenced, so the
      // merge below can never mutate the object in resume.js.
      yearBucket[entry.month] = { ...entry, labels: [entry.label] }
      return
    }

    // A second (or third) event in the same month.
    existing.labels.push(entry.label)
    existing.intensity = Math.max(existing.intensity, entry.intensity)

    // Say "mixed" instead of picking one kind, so the legend colour
    // does not claim the month was only a project or only a cert.
    if (existing.kind !== entry.kind) existing.kind = 'mixed'
  })

  return Object.keys(grouped)
    .sort()
    .reverse() // newest year first, like GitHub
    .map((year) => ({ year: Number(year), months: grouped[year] }))
}

/**
 * Build every cell of the grid for one year.
 *
 * One cell = one real calendar day. The grid is 7 rows tall
 * (one per weekday) and however many columns are needed to fit
 * the year, which is exactly how GitHub lays it out.
 *
 * A cell looks like:
 *   { key, day, date, level, entry, monthStart }
 *
 * `level` comes from the month's timeline entry, so all the days
 * in one month share a shade. `monthStart` is only true on the
 * first day of a month, and that is what the month labels use.
 */
export function buildYearGrid(year, months) {
  const cells = []

  // How many days this year has: 365, or 366 in a leap year.
  // The simplest way to count is to subtract January 1st of this
  // year from January 1st of next year. The result is in
  // milliseconds, so we divide by the length of one day.
  const totalDays = Math.round(
    (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / 86400000
  )

  // Jan 1st of that year, used only for the weekday.
  const startDay = new Date(year, 0, 1).getDay()

  // Pad the start so day 1 lands in the correct row. Without
  // this, Jan 1 would always appear on the first row.
  for (let i = 0; i < startDay; i += 1) {
    cells.push({ empty: true, key: `pad-start-${i}`, day: i })
  }

  for (let dayNumber = 1; dayNumber <= totalDays; dayNumber += 1) {
    const date = new Date(year, 0, dayNumber)
    const month = date.getMonth()

    // "2026-04" -> the key we look up in the timeline.
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

    // Whatever was happening that month.
    const entry = months[monthKey] || null

    // Careful: `dayNumber` is the 1..365 loop counter, but the
    // real day of the month comes from the Date. They only match
    // in January, because Date silently rolls over into the next
    // month (day 32 becomes February 1st).
    const dayOfMonth = date.getDate()

    cells.push({
      // Must be unique per cell, so React keys work. Using the
      // month key here would repeat 30 times over.
      key: `${monthKey}-${String(dayOfMonth).padStart(2, '0')}`,
      day: date.getDay(),
      date: `${MONTHS[month]} ${dayOfMonth}, ${year}`,
      level: entry ? entry.intensity : 0,
      entry,
      // Only the real first day of a month, not dayNumber === 1.
      monthStart: dayOfMonth === 1,
    })
  }

  // Pad the end so the grid is a clean rectangle. The year may
  // stop part way through a week, and the columns are rendered as
  // 7 stacked cells, so without this the last column would be
  // shorter than the others and the layout would look broken.
  const remainder = cells.length % 7
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i += 1) {
      cells.push({ empty: true, key: `pad-end-${i}`, day: (startDay + remainder + i) % 7 })
    }
  }

  return cells
}

// Split a flat list of cells into columns of 7, which is what we
// actually render.
//
// We also work out the month labels here, because a month label
// has to be attached to the right *column*, and that only makes
// sense once the cells have been grouped into weeks.
export function toWeeks(cells) {
  const weeks = []
  let current = []

  cells.forEach((cell) => {
    current.push(cell)
    if (current.length === 7) {
      weeks.push(current)
      current = []
    }
  })

  if (current.length > 0) weeks.push(current)

  // A month label goes on a column if the first real day of that
  // month appears in it. We only look at the FIRST month start we
  // find in the column, so a month never gets labelled twice.
  const monthLabels = weeks.map((week) => {
    const startCell = week.find((cell) => cell.monthStart)
    if (!startCell) return null

    // The cell key looks like "2026-02-01", so the first 7
    // characters give the month. Turning the full key into a Date
    // would not work, because "2026-02-01-01" is not a valid date.
    const monthNumber = Number(startCell.key.slice(5, 7)) - 1
    return MONTHS[monthNumber]
  })

  return { weeks, monthLabels }
}

// A few numbers for the summary line above the graph.
export function summarize(timeline) {
  // If there is no timeline yet, avoid Math.max() on an empty
  // list, which would return -Infinity and show up in the UI.
  if (timeline.length === 0) {
    return { monthsWithWork: 0, totalPoints: 0, projectsCount: 0, busiest: 0 }
  }

  const monthsWithWork = new Set(timeline.map((entry) => entry.month)).size
  const totalPoints = timeline.reduce((sum, entry) => sum + entry.intensity, 0)
  const projectsCount = new Set(timeline.filter((t) => t.kind === 'project').map((t) => t.label)).size

  return {
    monthsWithWork,
    totalPoints,
    projectsCount,
    // "intensity" is 0-4 per month, 4 is like a full week of work
    busiest: Math.max(...timeline.map((entry) => entry.intensity)),
  }
}

export { MONTHS, DAYS }
