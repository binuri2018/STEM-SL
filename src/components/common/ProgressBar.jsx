import { motion } from 'framer-motion'

export function ProgressBar({
  value,
  max = 100,
  className = '',
  variant = 'light',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const track =
    variant === 'dark' ? 'bg-zinc-800' : 'bg-emerald-900/10'
  const fill =
    variant === 'dark'
      ? 'bg-[#2eb88a]'
      : 'bg-gradient-to-r from-[#27AE60] to-[#2ECC71]'

  return (
    <div
      className={`h-3 w-full overflow-hidden rounded-full ${track} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`h-full rounded-full ${fill}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      />
    </div>
  )
}
