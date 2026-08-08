import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function TypingText({
  words = [],
  className = '',
  typingSpeed = 90,
  deletingSpeed = 45,
  pause = 1600,
  caret = true,
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(reduce ? words[0] : '')

  useEffect(() => {
    if (reduce) return undefined
    const word = words[index % words.length]
    let timeout

    if (text.length < word.length) {
      timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), typingSpeed)
    } else if (text.length === word.length) {
      timeout = setTimeout(() => setIndex((i) => (i + 1) % words.length), pause)
    } else {
      timeout = setTimeout(() => setText(word.slice(0, text.length - 1)), deletingSpeed)
    }
    return () => clearTimeout(timeout)
  }, [text, index, words, typingSpeed, deletingSpeed, pause, reduce])

  return (
    <span className={className}>
      {text}
      {caret && !reduce && (
        <span aria-hidden="true" className="animate-caret ml-1 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.12em] bg-pixel" />
      )}
    </span>
  )
}