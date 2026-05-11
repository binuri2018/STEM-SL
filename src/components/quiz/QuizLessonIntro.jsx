import { BookOpen, Clock, Lightbulb, User } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { OHMS_LESSON } from '../../data/ohmsLawLessonQuiz.js'

/**
 * Screen 1 — “AR Lesson Complete” before the adaptive assessment.
 * @param {{ onStart: () => void; lesson?: typeof OHMS_LESSON }} props
 */
export function QuizLessonIntro({ onStart, lesson = OHMS_LESSON }) {
  const { student } = useApp()
  const displayName = student.name.split(' ')[0] ?? 'Student'
  const displayId = student.studentId

  const card =
    'rounded-2xl border border-emerald-900/10 bg-white/85 p-5 shadow-[0_12px_40px_-18px_rgba(15,118,110,0.25)] ring-1 ring-emerald-950/5 backdrop-blur-sm sm:p-6'

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 pb-12 pt-6 text-emerald-950">
      <div className="text-5xl drop-shadow-md" aria-hidden>
        🏆
      </div>
      <h1 className="mt-5 text-center text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
        AR Lesson Complete!
      </h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-emerald-950/70 sm:text-base">
        Great work! Now let&apos;s see how well you&apos;ve understood the material.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-[var(--shadow-soft)] ring-1 ring-emerald-900/10">
        <User className="h-4 w-4 text-emerald-600" aria-hidden />
        <span>{displayName}</span>
        <span className="text-emerald-400/90">|</span>
        <span className="font-mono text-xs text-emerald-800/90">{displayId}</span>
      </div>

      <div className={`mt-8 w-full ${card}`}>
        <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white ring-1 ring-emerald-700/30">
          {lesson.subject}
        </span>
        <h2 className="mt-3 text-xl font-bold text-emerald-950 sm:text-2xl">{lesson.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-emerald-950/75">{lesson.description}</p>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-emerald-900/10 pt-4 text-xs font-semibold text-emerald-950/55">
          <span className="inline-flex items-center gap-2 text-emerald-900/85">
            <BookOpen className="h-4 w-4 text-emerald-600" aria-hidden />
            {lesson.yearLabel}
          </span>
          <span className="inline-flex items-center gap-2 text-emerald-900/85">
            <Clock className="h-4 w-4 text-teal-600" aria-hidden />
            {lesson.durationLabel}
          </span>
        </div>
      </div>

      <div className={`mt-6 w-full ${card}`}>
        <div className="border-b border-emerald-900/10 pb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-950/50">
            What&apos;s next?
          </p>
          <p className="mt-2 text-sm font-medium leading-snug text-emerald-950/65">
            Three short stages — <span className="font-semibold text-emerald-950">9 questions total</span>{' '}
            (3 per level), from recall to harder reasoning.
          </p>
        </div>

        <ul className="mt-5 space-y-5" role="list" aria-label="Assessment levels">
          {lesson.roadmap.map((row) => (
            <li key={row.level} className="flex gap-3.5 sm:gap-4">
              <span
                className={[
                  'mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-sm ring-2 ring-white',
                  row.dotClass,
                ].join(' ')}
                title={`Level ${row.level}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[13px] font-medium text-emerald-950/45 sm:text-sm">
                    Level {row.level}
                  </span>
                  <span className="text-base font-bold tracking-tight text-emerald-950 sm:text-[15px]">
                    {row.label}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex gap-2 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-3 text-xs leading-relaxed text-amber-950 ring-1 ring-amber-900/10">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <p>
            The system will monitor your responses and facial expressions (demo) to provide
            personalised support during the quiz.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-10 w-full max-w-md rounded-2xl bg-emerald-600 px-6 py-4 text-center text-base font-extrabold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-500/40 transition hover:bg-emerald-500"
      >
        🚀 Start Assessment
      </button>
    </div>
  )
}
