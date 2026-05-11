import { Sparkles, ArrowRight, BookOpen, Mic, Brain, ScanLine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/common/Card.jsx'
import { ProgressBar } from '../components/common/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { ROUTES } from '../utils/routes.js'

const modules = [
  {
    title: 'Narrative Learning',
    emoji: '📖',
    desc: "Story-led path into Ohm's Law — same chapter as your AR lab (demo).",
    to: ROUTES.narrative,
    icon: BookOpen,
    accent: 'from-emerald-600 to-[#2ECC71]',
  },
  {
    title: 'Voice Tutor',
    emoji: '🎙️',
    desc: "Talk through V = IR, units, and circuits with calm, chat-style help.",
    to: ROUTES.tutor,
    icon: Mic,
    accent: 'from-emerald-700 to-emerald-500',
  },
  {
    title: 'Adaptive Quiz',
    emoji: '🧠',
    desc: "Nine-step check on Ohm's Law after the AR lesson (basic → advanced).",
    to: ROUTES.quiz,
    icon: Brain,
    accent: 'from-[#27AE60] to-emerald-400',
  },
  {
    title: 'Knowledge Maps',
    emoji: '🗺️',
    desc: "Verify handwritten notes on circuits — demo uses Ohm's Law corrections.",
    to: ROUTES.synthesis,
    icon: ScanLine,
    accent: 'from-emerald-600 to-teal-400',
  },
]

export default function Dashboard() {
  const nav = useNavigate()
  const { student, weeklyMinutes, weeklyTotal } = useApp()

  const goalMinutes = 210
  const progressValue = Math.min(weeklyTotal, goalMinutes)

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl bg-gradient-to-br from-white via-emerald-50/55 to-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-emerald-900/10 lg:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-900/10">
              <Sparkles className="h-4 w-4 text-emerald-700" aria-hidden />
              Welcome back — your STEM tutor is ready.
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 lg:text-4xl">
              Hi {student.name.split(' ')[0]}, ready for a calm revision lap?
            </h1>
            <p className="text-lg leading-relaxed text-emerald-950/75">
              Pick a module below — learn with narrative context, talk it through,
              test yourself, then tidy handwritten notes into a revision map.
            </p>
          </div>

          <Card hover={false} className="w-full max-w-md p-6 lg:w-[380px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Profile
                </div>
                <div className="mt-2 text-xl font-extrabold tracking-tight text-emerald-950">
                  {student.name}
                </div>
                <div className="mt-1 text-sm font-semibold text-emerald-950/65">
                  {student.grade} • {student.school}
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-600 text-lg font-extrabold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25">
                {student.name
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-900/10">
              <div className="flex items-center justify-between text-sm font-bold text-emerald-950">
                <span>Weekly learning</span>
                <span className="text-emerald-800">
                  {weeklyTotal}/{goalMinutes} min
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={progressValue} max={goalMinutes} />
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {weeklyMinutes.map((d) => (
                  <div key={d.label} className="text-center">
                    <div className="text-[11px] font-bold text-emerald-900/55">
                      {d.label}
                    </div>
                    <div className="mt-2 flex h-16 flex-col justify-end rounded-2xl bg-white/80 p-1 ring-1 ring-emerald-900/10">
                      <motion.div
                        className="w-full rounded-xl bg-gradient-to-t from-[#27AE60] to-[#2ECC71]"
                        initial={{ height: '12%' }}
                        animate={{
                          height: `${Math.min(100, (d.minutes / 70) * 100)}%`,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 220,
                          damping: 20,
                        }}
                        title={`${d.minutes} minutes`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-emerald-950/70">
              <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-emerald-900/10">
                Streak: {student.streakDays} days
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-emerald-900/10">
                Focus: {student.focusSubject}
              </span>
            </div>
          </Card>
        </div>
      </motion.section>

      <section aria-label="Modules">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950">
              Choose your next step
            </h2>
            <p className="mt-2 text-base text-emerald-950/70">
              Four AI companions — one friendly loop.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((m, idx) => {
            const Icon = m.icon
            return (
              <motion.button
                key={m.to}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * idx, duration: 0.42 }}
                onClick={() => nav(m.to)}
                className="text-left"
              >
                <Card className="h-full overflow-hidden p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${m.accent} text-white shadow-[var(--shadow-soft)] ring-1 ring-white/25`}
                      >
                        <Icon className="h-7 w-7 text-white" aria-hidden />
                      </span>
                      <div>
                        <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-emerald-950">
                          <span aria-hidden>{m.emoji}</span>
                          {m.title}
                        </div>
                        <p className="mt-2 text-base leading-relaxed text-emerald-950/70">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/10">
                      Open
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Card>
              </motion.button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
