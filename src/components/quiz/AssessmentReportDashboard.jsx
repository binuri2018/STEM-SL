import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Clock,
  Lightbulb,
  Meh,
  Frown,
} from 'lucide-react'
import { HEART_LESSON } from '../../data/heartAssessmentQuiz.js'
import { ROUTES } from '../../utils/routes.js'

/**
 * @typedef {{
 *   index: number
 *   kind: 'mcq'
 *   question: string
 *   isCorrect: boolean
 *   selectedOption?: string
 *   correctOption?: string
 *   level?: number
 *   tag?: string
 * }} ResultRow
 */

function formatDuration(ms) {
  if (ms == null || ms < 0) return '—'
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
}

/**
 * @param {{
 *   results: ResultRow[]
 *   emotionQuiz: string
 *   startedAt: number | null
 *   endedAt: number | null
 *   hintsUsed: number
 *   onRetry: () => void
 * }} props
 */
export function AssessmentReportDashboard({
  results,
  emotionQuiz,
  startedAt,
  endedAt,
  hintsUsed,
  onRetry,
}) {
  const L = HEART_LESSON

  const durationMs =
    startedAt != null && endedAt != null ? endedAt - startedAt : null

  const stats = useMemo(() => {
    const total = results.length || 1
    const correct = results.filter((r) => r.isCorrect).length
    const pct = Math.round((correct / total) * 100)

    const byLevel = { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 } }
    const byTag = /** @type {Record<string, { c: number; t: number }>} */ ({})

    for (const r of results) {
      const lv = r.level ?? 1
      if (byLevel[lv]) {
        byLevel[lv].t += 1
        if (r.isCorrect) byLevel[lv].c += 1
      }
      const tg = r.tag || 'General'
      if (!byTag[tg]) byTag[tg] = { c: 0, t: 0 }
      byTag[tg].t += 1
      if (r.isCorrect) byTag[tg].c += 1
    }

    const weakTags = Object.entries(byTag)
      .filter(([, v]) => v.t > 0 && (v.c / v.t) * 100 < 60)
      .map(([k]) => k)

    const wrongTags = results.filter((r) => !r.isCorrect).map((r) => r.tag || 'Topic')

    return { total, correct, pct, byLevel, byTag, weakTags, wrongTags }
  }, [results])

  const levelPct = (lv) => {
    const b = stats.byLevel[lv]
    if (!b || b.t === 0) return 0
    return Math.round((b.c / b.t) * 1000) / 10
  }

  const frustratedN = emotionQuiz === 'stressed' ? 10 : 4
  const neutralN = emotionQuiz === 'stressed' ? 5 : 8

  const chartPoints = useMemo(() => {
    const n = 16
    const pts = []
    for (let i = 0; i < n; i++) {
      const r = results[Math.min(i, Math.max(0, results.length - 1))]
      const base = r?.isCorrect ? 72 : 38
      const jitter = ((i * 17) % 23) - 11
      pts.push(Math.max(18, Math.min(92, base + jitter)))
    }
    return pts
  }, [results])

  const timeBars = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const r = results[Math.min(i % Math.max(results.length, 1), Math.max(results.length - 1, 0))]
      const h = r?.isCorrect ? 22 + (i % 5) * 8 : 45 + (i % 7) * 12
      return Math.min(100, h)
    })
  }, [results])

  const polyPts = chartPoints
    .map((y, i) => {
      const x = 10 + i * (300 / Math.max(chartPoints.length - 1, 1))
      return `${x},${100 - y}`
    })
    .join(' ')

  const panel =
    'rounded-2xl border border-emerald-900/10 bg-white/85 p-5 shadow-[0_12px_40px_-18px_rgba(15,118,110,0.25)] ring-1 ring-emerald-950/5 backdrop-blur-sm'

  return (
    <div className="relative mx-auto max-w-3xl px-3 pb-24 pt-4 text-emerald-950 sm:px-4">
      <div
        className="pointer-events-none fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-emerald-200/90 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-[var(--shadow-soft)] ring-1 ring-emerald-900/10 sm:block"
        aria-hidden
      >
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        System ready
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-lg font-extrabold text-emerald-950">
          <BarChart3 className="h-6 w-6 text-emerald-600" aria-hidden />
          Assessment Report
        </div>
        <p className="mt-1 text-sm text-emerald-950/60">
          {L.title} · {L.demoStudent?.name ?? 'Student'}
        </p>
      </motion.header>

      <section className={`mb-6 ${panel}`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-rose-300 bg-rose-50 sm:mx-0">
            <span className="text-center text-lg font-extrabold text-rose-700">{stats.pct}%</span>
            <span className="absolute bottom-2 text-[9px] font-bold uppercase tracking-wide text-rose-600/95">
              Needs work
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-emerald-950/75">
              You scored <strong className="text-emerald-950">{stats.pct}%</strong>. Several concepts
              may need revision:{' '}
              <span className="font-semibold text-emerald-900">
                {Object.keys(stats.byTag).join(', ') || '—'}
              </span>
              . <strong className="text-emerald-950">{hintsUsed}</strong> hints were used during the
              assessment.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-900/10">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {formatDuration(durationMs)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-900/10">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" aria-hidden />
                {hintsUsed} Hints Used
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 ring-1 ring-rose-900/10">
                <Frown className="h-3.5 w-3.5" aria-hidden />
                Frustrated
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={`mb-6 ${panel}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950/45">
          Level-wise performance
        </h3>
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((lv) => (
            <div key={lv}>
              <div className="flex justify-between text-xs font-semibold text-emerald-950/60">
                <span>
                  L{lv} — {lv === 1 ? 'Basic' : lv === 2 ? 'Concept' : 'Advanced'}
                </span>
                <span>{levelPct(lv)}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-emerald-100">
                <div
                  className={[
                    'h-full rounded-full',
                    lv === 1 ? 'bg-amber-500' : lv === 2 ? 'bg-emerald-400' : 'bg-rose-500',
                  ].join(' ')}
                  style={{ width: `${levelPct(lv)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`mb-6 ${panel}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950/45">
          Concept-wise performance
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(stats.byTag).map(([tag, v]) => {
            const p = v.t ? Math.round((v.c / v.t) * 100) : 0
            const label = p >= 80 ? 'Strong' : p >= 60 ? 'Fair' : 'Needs Work'
            return (
              <div
                key={tag}
                className="rounded-xl border border-emerald-900/10 bg-emerald-50/40 p-4 ring-1 ring-emerald-900/5"
              >
                <p className="text-sm font-bold text-emerald-950">{tag}</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-900">{p}%</p>
                <p
                  className={[
                    'mt-1 text-xs font-bold',
                    p >= 80 ? 'text-emerald-600' : p >= 60 ? 'text-amber-600' : 'text-rose-600',
                  ].join(' ')}
                >
                  {label}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className={
                      p >= 60 ? 'h-full rounded-full bg-amber-500' : 'h-full rounded-full bg-rose-500'
                    }
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className={`mb-6 ${panel}`}>
        <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
          Weak areas
        </div>
        <p className="mt-2 text-xs text-emerald-950/50">
          These concepts scored below 60%. Focus revision here.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(stats.weakTags.length ? stats.weakTags : stats.wrongTags).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 ring-1 ring-rose-900/10"
            >
              {t}
              <span className="text-rose-500/90">×</span>
            </span>
          ))}
        </div>
      </section>

      <section className={`mb-6 ${panel}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950/45">
          Facial expression analysis (demo)
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-900 ring-1 ring-rose-900/10">
            <Frown className="h-4 w-4" aria-hidden />
            Frustrated {frustratedN}×
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/10">
            <Meh className="h-4 w-4" aria-hidden />
            Neutral {neutralN}×
          </span>
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-200/90 bg-rose-50/90 p-4 ring-1 ring-rose-900/10">
          <h4 className="text-sm font-extrabold text-rose-900">Targeted review required</h4>
          <p className="mt-2 text-xs leading-relaxed text-rose-900/85">
            Accuracy stayed under 60% on:{' '}
            <strong>{stats.weakTags.join(', ') || 'key heart topics'}</strong>. Revisit diagrams and
            definitions before the next attempt.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/90 p-4 ring-1 ring-emerald-900/10">
          <h4 className="text-sm font-extrabold text-emerald-900">Suggested next action</h4>
          <p className="mt-2 text-xs leading-relaxed text-emerald-900/85">
            Review the basic AR heart model again to reinforce chambers, valves, and the two loops —
            then retry the assessment.
          </p>
        </div>
      </section>

      <section className={`mb-6 ${panel}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950/45">
          Behavioural engagement (demo)
        </h3>
        <p className="mt-1 text-xs text-emerald-950/50">
          Emotional valence across questions (synthetic curve for demo).
        </p>
        <svg viewBox="0 0 320 100" className="mt-4 h-28 w-full text-emerald-600">
          <defs>
            <linearGradient id="engFillReport" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(5 150 105)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(5 150 105)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline fill="none" stroke="currentColor" strokeWidth="2" points={polyPts} />
          <polygon fill="url(#engFillReport)" points={`0,100 ${polyPts} 320,100`} />
        </svg>
      </section>

      <section className={`mb-6 ${panel}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950/45">
          Cognitive effort (demo)
        </h3>
        <div className="mt-4 flex h-32 items-end gap-1">
          {timeBars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full max-w-[14px] rounded-t bg-teal-600/85"
                style={{ height: `${h}%` }}
              />
              {i % 4 === 0 ? (
                <span className="text-[8px] font-mono text-emerald-950/45">Q{i + 1}</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className={`mb-10 ${panel}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950/45">
          Learning state distribution (demo)
        </h3>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            { k: 'Needs hint', pct: 50, c: 'bg-rose-500' },
            { k: 'Weak', pct: 25, c: 'bg-amber-500' },
            { k: 'Strong', pct: 13, c: 'bg-emerald-500' },
            { k: 'Partial', pct: 12, c: 'bg-yellow-400' },
          ].map((row) => (
            <li key={row.k} className="flex items-center gap-3">
              <span className="w-28 shrink-0 font-semibold text-emerald-950/80">{row.k}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-emerald-100">
                <div className={`h-full rounded-full ${row.c}`} style={{ width: `${row.pct}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-emerald-950/50">{row.pct}%</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="w-full max-w-xs rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-500/35 transition hover:bg-emerald-500 sm:w-auto"
        >
          Retry Assessment
        </button>
        <Link
          to={ROUTES.home}
          className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/90 px-6 py-3 text-sm font-bold text-emerald-950 shadow-sm ring-1 ring-emerald-900/10 transition hover:bg-emerald-50/80 sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Logout
        </Link>
      </div>
    </div>
  )
}
