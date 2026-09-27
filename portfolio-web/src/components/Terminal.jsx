import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { matchAnswer, suggestions } from '../data/terminalBrain'
import { profile } from '../data/resume'

// ---------------------------------------------------------------
//  Terminal  (the "ask me anything" box)
// ---------------------------------------------------------------
//  It looks like a real command line and it behaves like one:
//
//   > what are your skills
//   I am strongest in ...                    <- typed out letter by letter
//
//  Nothing is sent to a server. The answer comes from a small
//  search over data/terminalBrain.js, which itself imports
//  data/resume.js. Change your details there and this updates too.
//
//  Three pieces of state:
//   history -> every line already printed (stays on screen)
//   input   -> what you are typing right now
//   typing  -> the answer currently being "typed"
//
//  A fourth piece, printed, is the answer that has finished typing.
// ---------------------------------------------------------------

// A line in the terminal. type is one of:
//   'input'  -> the user's own line
//   'answer' -> the terminal's reply
//   'system' -> notes like "boot finished" or "unknown command"
const BOOT_LINES = [
  `portfolio v2.0 — ${profile.shortName}`,
  `ask me anything, or type "help"`,
]

const HELP_TEXT =
  'I understand questions about skills, projects, tools, school, certifications, and contact. Try one of the suggestions below.'

export default function Terminal() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [printed, setPrinted] = useState('')
  const [typing, setTyping] = useState(false)
  const [booted, setBooted] = useState(false)

  const { play } = useSettings()
  const navigate = useNavigate()

  const inputRef = useRef(null)
  const logRef = useRef(null)
  const typingTimer = useRef(null)

  // --- boot sequence: two lines appear one after the other ---
  useEffect(() => {
    const timers = BOOT_LINES.map((text, i) =>
      setTimeout(() => {
        setHistory((prev) => [...prev, { type: 'system', text }])
        if (i === BOOT_LINES.length - 1) {
          setBooted(true)
          play('boot')
        }
      }, 350 * (i + 1))
    )

    return () => timers.forEach(clearTimeout)
  }, [play])

  // Keep the newest line in view as the answer grows.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [history, printed])

  // Clicking anywhere in the terminal focuses the input, like a
  // real terminal where you can click anywhere and start typing.
  const focusInput = () => inputRef.current?.focus()

  // The typing effect. We reveal one more character on a timer.
  const typeOut = (fullText, onDone) => {
    setTyping(true)
    setPrinted('')

    let i = 0
    const step = () => {
      i += 1
      setPrinted(fullText.slice(0, i))

      if (i % 3 === 0) play('type') // a small blip every 3 letters

      if (i < fullText.length) {
        // 12ms per character is fast enough to feel responsive
        // but slow enough that you can read it.
        typingTimer.current = setTimeout(step, 12)
      } else {
        setTyping(false)
        onDone?.()
      }
    }

    step()
  }

  const addLine = (line) => setHistory((prev) => [...prev, line])

  // --- handling Enter ---
  const submit = (event) => {
    event?.preventDefault()
    if (typing) return // do not queue while an answer is typing

    const question = input.trim()
    if (!question) return

    addLine({ type: 'input', text: question })
    setInput('')
    play('click')

    // "help" is a special command, not a knowledge question.
    if (question.toLowerCase() === 'help') {
      typeOut(HELP_TEXT)
      return
    }

    // "clear" wipes the screen, including the half-typed answer.
    if (question.toLowerCase() === 'clear') {
      setHistory([])
      setPrinted('')
      return
    }

    // Look for the best matching knowledge entry.
    const match = matchAnswer(question)

    if (!match) {
      play('error')
      typeOut(
        `I do not know about that yet. I can answer questions about my skills, projects, school, certifications, and how to contact me.`
      )
      return
    }

    play('success')

    // Type the answer, then add it permanently to the log.
    typeOut(match.answer, () => {
      const finished = { type: 'answer', text: match.answer }
      setHistory((prev) => {
        // Do not duplicate if the user pressed something else meanwhile.
        if (prev.some((line) => line.text === finished.text)) return prev
        return [...prev, finished]
      })
      setPrinted('')
    })

    // If the answer has a link, show it as a clickable button.
    if (match.link) {
      setTimeout(() => addLine({ type: 'link', ...match.link }), match.answer.length * 12 + 60)
    }
  }

  // When the terminal finishes its answer, show the suggestions
  // again so there is always something to click.
  useEffect(() => {
    if (!typing && booted && history.some((l) => l.type === 'answer')) {
      setHistory((prev) => (prev.some((l) => l.type === 'hints') ? prev : [...prev, { type: 'hints' }]))
    }
  }, [typing, booted, history])

  // Stop the timer if the component goes away mid-typing.
  useEffect(() => () => clearTimeout(typingTimer.current), [])

  return (
    <section className="sec" id="terminal">
      <div className="wrap">
        <div className="term" onClick={focusInput}>
          {/* ---------- the fake title bar ---------- */}
          <div className="term-bar">
            <span className="term-dots">
              <i /> <i /> <i />
            </span>
            <span className="term-title">ask-me.sh — {profile.shortName.toLowerCase().replace(/\s/g, '')}</span>
            <span className="term-status">online</span>
          </div>

          {/* ---------- the scrollback area ---------- */}
          <div className="term-log" ref={logRef}>
            {!booted && <p className="term-line term-system">booting...</p>}

            {history.map((line, i) => (
              <React.Fragment key={i}>
                {line.type === 'input' && (
                  <p className="term-line term-input">
                    <span className="term-prompt">visitor@portfolio:~$</span> {line.text}
                  </p>
                )}

                {line.type === 'system' && <p className="term-line term-system">{line.text}</p>}

                {line.type === 'answer' && <p className="term-line term-answer">{line.text}</p>}

                {line.type === 'link' && (
                  <p className="term-line">
                    <button className="term-link" onClick={(e) => { e.stopPropagation(); navigate(line.to); play('click') }}>
                      {line.label} →
                    </button>
                  </p>
                )}

                {line.type === 'hints' && (
                  <div className="term-hints" onClick={(e) => e.stopPropagation()}>
                    {suggestions.slice(0, 5).map((s) => (
                      <button key={s} className="term-chip" onClick={() => submit(s)}>
                        {s}
                      </button>
                    ))}
                    <p className="term-hint-note">
                      type <b>help</b> for what I can answer, or <b>clear</b> to wipe the screen
                    </p>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* The answer as it is being typed, live */}
            {typing && (
              <p className="term-line term-answer">
                {printed}
                <span className="term-caret" />
              </p>
            )}

            {/* The input row, always at the bottom */}
            <form className="term-form" onSubmit={submit}>
              <span className="term-prompt">visitor@portfolio:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={booted ? 'ask me anything...' : 'loading...'}
                disabled={!booted}
                aria-label="Ask a question"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="term-caret" />
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
