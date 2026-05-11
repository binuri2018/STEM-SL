import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

export function ShortAnswerCard({
  question,
  value,
  onChange,
  onSubmit,
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

      <label htmlFor="short-answer" className="mt-6 block">
        <span className="sr-only">Your answer</span>
        <textarea
          id="short-answer"
          rows={4}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write one sentence — aim for clear STEM wording."
          className="w-full rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-base text-emerald-950 shadow-inner shadow-emerald-900/5 outline-none ring-emerald-500/25 placeholder:text-emerald-950/35 focus:border-emerald-400 focus:ring-4 disabled:opacity-60"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          disabled={disabled || !value.trim()}
          onClick={onSubmit}
          className={[
            'inline-flex items-center justify-center rounded-2xl bg-[#27AE60] px-5 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 hover:bg-[#2ECC71] disabled:pointer-events-none disabled:opacity-45',
          ].join(' ')}
        >
          Check answer
        </motion.button>
        <span className="text-sm font-semibold text-emerald-950/55">
          Short answers are gently mocked — length & keywords matter.
        </span>
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
              feedback.positive
                ? 'bg-emerald-50 text-emerald-900 ring-emerald-500/25'
                : 'bg-rose-50 text-rose-900 ring-rose-400/25',
            ].join(' ')}
          >
            {feedback.positive
              ? 'Nice — that shows you linked cause and effect. Continue!'
              : 'Add one concrete consequence (shock, heat, spark) to strengthen your answer.'}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
