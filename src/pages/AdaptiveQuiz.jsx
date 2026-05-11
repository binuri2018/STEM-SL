import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/common/Button.jsx'
import { Loader } from '../components/common/Loader.jsx'
import { Modal } from '../components/common/Modal.jsx'
import { ProgressBar } from '../components/common/ProgressBar.jsx'
import { EmotionPanel } from '../components/quiz/EmotionPanel.jsx'
import { QuestionCard } from '../components/quiz/QuestionCard.jsx'
import { QuizResultsDashboard } from '../components/quiz/QuizResultsDashboard.jsx'
import { ShortAnswerCard } from '../components/quiz/ShortAnswerCard.jsx'
import { fetchAdaptiveQuiz } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'
import { emotionClasses } from '../utils/emotionTheme.js'

function evaluateShortAnswer(text) {
  const t = text.trim().toLowerCase()
  if (t.length < 18) return false
  const signals = ['shock', 'fire', 'short', 'insulation', 'live', 'current', 'danger']
  return signals.some((s) => t.includes(s))
}

/**
 * @param {{ kind?: string; question: string; correct?: string } | undefined} q
 * @param {number} index
 * @param {{ show: boolean; correct?: boolean; positive?: boolean }} fb
 * @param {string | null} selected
 * @param {string} shortText
 */
function buildQuizResultRow(q, index, fb, selected, shortText) {
  if (!q || !fb.show) return null
  if (q.kind === 'short') {
    return {
      index,
      kind: /** @type {const} */ ('short'),
      question: q.question,
      isCorrect: Boolean(fb.positive),
      userAnswer: shortText,
    }
  }
  return {
    index,
    kind: /** @type {const} */ ('mcq'),
    question: q.question,
    isCorrect: Boolean(fb.correct),
    selectedOption: selected ?? undefined,
    correctOption: q.correct,
  }
}

export default function AdaptiveQuiz() {
  const { emotionQuiz, setEmotionQuiz } = useApp()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [shortText, setShortText] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [hintOpen, setHintOpen] = useState(false)
  const [results, setResults] = useState([])
  const [startedAt, setStartedAt] = useState(null)
  const [endedAt, setEndedAt] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const { data } = await fetchAdaptiveQuiz()
      if (!mounted) return
      setQuestions(data)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!loading && questions.length > 0 && startedAt === null) {
      setStartedAt(Date.now())
    }
  }, [loading, questions.length, startedAt])

  const total = questions.length || 1
  const current = questions[idx]
  const finished = idx >= total

  useEffect(() => {
    if (finished && endedAt === null) {
      setEndedAt(Date.now())
    }
  }, [finished, endedAt])

  const progressValue = useMemo(
    () => (finished ? 100 : (idx / total) * 100),
    [idx, total, finished],
  )

  const moodWrap = emotionClasses(emotionQuiz)

  function resetQuestionState() {
    setSelected(null)
    setShortText('')
    setFeedback(null)
  }

  function goNext() {
    const row = buildQuizResultRow(current, idx, feedback, selected, shortText)
    if (row) {
      setResults((prev) => [...prev, row])
    }
    resetQuestionState()
    setIdx((i) => Math.min(i + 1, total))
  }

  function restart() {
    resetQuestionState()
    setResults([])
    setEndedAt(null)
    setStartedAt(Date.now())
    setIdx(0)
  }

  function submitMcq() {
    if (!current?.correct || !selected) return
    const correct = selected === current.correct
    setFeedback({ show: true, correct })
  }

  function submitShort() {
    const positive = evaluateShortAnswer(shortText)
    setFeedback({ show: true, positive })
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-900/10">
          🧠 Adaptive Quiz
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 lg:text-4xl">
              Quick checks with hints — no scary exam vibes.
            </h1>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-emerald-950/70">
              Pick how you feel (mock “emotion-aware” styling), answer MCQs or a short written prompt, and watch gentle feedback animations.
            </p>
          </div>

          <div className="w-full max-w-md space-y-3 rounded-3xl bg-white/70 p-4 ring-1 ring-emerald-900/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm font-bold text-emerald-950">
              <span>Quiz progress</span>
              <span className="text-emerald-800">
                {finished ? total : Math.min(idx + 1, total)} / {total}
              </span>
            </div>
            <ProgressBar value={progressValue} />
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-8">
          <section
            className={[
              'rounded-3xl p-1 transition-colors duration-300',
              moodWrap,
            ].join(' ')}
          >
            <div className="rounded-[22px] bg-white/80 p-4 ring-1 ring-emerald-950/5 backdrop-blur-sm lg:p-6">
              {loading ? <Loader label="Loading warm quiz mock…" /> : null}

              {!loading && finished ? (
                <QuizResultsDashboard
                  results={results}
                  totalQuestions={total}
                  emotionQuiz={emotionQuiz}
                  startedAt={startedAt}
                  endedAt={endedAt}
                  onRestart={restart}
                />
              ) : null}

              {!loading && !finished && current?.kind !== 'short' ? (
                <div className="space-y-6">
                  <QuestionCard
                    question={current.question}
                    options={current.options ?? []}
                    selected={selected}
                    onSelect={(opt) => {
                      if (feedback?.show) return
                      setSelected(opt)
                    }}
                    disabled={feedback?.show}
                    feedback={
                      feedback?.show
                        ? { show: true, correct: feedback.correct, answer: selected }
                        : null
                    }
                    onHint={() => setHintOpen(true)}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {!feedback?.show ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setHintOpen(true)}
                      >
                        Need a hint?
                      </Button>
                    ) : (
                      <span />
                    )}

                    {!feedback?.show ? (
                      <Button
                        type="button"
                        disabled={!selected}
                        onClick={submitMcq}
                      >
                        Check answer
                      </Button>
                    ) : (
                      <Button type="button" onClick={goNext}>
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}

              {!loading && !finished && current?.kind === 'short' ? (
                <div className="space-y-6">
                  <ShortAnswerCard
                    question={current.question}
                    value={shortText}
                    onChange={setShortText}
                    disabled={feedback?.show}
                    feedback={
                      feedback?.show
                        ? { show: true, positive: feedback.positive }
                        : null
                    }
                    onSubmit={submitShort}
                    onHint={() => setHintOpen(true)}
                  />

                  <div className="flex justify-end">
                    {feedback?.show ? (
                      <Button type="button" onClick={goNext}>
                        Continue
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <EmotionPanel value={emotionQuiz} onChange={setEmotionQuiz} />

          <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm">
            <div className="text-sm font-extrabold text-emerald-950">
              OL-friendly pacing
            </div>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-emerald-950/70">
              <li className="rounded-2xl bg-emerald-50/70 px-4 py-3 ring-1 ring-emerald-900/10">
                Got it wrong? Read the hint, say it aloud once, then retry mentally.
              </li>
              <li className="rounded-2xl bg-white/85 px-4 py-3 ring-1 ring-emerald-900/10">
                Short answers reward clarity — skip filler words.
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <Modal
        open={hintOpen}
        onClose={() => setHintOpen(false)}
        title="Adaptive hint"
      >
        {current?.hint
          ? current.hint
          : 'Hints appear here — connect the prompt to a definition + one example.'}
      </Modal>
    </div>
  )
}
