import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon } from 'lucide-react'
import { Button } from '../components/common/Button.jsx'
import { InputField } from '../components/common/InputField.jsx'
import { Loader } from '../components/common/Loader.jsx'
import { TellShowPanels } from '../components/story/TellShowPanels.jsx'
import { generateNarrative } from '../services/aiService.js'
import diagramPlaceholder from '../assets/diagram-placeholder.svg'

const interests = [
  { key: 'farming', label: 'Farming & villages' },
  { key: 'transport', label: 'Transport & roads' },
  { key: 'sports', label: 'Sports & motion' },
]

export default function NarrativeLearning() {
  const [topic, setTopic] = useState('Electricity')
  const [interest, setInterest] = useState('farming')
  const [loading, setLoading] = useState(false)
  const [payload, setPayload] = useState(null)

  const interestLabel = useMemo(
    () => interests.find((i) => i.key === interest)?.label ?? 'Mixed contexts',
    [interest],
  )

  async function onGenerate() {
    setLoading(true)
    try {
      const { data } = await generateNarrative(topic, interest)
      setPayload(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-900/10">
          📖 Narrative Learning
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 lg:text-4xl">
          Tell me the topic — I’ll show it like a story.
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-emerald-950/70">
          Left side captures what you want to learn. Right side keeps textbook clarity and a Sri Lankan everyday story side-by-side.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <section className="rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:col-span-5 lg:p-8">
          <div className="space-y-6">
            <InputField
              id="topic"
              label="STEM topic"
              hint="Example: Electricity, Photosynthesis, Acids & bases…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Type your lesson topic"
            />

            <div>
              <div className="mb-3 text-sm font-semibold text-emerald-950">
                Interest lane (sets story vibe)
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => {
                  const active = interest === i.key
                  return (
                    <button
                      key={i.key}
                      type="button"
                      onClick={() => setInterest(i.key)}
                      className={[
                        'rounded-full px-4 py-2 text-sm font-bold ring-1 transition-colors',
                        active
                          ? 'bg-emerald-600 text-white ring-emerald-700/25'
                          : 'bg-white/85 text-emerald-950 ring-emerald-900/10 hover:bg-emerald-50',
                      ].join(' ')}
                    >
                      {i.label}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-sm text-emerald-950/65">
                Selected: <span className="font-semibold">{interestLabel}</span>
              </p>
            </div>

            <Button type="button" onClick={onGenerate} disabled={loading}>
              Generate lesson story
            </Button>

            <p className="text-sm leading-relaxed text-emerald-950/60">
              Output follows the demo JSON shape (concept, explanation, story,
              context, diagram placeholder).
            </p>
          </div>
        </section>

        <section className="space-y-6 lg:col-span-7">
          {loading ? <Loader label="Weaving your Sri Lankan STEM story…" /> : null}

          {!loading && payload ? (
            <div className="space-y-6">
              <TellShowPanels
                concept={payload.concept}
                explanation={payload.explanation}
                story={payload.story}
                context={payload.context}
              />

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl bg-white/75 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
                    <ImageIcon className="h-4 w-4 text-emerald-700" aria-hidden />
                    Illustration placeholder
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 ring-1 ring-emerald-900/10">
                    Diagram flag
                  </span>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-emerald-900/10">
                  <img
                    src={diagramPlaceholder}
                    alt="Lesson diagram placeholder"
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          ) : null}

          {!loading && !payload ? (
            <div className="rounded-3xl bg-white/55 p-10 text-center ring-1 ring-emerald-900/10 backdrop-blur-sm">
              <p className="text-lg font-semibold text-emerald-950">
                Your story panel is empty — tap generate to preview.
              </p>
              <p className="mt-2 text-sm text-emerald-950/65">
                Tip: keep topics aligned with your syllabus keywords for stronger OL revision.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
