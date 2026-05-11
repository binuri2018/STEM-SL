/** AR lesson + 9-question heart assessment (demo — Biology / Human Heart). */

export const HEART_LESSON = {
  demoStudent: { name: 'sahan', id: 'IT224567890' },
  subject: 'BIOLOGY',
  title: 'The Human Heart',
  description:
    'Explore the structure and function of the human heart through an interactive AR experience. Learn about the four chambers, blood vessels, valves, and the two circulatory loops.',
  yearLabel: 'Year 1',
  durationLabel: '~25 min',
  roadmap: [
    { level: 1, label: '3 Basic Questions', dotClass: 'bg-emerald-500' },
    { level: 2, label: '3 Concept Questions', dotClass: 'bg-amber-400' },
    { level: 3, label: '3 Advanced Questions', dotClass: 'bg-rose-500' },
  ],
}

/** @type {import('../services/aiService.js').QuizQuestion[]} */
export const HEART_QUIZ_QUESTIONS = [
  {
    kind: 'mcq',
    level: 1,
    tag: 'Blood Vessels',
    question:
      'Which blood vessel carries oxygenated blood away from the heart to the body?',
    options: ['Pulmonary vein', 'Vena cava', 'Aorta', 'Pulmonary artery'],
    correct: 'Aorta',
    hint: 'Oxygenated blood leaves the left ventricle through the largest artery.',
    supporterHint:
      "It's okay to feel stuck! Take a deep breath. Consider this: The biggest artery leaving the heart starts with the letter 'A'.",
  },
  {
    kind: 'mcq',
    level: 1,
    tag: 'Heart Structure',
    question: 'Which chamber receives oxygenated blood from the lungs?',
    options: ['Right atrium', 'Left atrium', 'Right ventricle', 'Left ventricle'],
    correct: 'Left atrium',
    hint: 'Pulmonary veins return freshly oxygenated blood to the heart.',
    supporterHint:
      'Think “left = lung return” — oxygen-rich blood enters the upper chamber on the same side as the aorta.',
  },
  {
    kind: 'mcq',
    level: 1,
    tag: 'Circulation',
    question: 'The pulmonary circuit carries blood between the heart and the…',
    options: ['Brain', 'Lungs', 'Kidneys', 'Digestive tract'],
    correct: 'Lungs',
    hint: '“Pulmonary” always refers to the lungs in OL biology.',
    supporterHint: 'Pulmonary = lungs. Systemic = the rest of the body.',
  },
  {
    kind: 'mcq',
    level: 2,
    tag: 'Circulation',
    question: 'In the systemic circuit, oxygenated blood is pumped from the…',
    options: ['Right ventricle', 'Left ventricle', 'Right atrium', 'Coronary sinus'],
    correct: 'Left ventricle',
    hint: 'The left ventricle has the thickest wall because it pumps to the whole body.',
    supporterHint: 'Systemic loop starts where muscle is thickest — the left pump.',
  },
  {
    kind: 'mcq',
    level: 2,
    tag: 'Heart Structure',
    question: 'Which valve is found between the left atrium and left ventricle?',
    options: ['Tricuspid', 'Mitral (bicuspid)', 'Pulmonary', 'Aortic'],
    correct: 'Mitral (bicuspid)',
    hint: 'Two cusps on the left side — “bicuspid”.',
    supporterHint: 'Left AV valve = two flaps. Say “bi-” out loud.',
  },
  {
    kind: 'mcq',
    level: 2,
    tag: 'Heart Sounds',
    question: 'The “lub” sound of the heartbeat is mainly associated with…',
    options: ['Semilunar valves closing', 'AV valves closing', 'Blood hitting the aorta', 'SAN firing'],
    correct: 'AV valves closing',
    hint: 'Lub = start of systole when AV valves shut.',
    supporterHint: 'Lub closes the door between atria and ventricles.',
  },
  {
    kind: 'mcq',
    level: 3,
    tag: 'Circulation',
    question: 'Deoxygenated blood enters the right atrium from the…',
    options: ['Pulmonary veins', 'Coronary arteries', 'Superior & inferior vena cava', 'Aorta'],
    correct: 'Superior & inferior vena cava',
    hint: 'Body return path uses the great veins opening into the RA.',
    supporterHint: '“Vena cava” = big veins returning used blood.',
  },
  {
    kind: 'mcq',
    level: 3,
    tag: 'Heart Structure',
    question: 'The natural pacemaker of the heart is the…',
    options: ['AV node', 'Bundle of His', 'Sinoatrial (SA) node', 'Purkinje fibres'],
    correct: 'Sinoatrial (SA) node',
    hint: 'Impulses begin high in the right atrium.',
    supporterHint: 'SA node sets the beat — first letter S for “start”.',
  },
  {
    kind: 'mcq',
    level: 3,
    tag: 'Heart Sounds',
    question: 'The “dup” component is mainly linked to…',
    options: ['AV valves opening', 'Semilunar valves closing', 'Atrial contraction', 'Ventricular filling'],
    correct: 'Semilunar valves closing',
    hint: 'Dup marks the end of systole when SL valves snap shut.',
    supporterHint: 'Dup = semilunars shutting after ejection.',
  },
]
