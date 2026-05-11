import { motion } from 'framer-motion'

export function Loader({
  label = 'STEM tutor is thinking…',
  tone = 'emerald',
}) {
  const dot =
    tone === 'darkTeal' ? 'bg-[#2eb88a]' : 'bg-[#27AE60]'
  const caption =
    tone === 'darkTeal' ? 'text-zinc-400' : 'text-emerald-900/70'

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-10"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`h-3 w-3 rounded-full ${dot}`}
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -5, 0] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.14,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <p className={`text-center text-sm font-medium ${caption}`}>
        {label}
      </p>
    </div>
  )
}
