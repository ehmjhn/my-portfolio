import React, { useEffect, useRef, useState } from 'react'

/**
 * Types one word out, waits, deletes it, then types the next one.
 * Words come from the resume.js file.
 */
export default function TypingText({ words, speed = 95, deleteSpeed = 45 }) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [erasing, setErasing] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const current = words[index % words.length]

    // typing or deleting one character at a time
    if (!erasing && text === current) {
      timer.current = setTimeout(() => setErasing(true), 1600)
      return () => clearTimeout(timer.current)
    }

    if (erasing && text === '') {
      setErasing(false)
      setIndex((i) => i + 1)
      return
    }

    timer.current = setTimeout(
      () => {
        setText((prev) =>
          erasing ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        )
      },
      erasing ? deleteSpeed : speed
    )

    return () => clearTimeout(timer.current)
  }, [text, erasing, index, words, speed, deleteSpeed])

  return (
    <span className="typing">
      {text}
      <span className="cursor" aria-hidden="true" />
    </span>
  )
}
