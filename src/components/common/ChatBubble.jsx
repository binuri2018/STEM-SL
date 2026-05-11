import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

export function ChatBubble({ role, children }) {
  const isAI = role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${
          isAI
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/15'
            : 'bg-white text-emerald-900 ring-emerald-900/10'
        }`}
        aria-hidden
      >
        {isAI ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <div
        className={`max-w-[min(720px,85vw)] rounded-3xl px-4 py-3 text-base leading-relaxed shadow-sm ring-1 ${
          isAI
            ? 'bg-white text-emerald-950 ring-emerald-900/10'
            : 'bg-[#27AE60] text-white ring-transparent'
        }`}
      >
        {children}
      </div>
    </motion.div>
  )
}
