import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Mic, Sparkles, Youtube } from 'lucide-react'
import { Button } from '../components/common/Button.jsx'
import { ChatBubble } from '../components/common/ChatBubble.jsx'
import { InputField } from '../components/common/InputField.jsx'
import { RecommendationList } from '../components/chat/RecommendationList.jsx'
import { TypingIndicator } from '../components/chat/TypingIndicator.jsx'
import { StreamingAnswer } from '../components/chat/StreamingAnswer.jsx'
import { sendTutorMessage } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'
import { renderRichText } from '../utils/richText.jsx'

const suggestedVideos = [
  'Ohm’s Law — intuition with water analogy',
  'Photosynthesis — inputs & outputs in 6 minutes',
  'Acids & bases — kitchen examples (Eng/Sinhala mix)',
]

const relatedTopics = ['Series circuits', 'pH & indicators', 'Newton’s laws']

export default function VoiceTutor() {
  const { tutorMemoryTopic, setTutorMemoryTopic } = useApp()
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      content:
        'Hi! Ask me anything from your syllabus — I’ll explain calmly and suggest quick resources.',
    },
  ])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeMeta, setActiveMeta] = useState(null)
  const [streamKey, setStreamKey] = useState(0)
  const bottomRef = useRef(null)

  const metaRef = useRef(null)

  useEffect(() => {
    metaRef.current = activeMeta
  }, [activeMeta])

  const memoryHint = useMemo(() => tutorMemoryTopic, [tutorMemoryTopic])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, busy, streamingText])

  const handleStreamComplete = useCallback((content) => {
    const meta = metaRef.current
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content,
        recommendations: meta?.recommendations,
        diagram: meta?.diagram,
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

    if (/electric|ohm|circuit|battery/i.test(trimmed)) {
      setTutorMemoryTopic('Electricity basics')
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
        diagram: data.diagram,
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
                {m.role === 'assistant' && m.diagram ? (
                  <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 ring-1 ring-emerald-900/10">
                    Diagram suggested — swap with interactive canvas later.
                  </div>
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
                {activeMeta?.diagram ? (
                  <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 ring-1 ring-emerald-900/10">
                    Diagram suggested — swap with interactive canvas later.
                  </div>
                ) : null}
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
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a question… (try “Explain Ohm’s Law simply”)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send(draft)
                    }
                  }}
                  inputClassName="lg:py-3.5"
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
                  <span className="hidden sm:inline">
                    {listening ? 'Listening…' : 'Voice'}
                  </span>
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
                className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-900/10"
              >
                Voice capture is mocked — imagine live transcription appearing here.
              </motion.div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
