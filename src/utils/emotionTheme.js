/**
 * Subtle UI tint shifts for the adaptive quiz emotion panel (mock).
 * @param {'neutral' | 'happy' | 'confused' | 'stressed'} emotion
 */
export function emotionClasses(emotion) {
  switch (emotion) {
    case 'happy':
      return 'ring-emerald-400/50 bg-emerald-50/70'
    case 'confused':
      return 'ring-amber-400/45 bg-amber-50/70'
    case 'stressed':
      return 'ring-rose-400/45 bg-rose-50/70'
    default:
      return 'ring-emerald-500/10 bg-white/70'
  }
}
