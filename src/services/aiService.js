import { ROUTES } from '../utils/routes.js'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

/** @typedef {{ concept: string; explanation: string; story: string; context: string; diagram: string }} NarrativeResponse */

/**
 * @typedef {{
 *   kind: 'youtube';
 *   label: string;
 *   href: string;
 * } | {
 *   kind: 'notes';
 *   label: string;
 *   to: string;
 * } | {
 *   kind: 'practice';
 *   label: string;
 *   to: string;
 * }} TutorRecommendation
 */

/** @typedef {{ answer: string; diagramType?: 'ohms-law' | null; recommendations: TutorRecommendation[] }} ChatResponse */

/** @typedef {{ question: string; hint: string; options?: string[]; correct?: string; kind?: 'mcq' | 'short' }} QuizQuestion */

/** @typedef {{ extracted_text: string; errors: string[]; corrections: string[]; mindmap: boolean }} OcrResponse */

/**
 * Demo story: VR athletics pod + Newton's Third Law (gaming × syllabus).
 */
function buildArunaNewtonStory(concept, studentFocus, aspiration, difficulty) {
  const pace =
    difficulty === 'high'
      ? 'Trace **Action** and **Reaction** on two different bodies — that line alone saves marks.'
      : difficulty === 'low'
        ? 'Read once for the feeling, then once again naming the two forces.'
        : 'Say the law first, then attach one everyday pair you can sketch in thirty seconds.'

  const aspirationLine =
    aspiration === 'athlete'
      ? 'Training reps aren’t noise — each footstrike is a paired force event you can feel.'
      : 'If you can say what pushes what — and in which direction — the equations stop feeling random.'

  const focusLine = studentFocus?.trim()
    ? `You asked to dig into: “${studentFocus.trim()}” — watch how **Action** and **Reaction** never balance each other on the same object; they live on different partners in the pair.`
    : 'Watch how **Action** and **Reaction** never cancel on the same body — they act on different objects in the pair.'

  return [
    `Aruna slips into the matte-black VR pod beside his desk — neon lane markers flicker on as the athletics trial countdown begins. The rig isn’t just a game: it simulates starting blocks, spikes biting the track, and the harsh truth that **${concept}** governs every explosive step. At first he tries to “pull” himself forward, but the avatar stutters until he remembers forces come in pairs.`,
    `${focusLine} In the sim, when he drives his foot **backward** against the block, the block (and the virtual Earth attached to it) shoves him **forward** with the same magnitude — classic **Newton’s Third Law**. The UI even labels the vectors: **Action** on the block, **Reaction** on Aruna — opposite directions, equal sizes.`,
    `On the next rep he stops fighting the floor and uses it: angle, timing, then push. The burst meter climbs; outside the pod, Colombo evening traffic hums, but inside it clicks — same physics as jumping from a boat or sprinting on school gravel. ${aspirationLine} ${pace}`,
  ].join('\n\n')
}

/**
 * Builds a demo Sri Lankan STEM story from persona picks (classifier mock).
 * @param {string} concept
 * @param {{ interest: string; aspiration: string; difficulty: string; studentFocus?: string }} p
 */
