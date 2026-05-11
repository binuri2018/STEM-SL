import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'

/**
 * @param {{ active: boolean; theme?: 'stem' | 'science' }} props
 */
export function MindMapPlaceholder({ active, theme = 'stem' }) {
  const science = theme === 'science'

  const card = science
    ? 'rounded-2xl border border-zinc-700 bg-zinc-900/60 p-6'
    : 'rounded-3xl bg-white/85 p-6 ring-1 ring-emerald-950/10'

  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div
            className={
              science
                ? 'text-sm font-semibold text-zinc-100'
                : 'text-sm font-bold text-emerald-950'
            }
          >
            Mind map
          </div>
          <div
            className={
              science
                ? 'mt-1 text-xs text-zinc-500'
                : 'mt-1 text-sm text-emerald-950/65'
            }
          >
            {science
              ? 'Concept nodes from your pasted notes (mock graph).'
              : 'Graph UI placeholder — swap with React Flow / Canvas later.'}
          </div>
        </div>
        <span
          className={
            science
              ? 'rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-xs font-semibold text-[#2eb88a]'
              : 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-900/10'
          }
        >
          {active ? 'Generated' : 'Idle'}
        </span>
      </div>

      <div
        className={
          science
            ? 'relative mt-6 h-56 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/80'
            : 'relative mt-6 h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 ring-1 ring-emerald-900/10'
        }
      >
        <svg
          viewBox="0 0 520 220"
          className="h-full w-full"
          role="img"
          aria-label="Mind map graph placeholder"
        >
          <defs>
            <linearGradient id="edge-science" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#2eb88a" stopOpacity="0.25" />
              <stop offset="1" stopColor="#2eb88a" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="edge-stem" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          <motion.path
            d="M70 110 C160 40, 220 40, 260 110"
            fill="none"
            stroke={science ? 'url(#edge-science)' : 'url(#edge-stem)'}
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: active ? 1 : 0.35 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
          <motion.path
            d="M260 110 C320 180, 380 180, 460 110"
            fill="none"
            stroke={science ? 'url(#edge-science)' : 'url(#edge-stem)'}
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: active ? 1 : 0.35 }}
            transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.12 }}
          />

          {[
            { x: 70, y: 110, t: 'Concept' },
            { x: 260, y: 110, t: 'Formula' },
            { x: 460, y: 110, t: 'Example' },
            { x: 170, y: 175, t: 'Units' },
            { x: 350, y: 55, t: 'Diagram' },
          ].map((n, i) => (
            <motion.g
              key={n.t}
              initial={{ opacity: 0.35, scale: 0.98 }}
              animate={{
                opacity: active ? 1 : 0.55,
                scale: active ? 1 : 0.98,
              }}
              transition={{ delay: i * 0.05 }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r="26"
                fill={science ? '#18181b' : '#ffffff'}
                stroke={science ? '#2eb88a' : '#27AE60'}
                strokeWidth="4"
              />
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={science ? '#a1a1aa' : '#065f46'}
              >
                {n.t}
              </text>
            </motion.g>
          ))}
        </svg>

        <div
          className={
            science
              ? 'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,184,138,0.12),transparent_55%)]'
              : 'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_55%)]'
          }
        />

        <div
          className={
            science
              ? 'absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-xs font-medium text-zinc-400'
              : 'absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-bold text-emerald-900 ring-1 ring-emerald-900/10'
          }
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Tap nodes (coming soon)
        </div>
      </div>
    </div>
  )
}
