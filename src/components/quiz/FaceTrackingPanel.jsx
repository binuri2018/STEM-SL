import { useEffect, useRef, useState } from 'react'
import { Video } from 'lucide-react'

const MOODS = {
  frustrated: { label: 'Frustrated' },
  neutral: { label: 'Neutral' },
}

/**
 * Face-tracking card: live webcam (when allowed) + demo overlays; mood text only (no emoji overlay).
 * “Analysis” is cosmetic — mood still comes from parent props.
 * @param {{ mood: 'frustrated' | 'neutral'; active?: boolean; enableCamera?: boolean }} props
 */
export function FaceTrackingPanel({ mood, active = true, enableCamera = true }) {
  const cfg = MOODS[mood] ?? MOODS.neutral
  const videoRef = useRef(/** @type {HTMLVideoElement | null} */ (null))
  /** @type {'idle' | 'live' | 'error' | 'off'} */
  const [cameraState, setCameraState] = useState('idle')

  useEffect(() => {
    if (!enableCamera) {
      setCameraState('off')
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('error')
      return
    }

    let cancelled = false
    /** @type {MediaStream | null} */
    let stream = null

    async function open() {
      setCameraState('idle')
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        const el = videoRef.current
        if (el) {
          el.srcObject = stream
          await el.play().catch(() => {})
          if (!cancelled) setCameraState('live')
        }
      } catch {
        if (!cancelled) setCameraState('error')
      }
    }

    open()

    return () => {
      cancelled = true
      if (stream) stream.getTracks().forEach((t) => t.stop())
      const el = videoRef.current
      if (el) el.srcObject = null
    }
  }, [enableCamera])

  const showLive = cameraState === 'live'

  return (
    <aside
      className="w-[8.75rem] shrink-0 rounded-2xl border border-emerald-900/10 bg-white p-2.5 shadow-[0_10px_28px_-8px_rgba(15,77,62,0.18)] ring-1 ring-emerald-950/[0.07] sm:w-[9.5rem]"
      aria-label="Face tracking (demo analyser with live camera when permitted)"
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Video className="h-3 w-3 shrink-0 text-[#1B4D3E]" strokeWidth={2.25} aria-hidden />
          <span className="truncate text-[7.5px] font-bold uppercase leading-tight tracking-[0.12em] text-[#1B4D3E]">
            Face tracking
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 pt-px">
          <span
            className={[
              'h-1.5 w-1.5 rounded-full bg-emerald-500',
              active ? 'animate-pulse' : 'opacity-40',
            ].join(' ')}
            aria-hidden
          />
          <span className="text-[7.5px] font-bold uppercase tracking-wide text-[#1B4D3E]">
            Active
          </span>
        </div>
      </div>

      <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-xl bg-[#E0F7EF] ring-1 ring-[#1B4D3E]/10">
        {enableCamera ? (
          <video
            ref={videoRef}
            className={[
              'absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-300',
              showLive ? 'opacity-100' : 'opacity-0',
              '-scale-x-100',
            ].join(' ')}
            playsInline
            muted
            autoPlay
            aria-hidden
          />
        ) : null}

        {/* Mint wash so the feed matches the “analyser” look */}
        <div
          className={[
            'pointer-events-none absolute inset-0 z-[1]',
            showLive ? 'bg-[#E0F7EF]/40' : 'bg-[#E0F7EF]',
          ].join(' ')}
          aria-hidden
        />

        {cameraState === 'idle' && enableCamera ? (
          <div className="absolute inset-0 z-[2] flex items-center justify-center bg-[#E0F7EF]/90">
            <span className="text-[8px] font-semibold text-[#1B4D3E]/70">Starting camera…</span>
          </div>
        ) : null}

        {cameraState === 'error' ? (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-1 bg-[#E0F7EF] px-2 text-center">
            <span className="text-[7px] font-semibold leading-tight text-[#1B4D3E]/75">
              Camera unavailable — placeholder feed
            </span>
          </div>
        ) : null}

        {/* Faux sensor grid */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(27 77 62 / 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(27 77 62 / 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-white/35 via-transparent to-[#1B4D3E]/[0.06]"
          aria-hidden
        />

        {/* Corner brackets */}
        <div className="pointer-events-none absolute inset-1.5 z-[4] rounded-md border border-[#1B4D3E]/15" aria-hidden />
        <div className="pointer-events-none absolute left-2 top-2 z-[4] h-2.5 w-2.5 border-l-2 border-t-2 border-emerald-600/50" aria-hidden />
        <div className="pointer-events-none absolute right-2 top-2 z-[4] h-2.5 w-2.5 border-r-2 border-t-2 border-emerald-600/50" aria-hidden />
        <div className="pointer-events-none absolute bottom-2 left-2 z-[4] h-2.5 w-2.5 border-b-2 border-l-2 border-emerald-600/50" aria-hidden />
        <div className="pointer-events-none absolute bottom-2 right-2 z-[4] h-2.5 w-2.5 border-b-2 border-r-2 border-emerald-600/50" aria-hidden />

        {/* Scan beam */}
        <div
          className="animate-face-analyzer-scan pointer-events-none absolute inset-x-0 top-0 z-[5] h-[3px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.65)]"
          aria-hidden
        />

        <div className="absolute left-1.5 top-1.5 z-[6] flex items-center gap-0.5 rounded bg-black/25 px-1 py-0.5 ring-1 ring-white/20">
          <span className="h-1 w-1 animate-pulse rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
          <span className="text-[6px] font-bold uppercase tracking-wide text-white/95">Demo</span>
        </div>
      </div>

      <div className="mt-2 rounded-lg bg-[#E0F7EF] py-1.5 text-center ring-1 ring-[#1B4D3E]/8">
        <p className="text-[11px] font-semibold text-[#1B4D3E]">{cfg.label}</p>
      </div>
    </aside>
  )
}