function buildPersonaStory(concept, p) {
  const { interest, aspiration, difficulty, studentFocus = '' } = p
  const focusLower = studentFocus.toLowerCase()
  const conceptLower = concept.toLowerCase()
  const wantsNewtonThird =
    (conceptLower.includes('newton') || focusLower.includes('newton')) &&
    (focusLower.includes('3') ||
      focusLower.includes('third') ||
      focusLower.includes('3rd') ||
      conceptLower.includes('third'))

  if (interest === 'gaming' && wantsNewtonThird) {
    return buildArunaNewtonStory(concept, studentFocus, aspiration, difficulty)
  }

  const pace =
    difficulty === 'high'
      ? 'Keep equations tight and link each step to an OL-style “show working” line.'
      : difficulty === 'low'
        ? 'Take it slowly: picture one diagram at a time before moving on.'
        : 'Balance quick recall with one worked example you could paste into an answer.'

  const aspirationHook =
    aspiration === 'athlete'
      ? 'Think like training reps: each formula run is a lap that makes the next one easier.'
      : aspiration === 'doctor'
        ? 'Precision matters — same habit you’d use reading a pulse or a dosage chart.'
        : aspiration === 'engineer'
          ? 'Treat the circuit or reaction like a system you’re commissioning step by step.'
          : aspiration === 'artist'
            ? 'Notice patterns and contrasts — colour in chemistry, rhythm in periodic trends.'
            : aspiration === 'teacher'
              ? 'Explain it aloud once in simple words; that locks memory better than silent reading.'
              : 'Anchor every idea to one observation you’ve actually made this week.'

  if (interest === 'gaming') {
    return `You queue for a quick session after homework — **${concept}** is the “meta” that decides whether your setup runs smooth or tanks mid-match. ${aspirationHook} On screen, voltage and current behave like cool-down timers and resource bars; ${pace} Sri Lanka’s evening power flicker is a reminder that real circuits still follow the same rules as your ranked lobby.`
  }
  if (interest === 'farming') {
    return `In a Sabaragamuwa paddy field, **${concept}** quietly powers the pump that lifts river water into the canal. ${aspirationHook} When the motor hums, energy transforms step-by-step — exactly like the diagrams in your textbook, only now you can feel the breeze off the field while you revise. ${pace}`
  }
  if (interest === 'transport') {
    return `Along the Kandy road, the LED signs at the bus halt glow because **${concept}** behaves predictably in circuits. ${aspirationHook} The driver checks battery terminals before dawn — a small habit that saves hours for passengers rushing to school. ${pace}`
  }
  if (interest === 'music') {
    return `At band practice, someone asks why the amp hums — **${concept}** is hiding in the cables, pickups, and power supply. ${aspirationHook} Treat each paragraph of notes like a bar you loop until it’s clean. ${pace}`
  }
  if (interest === 'technology') {
    return `On your desk, **${concept}** is what keeps the charger cool, the screen bright, and the router honest about throughput. ${aspirationHook} Debug it like a script: isolate variables, measure once, then explain. ${pace}`
  }
  // sports & default
  return `During interval football at school, **${concept}** shows up when you talk about force, motion, and even how your phone battery drains after filming penalties. ${aspirationHook} You already observe it — now connect it to the equation sheet. ${pace}`
}

/**
 * Mock narrative aligned with strict JSON contract.
 * @param {string} topic
 * @param {string | { interest: string; aspiration: string; difficulty?: string }} interestContext
 *   Legacy string keys: farming | transport | sports — or full persona object from Step 1.
 * @returns {Promise<{ data: NarrativeResponse }>}
 */
export async function generateNarrative(topic, interestContext) {
  await delay(900 + Math.random() * 400)
  const concept = topic.trim() || 'Electricity'

  let interest = 'farming'
  let aspiration = 'student'
  let difficulty = 'medium'

  let studentFocus = ''

  if (
    typeof interestContext === 'object' &&
    interestContext !== null &&
    !Array.isArray(interestContext)
  ) {
    interest = interestContext.interest || interest
    aspiration = interestContext.aspiration || aspiration
    difficulty = interestContext.difficulty || difficulty
    studentFocus = interestContext.studentFocus || ''
  } else if (typeof interestContext === 'string' && interestContext) {
    interest = interestContext
    aspiration = 'student'
    difficulty = 'medium'
  }

  const context = `${interest}|${aspiration}|${difficulty}`

  const difficultyTag =
    difficulty === 'high' ? 'stretch OL prompts' : difficulty === 'low' ? 'gentle scaffolding' : 'balanced revision'

  const explanation = `In Grade ${10}, ${concept} builds on matter and energy ideas you already carry. Persona (demo): **${interest}** interest × **${aspiration}** goal × **${difficulty}** science difficulty → ${difficultyTag}. Focus: ${studentFocus ? `“${studentFocus.slice(0, 120)}${studentFocus.length > 120 ? '…' : ''}”` : 'syllabus clarity + one observable hook'}.`

  const story = buildPersonaStory(concept, {
    interest,
    aspiration,
    difficulty,
    studentFocus,
  })

  return {
    data: {
      concept,
      explanation,
      story,
      context,
      diagram: '/assets/diagram-placeholder.svg',
    },
  }
}

