import { motion } from 'framer-motion'

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary:
    'bg-[#27AE60] text-white shadow-[var(--shadow-soft)] hover:bg-[#2ECC71]',
  secondary:
    'bg-white/80 text-emerald-900 ring-1 ring-emerald-900/10 hover:bg-emerald-50',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
