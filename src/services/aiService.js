const delay = (ms) => new Promise((r) => setTimeout(r, ms))

/** @typedef {{ concept: string; explanation: string; story: string; context: string; diagram: string }} NarrativeResponse */

/** @typedef {{ answer: string; diagram: boolean; recommendations: string[] }} ChatResponse */

/** @typedef {{ question: string; hint: string; options?: string[]; correct?: string; kind?: 'mcq' | 'short' }} QuizQuestion */

/** @typedef {{ extracted_text: string; errors: string[]; corrections: string[]; mindmap: boolean }} OcrResponse */

/**
 * Mock narrative aligned with strict JSON contract.
 * @param {string} topic
 * @param {string} interestContext
 * @returns {Promise<{ data: NarrativeResponse }>}
 */
export async function generateNarrative(topic, interestContext) {
  await delay(900 + Math.random() * 400)
  const concept = topic.trim() || 'Electricity'
  const context =
    interestContext ||
    ['farming', 'transport', 'sports'][Math.floor(Math.random() * 3)]

  const explanation = `In Grade ${10}, ${concept} builds on what you already know about matter and energy. Focus on definitions, units (SI), and one everyday example so it sticks for OL exams.`

  const story =
    context === 'farming'
      ? `In a Sabaragamuwa paddy field, **${concept}** quietly powers the pump that lifts river water into the canal. When the motor hums, energy transforms step-by-step — exactly like the diagrams in your textbook, only now you can feel the breeze off the field while you revise.`
      : context === 'transport'
        ? `Along the Kandy road, the LED signs at the bus halt glow because **${concept}** behaves predictably in circuits. The driver checks battery terminals before dawn — a small habit that saves hours for passengers rushing to school.`
        : `During interval football at school, **${concept}** shows up when you talk about force, motion, and even how your phone battery drains after filming penalties. You already observe it — now connect it to the equation sheet.`

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

  let answer =
    'Let’s go step-by-step. Tell me which part feels fuzzy — definition, units, or an example?'

  if (q.includes('ohm')) {
    answer =
      "Ohm’s Law links voltage (V), current (I), and resistance (R): **V = I × R**. Imagine water in a pipe: wider pipe → more flow (current), narrower → less flow for the same push (voltage)."
  } else if (q.includes('photosynthesis')) {
    answer =
      'Photosynthesis uses light energy to combine carbon dioxide and water into glucose and oxygen. Trace **inputs → chlorophyll → outputs**, then relate it to leaves you see around home.'
  } else if (q.includes('acid') || q.includes('base')) {
    answer =
      'Acids donate H⁺ (think sour taste, pH < 7); bases accept H⁺ or release OH⁻ (soapy feel, pH > 7). Use one Sri Lankan kitchen example (lime vs soap) to remember.'
  }

  return {
    data: {
      answer,
      diagram: true,
      recommendations: [
        'YouTube: animated Ohm’s Law intuition (8 min)',
        'Quick OL notes: units & symbols',
        'Practice: 3 voltage–current questions',
      ],
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
