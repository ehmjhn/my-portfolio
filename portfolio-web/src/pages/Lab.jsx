import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import { useSettings } from '../context/SettingsContext'
import { themes } from '../data/themes'
import usePageTitle from '../hooks/usePageTitle'
import { profile, quickFacts } from '../data/resume'

// ---------------------------------------------------------------
//  Lab
// ---------------------------------------------------------------
//  A playground. Every card here is a small live demo of something
//  the site actually uses, so you can see the React concept working
//  instead of just reading about it.
//
//  The four cards demonstrate, in order of difficulty:
//    1. useEffect + cleanup    (the clock)
//    2. useState + derived    (the counter, the gradient)
//    3. useMemo               (the slow list filter)
//    4. Context               (the theme buttons)
// ---------------------------------------------------------------

export default function Lab() {
  usePageTitle('Lab', 'Small interactive demos of the React ideas used across this site.')

  return (
    <>
      <PageHeader
        tag="Lab"
        accent="pink"
        title={
          <>
            Things I built to <span className="grad">learn</span>
          </>
        }
        sub="A playground. Each card is a small working demo of a React idea used somewhere on this site."
      />

      <div className="wrap">
        <div className="lab-grid">
          <Reveal>
            <LiveClock />
          </Reveal>

          <Reveal delay={90}>
            <Counter />
          </Reveal>

          <Reveal delay={180}>
            <GradientLab />
          </Reveal>

          <Reveal delay={270}>
            <SlowList />
          </Reveal>
        </div>

        {/* ---------- all four themes at once ---------- */}
        <Reveal>
          <div className="card lab-wide">
            <span className="sec-tag">Live Context</span>
            <h3>Switching themes from 30 levels deep</h3>
            <p className="lab-note">
              These buttons call the same <code>setTheme()</code> that the navbar uses. The
              theme lives in a React Context near the top of the tree, so any component can read
              it without props being passed down through everything in between.
            </p>

            <div className="theme-buttons">
              {themes.map((theme) => (
                <ThemeButton key={theme.id} id={theme.id} name={theme.name} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------- how the site is built ---------- */}
        <Reveal>
          <div className="card lab-wide">
            <span className="sec-tag">Under the hood</span>
            <h3>What powers this portfolio</h3>

            <div className="stack-list">
              {stack.map((item) => (
                <div className="stack-row" key={item.name}>
                  <span className="stack-name">{item.name}</span>
                  <span className="stack-desc">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="lab-foot">
              {profile.shortName} &middot; {quickFacts.location} &middot; no UI libraries, no
              animation library, no icon pack. Every effect on this site is hand-written.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  )
}

// The list of tech, shown on the Lab page.
const stack = [  { name: 'React 18', text: 'Components, hooks, and state for the whole interface' },
  { name: 'React Router 7', text: 'Real URLs for every page, plus a 404 and dynamic project routes' },
  { name: 'Context + useReducer', text: 'One place that owns the theme, sound, cursor, and motion settings' },
  { name: 'CSS custom properties', text: 'All four themes are just different sets of variables' },
  { name: 'IntersectionObserver', text: 'Reveals and progress bars without scroll-jank' },
  { name: 'requestAnimationFrame', text: 'The cursor and magnetic buttons, kept off the React render path' },
  { name: 'Web Audio API', text: 'Sound effects generated at runtime, so there are zero audio files' },
  { name: 'Web Workers ready', text: 'Nothing heavy runs during render, so it stays fast' },
]

// ---------------------------------------------------------------
//  ThemeButton
// ---------------------------------------------------------------
//  Reads the settings Context and calls setTheme. It is defined
//  300 lines below where it is used, which is normal in React and
//  totally fine, because a function declaration is hoisted.
// ---------------------------------------------------------------
function ThemeButton({ id, name }) {
  const { settings, setTheme, play } = useSettings()
  const isActive = settings.theme === id

  return (
    <button
      className={`btn btn-ghost ${isActive ? 'on' : ''}`}
      onClick={() => {
        setTheme(id)
        play('success')
      }}
      aria-pressed={isActive}
    >
      {isActive && <span className="theme-btn-dot" />}
      {name}
    </button>
  )
}

// ---------------------------------------------------------------
//  1. LiveClock — useEffect and cleanup
// ---------------------------------------------------------------
//  The point of this card: an effect that starts something must
//  clean it up. Without the return function, every re-render would
//  start another setInterval and the clock would run many times
//  per second. This is the single most common React bug.
// ---------------------------------------------------------------
function LiveClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    // This runs AFTER the component renders.
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    // This runs when the component is removed (or before a re-run).
    // Without it, the interval would leak.
    return () => clearInterval(timer)
  }, []) // <- empty array means "only run once"

  // Two different formats, both derived from the same state.
  const time = useMemo(
    () =>
      now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    [now]
  )

  const manilaOffset = useMemo(() => {
    // Philippines is UTC+8, so we can show the difference from UTC.
    const utcHours = now.getUTCHours()
    const localHours = now.getHours()
    return (localHours - utcHours + 24) % 24
  }, [now])

  return (
    <div className="card lab-card">
      <span className="sec-tag">useEffect</span>
      <h3>Live clock</h3>
      <p className="lab-note">
        An effect starts a timer and cleans it up. Try the Lab page toggle: unmounting this card
        stops the clock completely.
      </p>

      <div className="clock-face">
        <span className="clock-time">{time}</span>
        <span className="clock-zone">UTC{manilaOffset >= 0 ? '+' : ''}{manilaOffset}</span>
      </div>

      <code className="code-snippet">
        useEffect(() =&gt; {'{'}
        {'\n'}  const t = setInterval(tick, 1000)
        {'\n'}  return () =&gt; clearInterval(t)
        {'\n'}
        {'}'}, [])
      </code>
    </div>
  )
}

// ---------------------------------------------------------------
//  2. Counter — useState
// ---------------------------------------------------------------
//  The simplest piece of state there is. The interesting part is
//  the two ways of updating it, which look identical but are not:
//    setCount(count + 1)   reads the OLD value
//    setCount(c => c + 1)  always gets the LATEST value
//
//  Inside a setInterval you must use the second form, because the
//  first one would keep adding 1 to the same stale number.
// ---------------------------------------------------------------
function Counter() {
  const [count, setCount] = useState(0)
  const [history, setHistory] = useState([])

  // The first three clicks are ignored, to show the history cap.
  const add = () => {
    // c => c + 1 is the safe "updater" form.
    setCount((c) => c + 1)
    setHistory((prev) => [count + 1, ...prev].slice(0, 6))
  }

  const reset = () => {
    setCount(0)
    setHistory([])
  }

  return (
    <div className="card lab-card">
      <span className="sec-tag">useState</span>
      <h3>Click counter</h3>
      <p className="lab-note">
        Every click pushes onto two separate pieces of state. The history is capped at six so
        the card never grows forever.
      </p>

      <div className="counter-face">
        <b className="grad">{count}</b>
        <span>{count === 1 ? 'click' : 'clicks'}</span>
      </div>

      <div className="lab-buttons">
        <MagneticButton className="btn btn-primary btn-sm" strength={0.4} onClick={add}>
          +1
        </MagneticButton>
        <button className="btn btn-ghost btn-sm" onClick={reset}>
          Reset
        </button>
      </div>

      {history.length > 0 && (
        <div className="counter-history">
          {history.map((value, i) => (
            <span className="chip" key={i} style={{ opacity: 1 - i * 0.13 }}>
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------
//  3. GradientLab — state, and a random number
// ---------------------------------------------------------------
function GradientLab() {
  const [hue, setHue] = useState(190)

  // The CSS value is derived from state, so it is calculated during
  // render instead of being stored. Storing it separately would
  // mean two sources of truth that can disagree.
  const gradient = useMemo(
    () => `linear-gradient(135deg, hsl(${hue} 90% 55%), hsl(${(hue + 70) % 360} 90% 62%))`,
    [hue]
  )

  const randomise = () => setHue(Math.floor(Math.random() * 360))

  return (
    <div className="card lab-card">
      <span className="sec-tag">Derived state</span>
      <h3>Gradient generator</h3>
      <p className="lab-note">
        Only the hue is stored. The gradient string is worked out from it during render, so the
        two can never fall out of sync.
      </p>

      <div className="gradient-preview" style={{ background: gradient }}>
        <span className="gradient-hue">hue {hue}&deg;</span>
      </div>

      {/* A real range input, styled to match the theme. */}
      <input
        type="range"
        className="slider"
        min="0"
        max="359"
        value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        aria-label="Gradient hue"
      />

      <div className="lab-buttons">
        <MagneticButton className="btn btn-primary btn-sm" strength={0.4} onClick={randomise}>
          Randomise
        </MagneticButton>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigator.clipboard?.writeText(gradient)}
        >
          Copy CSS
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------
//  4. SlowList — useMemo, done on purpose
// ---------------------------------------------------------------
//  Here the "work" is a slow loop, so you can SEE what useMemo
//  saves. Type in the box and watch: the delay only appears when
//  the search text changes, not on every keystroke of the other
//  input, and not when you bump the counter.
// ---------------------------------------------------------------
function SlowList() {
  const [query, setQuery] = useState('')
  const [noise, setNoise] = useState(0)

  const names = ['chronica', 'survey', 'volleyball', 'library', 'dashboard', 'analytics']

  // Without useMemo this would run on every render, including
  // every keystroke in the counter above it.
  const filtered = useMemo(() => {
    // A deliberately slow loop so the point is visible.
    const start = performance.now()
    let result = names
    while (performance.now() - start < 220) {
      result = names.filter((n) => n.includes(query))
    }
    return result
  }, [query])

  return (
    <div className="card lab-card">
      <span className="sec-tag">useMemo</span>
      <h3>Deliberately slow filter</h3>
      <p className="lab-note">
        The loop burns 220ms on purpose. Thanks to <code>useMemo</code> it only runs when the
        query changes &mdash; bump the counter and notice how instant it stays.
      </p>

      <input
        className="field-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to filter..."
        aria-label="Filter the list"
      />

      <div className="slow-result">
        {filtered.length > 0 ? (
          filtered.map((name) => (
            <span className="chip" key={name}>
              {name}
            </span>
          ))
        ) : (
          <span className="chip chip-empty">nothing matches</span>
        )}
      </div>

      <div className="lab-buttons">
        <button className="btn btn-ghost btn-sm" onClick={() => setNoise((n) => n + 1)}>
          Force a re-render ({noise})
        </button>
      </div>
    </div>
  )
}