/**
 * Mock tutor reply with streaming handled on the UI.
 * @param {{ role: 'user' | 'assistant'; content: string }[]} _history
 * @param {string} message
 * @returns {Promise<{ data: ChatResponse }>}
 */
export async function sendTutorMessage(_history, message) {
  await delay(700 + Math.random() * 500)
  const q = message.toLowerCase()

  /** Khan Academy–style Ohm’s Law overview (external demo link). */
  const OHM_LAW_VIDEO = 'https://www.youtube.com/watch?v=e54tGoHVae8'

  const defaultRecommendations = /** @type {TutorRecommendation[]} */ ([
    {
      kind: 'youtube',
      label: 'YouTube: STEM fundamentals playlist (demo)',
      href: OHM_LAW_VIDEO,
    },
    {
      kind: 'notes',
      label: 'Quick OL notes: units & symbols',
      to: ROUTES.tutorNotes,
    },
    {
      kind: 'practice',
      label: 'Practice: voltage–current quiz questions',
      to: ROUTES.quiz,
    },
  ])

  let answer =
    'Let’s go step-by-step. Tell me which part feels fuzzy — definition, units, or an example?'
  /** @type {'ohms-law' | null} */
  let diagramType = null
  let recommendations = defaultRecommendations

  if (q.includes('ohm') || q.includes('circuit') || q.includes('voltage') || q.includes('resistance')) {
    answer =
      "Ohm’s Law links voltage (V), current (I), and resistance (R): **V = I × R**. Imagine water in a pipe: wider pipe → more flow (current), narrower → less flow for the same push (voltage)."
    diagramType = 'ohms-law'
    recommendations = [
      {
        kind: 'youtube',
        label: 'YouTube: animated Ohm’s Law intuition (8 min)',
        href: OHM_LAW_VIDEO,
      },
      {
        kind: 'notes',
        label: 'Quick OL notes: units & symbols',
        to: ROUTES.tutorNotes,
      },
      {
        kind: 'practice',
        label: 'Practice: 3 voltage–current questions',
        to: ROUTES.quiz,
      },
    ]
  } else if (q.includes('photosynthesis')) {
    answer =
      'Photosynthesis uses light energy to combine carbon dioxide and water into glucose and oxygen. Trace **inputs → chlorophyll → outputs**, then relate it to leaves you see around home.'
    recommendations = [
      {
        kind: 'youtube',
        label: 'YouTube: photosynthesis overview (demo)',
        href: 'https://www.youtube.com/watch?v=iRYZjOuUnlU',
      },
      {
        kind: 'notes',
        label: 'Quick OL notes: units & symbols',
        to: ROUTES.tutorNotes,
      },
      {
        kind: 'practice',
        label: 'Practice: adaptive quiz',
        to: ROUTES.quiz,
      },
    ]
  } else if (q.includes('acid') || q.includes('base')) {
    answer =
      'Acids donate H⁺ (think sour taste, pH < 7); bases accept H⁺ or release OH⁻ (soapy feel, pH > 7). Use one Sri Lankan kitchen example (lime vs soap) to remember.'
    recommendations = [
      {
        kind: 'youtube',
        label: 'YouTube: acids & bases introduction (demo)',
        href: 'https://www.youtube.com/watch?v=IOrrdDUvUrY',
      },
      {
        kind: 'notes',
        label: 'Quick OL notes: units & symbols',
        to: ROUTES.tutorNotes,
      },
      {
        kind: 'practice',
        label: 'Practice: adaptive quiz',
        to: ROUTES.quiz,
      },
    ]
  }

  return {
    data: {
      answer,
      diagramType,
      recommendations,
    },
  }
}

