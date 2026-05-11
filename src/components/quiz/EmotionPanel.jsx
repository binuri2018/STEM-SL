import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ScanLine, Square } from 'lucide-react'

const moodKeys = ['happy', 'confused', 'stressed']

/**
 * @param {{ value: string; onChange: (v: 'neutral' | 'happy' | 'confused' | 'stressed') => void }} props
 */
export function EmotionPanel({ value, onChange }) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [hasPreview, setHasPreview] = useState(false)
  const [camError, setCamError] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const stopCamera = useCallback(() => {
    setStream((prev) => {
      prev?.getTracks().forEach((t) => t.stop())
      return null
    })
    setHasPreview(false)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCamError(null)
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const startCamera = useCallback(async () => {
    setCamError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Camera API not available in this browser.')
      return false
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })
      setStream(s)
      setHasPreview(true)
      const el = videoRef.current
      if (el) {
        el.srcObject = s
        await el.play().catch(() => {})
      }
      return true
    } catch {
      setCamError('Could not open the camera (permission denied or in use).')
      return false
    }
  }, [])

  const runFakeScan = useCallback(async () => {
    if (analyzing) return
    setAnalyzing(true)
    setCamError(null)

    const activeStream = stream
    if (!activeStream) {
      const ok = await startCamera()
      if (!ok) {
        setAnalyzing(false)
        return
      }
    }

    await new Promise((r) => setTimeout(r, 2600))

    const pick = moodKeys[Math.floor(Math.random() * moodKeys.length)]
    onChange(pick)

    setAnalyzing(false)
  }, [analyzing, onChange, startCamera, stream])

  return (
    <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-emerald-900/10 backdrop-blur-sm">
      <div className="text-sm font-bold text-emerald-950">
        How are you feeling?
      </div>
      <p className="mt-1 text-sm text-emerald-950/65">
        The preview uses your front camera; the mood pick is a random demo (no real face
        analysis).
      </p>

      <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-emerald-950/90 ring-1 ring-emerald-900/20">
        <video
          ref={videoRef}
          playsInline
          muted
          className={[
            'h-full w-full object-cover transition-opacity duration-300',
            stream || hasPreview ? 'opacity-100' : 'opacity-0',
            'scale-x-[-1]',
          ].join(' ')}
          aria-label="Front camera preview"
        />

        {!stream && !hasPreview ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-emerald-950 to-emerald-900 p-4 text-center">
            <Camera className="h-10 w-10 text-emerald-300/80" aria-hidden />
            <p className="text-xs font-medium text-emerald-100/90">
              Camera off — tap “Open camera &amp; scan” below.
            </p>
          </div>
        ) : null}

        <AnimatePresence>
          {analyzing ? (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0"
              aria-hidden
            >
              <div className="absolute inset-0 bg-emerald-600/10" />
              <motion.div
                className="absolute left-0 right-0 z-10 h-[3px] rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]"
                initial={{ top: '8%' }}
                animate={{ top: ['8%', '92%', '8%'] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 rounded-lg bg-black/45 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-100 backdrop-blur-sm">
                <ScanLine className="h-3.5 w-3.5 animate-pulse" aria-hidden />
                Fake analyzer running…
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {camError ? (
        <p className="mt-2 text-xs font-medium text-rose-700" role="alert">
          {camError}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runFakeScan}
          disabled={analyzing}
          className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 transition hover:bg-[#2ECC71] disabled:pointer-events-none disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <ScanLine className="h-4 w-4 animate-pulse" aria-hidden />
              Scanning…
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" aria-hidden />
              Open camera &amp; scan
            </>
          )}
        </button>
        {stream ? (
          <button
            type="button"
            onClick={stopCamera}
            disabled={analyzing}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-900/15 bg-white/90 px-3 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
          >
            <Square className="h-3.5 w-3.5" aria-hidden />
            Stop camera
          </button>
        ) : null}
      </div>

      {value !== 'neutral' && moodKeys.includes(value) ? (
        <p className="mt-3 text-center text-xs text-emerald-950/70">
          Quiz tint:{' '}
          <span className="font-semibold capitalize text-emerald-900">{value}</span>
        </p>
      ) : null}
    </div>
  )
}
