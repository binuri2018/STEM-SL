import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Youtube, NotebookTabs, MessageSquareMore } from 'lucide-react'

const ICONS = {
  youtube: Youtube,
  notes: NotebookTabs,
  practice: MessageSquareMore,
  quiz: MessageSquareMore,
}

const ROW =
  'flex items-start gap-3 rounded-2xl bg-white/85 px-3 py-2.5 text-sm font-semibold ring-1 ring-emerald-900/10 transition hover:bg-emerald-50/90'

/**
 * @param {{ items: (string | { kind: string; label: string; href?: string; to?: string })[] }} props
 */
export function RecommendationList({ items }) {
  return (
    <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-900/10">
      <div className="text-sm font-bold text-emerald-950">Recommendations</div>
      <ul className="mt-3 space-y-2">
        {items.map((item, idx) => {
          if (typeof item === 'string') {
            const Icon = [Youtube, NotebookTabs, MessageSquareMore][idx % 3]
            return (
              <motion.li
                key={`${item}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`${ROW} text-emerald-950/80`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                <span>{item}</span>
              </motion.li>
            )
          }

          const Icon = ICONS[item.kind] ?? MessageSquareMore

          const body =
            item.kind === 'youtube' && item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-950/90 underline decoration-emerald-600/40 underline-offset-2 hover:decoration-emerald-600"
              >
                {item.label}
              </a>
            ) : item.to ? (
              <Link
                to={item.to}
                className="text-emerald-950/90 underline decoration-emerald-600/40 underline-offset-2 hover:decoration-emerald-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-emerald-950/80">{item.label}</span>
            )

          return (
            <motion.li
              key={`${item.label}-${idx}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`${ROW} text-left`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
              {body}
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