/** @returns {Promise<{ data: QuizQuestion[] }>} */
export async function fetchAdaptiveQuiz() {
  await delay(600)
  return {
    data: [
      {
        kind: 'mcq',
        question: "What is Ohm's Law?",
        options: ['V = I × R', 'P = V × I', 'F = m × a', 'ρ = m/V'],
        correct: 'V = I × R',
        hint: 'Voltage = Current × Resistance',
      },
      {
        kind: 'mcq',
        question: 'Which gas is released during photosynthesis?',
        options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
        correct: 'Oxygen',
        hint: 'Think about what plants “give back” to the air.',
      },
      {
        kind: 'short',
        question:
          'In one sentence, explain why using damaged appliance cords is risky.',
        hint: 'Connect exposed conductors to shock / short-circuit ideas.',
      },
      {
        kind: 'mcq',
        question: 'Which pH range describes an acid?',
        options: ['pH > 7', 'pH = 7', 'pH < 7', 'pH = 0 only'],
        correct: 'pH < 7',
        hint: 'Neutral is 7; acids are on the lower side.',
      },
    ],
  }
}

/**
 * Mock OCR / handwritten synthesis pipeline.
 * @param {string} fileLabel
 * @returns {Promise<{ data: OcrResponse }>}
 */
export async function synthesizeHandwritten(fileLabel) {
  await delay(1400 + Math.random() * 600)
  return {
    data: {
      extracted_text: [
        `Pages scanned: ${fileLabel}`,
        '',
        'Observed notes:',
        'V = I x R  (units mixed)',
        'R = V/I',
        'Example: 12V battery, 4Ω resistor → I = 3A',
      ].join('\n'),
      errors: [
        'Mixed notation: “x” used instead of “×” for multiplication.',
        'Sketch of circuit incomplete — ground reference missing.',
      ],
      corrections: [
        'Use **×** or dots for multiplication in formulae for OL clarity.',
        'Redraw series circuit with closed loop + labeled polarity (+/−).',
        'Remember: I = V/R → consistent SI units (V, Ω, A).',
      ],
      mindmap: true,
    },
  }
}

/** @typedef {{ ok: boolean; statement: string; rationale: string; tag?: string }} VerificationItem */

/**
 * Mock syllabus verification (HyDE-style scoring in UI only).
 * @param {{ text: string; errors?: string[]; corrections?: string[] }} input
 * @returns {Promise<{ data: { correct: number; total: number; items: VerificationItem[] } }>}
 */
