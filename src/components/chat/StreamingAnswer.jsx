import { useEffect, useRef, useState } from 'react'

export function StreamingAnswer({ text, onComplete }) {
  const [shown, setShown] = useState('')
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!text) return undefined

    setShown('')
    let i = 0
    const tick = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(tick)
        onCompleteRef.current?.(text)
      }
    }, 11)
    return () => window.clearInterval(tick)
  }, [text])

  return <span className="whitespace-pre-wrap">{shown}</span>
}
