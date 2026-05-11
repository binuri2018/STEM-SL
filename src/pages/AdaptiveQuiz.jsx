import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader } from '../components/common/Loader.jsx'
import { Modal } from '../components/common/Modal.jsx'
import { AssessmentReportDashboard } from '../components/quiz/AssessmentReportDashboard.jsx'
import { GamifiedQuestionCard } from '../components/quiz/GamifiedQuestionCard.jsx'
import { QuizLessonIntro } from '../components/quiz/QuizLessonIntro.jsx'
import { HEART_LESSON, HEART_QUIZ_QUESTIONS } from '../data/heartAssessmentQuiz.js'
import { BookOpen, Plus, Trophy, Video, Zap } from 'lucide-react'

function levelLabelFromNum(level) {
  if (level === 1) return 'Level 1 — Basic'
  if (level === 2) return 'Level 2 — Concept'
  return 'Level 3 — Advanced'
}

function formatClock(totalSec) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * @param {import('../services/aiService.js').QuizQuestion | undefined} q
 * @param {number} index
 * @param {{ show: boolean; correct?: boolean } | null} fb
 * @param {string | null} selected
 */
function buildQuizResultRow(q, index, fb, selected) {
  if (!q || q.kind !== 'mcq' || !fb?.show) return null
  return {
    index,
    kind: /** @type {const} */ ('mcq'),
    question: q.question,
    isCorrect: Boolean(fb.correct),
    selectedOption: selected ?? undefined,
    correctOption: q.correct,
    level: q.level ?? 1,
    tag: q.tag ?? '',
  }
}

