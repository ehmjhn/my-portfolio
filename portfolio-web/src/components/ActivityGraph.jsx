import React, { useMemo, useState } from 'react'
import { timeline } from '../data/resume'
import { groupByYear, buildYearGrid, toWeeks, summarize, DAYS } from '../lib/heatmap'

// ---------------------------------------------------------------
//  ActivityGraph
// ---------------------------------------------------------------
//  A GitHub-style contribution heatmap, but the data is real: it
//  comes from the "timeline" array in data/resume.js.
//
//  Columns are weeks, rows are days (Sunday on top), and each
//  square is shaded by how intense that month was.
//  Hover or tap any square to see what happened that month.
//
//  There are ~370 squares per year, so the squares are NOT in the
//  tab order. That would mean over a thousand tab stops before the
//  visitor could reach the rest of the page. Instead the whole
//  graph is one focusable image with a text summary, and mouse
//  users still get the per-square tooltips.
// ---------------------------------------------------------------

// The colour scale: level 0 is "nothing here", 4 is the busiest.
const LEVEL_LABEL = {
  0: 'Nothing logged',
  1: 'Light activity',
  2: 'Steady work',
  3: 'Heavy focus',
  4: 'Peak effort',
}

const LEVEL_WORD = {
  1: 'light',
  2: 'steady',
  3: 'heavy',
  4: 'peak',
}

export default function ActivityGraph() {
  // The square the mouse is over right now, stored as
  // { date, level, entry }. null when nothing is hovered.
  const [hover, setHover] = useState(null)

  // All of this is just data reshaping, so we only do it once.
  const years = useMemo(() => groupByYear(timeline), [])
  const summary = useMemo(() => summarize(timeline), [])

  // One sentence for screen readers, instead of making them walk
  // through a thousand individual squares.
  const graphDescription = `Activity heatmap for ${years
    .map(({ year }) => year)
    .join(', ')}. ${summary.monthsWithWork} active months, ${summary.projectsCount} projects shipped, ${summary.totalPoints} focus points logged.`

  return (
    <div className="heat">
      {/* ---------- the summary numbers ---------- */}
      <div className="heat-stats">
        <div>
          <b>{summary.monthsWithWork}</b>
          <span>active months</span>
        </div>
        <div>
          <b>{summary.projectsCount}</b>
          <span>projects shipped</span>
        </div>
        <div>
          <b>{summary.totalPoints}</b>
          <span>focus points</span>
        </div>
      </div>

      {/* ---------- one grid per year ---------- */}
      {years.map(({ year, months }) => {
        const { weeks, monthLabels } = toWeeks(buildYearGrid(year, months))

        return (
          <div className="heat-year" key={year}>
            {/* Row labels down the left side */}
            <div className="heat-days">
              {DAYS.map((day, i) => (
                // Label every other row, or the text is cramped.
                i % 2 === 1 ? <span key={day}>{day}</span> : <span key={day} />
              ))}
            </div>

            <div className="heat-scroll">
              {/* The whole graph is one stop in the tab order, and it
                  reads out as a single image with a summary. */}
              <div
                className="heat-weeks"
                role="img"
                aria-label={graphDescription}
                tabIndex={0}
              >
                {weeks.map((week, wIndex) => (
                  <div className="heat-week" key={wIndex}>
                    {/* The month name floats above the first column
                        of that month, exactly like GitHub. */}
                    <span className="heat-month">{monthLabels[wIndex] || ''}</span>

                    {week.map((cell) => {
                      if (cell.empty) {
                        // Padding cell so weekdays line up with real dates.
                        return <i className="heat-cell pad" key={cell.key} />
                      }

                      return (
                        <i
                          className={`heat-cell lvl-${cell.level} kind-${cell.entry?.kind || 'none'}`}
                          key={cell.key}
                          // -1 keeps this out of the tab order.
                          tabIndex={-1}
                          onMouseEnter={() => setHover(cell)}
                          onMouseLeave={() => setHover(null)}
                          // Native browser tooltip, so the detail is
                          // available to mouse users on hover.
                          title={`${cell.date} — ${
                            cell.entry ? cell.entry.labels.join(' · ') : LEVEL_LABEL[0]
                          }`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {/* ---------- the tooltip / detail line ---------- */}
      <div className={`heat-tip ${hover ? 'show' : ''}`}>
        {hover ? (
          hover.entry ? (
            <>
              <span className="heat-tip-date">{hover.date}</span>
              <span className={`heat-kind kind-${hover.entry.kind}`}>
                {hover.entry.kind}
              </span>
              <span className="heat-tip-label">{hover.entry.labels.join(' · ')}</span>
              <span className="heat-tip-level">{LEVEL_WORD[hover.entry.intensity]} month</span>
            </>
          ) : (
            <>
              <span className="heat-tip-date">{hover.date}</span>
              <span className="heat-tip-label">No activity logged</span>
            </>
          )
        ) : (
          <span className="heat-tip-hint">Hover a square to see what happened that month</span>
        )}
      </div>

      {/* ---------- the legend ---------- */}
      <div className="heat-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <i className={`heat-cell lvl-${level}`} key={level} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
