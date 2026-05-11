import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Dna,
  Globe,
  KeyRound,
  Layers,
  Lightbulb,
  MessageCircleQuestion,
  Pin,
  Pencil,
  Ruler,
  Sparkles,
  User,
} from 'lucide-react'
import { Loader } from '../components/common/Loader.jsx'
import { generateNarrative } from '../services/aiService.js'
import { renderRichText } from '../utils/richText.jsx'
import { ROUTES } from '../utils/routes.js'
import {
  getScienceBlocks,
  TEXTBOOKS,
  TOPICS_BY_TEXTBOOK,
  topicShortLabel,
} from '../data/narrativeFlowDemo.js'

const INTEREST_OPTIONS = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'farming', label: 'Farming & villages' },
  { value: 'transport', label: 'Transport & roads' },
  { value: 'sports', label: 'Sports & motion' },
  { value: 'music', label: 'Music & bands' },
  { value: 'technology', label: 'Technology & gadgets' },
]

const ASPIRATION_OPTIONS = [
  { value: 'athlete', label: 'Athlete' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'artist', label: 'Artist' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'explorer', label: 'Scientist / explorer' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const FEEDBACK_OPTIONS = [
  { id: 'very', emoji: '🤩', label: 'Very helpful' },
  { id: 'somewhat', emoji: '😊', label: 'Somewhat helpful' },
  { id: 'not', emoji: '😐', label: 'Not helpful' },
  { id: 'hard', emoji: '😫', label: 'Hard to understand' },
]

function demoClassifierPreview({ interest, aspiration, difficulty }) {
  const pace =
    difficulty === 'high'
      ? 'high-density exam beats'
      : difficulty === 'low'
        ? 'gentle scaffolding'
        : 'balanced pacing'
  const vibe =
    interest === 'gaming' && aspiration === 'athlete'
      ? 'Competitive quest arc — timers, targets, clutch moments.'
      : interest === 'gaming'
        ? 'Interactive quest narrative — checkpoints and upgrades.'
        : interest === 'farming'
          ? 'Field-and-canal realism — patience, seasons, tools.'
          : interest === 'music'
            ? 'Session narrative — rhythm, harmony, rehearsal loops.'
            : interest === 'technology'
              ? 'Systems narrative — specs, debugging, efficiency.'
              : 'Motion-forward story — forces, fields, everyday gear.'
  return `Story theme (demo): ${vibe} · ${pace}.`
}

const cardShell =
  'rounded-3xl bg-white/75 p-6 shadow-[var(--shadow-soft)] ring-1 ring-emerald-900/10 backdrop-blur-sm sm:p-8'
const inputSelect =
  'w-full appearance-none rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 pr-11 text-sm text-emerald-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30'
const subtleCard =
  'rounded-2xl border border-emerald-900/10 bg-white/85 p-4 shadow-inner shadow-emerald-900/5 ring-1 ring-emerald-950/5'

const FLOW_STEPS = [
  { phase: 'profile', num: 1, label: 'Profile' },
  { phase: 'topic', num: 2, label: 'Topic' },
  { phase: 'science', num: 3, label: 'Science' },
  { phase: 'story', num: 4, label: 'Story' },
  { phase: 'done', num: 5, label: 'Next' },
]

function FlowStepper({ currentPhase }) {
  const idx = FLOW_STEPS.findIndex((s) => s.phase === currentPhase)
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {FLOW_STEPS.map((s, i) => {
        const active = i === idx
        const done = i < idx
        return (
          <div key={s.phase} className="flex items-center gap-2 sm:gap-3">
            <div
              className={[
                'flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-xs font-bold sm:h-10 sm:min-w-[2.5rem] sm:px-3 sm:text-sm',
                active
                  ? 'bg-emerald-600 text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25'
                  : done
                    ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-600/25'
                    : 'bg-white/90 text-emerald-950/45 ring-1 ring-emerald-900/10',
              ].join(' ')}
            >
              {s.num}
            </div>
            <span
              className={[
                'hidden text-xs font-semibold sm:inline sm:text-sm',
                active ? 'text-emerald-950' : 'text-emerald-950/45',
              ].join(' ')}
            >
              {s.label}
            </span>
            {i < FLOW_STEPS.length - 1 ? (
              <span className="hidden h-px w-6 bg-emerald-900/15 sm:block lg:w-10" aria-hidden />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function ScienceCard({ headerClass, title, children, icon: Icon }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white/90 shadow-sm ring-1 ring-emerald-950/5">
      <div
        className={[
          'flex items-center gap-2 px-4 py-3 text-sm font-extrabold uppercase tracking-wide',
          headerClass,
        ].join(' ')}
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-95" aria-hidden /> : null}
        {title}
      </div>
      <div className="px-4 py-4 text-sm leading-relaxed text-emerald-950/85 [&_strong]:text-emerald-950">
        {typeof children === 'string' ? renderRichText(children) : children}
      </div>
    </div>
  )
}

export default function NarrativeLearning() {
  const [phase, setPhase] = useState('profile')

  const [interest, setInterest] = useState('gaming')
  const [aspiration, setAspiration] = useState('athlete')
  const [scienceDifficulty, setScienceDifficulty] = useState('high')

  const [textbookId, setTextbookId] = useState('g10p1')
  const [topicId, setTopicId] = useState('ohms-law')
  const [focusText, setFocusText] = useState('Explain 3rd law')

  const [loading, setLoading] = useState(false)
  const [narrativePayload, setNarrativePayload] = useState(null)
  const [feedbackId, setFeedbackId] = useState(null)

  const chapterOptions = TOPICS_BY_TEXTBOOK[textbookId] ?? []
  const chapterLabel = useMemo(
    () => chapterOptions.find((t) => t.id === topicId)?.label ?? 'Topic',
    [chapterOptions, topicId],
  )

  const persona = useMemo(
    () => ({ interest, aspiration, difficulty: scienceDifficulty }),
    [interest, aspiration, scienceDifficulty],
  )

  const classifierHint = useMemo(() => demoClassifierPreview(persona), [persona])

  const scienceData = useMemo(
    () => getScienceBlocks(topicId, chapterLabel),
    [topicId, chapterLabel],
  )

  const textbookLabel = TEXTBOOKS.find((t) => t.id === textbookId)?.label ?? ''

  const resetFlow = useCallback(() => {
    setPhase('profile')
    setNarrativePayload(null)
    setFeedbackId(null)
    setFocusText('Explain 3rd law')
    setTopicId('newtons-laws')
    setTextbookId('g10p1')
  }, [])

  async function runTopicGenerate() {
    if (!focusText.trim() || !chapterLabel) return
    setLoading(true)
    setFeedbackId(null)
    try {
      const { data } = await generateNarrative(chapterLabel, {
        ...persona,
        studentFocus: focusText.trim(),
      })
      setNarrativePayload(data)
      setPhase('science')
    } finally {
      setLoading(false)
    }
  }

  const shortTopic = topicShortLabel(topicId, chapterLabel)

  return (
    <div className="pb-16 text-emerald-950">
      <FlowStepper currentPhase={phase} />

      <AnimatePresence mode="wait">
        {phase === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-lg"
          >
            <div className={cardShell}>
              <div className="mb-6 flex items-start gap-3 border-b border-emerald-900/10 pb-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-900/10">
                  <User className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800/70">
                    Step 1
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-emerald-950">Student Profile</h2>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-950/70">
                    These inputs drive the ML Persona Classifier to predict a story theme.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-950">Interest</span>
                  <div className="relative">
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className={inputSelect}
                      aria-label="Interest"
                    >
                      {INTEREST_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-800/50"
                      aria-hidden
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-950">
                    Aspiration / Career Goal
                  </span>
                  <div className="relative">
                    <select
                      value={aspiration}
                      onChange={(e) => setAspiration(e.target.value)}
                      className={inputSelect}
                      aria-label="Aspiration or career goal"
                    >
                      {ASPIRATION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-800/50"
                      aria-hidden
                    />
                  </div>
                </label>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-950">
                      Science Difficulty Level
                    </span>
                    <span
                      className="inline-flex text-emerald-800/45"
                      title="Narrative density for OL revision."
                    >
                      <CircleHelp className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {DIFFICULTY_OPTIONS.map((opt) => {
                      const selected = scienceDifficulty === opt.value
                      return (
                        <label
                          key={opt.value}
                          className="flex cursor-pointer items-center gap-3 text-sm font-medium text-emerald-950/90"
                        >
                          <input
                            type="radio"
                            name="science-difficulty"
                            value={opt.value}
                            checked={selected}
                            onChange={() => setScienceDifficulty(opt.value)}
                            className="sr-only"
                          />
                          <span
                            className={[
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
                              selected
                                ? 'border-emerald-600 bg-emerald-600 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]'
                                : 'border-emerald-900/20 bg-white',
                            ].join(' ')}
                            aria-hidden
                          >
                            {selected ? (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            ) : null}
                          </span>
                          {opt.label}
                        </label>
                      )
                    })}
                  </div>
                </div>

                <p className="rounded-xl bg-emerald-50/90 px-3 py-2.5 text-xs leading-relaxed text-emerald-900/80 ring-1 ring-emerald-900/10">
                  {classifierHint}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPhase('topic')}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500"
              >
                Continue to topic selection
              </button>
            </div>
          </motion.div>
        ) : null}

        {phase === 'topic' ? (
          <motion.div
            key="topic"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-3xl"
          >
            <header className="mb-8 border-b border-emerald-900/10 pb-8">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-900/10">
                  <Dna className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">
                    Personalized STEM Narrative Simulator
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-950/70">
                    Hybrid ML Personalization + RAG Grounding + Generative AI — Sri Lanka NIE Grade
                    10 &amp; 11 Syllabus
                  </p>
                </div>
              </div>
            </header>

            <div className={cardShell}>
              <div className="mb-6 flex items-center gap-2 text-emerald-950">
                <Layers className="h-5 w-5 text-emerald-600" aria-hidden />
                <h2 className="text-lg font-bold">Topic Selection</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-950">Textbook</span>
                  <div className="relative">
                    <select
                      value={textbookId}
                      onChange={(e) => {
                        const next = e.target.value
                        setTextbookId(next)
                        const first = TOPICS_BY_TEXTBOOK[next]?.[0]
                        if (first) setTopicId(first.id)
                      }}
                      className={inputSelect}
                    >
                      {TEXTBOOKS.map((tb) => (
                        <option key={tb.id} value={tb.id}>
                          {tb.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-800/45" />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-emerald-950">
                    Chapter / Topic
                  </span>
                  <div className="relative">
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      className={inputSelect}
                    >
                      {chapterOptions.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-800/45" />
                  </div>
                </label>
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs text-emerald-950/65">
                <span className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-sm bg-emerald-500 ring-1 ring-emerald-600/30" />
                Sourcing from: {textbookLabel} — Sri Lanka National Institute of Education
              </p>

              <label className="mt-8 block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-950">
                  <MessageCircleQuestion className="h-4 w-4 text-emerald-600" aria-hidden />
                  What specifically are you struggling with or want to focus on?
                </span>
                <textarea
                  value={focusText}
                  onChange={(e) => setFocusText(e.target.value)}
                  rows={5}
                  placeholder="e.g. Explain 3rd law with an everyday example…"
                  className="w-full resize-y rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-sm leading-relaxed text-emerald-950 shadow-inner shadow-emerald-900/5 placeholder:text-emerald-950/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={loading || !focusText.trim()}
                  onClick={runTopicGenerate}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 transition hover:bg-[#2ECC71] disabled:pointer-events-none disabled:opacity-40"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-pulse">…</span>
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden />
                  )}
                  Generate Personalized Story
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('profile')}
                  className="rounded-2xl border border-emerald-900/15 bg-white/80 px-4 py-2.5 text-sm font-semibold text-emerald-950/75 ring-1 ring-emerald-900/10 hover:bg-emerald-50/90"
                >
                  Back
                </button>
              </div>

              {loading ? (
                <div className="mt-6">
                  <Loader label="Personalizing lesson path & grounding to syllabus (demo)…" />
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {phase === 'science' ? (
          <motion.div
            key="science"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-100/90 via-white to-teal-50/70 shadow-[var(--shadow-soft)] ring-1 ring-emerald-900/10">
              <div
                className="border-b border-emerald-900/10 px-4 py-10 text-center sm:py-12"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.09'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/80">
                  Topic
                </p>
                <p className="mt-2 text-xl font-bold text-emerald-950 sm:text-2xl">
                  {scienceData.bannerTopic}
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-950">
                <Ruler className="h-5 w-5 text-amber-600" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800/70">
                    Step 3
                  </p>
                  <h2 className="text-lg font-extrabold">Understand the Science First</h2>
                  <p className="mt-1 text-sm text-emerald-950/65">
                    Read this before the story — it will make the story click instantly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhase('topic')}
                className="rounded-2xl border border-emerald-900/15 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-950/75 ring-1 ring-emerald-900/10 hover:bg-emerald-50/90"
              >
                Back
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
              <div className="space-y-4 lg:col-span-2">
                <ScienceCard
                  headerClass={scienceData.concept.headerClass}
                  title={scienceData.concept.title}
                  icon={Pin}
                >
                  {scienceData.concept.body}
                </ScienceCard>
                <ScienceCard
                  headerClass={scienceData.whyItWorks.headerClass}
                  title={scienceData.whyItWorks.title}
                  icon={Lightbulb}
                >
                  {scienceData.whyItWorks.body}
                </ScienceCard>
                <ScienceCard
                  headerClass={scienceData.keyEquations.headerClass}
                  title={scienceData.keyEquations.title}
                  icon={KeyRound}
                >
                  <div className="space-y-2 font-mono text-base font-semibold text-amber-800">
                    {scienceData.keyEquations.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </ScienceCard>
                <ScienceCard
                  headerClass={scienceData.realWorld.headerClass}
                  title={scienceData.realWorld.title}
                  icon={Globe}
                >
                  {scienceData.realWorld.body}
                </ScienceCard>
              </div>

              <aside className="space-y-5 lg:col-span-1">
                <div className={subtleCard}>
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <KeyRound className="h-4 w-4 text-emerald-600" aria-hidden />
                    Key Equations
                  </div>
                  <div className="mt-4 space-y-4">
                    {scienceData.sidebarEquationBlocks.map((block) => (
                      <div
                        key={block.label}
                        className="rounded-xl bg-emerald-50/90 px-3 py-3 ring-1 ring-emerald-900/10"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70">
                          {block.label}
                        </p>
                        <p className="mt-2 font-mono text-sm font-semibold text-amber-700">
                          {block.formula}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <DefinitionsAccordion definitions={scienceData.definitions} />

                <div className={subtleCard}>
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
                    <Pencil className="h-4 w-4 text-amber-600" aria-hidden />
                    What to Write in the Exam
                  </div>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-emerald-900/90">
                    {scienceData.examTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setPhase('story')}
                className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg ring-1 ring-emerald-500/40 transition hover:bg-emerald-500"
              >
                Continue to story
              </button>
            </div>
          </motion.div>
        ) : null}

        {phase === 'story' ? (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-3xl"
          >
            <div className={cardShell}>
              <h2 className="text-xl font-extrabold text-emerald-950">
                📖 Step 4: See It in Action
              </h2>
              <p className="mt-2 text-sm text-emerald-950/65">
                Now read this story. Spot the science concept playing out in real life!
              </p>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-emerald-950/85">
                {narrativePayload?.story
                  ? narrativePayload.story.split('\n\n').map((para, i) => (
                      <p key={i} className="whitespace-pre-wrap">
                        {renderRichText(para)}
                      </p>
                    ))
                  : null}
              </div>

              <hr className="my-10 border-emerald-900/10" />

              <h3 className="text-lg font-extrabold text-emerald-950">💬 Was This Story Helpful?</h3>
              <p className="mt-1 text-sm text-emerald-950/55">
                Your feedback helps improve the storytelling for all students.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FEEDBACK_OPTIONS.map((f) => {
                  const on = feedbackId === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFeedbackId(f.id)}
                      className={[
                        'rounded-xl border px-3 py-3 text-left text-sm font-semibold transition',
                        on
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm ring-1 ring-emerald-600/20'
                          : 'border-emerald-900/15 bg-white/90 text-emerald-950 ring-1 ring-emerald-900/10 hover:border-emerald-400/40 hover:bg-emerald-50/50',
                      ].join(' ')}
                    >
                      <span className="mr-2" aria-hidden>
                        {f.emoji}
                      </span>
                      {f.label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!feedbackId}
                  onClick={() => setPhase('done')}
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white ring-1 ring-emerald-500/40 transition hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-35"
                >
                  Next steps
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('science')}
                  className="rounded-2xl border border-emerald-900/15 bg-white/80 px-4 py-2.5 text-sm font-semibold text-emerald-950/75 ring-1 ring-emerald-900/10 hover:bg-emerald-50/90"
                >
                  Back to science
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {phase === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950">🎯 Next Steps</h2>
            <div className="mt-6 rounded-2xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50/95 via-white to-teal-50/60 px-5 py-5 text-emerald-950 ring-1 ring-emerald-900/10 shadow-[var(--shadow-soft)]">
              <p className="text-sm leading-relaxed text-emerald-950/85">
                You&apos;ve just learned about{' '}
                <strong className="font-bold text-emerald-800">{shortTopic}</strong> through a
                personalized story. Ready to test your knowledge or explore something new?
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <Link
                  to={ROUTES.quiz}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-center text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 transition hover:bg-[#2ECC71]"
                >
                  🧪 Go to Quiz Module →
                </Link>
                <p className="mt-2 text-center text-xs text-emerald-950/55">
                  Tests you on: <strong className="text-emerald-900">{shortTopic}</strong>
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/90 px-5 py-4 text-sm font-bold text-emerald-950 ring-1 ring-emerald-900/10 transition hover:bg-emerald-50/90"
                >
                  🔄 Learn a New Concept
                </button>
                <p className="mt-2 text-center text-xs text-emerald-950/55">
                  Clears the flow so you can pick a new topic from Step 1.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function DefinitionsAccordion({ definitions }) {
  const [open, setOpen] = useState(null)

  return (
    <div className={subtleCard}>
      <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
        <BookOpen className="h-4 w-4 text-emerald-600" aria-hidden />
        Key Definitions
      </div>
      <ul className="mt-3 space-y-2">
        {definitions.map((d, i) => {
          const isOpen = open === i
          return (
            <li
              key={d.term}
              className="rounded-xl border border-emerald-900/10 bg-white/80 ring-1 ring-emerald-950/5"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-semibold text-emerald-950"
              >
                {d.term}
                <ChevronDown
                  className={[
                    'h-4 w-4 shrink-0 text-emerald-800/45 transition',
                    isOpen ? 'rotate-180' : '',
                  ].join(' ')}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden border-t border-emerald-900/10"
                  >
                    <p className="px-3 py-3 text-sm leading-relaxed text-emerald-950/75">{d.text}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
