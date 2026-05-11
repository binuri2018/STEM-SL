import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  ExternalLink,
  FileQuestion,
  Loader2,
  Microscope,
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
import { renderRichText } from '../utils/richText.jsx'

const MAIN_TABS = [
  { id: 'qa', label: 'Q&A' },
  { id: 'verify', label: 'Verify Notes' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'synthesis', label: 'Synthesis' },
]

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
    setExtractedText('')
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }, [])

  const clearVerify = useCallback(() => {
    setSelectedFile(null)
    setOcrOutput(null)
    setExtractPhase('idle')
    setExtractedText('')
    setVerifyResult(null)
    setVerifyPhase('idle')
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  async function runExtract() {
    if (!selectedFile) return
    setExtractPhase('processing')
    setVerifyResult(null)
    setVerifyPhase('idle')
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
    const { data } = await verifySyllabusNotes({
      text,
      errors: ocrOutput?.errors,
      corrections: ocrOutput?.corrections,
    })
    setVerifyResult(data)
    setVerifyPhase('done')
  }

  function openCorrectedNote() {
    const lines = ocrOutput?.corrections?.length
      ? ocrOutput.corrections
      : verifyResult?.correctionBullets ?? []
    const block = lines.map((l, i) => `${i + 1}. ${l.replace(/\*\*/g, '')}`).join('\n')
    setSynthText(['# Corrected note (draft)', '', block].join('\n'))
    setMainTab('synthesis')
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

  const pctVerified =
    verifyResult && verifyResult.total
      ? Math.round((verifyResult.correct / verifyResult.total) * 100)
      : 0

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
        {mainTab === 'qa' ? (
          <motion.section
            key="qa"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-900/10">
                  <FileQuestion className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-emerald-950">Syllabus Q&A</h2>
                  <p className="mt-1 max-w-lg text-sm text-emerald-950/70">
                    Ask exam-style questions grounded in your indexed PDFs. The full
                    conversational tutor lives under Voice Tutor.
                  </p>
                </div>
              </div>
              <Link
                to="/tutor"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 transition hover:bg-[#2ECC71]"
              >
                Open Voice Tutor
                <ExternalLink className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.section>
        ) : null}

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
                  onClick={openCorrectedNote}
                  disabled={!ocrOutput?.corrections?.length && !verifyResult}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50/90 px-4 py-2.5 text-sm font-bold text-emerald-900 ring-1 ring-emerald-900/15 transition hover:bg-emerald-100 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden />
                  + Corrected Note
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

            <div className="space-y-4 rounded-3xl bg-white/70 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8">
              <div className="hidden lg:flex lg:justify-end">
                <div className="max-w-xs rounded-2xl bg-emerald-50/80 p-4 text-xs leading-relaxed text-emerald-950/75 ring-1 ring-emerald-900/10">
                  <Microscope className="mb-2 h-5 w-5 text-emerald-600" aria-hidden />
                  Upload a note image or paste text, then click Verify Content to check it
                  against the syllabus.
                </div>
              </div>

              <UnderlineTabs
                tabs={[
                  { id: 'verification', label: 'Verification' },
                  { id: 'corrections', label: 'AI Corrections' },
                ]}
                active={verifySubTab}
                onChange={setVerifySubTab}
              />

              {verifyPhase === 'loading' ? (
                <Loader label="Cross-checking with syllabus index…" />
              ) : null}

              {verifySubTab === 'verification' ? (
                <div className="space-y-4 pt-2">
                  {verifyResult ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-emerald-950">
                          {verifyResult.correct} / {verifyResult.total} correct
                        </span>
                        <span className="font-extrabold text-emerald-700">
                          {pctVerified}%
                        </span>
                      </div>
                      <ProgressBar value={pctVerified} max={100} />
                      <ul className="max-h-[min(60vh,520px)] space-y-3 overflow-y-auto pr-1">
                        {verifyResult.items.map((item, idx) => (
                          <li
                            key={`${item.statement}-${idx}`}
                            className="relative rounded-2xl border border-emerald-900/10 bg-white/90 py-4 pl-5 pr-4 ring-1 ring-emerald-950/5"
                          >
                            <span
                              className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-emerald-500"
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
                    </>
                  ) : (
                    <p className="py-12 text-center text-sm text-emerald-950/60">
                      Run Verify Content to see line-by-line syllabus alignment.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {(ocrOutput?.corrections?.length
                    ? ocrOutput.corrections
                    : verifyResult?.correctionBullets ?? []
                  ).length ? (
                    <ul className="max-h-[min(60vh,520px)] space-y-3 overflow-y-auto">
                      {(ocrOutput?.corrections?.length
                        ? ocrOutput.corrections
                        : verifyResult?.correctionBullets ?? []
                      ).map((c) => (
                        <li
                          key={c}
                          className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-emerald-950 ring-1 ring-emerald-900/10"
                        >
                          {renderRichText(c)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-12 text-center text-sm text-emerald-950/60">
                      Extract text first — corrections appear after OCR or verification.
                    </p>
                  )}
                </div>
              )}
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
