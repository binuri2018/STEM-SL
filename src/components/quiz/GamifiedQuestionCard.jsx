import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MessageCircle, Volume2 } from 'lucide-react'

const letters = ['A', 'B', 'C', 'D']

/**
 * @param {{
 *   qIndex: number
 *   tag: string
 *   question: string
 *   options: string[]
 *   selected: string | null
 *   onSelect: (opt: string) => void
 *   disabled: boolean
 *   feedback: { show: boolean; correct: boolean; answer: string | null } | null
 *   showSupporter: boolean
 *   supporterText?: string
 *   correctAnswer?: string
 *   onSubmit: () => void
 *   onContinue: () => void
 * }} props
 */
export function GamifiedQuestionCard({
  qIndex,
  tag,
  question,
  options,
  selected,
  onSelect,
  disabled,
  feedback,
  showSupporter,
  supporterText,
  correctAnswer,
  onSubmit,
  onContinue,
}) {
  const [changes, setChanges] = useState(0)
  const prevSel = useRef(null)

  useEffect(() => {
    setChanges(0)
    prevSel.current = null
  }, [qIndex])

  useEffect(() => {
    if (selected == null) return
    if (prevSel.current != null && prevSel.current !== selected) {
      setChanges((c) => c + 1)
    }
    prevSel.current = selected
  }, [selected])

  const showContinue = Boolean(feedback?.show)

  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-white/90 p-5 shadow-[0_12px_40px_-18px_rgba(15,118,110,0.25)] ring-1 ring-emerald-950/5 backdrop-blur-sm sm:p-7">
      <div className="flex flex-wrap items-center gap-2 gap-y-2">
        <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-extrabold text-white ring-1 ring-emerald-500/30">
          Q{qIndex + 1}
        </span>
        <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900 ring-1 ring-emerald-900/10">
          {tag}
        </span>
        <span className="ml-auto flex items-center gap-3 text-[11px] font-semibold text-emerald-950/45">
          <span>Changes: {changes}</span>
          <span>Attempts: 1</span>
        </span>
      </div>

      <h2 className="mt-5 text-lg font-bold leading-snug text-emerald-950 sm:text-xl">{question}</h2>

      <AnimatePresence>
        {showSupporter && supporterText ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-5 rounded-xl border border-sky-200 bg-sky-50/95 px-4 py-3 ring-1 ring-sky-900/10"
          >
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-sky-800">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Student supporter
              <Volume2 className="ml-auto h-3.5 w-3.5 text-sky-600" aria-hidden />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-sky-950/90">{supporterText}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6 grid gap-3">
        {options.map((opt, i) => {
          const letter = letters[i] ?? String(i + 1)
          const isSel = selected === opt
          let ring =
            'border-emerald-900/10 bg-white hover:border-emerald-400/45 hover:bg-emerald-50/50'
          if (feedback?.show && correctAnswer) {
            const isCorrectOpt = opt === correctAnswer
            const isUserPick = opt === feedback.answer
            if (isCorrectOpt) {
              ring = 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/25'
            } else if (isUserPick && !feedback.correct) {
              ring = 'border-rose-400 bg-rose-50 ring-1 ring-rose-400/20'
            } else {
              ring = 'border-emerald-900/5 bg-emerald-50/40 opacity-60'
            }
          } else if (isSel) {
            ring = 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/35'
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={[
                'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold text-emerald-950 transition',
                ring,
                disabled ? 'cursor-default opacity-95' : '',
              ].join(' ')}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-900/10">
                {letter}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {feedback?.show ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={[
              'mt-4 rounded-xl px-4 py-3 text-sm font-semibold ring-1',
              feedback.correct
                ? 'bg-emerald-50 text-emerald-900 ring-emerald-300/80'
                : 'bg-rose-50 text-rose-900 ring-rose-200/90',
            ].join(' ')}
          >
            {feedback.correct
              ? 'Correct — great job! Continue when you are ready.'
              : `Not quite. The correct answer is: ${correctAnswer ?? '—'}.`}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {!showContinue ? (
          <button
            type="button"
            disabled={!selected}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-md ring-1 ring-emerald-500/35 transition hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-40"
          >
            <Check className="h-4 w-4" aria-hidden />
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-md ring-1 ring-emerald-500/35 transition hover:bg-emerald-500"
          >
            Continue
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </div>
  )
}
