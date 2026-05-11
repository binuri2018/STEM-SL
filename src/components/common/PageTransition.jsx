import { motion } from 'framer-motion'

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.42, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
