import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Microscope,
  Play,
  Plus,
  Sparkles,
  Upload,
  Wand2,
  Youtube,
} from 'lucide-react'
import { DropZone } from '../components/ocr/DropZone.jsx'
import { MindMapPlaceholder } from '../components/ocr/MindMapPlaceholder.jsx'
import { Loader } from '../components/common/Loader.jsx'
import { ProgressBar } from '../components/common/ProgressBar.jsx'
import {
  generateStudySynthesis,
  synthesizeHandwritten,
  verifySyllabusNotes,
} from '../services/aiService.js'
import {
  fetchNoEmbedVideoMeta,
  getYouTubeApiKey,
  searchYouTubeVideos,
} from '../services/youtubeClient.js'
import { VERIFY_TAG_YOUTUBE_CONFIG } from '../data/verifyTagYoutubeConfig.js'
import { renderRichText } from '../utils/richText.jsx'

const MAIN_TABS = [
  { id: 'verify', label: 'Verify Notes' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'synthesis', label: 'Synthesis' },
]

/** Demo content for Verify Notes → Ohm's Law notes (aligned with AR lab + quiz). */
const DEMO_CORRECTED_BULLETS = [
  'Ohm’s law is usually written as V = I R for a conductor at constant temperature.',
  'The ohm (Ω) is the SI unit of resistance.',
  'Current is measured in amperes (A).',
  'In series, equivalent resistance is the sum of individual resistances.',
  'Electrical power can be written as P = V I or P = I² R.',
  'For two equal resistors in parallel, equivalent resistance is R / 2.',
]

const DEMO_REMOVED_LINES = [
  'Ohm’s law is V = I / R for all materials.',
  'Resistance is measured in volts.',
  'In parallel, currents always stay equal in every branch.',
]

const DEMO_AI_CORRECTIONS = [
  '**Ohm’s law:** use **V = I R** (not V = I/R) for the standard proportional form taught at OL.',
  '**Resistance:** measured in **ohms (Ω)**, not volts.',
  '**Parallel branches:** share the same **voltage**; branch **currents** differ unless resistors are identical.',
]

const DEMO_VERIFICATION_ITEMS = [
  {
    ok: true,
    statement: 'For many metallic conductors at fixed temperature, V is proportional to I (Ohm’s law).',
    rationale: 'Matches syllabus wording linking potential difference, current, and resistance.',
    tag: 'SYLLABUS',
  },
  {
    ok: false,
    statement: 'Resistance is measured in volts.',
    rationale: 'Volts measure potential difference; resistance uses ohms (Ω).',
    tag: 'REVIEW',
  },
  {
    ok: true,
    statement: 'In series, R_total equals the sum of the separate resistances.',
    rationale: 'Single-path current — resistances add.',
    tag: 'SYLLABUS',
  },
]

function summaryFromApiDescription(desc, index) {
  const t = (desc || '').replace(/\s+/g, ' ').trim()
  if (!t) return `Clip ${index + 1}: open on YouTube to read the full description and transcript.`
  return t.length > 480 ? `${t.slice(0, 477)}…` : t
}

function VerifyVideoThumb({ thumbnailUrl, title }) {
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    setImgOk(true)
  }, [thumbnailUrl])

  return (
    <div className="relative aspect-video overflow-hidden bg-slate-900">
      {thumbnailUrl && imgOk ? (
        <img
          src={thumbnailUrl}
          alt=""
          width={640}
          height={360}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgOk(false)}
        />
      ) : null}
      <div
        className={[
          'pointer-events-none absolute inset-0',
          thumbnailUrl && imgOk
            ? 'bg-gradient-to-t from-black/55 via-black/15 to-black/25'
            : 'bg-gradient-to-br from-slate-800 via-emerald-900 to-teal-950',
        ].join(' ')}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/35 ring-2 ring-white/35 backdrop-blur-[1px]">
          <Play
            className="h-6 w-6 translate-x-0.5 text-white drop-shadow-md"
            fill="currentColor"
            aria-hidden
          />
        </span>
      </div>
      <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/95 ring-1 ring-white/10">
        YouTube
      </span>
      <span className="sr-only">Video thumbnail for {title}</span>
    </div>
  )
}

const LANGS = ['English', 'Sinhala', 'Tamil']

const pillBase =
  'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800/70">
      {children}
    </p>
  )
}

function UnderlineTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-6 border-b border-emerald-900/15">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={[
            '-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors',
            active === t.id
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-emerald-950/50 hover:text-emerald-950',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function KnowledgeSynthesis() {
  const [mainTab, setMainTab] = useState('verify')

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [extractPhase, setExtractPhase] = useState('idle')
  const [ocrOutput, setOcrOutput] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [verifyLang, setVerifyLang] = useState('English')
  const [verifySubTab, setVerifySubTab] = useState('verification')
  const [verifyPhase, setVerifyPhase] = useState('idle')
  const [verifyResult, setVerifyResult] = useState(null)
  const [correctedNoteReady, setCorrectedNoteReady] = useState(false)
  /** @type {{ id: string; title: string; summary: string; watchUrl?: string } | null} */
  const [verifyVideoSummary, setVerifyVideoSummary] = useState(null)
  const verifyRelatedVideosRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [activeVerifyTagId, setActiveVerifyTagId] = useState(VERIFY_TAG_YOUTUBE_CONFIG[0]?.id ?? 'ohm')
  /** @type {Record<string, { status: 'idle' | 'loading' | 'error' | 'done'; items: Array<{ videoId: string; title: string; channelTitle: string; thumbnailUrl: string; summary: string }>; error?: string }>} */
  const [verifyTagVideos, setVerifyTagVideos] = useState({})
  const [verifyYtNonce, setVerifyYtNonce] = useState(0)

  const verifyTagVideosRef = useRef(verifyTagVideos)
  verifyTagVideosRef.current = verifyTagVideos

  const resetVerifyYoutubeBlock = useCallback(() => {
    setVerifyTagVideos({})
    setVerifyVideoSummary(null)
    setVerifyYtNonce(0)
    setActiveVerifyTagId(VERIFY_TAG_YOUTUBE_CONFIG[0]?.id ?? 'ohm')
  }, [])

  const [ytUrl, setYtUrl] = useState('')
  const [ytTopic, setYtTopic] = useState('')
  const [ytBusy, setYtBusy] = useState(null)

  const [synthText, setSynthText] = useState('')
  const [synthLang, setSynthLang] = useState('English')
  const [synthSubTab, setSynthSubTab] = useState('flashcards')
  const [synthPhase, setSynthPhase] = useState('idle')
  const [synthData, setSynthData] = useState(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onFileChosen = useCallback((file) => {
    setSelectedFile(file)
    setOcrOutput(null)
    setExtractPhase('idle')
    setVerifyResult(null)
    setVerifyPhase('idle')
    setCorrectedNoteReady(false)
    resetVerifyYoutubeBlock()
    setExtractedText('')
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }, [resetVerifyYoutubeBlock])

  const clearVerify = useCallback(() => {
    setSelectedFile(null)
    setOcrOutput(null)
    setExtractPhase('idle')
    setExtractedText('')
    setVerifyResult(null)
    setVerifyPhase('idle')
    setCorrectedNoteReady(false)
    resetVerifyYoutubeBlock()
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [resetVerifyYoutubeBlock])

  useEffect(() => {
    if (!correctedNoteReady) return

    const tagId = activeVerifyTagId
    const tagCfg = VERIFY_TAG_YOUTUBE_CONFIG.find((t) => t.id === tagId)
    if (!tagCfg) return

    const snap = verifyTagVideosRef.current[tagId]
    if (snap?.status === 'done' && snap.items.length > 0) return

    let cancelled = false

    setVerifyTagVideos((prev) => ({
      ...prev,
      [tagId]: { status: 'loading', items: [] },
    }))

    ;(async () => {
      try {
        let items = []
        const hasKey = Boolean(getYouTubeApiKey())
        if (hasKey) {
          try {
            const raw = await searchYouTubeVideos(tagCfg.searchQuery, 6)
            items = (raw ?? []).map((v, i) => ({
              videoId: v.videoId,
              title: v.title,
              channelTitle: v.channelTitle,
              thumbnailUrl: v.thumbnailUrl,
              summary: summaryFromApiDescription(v.description, i),
            }))
          } catch {
            items = []
          }
        }
        if (!cancelled && items.length === 0) {
          const pairs = tagCfg.fallbackVideoIds.map((id, i) => ({
            id,
            sum: tagCfg.fallbackSummaries[i] ?? tagCfg.fallbackSummaries[0] ?? '',
          }))
          const metas = await Promise.all(
            pairs.map(async ({ id, sum }) => {
              try {
                const m = await fetchNoEmbedVideoMeta(id)
                return {
                  videoId: m.videoId,
                  title: m.title,
                  channelTitle: m.channelTitle,
                  thumbnailUrl: m.thumbnailUrl,
                  summary: sum,
                }
              } catch {
                return {
                  videoId: id,
                  title: 'YouTube clip',
                  channelTitle: 'YouTube',
                  thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                  summary: sum,
                }
              }
            }),
          )
          items = metas
        }
        if (cancelled) return
        setVerifyTagVideos((prev) => ({
          ...prev,
          [tagId]: { status: 'done', items },
        }))
      } catch (e) {
        if (cancelled) return
        setVerifyTagVideos((prev) => ({
          ...prev,
          [tagId]: {
            status: 'error',
            items: [],
            error: e instanceof Error ? e.message : 'Could not load videos',
          },
        }))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [correctedNoteReady, activeVerifyTagId, verifyYtNonce])

  async function runExtract() {
    if (!selectedFile) return
    setExtractPhase('processing')
    setVerifyResult(null)
    setVerifyPhase('idle')
    setCorrectedNoteReady(false)
    resetVerifyYoutubeBlock()
    const { data } = await synthesizeHandwritten(selectedFile.name)
    setOcrOutput(data)
    setExtractedText(data.extracted_text)
    setExtractPhase('done')
  }

  async function runVerify() {
    const text = extractedText.trim()
    if (!text) return
    setVerifyPhase('loading')
    setVerifySubTab('verification')
    setCorrectedNoteReady(false)
    resetVerifyYoutubeBlock()
    const { data } = await verifySyllabusNotes({
      text,
      errors: ocrOutput?.errors,
      corrections: ocrOutput?.corrections,
    })
    setVerifyResult(data)
    setVerifyPhase('done')
  }

  function generateCorrectedNote() {
    setCorrectedNoteReady(true)
    setVerifySubTab('corrected')
  }

  function downloadCorrectedNote() {
    const body = [
      'CORRECTED NOTE',
      '',
      ...DEMO_CORRECTED_BULLETS.map((line, i) => `• ${line}`),
      '',
      `REMOVED (${DEMO_REMOVED_LINES.length} incorrect / incomplete)`,
      '',
      ...DEMO_REMOVED_LINES.map((line) => `– ${line}`),
    ].join('\n')
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'corrected-note.txt'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function runYoutube(mode) {
    setYtBusy(mode)
    await new Promise((r) => setTimeout(r, 900))
    setYtBusy(null)
  }

  async function runSynthesis() {
    if (!synthText.trim()) return
    setSynthPhase('processing')
    const { data } = await generateStudySynthesis(synthText)
    setSynthData(data)
    setSynthPhase('done')
  }

  const verificationPayload = verifyResult ?? {
    correct: DEMO_VERIFICATION_ITEMS.filter((i) => i.ok).length,
    total: DEMO_VERIFICATION_ITEMS.length,
    items: DEMO_VERIFICATION_ITEMS,
  }
  const pctVerified = verificationPayload.total
    ? Math.round((verificationPayload.correct / verificationPayload.total) * 100)
    : 0

  const correctionLines =
    ocrOutput?.corrections?.length > 0
      ? ocrOutput.corrections
      : verifyResult?.correctionBullets?.length > 0
        ? verifyResult.correctionBullets
        : DEMO_AI_CORRECTIONS

  return (
    <div className="space-y-8 pb-6">
      <header className="flex flex-col gap-4 border-b border-emerald-900/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-emerald-600 ring-2 ring-emerald-200"
            aria-hidden
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 lg:text-3xl">
              Science study assistant
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-emerald-950/70">
              Sri Lanka Grades 10–11 · answers from your syllabus PDFs only
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/25">
          Index ready · Ollama chat
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {MAIN_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMainTab(t.id)}
            className={[
              pillBase,
              mainTab === t.id
                ? 'bg-emerald-600 text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25'
                : 'bg-white/90 text-emerald-900 ring-1 ring-emerald-900/10 hover:bg-emerald-50',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mainTab === 'verify' ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid gap-6 lg:grid-cols-2 lg:items-start"
          >
            <div className="space-y-6 rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8">
              <div className="space-y-3">
                <SectionLabel>1. Upload handwritten note</SectionLabel>
                <DropZone onFileChosen={onFileChosen} theme="stem" />
              </div>

              {previewUrl ? (
                <div className="overflow-hidden rounded-2xl ring-1 ring-emerald-900/10">
                  <img
                    src={previewUrl}
                    alt="Note preview"
                    className="max-h-52 w-full object-contain bg-emerald-50/50"
                  />
                </div>
              ) : null}

              <div className="space-y-3">
                <SectionLabel>2. Extracted text</SectionLabel>
                <div className="relative">
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    rows={10}
                    placeholder="OCR output appears here after upload & extract — or paste your own note text."
                    className="w-full resize-y rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-sm leading-relaxed text-emerald-950 shadow-inner shadow-emerald-900/5 placeholder:text-emerald-950/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                  <span
                    className="absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"
                    title="Mock status"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <label className="flex flex-1 flex-col gap-2">
                  <SectionLabel>Language</SectionLabel>
                  <select
                    value={verifyLang}
                    onChange={(e) => setVerifyLang(e.target.value)}
                    className="rounded-2xl border border-emerald-900/10 bg-white/90 px-3 py-2.5 text-sm text-emerald-950 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  >
                    {LANGS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!selectedFile || extractPhase === 'processing'}
                  onClick={runExtract}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 transition hover:bg-[#2ECC71] disabled:pointer-events-none disabled:opacity-40"
                >
                  {extractPhase === 'processing' ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Upload className="h-4 w-4" aria-hidden />
                  )}
                  Upload &amp; Extract Text
                </button>
                <button
                  type="button"
                  disabled={!extractedText.trim() || verifyPhase === 'loading'}
                  onClick={runVerify}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-600 bg-white/90 px-4 py-2.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-900/10 transition hover:bg-emerald-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  {verifyPhase === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Check className="h-4 w-4" aria-hidden />
                  )}
                  Verify Content
                </button>
                <button
                  type="button"
                  onClick={clearVerify}
                  className="ml-auto rounded-2xl border border-emerald-900/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-emerald-950/70 hover:bg-emerald-50/80"
                >
                  Clear
                </button>
              </div>

              {extractPhase === 'processing' ? (
                <Loader label="Reading handwriting & aligning symbols…" />
              ) : null}
            </div>

            <div className="flex flex-col space-y-4 rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:min-h-[560px] lg:p-8">
              <UnderlineTabs
                tabs={[
                  { id: 'verification', label: 'Verification' },
                  { id: 'corrections', label: 'AI Corrections' },
                  { id: 'corrected', label: 'Corrected Note' },
                ]}
                active={verifySubTab}
                onChange={setVerifySubTab}
              />

              <button
                type="button"
                onClick={generateCorrectedNote}
                className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-emerald-600/30 bg-white/90 px-4 py-2.5 text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/10 transition hover:bg-emerald-50 sm:w-auto"
              >
                <Plus className="h-4 w-4 text-emerald-600" aria-hidden />
                Generate Corrected Note
              </button>

              {verifyPhase === 'loading' ? (
                <Loader label="Cross-checking with syllabus index…" />
              ) : null}

              {verifySubTab === 'verification' ? (
                <div className="space-y-4 pt-2">
                  {!verifyResult ? (
                    <p className="rounded-xl bg-amber-50/80 px-3 py-2 text-xs font-medium text-amber-950/90 ring-1 ring-amber-200/80">
                      Demo preview — run Verify Content to replace with a fresh syllabus check.
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-emerald-950">
                      {verificationPayload.correct} / {verificationPayload.total} correct
                    </span>
                    <span className="font-extrabold text-emerald-700">{pctVerified}%</span>
                  </div>
                  <ProgressBar value={pctVerified} max={100} />
                  <ul className="max-h-[min(60vh,520px)] space-y-3 overflow-y-auto pr-1">
                    {verificationPayload.items.map((item, idx) => (
                      <li
                        key={`${item.statement}-${idx}`}
                        className="relative rounded-2xl border border-emerald-900/10 bg-white/90 py-4 pl-5 pr-4 ring-1 ring-emerald-950/5"
                      >
                        <span
                          className="absolute top-3 bottom-3 left-0 w-1 rounded-full bg-emerald-500"
                          aria-hidden
                        />
                        <div className="flex gap-2 pl-2">
                          {item.ok ? (
                            <CheckCircle2
                              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                              aria-hidden
                            />
                          ) : (
                            <span
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400 bg-amber-50 text-xs font-bold text-amber-700"
                              aria-hidden
                            >
                              !
                            </span>
                          )}
                          <div>
                            <p className="font-bold text-emerald-950">{item.statement}</p>
                            <p className="mt-2 text-sm leading-relaxed text-emerald-950/70">
                              {item.rationale}
                            </p>
                          </div>
                        </div>
                        <span className="mt-3 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-600/20">
                          {item.tag ?? 'SYLLABUS'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {verifySubTab === 'corrections' ? (
                <div className="space-y-3 pt-2">
                  {!ocrOutput?.corrections?.length && !verifyResult?.correctionBullets?.length ? (
                    <p className="rounded-xl bg-amber-50/80 px-3 py-2 text-xs font-medium text-amber-950/90 ring-1 ring-amber-200/80">
                      Demo corrections — extract or verify to show pipeline output here.
                    </p>
                  ) : null}
                  <ul className="max-h-[min(60vh,520px)] space-y-3 overflow-y-auto">
                    {correctionLines.map((c) => (
                      <li
                        key={c}
                        className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-emerald-950 ring-1 ring-emerald-900/10"
                      >
                        {renderRichText(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {verifySubTab === 'corrected' ? (
                <div className="space-y-5 pt-2">
                  {!correctedNoteReady ? (
                    <p className="py-10 text-center text-sm text-emerald-950/60">
                      Click <span className="font-semibold text-emerald-800">Generate Corrected Note</span>{' '}
                      above to build the cleaned syllabus-style note (demo data).
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-950/70">
                          Corrected note
                        </p>
                        <button
                          type="button"
                          onClick={downloadCorrectedNote}
                          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-emerald-800/30 transition hover:bg-emerald-600"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden />
                          Download
                        </button>
                      </div>
                      <div className="rounded-2xl border border-amber-300/80 bg-amber-100/95 p-5 shadow-inner shadow-amber-900/5 ring-1 ring-amber-200/60">
                        <p className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-amber-950">
                          <span className="text-amber-600" aria-hidden>
                            ✦
                          </span>
                          CORRECTED NOTE
                        </p>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-medium leading-relaxed text-amber-950">
                          {DEMO_CORRECTED_BULLETS.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-950/55">
                          Removed ({DEMO_REMOVED_LINES.length} incorrect / incomplete)
                        </p>
                        <ul className="mt-2 space-y-2 rounded-xl bg-emerald-950/[0.04] px-4 py-3 ring-1 ring-emerald-900/10">
                          {DEMO_REMOVED_LINES.map((line) => (
                            <li
                              key={line}
                              className="text-sm text-emerald-950/55 line-through decoration-emerald-950/40"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-5 border-t border-emerald-900/10 pt-6">
                        <div>
                          <SectionLabel>Related topics</SectionLabel>
                          <p className="mt-1 text-xs leading-relaxed text-emerald-950/60">
                            Pick a tag to load matching clips. With{' '}
                            <code className="rounded bg-emerald-100/80 px-1 py-0.5 text-[10px]">
                              VITE_YOUTUBE_API_KEY
                            </code>{' '}
                            set, results come from YouTube search; otherwise curated IDs load via
                            thumbnails and short summaries.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {VERIFY_TAG_YOUTUBE_CONFIG.map((t) => {
                              const isActive = t.id === activeVerifyTagId
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setActiveVerifyTagId(t.id)}
                                  className={[
                                    'rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                                    isActive
                                      ? 'bg-teal-600 text-white shadow-sm ring-teal-700'
                                      : 'bg-teal-50 text-teal-900 ring-teal-600/25 hover:bg-teal-100',
                                  ].join(' ')}
                                >
                                  {t.label}
                                </button>
                              )
                            })}
                          </div>
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-900/15 bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white shadow-md ring-1 ring-emerald-900/40 transition hover:bg-emerald-900"
                            onClick={() => {
                              verifyRelatedVideosRef.current?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              })
                              setVerifyTagVideos((prev) => {
                                const next = { ...prev }
                                delete next[activeVerifyTagId]
                                return next
                              })
                              setVerifyYtNonce((n) => n + 1)
                            }}
                          >
                            <Youtube className="h-4 w-4 shrink-0 text-red-400" aria-hidden />
                            Find Videos
                          </button>
                        </div>

                        <div ref={verifyRelatedVideosRef} className="scroll-mt-4 space-y-4">
                          <h3
                            className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-800"
                            id="verify-related-videos-heading"
                          >
                            {VERIFY_TAG_YOUTUBE_CONFIG.find((t) => t.id === activeVerifyTagId)
                              ?.label ?? 'Videos'}
                          </h3>
                          {(() => {
                            const st = verifyTagVideos[activeVerifyTagId]
                            if (!st || st.status === 'loading') {
                              return (
                                <div className="flex items-center gap-2 py-10 text-sm text-emerald-950/60">
                                  <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                                  Loading videos…
                                </div>
                              )
                            }
                            if (st.status === 'error') {
                              return (
                                <p className="rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-900">
                                  {st.error ?? 'Could not load videos.'}
                                </p>
                              )
                            }
                            if (!st.items.length) {
                              return (
                                <p className="text-sm text-emerald-950/55">No videos found.</p>
                              )
                            }
                            return (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {st.items.map((v) => (
                                  <article
                                    key={v.videoId}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white/95 ring-1 ring-emerald-950/5"
                                  >
                                    <VerifyVideoThumb
                                      thumbnailUrl={v.thumbnailUrl}
                                      title={v.title}
                                    />
                                    <div className="flex flex-1 flex-col gap-2 p-3">
                                      <h4 className="text-sm font-bold leading-snug text-emerald-950">
                                        {v.title}
                                      </h4>
                                      <p className="text-[11px] font-medium text-emerald-950/55">
                                        {v.channelTitle}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setVerifyVideoSummary({
                                            id: v.videoId,
                                            title: v.title,
                                            summary: v.summary,
                                            watchUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(v.videoId)}`,
                                          })
                                        }
                                        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-3 py-2 text-xs font-bold text-white ring-1 ring-emerald-900/50 transition hover:bg-emerald-900"
                                      >
                                        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        Summarize
                                      </button>
                                    </div>
                                  </article>
                                ))}
                              </div>
                            )
                          })()}
                        </div>

                        <AnimatePresence mode="wait">
                          {verifyVideoSummary ? (
                            <motion.div
                              key={verifyVideoSummary.id}
                              role="region"
                              aria-label="Video summary"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.22 }}
                              className="rounded-2xl border-2 border-teal-500/70 bg-teal-50/40 p-4 ring-1 ring-teal-600/20 sm:p-5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-[10px] font-extrabold uppercase leading-snug tracking-[0.12em] text-emerald-950 sm:text-[11px]">
                                  {verifyVideoSummary.title}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setVerifyVideoSummary(null)}
                                  className="shrink-0 rounded-lg border border-emerald-900/15 bg-white/90 px-2 py-1 text-[10px] font-bold text-emerald-900 ring-1 ring-emerald-900/10 hover:bg-emerald-50"
                                >
                                  Close
                                </button>
                              </div>
                              <p className="mt-3 text-sm leading-relaxed text-emerald-950/90">
                                {verifyVideoSummary.summary}
                              </p>
                              {verifyVideoSummary.watchUrl ? (
                                <a
                                  href={verifyVideoSummary.watchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 underline decoration-teal-600/40 underline-offset-2 hover:text-teal-950"
                                >
                                  Open on YouTube
                                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                </a>
                              ) : null}
                              <p className="mt-2 text-[10px] font-medium text-emerald-950/45">
                                Summary text is from the search snippet or a short revision note when
                                no API key is configured — replace with transcript + LLM when wired.
                              </p>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              <div className="mt-auto hidden rounded-2xl bg-emerald-50/80 p-4 text-xs leading-relaxed text-emerald-950/75 ring-1 ring-emerald-900/10 lg:block">
                <Microscope className="mb-2 h-5 w-5 text-emerald-600" aria-hidden />
                Upload a note image or paste text, then click Verify Content to check it against the
                syllabus.
              </div>
            </div>
          </motion.div>
        ) : null}

        {mainTab === 'youtube' ? (
          <motion.section
            key="yt"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6 rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8"
          >
            <div className="space-y-3">
              <SectionLabel>YouTube lecture URL</SectionLabel>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="min-w-0 flex-1 rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-950/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <select
                  className="rounded-2xl border border-emerald-900/10 bg-white/90 px-3 py-3 text-sm text-emerald-950 sm:w-40"
                  aria-label="Language"
                >
                  {LANGS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => runYoutube('url')}
                  disabled={ytBusy !== null}
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 hover:bg-[#2ECC71] disabled:opacity-50"
                >
                  {ytBusy === 'url' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Go'
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <SectionLabel>Find videos by topic</SectionLabel>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={ytTopic}
                  onChange={(e) => setYtTopic(e.target.value)}
                  placeholder="e.g. photosynthesis Grade 10"
                  className="min-w-0 flex-1 rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-950/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <button
                  type="button"
                  onClick={() => runYoutube('topic')}
                  disabled={ytBusy !== null}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-900/10 bg-white/90 px-5 py-3 text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/10 hover:bg-emerald-50 disabled:opacity-50"
                >
                  {ytBusy === 'topic' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" aria-hidden />
                      Find Videos
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-emerald-950/55">
              Frontend mock — wire to your search or transcript API.
            </p>
          </motion.section>
        ) : null}

        {mainTab === 'synthesis' ? (
          <motion.section
            key="synth"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6 rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8"
          >
            <div className="space-y-2">
              <SectionLabel>Text to synthesise</SectionLabel>
              <p className="text-sm text-emerald-950/65">
                Paste notes or verified text here, then choose a synthesis mode below.
              </p>
            </div>
            <textarea
              value={synthText}
              onChange={(e) => setSynthText(e.target.value)}
              rows={8}
              placeholder="Paste your notes or extracted text here…"
              className="w-full resize-y rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-sm leading-relaxed text-emerald-950 placeholder:text-emerald-950/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-2">
                <SectionLabel>Language</SectionLabel>
                <select
                  value={synthLang}
                  onChange={(e) => setSynthLang(e.target.value)}
                  className="rounded-2xl border border-emerald-900/10 bg-white/90 px-3 py-2.5 text-sm text-emerald-950 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                >
                  {LANGS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={!synthText.trim() || synthPhase === 'processing'}
                onClick={runSynthesis}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 transition hover:bg-[#2ECC71] disabled:pointer-events-none disabled:opacity-40"
              >
                {synthPhase === 'processing' ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Wand2 className="h-4 w-4" aria-hidden />
                )}
                Generate All
              </button>
            </div>

            <UnderlineTabs
              tabs={[
                { id: 'flashcards', label: 'Flashcards' },
                { id: 'mindmap', label: 'Mind Map' },
                { id: 'notes', label: 'Structured Notes' },
              ]}
              active={synthSubTab}
              onChange={setSynthSubTab}
            />

            {synthPhase === 'processing' ? (
              <Loader label="Building flashcards, map, and notes…" />
            ) : null}

            <div className="min-h-[200px]">
              {synthData && synthPhase === 'done' ? (
                <>
                  {synthSubTab === 'flashcards' ? (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {synthData.flashcards.map((fc, i) => (
                        <li
                          key={i}
                          className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 ring-1 ring-emerald-900/10"
                        >
                          <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                            Front
                          </p>
                          <p className="mt-1 text-sm font-bold text-emerald-950">{fc.front}</p>
                          <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-emerald-950/55">
                            Back
                          </p>
                          <p className="mt-1 text-sm font-semibold text-emerald-950/80">{fc.back}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {synthSubTab === 'mindmap' ? (
                    <MindMapPlaceholder active={synthData.mindmap} theme="stem" />
                  ) : null}
                  {synthSubTab === 'notes' ? (
                    <pre className="whitespace-pre-wrap rounded-2xl border border-emerald-900/10 bg-emerald-50/40 p-4 text-sm leading-relaxed text-emerald-950 ring-1 ring-emerald-900/10">
                      {synthData.structuredNotes}
                    </pre>
                  ) : null}
                </>
              ) : (
                <p className="py-16 text-center text-sm text-emerald-950/60">
                  {synthSubTab === 'flashcards'
                    ? 'Generate flashcards to start studying.'
                    : synthSubTab === 'mindmap'
                      ? 'Generate a mind map from your pasted text.'
                      : 'Generate structured notes for revision.'}
                </p>
              )}
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
