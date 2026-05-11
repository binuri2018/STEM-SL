import { motion } from 'framer-motion'
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ListChecks,
  RefreshCw,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { Button } from '../common/Button.jsx'
import { ProgressBar } from '../common/ProgressBar.jsx'

/**
 * @typedef {{
 *   index: number
 *   kind: 'mcq' | 'short'
 *   question: string
 *   isCorrect: boolean
 *   selectedOption?: string
 *   correctOption?: string
 *   userAnswer?: string
 * }} QuizResultRow
 */

function formatDuration(ms) {
  if (ms == null || ms < 0) return '—'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
}

function moodLabel(key) {
  switch (key) {
    case 'happy':
      return 'Happy'
    case 'confused':
      return 'Confused'
    case 'stressed':
      return 'Stressed'
    default:
      return 'Neutral'
  }
}

/**
 * @param {{
 *   results: QuizResultRow[]
 *   totalQuestions: number
 *   emotionQuiz: string
 *   startedAt: number | null
 *   endedAt: number | null
 *   onRestart: () => void
 * }} props
 */
export function QuizResultsDashboard({
  results,
  totalQuestions,
  emotionQuiz,
  startedAt,
  endedAt,
  onRestart,
}) {
  const correct = results.filter((r) => r.isCorrect).length
  const total = results.length || totalQuestions || 1
  const pct = Math.round((correct / total) * 100)
  const durationMs =
    startedAt != null && endedAt != null ? endedAt - startedAt : null

  const mcqCount = results.filter((r) => r.kind === 'mcq').length
  const mcqCorrect = results.filter((r) => r.kind === 'mcq' && r.isCorrect).length
  const shortCount = results.filter((r) => r.kind === 'short').length
  const shortCorrect = results.filter(
    (r) => r.kind === 'short' && r.isCorrect,
  ).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-8"
    >
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-6 text-center ring-1 ring-emerald-900/10 lg:p-8">
        <div className="text-3xl" aria-hidden>
          🎓
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-emerald-950 lg:text-3xl">
          Quiz complete
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-emerald-950/70">
          Here is how you did this lap — use misses as a tiny study list, not a
          grade.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/90 p-5 ring-1 ring-emerald-900/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800/80">
            <BarChart3 className="h-4 w-4" aria-hidden />
            Score
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-950">
            {correct}{' '}
            <span className="text-lg font-bold text-emerald-950/50">/ {total}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-emerald-800">{pct}% correct</p>
          <div className="mt-3">
            <ProgressBar value={pct} max={100} />
          </div>
        </div>

        <div className="rounded-2xl bg-white/90 p-5 ring-1 ring-emerald-900/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800/80">
            <ListChecks className="h-4 w-4" aria-hidden />
            MCQ
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-950">
            {mcqCorrect}/{mcqCount || '—'}
          </div>
          <p className="mt-1 text-sm text-emerald-950/65">Multiple choice items</p>
        </div>

        <div className="rounded-2xl bg-white/90 p-5 ring-1 ring-emerald-900/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800/80">
            <Sparkles className="h-4 w-4" aria-hidden />
            Short answer
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-950">
            {shortCount ? `${shortCorrect}/${shortCount}` : '—'}
          </div>
          <p className="mt-1 text-sm text-emerald-950/65">
            {shortCount
              ? shortCorrect
                ? 'Keyword check passed'
                : 'Add safety keywords next time'
              : 'No short prompt this run'}
          </p>
        </div>

        <div className="rounded-2xl bg-white/90 p-5 ring-1 ring-emerald-900/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800/80">
            <Clock className="h-4 w-4" aria-hidden />
            Time
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-950">
            {formatDuration(durationMs)}
          </div>
          <p className="mt-1 text-sm text-emerald-950/65">
            Mood tint:{' '}
            <span className="font-semibold text-emerald-900">
              {moodLabel(emotionQuiz)}
            </span>
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white/85 p-5 ring-1 ring-emerald-950/10 lg:p-8">
        <h3 className="text-lg font-extrabold text-emerald-950">Question breakdown</h3>
        <p className="mt-1 text-sm text-emerald-950/65">
          Each row is what you submitted when you tapped Continue.
        </p>

        <ul className="mt-6 space-y-4">
          {results.map((r) => (
            <li
              key={r.index}
              className="rounded-2xl border border-emerald-900/10 bg-emerald-50/40 p-4 ring-1 ring-emerald-900/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <span
                    className={
                      r.isCorrect
                        ? 'mt-0.5 text-emerald-600'
                        : 'mt-0.5 text-rose-600'
                    }
                    aria-hidden
                  >
                    {r.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-900/10">
                        Q{r.index + 1} · {r.kind === 'mcq' ? 'MCQ' : 'Short'}
                      </span>
                      <span
                        className={
                          r.isCorrect
                            ? 'text-xs font-bold text-emerald-700'
                            : 'text-xs font-bold text-rose-700'
                        }
                      >
                        {r.isCorrect ? 'Correct' : 'Needs work'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug text-emerald-950">
                      {r.question}
                    </p>
                    {r.kind === 'mcq' ? (
                      <dl className="mt-3 space-y-1 text-sm text-emerald-950/75">
                        <div>
                          <dt className="inline font-bold text-emerald-900">
                            Your answer:{' '}
                          </dt>
                          <dd className="inline">{r.selectedOption ?? '—'}</dd>
                        </div>
                        <div>
                          <dt className="inline font-bold text-emerald-900">
                            Correct:{' '}
                          </dt>
                          <dd className="inline">{r.correctOption ?? '—'}</dd>
                        </div>
                      </dl>
                    ) : (
                      <div className="mt-3 text-sm text-emerald-950/75">
                        <span className="font-bold text-emerald-900">Your text: </span>
                        <span className="break-words">
                          {r.userAnswer?.trim()
                            ? r.userAnswer.length > 220
                              ? `${r.userAnswer.slice(0, 220)}…`
                              : r.userAnswer
                            : '—'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={onRestart}>
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden />
            Restart quiz
          </span>
        </Button>
      </div>
    </motion.div>
  )
}
