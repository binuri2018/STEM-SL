/**
 * Shared demo lesson + 9-question adaptive quiz — Physics / Ohm's Law.
 * Used across Narrative, Voice Tutor, Adaptive Quiz, and Knowledge Maps demos.
 */

export const OHMS_LESSON = {
  subject: 'PHYSICS',
  title: "Ohm's Law & simple circuits",
  description:
    'Explore voltage, current, and resistance through an interactive AR circuit lab. Build intuition for V = IR, practise SI units, and connect series and parallel arrangements to how components share or split potential difference.',
  yearLabel: 'Grade 10',
  durationLabel: '~25 min',
  roadmap: [
    { level: 1, label: '3 Basic Questions', dotClass: 'bg-emerald-500' },
    { level: 2, label: '3 Concept Questions', dotClass: 'bg-amber-400' },
    { level: 3, label: '3 Advanced Questions', dotClass: 'bg-rose-500' },
  ],
}

/** @type {import('../services/aiService.js').QuizQuestion[]} */
export const OHMS_QUIZ_QUESTIONS = [
  {
    kind: 'mcq',
    level: 1,
    tag: 'Definitions',
    question: 'Which equation states Ohm’s law for a metallic conductor at constant temperature?',
    options: ['V = I / R', 'V = I × R', 'V = R / I', 'I = V × R'],
    correct: 'V = I × R',
    hint: 'Potential difference equals current multiplied by resistance.',
    supporterHint:
      "It's okay to feel stuck! Voltage pushes current through resistance — multiply them: V equals I times R.",
  },
  {
    kind: 'mcq',
    level: 1,
    tag: 'Units',
    question: 'The SI unit of electrical resistance is the…',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    correct: 'Ohm',
    hint: 'Symbol Ω; named after Georg Ohm.',
    supporterHint: 'Resistance is measured in ohms — same letter O as in “Ohm’s law”.',
  },
  {
    kind: 'mcq',
    level: 1,
    tag: 'Units',
    question: 'The SI unit of electric current is the…',
    options: ['Coulomb', 'Volt', 'Ampere', 'Ohm'],
    correct: 'Ampere',
    hint: 'Current is rate of flow of charge — base SI unit A.',
    supporterHint: 'Think “amps” on a charger label — that is the SI unit of current.',
  },
  {
    kind: 'mcq',
    level: 2,
    tag: 'V = IR',
    question: 'Across a fixed resistor, if the potential difference doubles, the current…',
    options: ['halves', 'stays the same', 'doubles', 'quadruples'],
    correct: 'doubles',
    hint: 'I = V/R with R constant gives direct proportionality between I and V.',
    supporterHint: 'Same resistor → same R. Bigger V pushes twice as much I.',
  },
  {
    kind: 'mcq',
    level: 2,
    tag: 'Series circuits',
    question: 'Two resistors in series have equivalent resistance…',
    options: ['R₁ × R₂', 'R₁ − R₂', 'R₁ + R₂', '(R₁ + R₂) / (R₁ × R₂)'],
    correct: 'R₁ + R₂',
    hint: 'Series: same current, resistances add.',
    supporterHint: 'One path after another — lengths of resistance “add up”.',
  },
  {
    kind: 'mcq',
    level: 2,
    tag: 'Electrical power',
    question: 'Electrical power can be written as P = …',
    options: ['I²R', 'V²R', 'VR²', 'I / R²'],
    correct: 'I²R',
    hint: 'Combine P = VI with V = IR to eliminate V.',
    supporterHint: 'From P = VI and V = IR, substitute: P = I × (IR) = I²R.',
  },
  {
    kind: 'mcq',
    level: 3,
    tag: 'Parallel circuits',
    question: 'Two identical resistors R in parallel have equivalent resistance…',
    options: ['2R', 'R', 'R / 2', 'R²'],
    correct: 'R / 2',
    hint: 'Equal branches share current symmetrically.',
    supporterHint: 'Two equal paths side by side — effective resistance drops to half.',
  },
  {
    kind: 'mcq',
    level: 3,
    tag: 'V = IR',
    question: 'A 12 V battery is connected across a 4 Ω resistor (ideal wires). The current is…',
    options: ['0.33 A', '3 A', '48 A', '8 A'],
    correct: '3 A',
    hint: 'Use I = V/R.',
    supporterHint: 'Divide voltage by resistance: twelve divided by four.',
  },
  {
    kind: 'mcq',
    level: 3,
    tag: 'Circuit reasoning',
    question: 'For resistors in parallel across the same supply, each branch has the…',
    options: [
      'same current, different voltage',
      'same voltage, currents may differ',
      'same power only',
      'same resistance always',
    ],
    correct: 'same voltage, currents may differ',
    hint: 'Parallel components share the same potential difference.',
    supporterHint: 'Think of two lamps across the same two terminals — same V, different I if R differs.',
  },
]
