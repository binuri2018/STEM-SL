import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Mic, Sparkles, Youtube } from 'lucide-react'
import { Button } from '../components/common/Button.jsx'
import { ChatBubble } from '../components/common/ChatBubble.jsx'
import { InputField } from '../components/common/InputField.jsx'
import { RecommendationList } from '../components/chat/RecommendationList.jsx'
import { OhmsLawDiagram } from '../components/chat/OhmsLawDiagram.jsx'
import { TypingIndicator } from '../components/chat/TypingIndicator.jsx'
import { StreamingAnswer } from '../components/chat/StreamingAnswer.jsx'
import { sendTutorMessage } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'
import { renderRichText } from '../utils/richText.jsx'

const suggestedVideos = [
  'Ohm’s Law — V = IR with a water-pipe analogy',
  'Series vs parallel: how current and voltage split',
  'Electrical power: why P = VI matters for appliances',
]

const relatedTopics = [
  'Resistors in series',
  'Resistors in parallel',
  'Electrical power P = VI',
  'SI units for V, I, and R',
]

/** Shown in the question field when mic is on (demo “transcription”). */
const DEMO_VOICE_TRANSCRIPT =
  "Explain Ohm's Law simply — how voltage, current, and resistance relate."

export default function VoiceTutor() {
  const { tutorMemoryTopic, setTutorMemoryTopic, student } = useApp()
  const [messages, setMessages] = useState(() => {
    const first = student.name.split(' ')[0] ?? 'there'
    return [
      {
        role: 'assistant',
        content: `Hi ${first}! This thread follows **Ohm's Law** from your AR lab — ask about V = IR, units, or series vs parallel and I’ll keep the tone calm.`,
      },
    ]
  })
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeMeta, setActiveMeta] = useState(null)
  const [streamKey, setStreamKey] = useState(0)
  const bottomRef = useRef(null)

  const metaRef = useRef(null)
  const draftRef = useRef('')
  const demoVoiceIntervalRef = useRef(null)

  draftRef.current = draft

  useEffect(() => {
    metaRef.current = activeMeta
  }, [activeMeta])

  const memoryHint = useMemo(() => tutorMemoryTopic, [tutorMemoryTopic])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, busy, streamingText])

  /** Demo: type mock transcript into the question bar while “listening”. */
  useEffect(() => {
    if (!listening) {
      if (demoVoiceIntervalRef.current) {
        clearInterval(demoVoiceIntervalRef.current)
        demoVoiceIntervalRef.current = null
      }
      return
    }

    const startDelay = window.setTimeout(() => {
      if (draftRef.current.trim() !== '') return

      let i = 0
      demoVoiceIntervalRef.current = window.setInterval(() => {
        i += 1
        setDraft(DEMO_VOICE_TRANSCRIPT.slice(0, i))
        if (i >= DEMO_VOICE_TRANSCRIPT.length && demoVoiceIntervalRef.current) {
          clearInterval(demoVoiceIntervalRef.current)
          demoVoiceIntervalRef.current = null
        }
      }, 28)
    }, 320)

    return () => {
      clearTimeout(startDelay)
      if (demoVoiceIntervalRef.current) {
        clearInterval(demoVoiceIntervalRef.current)
        demoVoiceIntervalRef.current = null
      }
    }
  }, [listening])

  const handleStreamComplete = useCallback((content) => {
    const meta = metaRef.current
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content,
        recommendations: meta?.recommendations,
        diagramType: meta?.diagramType,
      },
    ])
    setStreamingText('')
    setActiveMeta(null)
    setBusy(false)
  }, [])

  async function send(text) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    const nextHistory = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextHistory)
    setDraft('')
    setBusy(true)
    setStreamingText('')
    setActiveMeta(null)

    if (/electric|ohm|circuit|battery|volt|amp|resist/i.test(trimmed)) {
      setTutorMemoryTopic("Ohm's Law (V = IR)")
    } else if (/photo|leaf|chlorophyll/i.test(trimmed)) {
      setTutorMemoryTopic('Photosynthesis')
    } else if (/acid|base|ph/i.test(trimmed)) {
      setTutorMemoryTopic('Acids & bases')
    }

    try {
      const { data } = await sendTutorMessage(nextHistory, trimmed)
      setStreamKey((k) => k + 1)
      setStreamingText(data.answer)
      setActiveMeta({
        recommendations: data.recommendations,
        diagramType: data.diagramType,
      })
    } catch {
      setBusy(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Hmm — the tutor stub glitched. Take a breath and tap Send again in a moment.',
        },
      ])
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] flex-col gap-6 lg:min-h-[calc(100dvh-8rem)]">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-900/10">
          🎙️ Voice Conversational Tutor
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 lg:text-4xl">
              Talk through doubts — like chatting with a calm tutor.
            </h1>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-emerald-950/70">
              This demo mocks voice input and streams replies so it feels alive — swap in Web Speech API + SSE later.
            </p>
          </div>

          <div className="rounded-3xl bg-white/75 px-4 py-3 ring-1 ring-emerald-900/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
              <Brain className="h-4 w-4" aria-hidden />
              Context memory (mock)
            </div>
            <div className="mt-1 text-sm font-semibold text-emerald-950">
              Remembering:{' '}
              <span className="font-extrabold text-emerald-800">{memoryHint}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-12">
        <aside className="hidden rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:col-span-4 lg:block">
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-950">
            <Youtube className="h-4 w-4 text-emerald-700" aria-hidden />
            Suggested videos
          </div>
          <ul className="mt-4 space-y-2">
            {suggestedVideos.map((v) => (
              <li
                key={v}
                className="rounded-2xl bg-white/85 px-4 py-3 text-sm font-semibold text-emerald-950/80 ring-1 ring-emerald-900/10"
              >
                {v}
              </li>
            ))}
          </ul>

          <div className="mt-8 text-sm font-extrabold text-emerald-950">
            Related topics
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTopics.map((t) => (
              <button
                key={t}
                type="button"
                className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-900 ring-1 ring-emerald-900/10 hover:bg-emerald-100"
                onClick={() => setDraft(`Explain ${t} simply with one example.`)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-4 ring-1 ring-emerald-900/10">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-700" aria-hidden />
              Friendly tip
            </div>
            <p className="mt-2 text-sm leading-relaxed text-emerald-950/70">
              Ask “why” twice — it helps the tutor tighten explanations without dumping textbook walls.
            </p>
          </div>
        </aside>

        <section className="flex min-h-[520px] flex-col rounded-3xl bg-white/75 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:col-span-8 lg:min-h-[640px]">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:p-6">
            {messages.map((m, idx) => (
              <ChatBubble key={`${idx}-${m.role}`} role={m.role}>
                <span className="whitespace-pre-wrap">
                  {m.role === 'assistant'
                    ? renderRichText(m.content)
                    : m.content}
                </span>
                {m.role === 'assistant' && m.diagramType === 'ohms-law' ? (
                  <OhmsLawDiagram />
                ) : null}
                {m.role === 'assistant' && m.recommendations?.length ? (
                  <RecommendationList items={m.recommendations} />
                ) : null}
              </ChatBubble>
            ))}

            {busy && streamingText ? (
              <ChatBubble role="assistant">
                <StreamingAnswer
                  key={streamKey}
                  text={streamingText}
                  onComplete={handleStreamComplete}
                />
                {activeMeta?.diagramType === 'ohms-law' ? <OhmsLawDiagram /> : null}
                {activeMeta?.recommendations?.length ? (
                  <RecommendationList items={activeMeta.recommendations} />
                ) : null}
              </ChatBubble>
            ) : null}

            {busy && !streamingText ? (
              <div className="px-2">
                <TypingIndicator />
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-emerald-900/10 bg-white/75 p-4 lg:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="flex-1">
                <InputField
                  id="chat"
                  label={undefined}
                  hint={undefined}
                  value={draft}
                  onChange={(e) => {
                    if (demoVoiceIntervalRef.current) {
                      clearInterval(demoVoiceIntervalRef.current)
                      demoVoiceIntervalRef.current = null
                    }
                    setDraft(e.target.value)
                  }}
                  placeholder={
                    listening
                      ? 'Demo: mock transcript will type into this box…'
                      : 'Type a question… (try “Explain Ohm’s Law simply”)'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send(draft)
                    }
                  }}
                  inputClassName={[
                    'lg:py-3.5',
                    listening ? 'border-emerald-400/40 ring-2 ring-emerald-400/25' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              </div>

              <div className="flex gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setListening((v) => !v)}
                  className={[
                    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold ring-1 transition-colors',
                    listening
                      ? 'bg-emerald-600 text-white ring-emerald-700/25 shadow-[var(--shadow-soft)]'
                      : 'bg-white text-emerald-950 ring-emerald-900/10 hover:bg-emerald-50',
                  ].join(' ')}
                  aria-pressed={listening}
                  title="Voice input (mock)"
                >
                  <Mic className="h-5 w-5" aria-hidden />
                  <span>{listening ? 'Listening…' : 'Voice'}</span>
                </motion.button>

                <Button type="button" disabled={busy} onClick={() => send(draft)}>
                  Send
                </Button>
              </div>
            </div>

            {listening ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50/90 px-4 py-3 ring-1 ring-emerald-900/10"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-extrabold text-emerald-950">
                      Microphone is on
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-emerald-950/75">
                      Demo mode: the bar above fills with sample speech-to-text so reviewers can see
                      the flow without Web Speech API.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