export async function verifySyllabusNotes(input) {
  await delay(900 + Math.random() * 500)
  const text = (input.text || '').trim()
  const errors = input.errors ?? []
  const corrections = input.corrections ?? []

  const syllabusOk = [
    {
      ok: true,
      statement: 'Glucose is found in ripe fruits and bee honey.',
      rationale:
        'Matches Grade 10 biology syllabus wording on simple sugars and energy storage in organisms.',
      tag: 'SYLLABUS',
    },
    {
      ok: true,
      statement: 'Photosynthesis releases oxygen as a by-product.',
      rationale:
        'Aligned with OL definitions: light-dependent reactions split water; oxygen exits through stomata.',
      tag: 'SYLLABUS',
    },
    {
      ok: true,
      statement: 'SI base unit for electric current is the ampere (A).',
      rationale: 'Standard symbols table in electricity chapter — consistent with your note intent.',
      tag: 'SYLLABUS',
    },
    {
      ok: true,
      statement: 'Neutral pH for pure water at 25 °C is 7.',
      rationale: 'Acids/bases section: reference point for comparing household and lab examples.',
      tag: 'SYLLABUS',
    },
    {
      ok: true,
      statement: 'Resistance in series adds: R_total = R₁ + R₂.',
      rationale: 'Series circuit rules in Grade 11 electricity — supports your V = I × R working.',
      tag: 'SYLLABUS',
    },
    {
      ok: true,
      statement: 'Voltage is measured in volts (V) with a voltmeter in parallel.',
      rationale: 'Instrument placement matches practical workbook diagrams referenced in OL papers.',
      tag: 'SYLLABUS',
    },
    {
      ok: true,
      statement: 'Chemical energy in a battery converts to electrical energy in a circuit.',
      rationale: 'Energy transformations strand — consistent with battery example in your scan.',
      tag: 'SYLLABUS',
    },
  ]

  const errorSource =
    errors.length > 0
      ? errors
      : [
          'Mixed notation: use × instead of “x” in formulae where handwriting is ambiguous.',
          'Diagram cues missing — add ground reference when you sketch a full circuit loop.',
          text.length < 40
            ? 'Response too brief — OL markers expect definitions with at least one SI unit.'
            : 'One inequality or comparison could be tightened to match textbook phrasing.',
        ]

  let warnItems = errorSource.slice(0, 3).map((statement) => ({
    ok: false,
    statement,
    rationale:
      'Compared against indexed syllabus PDFs (mock). Adjust wording or add the missing diagram detail.',
    tag: 'REVIEW',
  }))

  const defaultWarn = [
    'Symbol handwriting could be read as “l” instead of “1” — rewrite critical constants clearly.',
    'Add one sentence linking the formula to a named OL past-paper context.',
    'Underline final numerical answers where the mark scheme expects a boxed result.',
  ]
  let w = 0
  while (warnItems.length < 3) {
    warnItems.push({
      ok: false,
      statement: defaultWarn[w % defaultWarn.length],
      rationale:
        'Heuristic check from mock verifier — tighten presentation to match teacher-marked samples.',
      tag: 'REVIEW',
    })
    w += 1
  }
  warnItems = warnItems.slice(0, 3)

  const items = [...syllabusOk.slice(0, 7), ...warnItems]
  const correct = items.filter((i) => i.ok).length
  const total = 10

  return {
    data: {
      correct,
      total,
      items,
      correctionBullets: corrections.length
        ? corrections
        : [
            'Prefer × or · for multiplication in exam-style equations.',
            'Label all nodes in circuit sketches with V, I, R where asked.',
          ],
    },
  }
}

/**
 * @param {string} text
 * @returns {Promise<{ data: { flashcards: { front: string; back: string }[]; structuredNotes: string; mindmap: boolean } }>}
 */
export async function generateStudySynthesis(text) {
  await delay(1100 + Math.random() * 600)
  const topic = text.trim().slice(0, 80) || 'Your notes'

  return {
    data: {
      flashcards: [
        {
          front: `Define one key idea from: ${topic.slice(0, 48)}…`,
          back: 'State the definition in one sentence, then add one OL-style example with units.',
        },
        {
          front: 'What formula links V, I, and R?',
          back: 'Ohm’s Law: V = I × R (volts, amperes, ohms).',
        },
        {
          front: 'Name the gas released in photosynthesis.',
          back: 'Oxygen (O₂); glucose is retained for growth and energy storage.',
        },
        {
          front: 'Why are damaged cords dangerous?',
          back: 'Exposed conductors can cause shock or short circuits; insulation protects users.',
        },
      ],
      structuredNotes: [
        `## Synthesis: ${topic}`,
        '',
        '### Core ideas',
        '- Tie every claim to a syllabus outcome you can name.',
        '- Use SI units whenever quantities appear.',
        '',
        '### Exam technique',
        '- Start with “Therefore…” one-liners after calculations.',
        '- Sketch minimal diagrams: closed loop, polarity, meter placement.',
        '',
        '### Next steps',
        '- Re-read the matching PDF section and copy one worked example by hand.',
      ].join('\n'),
      mindmap: true,
    },
  }
}
