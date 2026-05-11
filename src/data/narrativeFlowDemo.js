/**
 * Demo syllabus + UI content for the Narrative Learning simulator (no backend).
 */

export const TEXTBOOKS = [
  { id: 'g10p1', label: 'Grade 10 - Part I' },
  { id: 'g10p2', label: 'Grade 10 - Part II' },
  { id: 'g11p1', label: 'Grade 11 - Part I' },
]

export const TOPICS_BY_TEXTBOOK = {
  g10p1: [
    { id: 'ohms-law', label: "Ohm's Law & simple circuits" },
    { id: 'newtons-laws', label: "Newton's laws of motion" },
    { id: 'electricity', label: 'Current electricity' },
    { id: 'photosynthesis', label: 'Photosynthesis & plant nutrition' },
  ],
  g10p2: [
    { id: 'waves', label: 'Waves & sound' },
    { id: 'acids', label: 'Acids, bases & salts' },
  ],
  g11p1: [
    { id: 'organic', label: 'Introductory organic chemistry' },
    { id: 'motion-fields', label: 'Motion in combined fields' },
  ],
}

/** Rich “Understand the Science First” layout — Newton demo matches reference screens. */
export const SCIENCE_NEWTON = {
  bannerTopic: "Newton's laws of motion",
  concept: {
    headerClass: 'bg-blue-600/95 text-white',
    title: 'The Concept',
    body:
      "Newton's third law states that for every action, there is a reaction equal in magnitude and opposite in direction to the action.",
  },
  whyItWorks: {
    headerClass: 'bg-emerald-600/95 text-white',
    title: 'WHY IT WORKS',
    body:
      'Forces always happen in pairs. When one object pushes another (Action), the second object pushes back on the first one with the same amount of strength but in the opposite way (Reaction).',
  },
  keyEquations: {
    headerClass: 'bg-amber-600/95 text-white',
    title: 'KEY EQUATIONS',
    lines: [
      'Action Force = Reaction Force',
      'Direction of Action = −(Direction of Reaction)',
    ],
  },
  realWorld: {
    headerClass: 'bg-violet-600/95 text-white',
    title: 'REAL WORLD',
    body:
      'When you jump off a small boat into the water, the boat moves backward as your legs push you forward.',
  },
  sidebarEquationBlocks: [
    {
      label: 'Force Equality',
      formula: 'Magnitude of Action = Magnitude of Reaction',
    },
    {
      label: 'Directional Relationship',
      formula: 'Direction of Action = − Direction of Reaction',
    },
  ],
  definitions: [
    {
      term: 'Action',
      text: 'The force exerted by the first object on the second object in an interaction pair.',
    },
    {
      term: 'Reaction',
      text: 'The force exerted by the second object back on the first — equal size, opposite direction.',
    },
    {
      term: "Newton's Third Law",
      text: 'For every force there is an equal and opposite force; action and reaction act on different bodies.',
    },
  ],
  examTips: [
    'State the law using the words “equal magnitude” and “opposite direction”.',
    'Identify the action/reaction pair — never mix two forces on the same single body.',
    'Give one brief example (e.g. swimming: you push water backward, water pushes you forward).',
    'Explain direction with a simple arrow sketch or “opposite to” wording.',
  ],
}

