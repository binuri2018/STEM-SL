import { motion } from 'framer-motion'

export function Card({
  children,
  className = '',
  hover = true,
  as = 'div',
  ...props
}) {
  const shared =
    `rounded-2xl bg-white/85 shadow-[0_12px_40px_-18px_rgba(15,118,110,0.25)] ring-1 ring-emerald-950/5 backdrop-blur-sm ${className}`

  if (hover) {
    return (
      <motion.div
        initial={false}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className={shared}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  const Static = as
  return (
    <Static className={shared} {...props}>
      {children}
    </Static>
  )
}