export default function AdaptiveQuiz() {
  const [phase, setPhase] = useState('intro')
  const [questions] = useState(() => HEART_QUIZ_QUESTIONS)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [results, setResults] = useState([])
  const [quizStartedAt, setQuizStartedAt] = useState(null)
  const [endedAt, setEndedAt] = useState(null)
  const [hintOpen, setHintOpen] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [mentalEnergy, setMentalEnergy] = useState(100)
  const [demoMood, setDemoMood] = useState(
    /** @type {'frustrated' | 'neutral'} */ ('frustrated'),
  )
  const [tick, setTick] = useState(0)

  const total = questions.length || 1
  const current = questions[idx]

  useEffect(() => {
    if (phase !== 'quiz' || quizStartedAt == null) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [phase, quizStartedAt])

  const elapsedSec = useMemo(() => {
    if (quizStartedAt == null) return 0
    return Math.floor((Date.now() - quizStartedAt) / 1000)
  }, [quizStartedAt, tick])

  const resetQuestionLocal = useCallback(() => {
    setSelected(null)
    setFeedback(null)
  }, [])

  const startAssessment = useCallback(() => {
    resetQuestionLocal()
    setResults([])
    setIdx(0)
    setEndedAt(null)
    setHintsUsed(0)
    setMentalEnergy(100)
    setDemoMood('frustrated')
    setQuizStartedAt(Date.now())
    setTick(0)
    setPhase('quiz')
  }, [resetQuestionLocal])

  const retryFull = useCallback(() => {
    resetQuestionLocal()
    setResults([])
    setIdx(0)
    setEndedAt(null)
    setQuizStartedAt(null)
    setHintsUsed(0)
    setPhase('intro')
  }, [resetQuestionLocal])

  function goNext() {
    const row = buildQuizResultRow(current, idx, feedback, selected)
    if (row) setResults((prev) => [...prev, row])
    resetQuestionLocal()
    if (idx + 1 >= total) {
      setEndedAt(Date.now())
      setPhase('report')
      return
    }
    setIdx((i) => i + 1)
  }

  function submitMcq() {
    if (!current?.correct || !selected) return
    const correct = selected === current.correct
    setFeedback({ show: true, correct })
    setMentalEnergy((e) => {
      const next = correct ? Math.min(100, e + 6) : Math.max(12, e - 12)
      return next
    })
    if (!correct) setDemoMood('frustrated')
    else setDemoMood('neutral')
  }

  function openHint() {
    setHintsUsed((h) => h + 1)
    setHintOpen(true)
  }

  const showSupporter =
    demoMood === 'frustrated' || (!!feedback?.show && !feedback.correct)

  const emotionForReport = demoMood === 'frustrated' ? 'stressed' : 'neutral'

  const L = HEART_LESSON

  const systemReadyPill = (
    <div
      className="pointer-events-none fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-emerald-200/90 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-[var(--shadow-soft)] ring-1 ring-emerald-900/10 sm:block"
      aria-hidden
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      System ready
    </div>
  )

  if (phase === 'intro') {
    return (
      <div className="min-h-[calc(100dvh-8rem)] pb-16 pt-4 text-emerald-950">
        {systemReadyPill}
        <QuizLessonIntro onStart={startAssessment} />
      </div>
    )
  }

  if (phase === 'report') {
    return (
      <div className="min-h-[calc(100dvh-8rem)] pb-16 pt-4 text-emerald-950">
        {systemReadyPill}
        <AssessmentReportDashboard
          results={results}
          emotionQuiz={emotionForReport}
          startedAt={quizStartedAt}
          endedAt={endedAt}
          hintsUsed={hintsUsed}
          onRetry={retryFull}
        />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100dvh-8rem)] pb-24 pt-4 text-emerald-950">
      {systemReadyPill}

      {!current ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader label="Loading questions…" />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-3 sm:px-4">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-900/10 pb-4">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-950">
                <BookOpen className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                {L.title}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 ring-1 ring-emerald-900/10">
                {levelLabelFromNum(current.level ?? 1)}
              </span>
            </div>
            <div className="flex w-full shrink-0 items-start justify-between gap-3 sm:w-auto sm:justify-end">
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 font-mono text-sm font-bold text-rose-800 ring-1 ring-rose-900/10">
                {formatClock(elapsedSec)}
              </div>
              <div className="w-[7.5rem] shrink-0 rounded-xl border border-emerald-900/10 bg-white/85 p-2 shadow-[0_8px_28px_-14px_rgba(15,118,110,0.35)] ring-1 ring-emerald-950/5 backdrop-blur-sm sm:w-36">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-emerald-950/55">
                  <span className="flex items-center gap-1 text-emerald-800/80">
                    <Video className="h-3 w-3" aria-hidden />
                    Face tracking
                  </span>
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    active
                  </span>
                </div>
                <div className="mt-1 flex aspect-video items-center justify-center rounded-lg bg-emerald-100/80 text-2xl ring-1 ring-emerald-900/5">
                  {demoMood === 'frustrated' ? '😟' : '😐'}
                </div>
                <p className="mt-1 rounded-md bg-emerald-50 py-1 text-center text-[10px] font-semibold text-emerald-900">
                  {demoMood === 'frustrated' ? 'Frustrated' : 'Neutral'}
                </p>
              </div>
            </div>
          </header>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white/85 px-4 py-3 shadow-[0_12px_40px_-18px_rgba(15,118,110,0.25)] ring-1 ring-emerald-950/5 backdrop-blur-sm">
            <div className="min-w-[140px] flex-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-emerald-950/50">
                <span>Mental energy</span>
                <span>{mentalEnergy}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${mentalEnergy}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-amber-200/90 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 ring-1 ring-amber-900/10">
              <Trophy className="h-4 w-4 text-amber-600" aria-hidden />
              STEM rank: Level 10 XP
            </div>
            <button
              type="button"
              onClick={() => setMentalEnergy(100)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white shadow-md ring-1 ring-emerald-400/25 transition hover:bg-emerald-500"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-100" aria-hidden />
              Recharge
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[1, 2, 3].map((step) => {
              const active = (current.level ?? 1) === step
              return (
                <div
                  key={step}
                  className={[
                    'flex flex-1 min-w-[5rem] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold sm:min-w-[6.5rem]',
                    active
                      ? 'border-emerald-400/60 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-900/10'
                      : 'border-emerald-900/10 bg-white/60 text-emerald-950/45',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
                      active ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700/70',
                    ].join(' ')}
                  >
                    {step}
                  </span>
                  <span className="hidden sm:inline">
                    {step === 1 ? 'Basic' : step === 2 ? 'Concept' : 'Advanced'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-emerald-950/55">
            <span>
              {idx} / {total} Questions
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden />
              Demo mood:
              <button
                type="button"
                onClick={() => setDemoMood((m) => (m === 'frustrated' ? 'neutral' : 'frustrated'))}
                className="rounded-lg border border-emerald-900/15 bg-white/80 px-2 py-1 text-[11px] font-bold text-emerald-900 ring-1 ring-emerald-900/10 hover:border-emerald-400/50"
              >
                {demoMood === 'frustrated' ? 'Frustrated' : 'Neutral'}
              </button>
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${(idx / total) * 100}%` }}
            />
          </div>

          <div className="mt-6">
            <GamifiedQuestionCard
              qIndex={idx}
              tag={current.tag ?? 'Topic'}
              question={current.question}
              options={current.options ?? []}
              selected={selected}
              onSelect={(opt) => {
                if (feedback?.show) return
                setSelected(opt)
              }}
              disabled={Boolean(feedback?.show)}
              feedback={
                feedback?.show
                  ? { show: true, correct: feedback.correct, answer: selected }
                  : null
              }
              showSupporter={showSupporter}
              supporterText={current.supporterHint ?? current.hint}
              correctAnswer={current.correct}
              onSubmit={submitMcq}
              onContinue={goNext}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={openHint}
              className="text-xs font-semibold text-emerald-700 underline decoration-emerald-400/50 hover:text-emerald-800"
            >
              Open syllabus hint (counts toward support)
            </button>
          </div>
        </div>
      )}

      <Modal open={hintOpen} onClose={() => setHintOpen(false)} title="Adaptive hint">
        {current?.hint
          ? current.hint
          : 'Link each option to a definition you can name from the AR lesson.'}
      </Modal>
    </div>
  )
}
