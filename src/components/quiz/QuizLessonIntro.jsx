import { BookOpen, Clock, Lightbulb, User } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { HEART_LESSON } from '../../data/heartAssessmentQuiz.js'

/**
 * Screen 1 — “AR Lesson Complete” before the adaptive assessment.
 * @param {{ onStart: () => void; lesson?: typeof HEART_LESSON }} props
 */
export function QuizLessonIntro({ onStart, lesson = HEART_LESSON }) {
  const { student } = useApp()
  const displayName = lesson.demoStudent?.name ?? student.name.split(' ')[0] ?? 'Student'
  const displayId = lesson.demoStudent?.id ?? 'OL-DEMO-ID'

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
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-950/45">
          What&apos;s next?
        </p>
        <ul className="mt-4 space-y-4">
          {lesson.roadmap.map((row) => (
            <li key={row.level} className="flex items-start gap-3">
              <span
                className={[
                  'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-emerald-900/10',
                  row.dotClass,
                ].join(' ')}
                aria-hidden
              />
              <p className="text-sm font-bold text-emerald-950">
                <span className="text-emerald-950/50">Level {row.level}</span>{' '}
                <span className="font-semibold text-emerald-900/90">{row.label}</span>
              </p>
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
