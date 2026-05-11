import { motion } from 'framer-motion'
import { Youtube, NotebookTabs, MessageSquareMore } from 'lucide-react'

const icons = [Youtube, NotebookTabs, MessageSquareMore]

export function RecommendationList({ items }) {
  return (
    <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-900/10">
      <div className="text-sm font-bold text-emerald-950">Recommendations</div>
      <ul className="mt-3 space-y-2">
        {items.map((text, idx) => {
          const Icon = icons[idx % icons.length]
          return (
            <motion.li
              key={`${text}-${idx}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-start gap-3 rounded-2xl bg-white/85 px-3 py-2 text-sm font-semibold text-emerald-950/80 ring-1 ring-emerald-900/10"
            >
              <Icon className="mt-0.5 h-4 w-4 text-emerald-700" aria-hidden />
              <span>{text}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