/** Rich “Understand the Science First” layout — Ohm’s Law (aligned with AR lab + quiz). */
export const SCIENCE_OHMS = {
  bannerTopic: "Ohm's Law & simple circuits",
  concept: {
    headerClass: 'bg-blue-600/95 text-white',
    title: 'The Concept',
    body:
      '**Ohm’s law** states that for many conductors at fixed temperature, the current through the conductor is directly proportional to the potential difference across it: **V = I R**, where **R** is the resistance.',
  },
  whyItWorks: {
    headerClass: 'bg-emerald-600/95 text-white',
    title: 'WHY IT WORKS',
    body:
      'A steady voltage “pushes” charge carriers; resistance measures how strongly the material opposes that flow. Larger **R** means smaller **I** for the same **V**, and rearranging gives **I = V/R** or **R = V/I** for checks.',
  },
  keyEquations: {
    headerClass: 'bg-amber-600/95 text-white',
    title: 'KEY EQUATIONS',
    lines: ['V = I R', 'I = V / R', 'R = V / I', 'P = V I = I² R = V² / R'],
  },
  realWorld: {
    headerClass: 'bg-violet-600/95 text-white',
    title: 'REAL WORLD',
    body:
      'Phone chargers list voltage and current limits; LED strips use series resistors so **I** stays safe. Household wiring stays at ~230 V while appliance **R** sets how much current is drawn.',
  },
  sidebarEquationBlocks: [
    { label: 'Ohm’s law', formula: 'V = I R' },
    { label: 'SI units', formula: 'V → volt (V), I → ampere (A), R → ohm (Ω)' },
  ],
  definitions: [
    {
      term: 'Potential difference (V)',
      text: 'Energy transferred per unit charge between two points in a circuit — measured in volts.',
    },
    {
      term: 'Current (I)',
      text: 'Rate of flow of electric charge through a cross-section — measured in amperes.',
    },
    {
      term: 'Resistance (R)',
      text: 'Opposition a component offers to current — measured in ohms (Ω).',
    },
  ],
  examTips: [
    'State **V = I R** before substituting numbers.',
    'Convert kΩ or mA to base SI (Ω, A) before calculating.',
    'For series: **R_total = ΣR**; for parallel: use **1/R_total = Σ(1/R)**.',
    'Interpret answers: “current rises because resistance dropped” shows understanding.',
  ],
}

export function getScienceBlocks(topicId, topicLabel) {
  if (topicId === 'ohms-law') return SCIENCE_OHMS
  if (topicId === 'newtons-laws') return SCIENCE_NEWTON

  const label = topicLabel || 'this topic'
  return {
    bannerTopic: label,
    concept: {
      headerClass: 'bg-blue-600/95 text-white',
      title: 'The Concept',
      body: `**${label}** — core definitions and relationships from the NIE syllabus (demo). Start from observable facts, then add symbols and units.`,
    },
    whyItWorks: {
      headerClass: 'bg-emerald-600/95 text-white',
      title: 'WHY IT WORKS',
      body: `Models in **${label}** fold smaller ideas into one diagram or equation so predictions stay consistent — same habit examiners reward when links are explicit.`,
    },
    keyEquations: {
      headerClass: 'bg-amber-600/95 text-white',
      title: 'KEY EQUATIONS',
      lines: ['Main relation for this unit (demo)', 'Supporting identity or conservation statement'],
    },
    realWorld: {
      headerClass: 'bg-violet-600/95 text-white',
      title: 'REAL WORLD',
      body: `Pick one Sri Lankan everyday hook for **${label}** — household tech, transport, agriculture, or sport — and tie it to one measured quantity.`,
    },
    sidebarEquationBlocks: [
      { label: 'Primary relation', formula: 'See textbook summary box (demo).' },
      { label: 'Units check', formula: 'SI base / derived units stated once.' },
    ],
    definitions: [
      { term: 'Key term A', text: 'Demo definition — replace with glossary entry from your PDF index.' },
      { term: 'Key term B', text: 'Second anchor term for this chapter (demo).' },
    ],
    examTips: [
      'Define before you calculate.',
      'Show unit consistency in one line.',
      'Name the law or principle you applied.',
      'End with a one-sentence interpretation.',
    ],
  }
}

/** Short display name for quiz / next-steps copy */
export function topicShortLabel(topicId, topicLabel) {
  if (topicId === 'ohms-law') return "Ohm's Law"
  if (topicId === 'newtons-laws') return 'Newton Third Law'
  const t = (topicLabel || '').trim()
  return t.length > 42 ? `${t.slice(0, 40)}…` : t
}
