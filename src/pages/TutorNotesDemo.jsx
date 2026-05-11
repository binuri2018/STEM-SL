import { Link } from 'react-router-dom'
import { ArrowLeft, BookMarked } from 'lucide-react'
import { ROUTES } from '../utils/routes.js'

export default function TutorNotesDemo() {
  return (
    <div className="space-y-8 pb-10">
      <Link
        to={ROUTES.tutor}
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Voice Tutor
      </Link>

      <header className="rounded-3xl bg-white/75 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-900/10">
          <BookMarked className="h-4 w-4 text-emerald-700" aria-hidden />
          Demo OL notes
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 lg:text-4xl">
          Units &amp; symbols — Electricity (quick sheet)
        </h1>
        <p className="mt-2 max-w-2xl text-emerald-950/70">
          Static demo page linked from tutor recommendations. Replace with CMS or PDF from your NIE
          bundle when wiring production content.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white/75 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8">
          <h2 className="text-lg font-extrabold text-emerald-950">SI quantities</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-emerald-950/85">
            <li>
              <strong className="text-emerald-950">Voltage (V)</strong> — joules per coulomb; voltmeter in{' '}
              <em>parallel</em>.
            </li>
            <li>
              <strong className="text-emerald-950">Current (I)</strong> — amperes (A); ammeter in <em>series</em>.
            </li>
            <li>
              <strong className="text-emerald-950">Resistance (R)</strong> — ohms (Ω); Ohm&apos;s Law:{' '}
              <strong>V = I × R</strong>.
            </li>
            <li>
              <strong className="text-emerald-950">Power (P)</strong> — watts (W); <strong>P = V × I</strong>.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl bg-white/75 p-6 ring-1 ring-emerald-900/10 backdrop-blur-sm lg:p-8">
          <h2 className="text-lg font-extrabold text-emerald-950">Exam checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-emerald-950/85">
            <li>State the law before substituting numbers.</li>
            <li>Carry SI units through every line.</li>
            <li>Sketch a minimal circuit when the question says “show”.</li>
            <li>One sentence interpreting the numerical answer.</li>
          </ol>
        </section>
      </div>
    </div>
  )
}
