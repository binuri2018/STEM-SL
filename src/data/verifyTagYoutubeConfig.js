/**
 * Verify Notes → Related YouTube: per-tag search queries + offline fallback clip IDs (noembed).
 * With VITE_YOUTUBE_API_KEY, the app uses Data API search instead of fallback IDs.
 */

/** @type {{ id: string; label: string; searchQuery: string; fallbackVideoIds: string[]; fallbackSummaries: string[] }[]} */
export const VERIFY_TAG_YOUTUBE_CONFIG = [
  {
    id: 'ohm',
    label: 'Ohm’s law — V = IR',
    searchQuery: "Ohm's law explained physics grade 10 voltage current resistance",
    fallbackVideoIds: ['IHZwWFHWa-w', 'M7FIvfx5J10'],
    fallbackSummaries: [
      'Dummy summary: walks through a relationship between quantities with graphs — use it to rehearse how changing one variable affects another before tackling numeric V = IR drills.',
      'Dummy summary: short clip with a clear visual metaphor; good for a break between textbook problems. Not a full lesson — pair with your corrected note equations.',
    ],
  },
  {
    id: 'units',
    label: 'volts, amps & ohms',
    searchQuery: 'SI units volt ampere ohm electricity physics OL',
    fallbackVideoIds: ['jNQXAC9IVRw', 'Rb0UmrCXxVA'],
    fallbackSummaries: [
      'Dummy summary: ultra-short clip — use it as a reminder that units belong to named quantities, then jump back to your note’s SI checklist.',
      'Dummy summary: longer-format audio-visual; skim chapters in the description for the segment on symbols and prefixes if your note confused V with Ω.',
    ],
  },
  {
    id: 'series',
    label: 'resistors in series',
    searchQuery: 'series resistors equivalent resistance physics tutorial',
    fallbackVideoIds: ['dQw4w9WgXcQ', 'IHZwWFHWa-w'],
    fallbackSummaries: [
      'Dummy summary: paced walkthrough — useful if you want a second voice explaining why currents match in one loop.',
      'Dummy summary: narrative + diagram style; jump to the middle for a numeric example with two series resistors.',
    ],
  },
  {
    id: 'parallel',
    label: 'parallel branches',
    searchQuery: 'parallel resistors same voltage different current electricity',
    fallbackVideoIds: ['M7FIvfx5J10', 'jNQXAC9IVRw'],
    fallbackSummaries: [
      'Dummy summary: emphasises intuition for branches sharing a supply — aligns with your corrected note about voltage in parallel.',
      'Dummy summary: compact clip; treat as a warm-up before redrawing junctions on paper.',
    ],
  },
  {
    id: 'power',
    label: 'electrical power P = VI',
    searchQuery: 'electrical power P=VI P=I2R physics explained',
    fallbackVideoIds: ['Rb0UmrCXxVA', 'dQw4w9WgXcQ'],
    fallbackSummaries: [
      'Dummy summary: listen for where the speaker ties power to everyday appliances — helpful for interpreting your P = VI bullet.',
      'Dummy summary: second clip for variety; use Summaries to pin which formula line you still find fuzzy.',
    ],
  },
]
