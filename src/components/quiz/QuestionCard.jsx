import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

export function QuestionCard({
  question,
  options,
  selected,
  onSelect,
  disabled,
  feedback,
  onHint,
}) {
  return (
    <div className="rounded-3xl bg-white/85 p-6 shadow-[0_14px_48px_-28px_rgba(15,118,110,0.35)] ring-1 ring-emerald-950/10 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-emerald-950 lg:text-2xl">
          {question}
        </h2>
        <button
          type="button"
          onClick={onHint}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/10 hover:bg-emerald-100"
        >
          <HelpCircle className="h-4 w-4" aria-hidden />
          Hint
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {options.map((opt) => {
          const isSel = selected === opt
          let tone =
            'bg-white/90 ring-emerald-900/10 hover:bg-emerald-50/90 focus-visible:ring-emerald-400'

          if (feedback?.show && feedback.answer === opt) {
            tone = feedback.correct
              ? 'bg-emerald-50 ring-emerald-500/40'
              : 'bg-rose-50 ring-rose-400/35'
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={[
                'rounded-2xl px-4 py-4 text-left text-base font-semibold ring-1 transition-colors',
                tone,
                isSel && !feedback?.show ? 'ring-2 ring-emerald-500/40' : '',
                disabled ? 'opacity-70' : '',
              ].join(' ')}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {feedback?.show ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28 }}
            className={[
              'mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ring-1',
              feedback.correct
                ? 'bg-emerald-50 text-emerald-900 ring-emerald-500/25'
                : 'bg-rose-50 text-rose-900 ring-rose-400/25',
            ].join(' ')}
          >
            {feedback.correct
              ? 'Nice! That’s right — ready for the next one?'
              : 'Not quite — peek at the hint, then try once more.'}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
