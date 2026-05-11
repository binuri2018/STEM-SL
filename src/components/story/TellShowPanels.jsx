import { motion } from 'framer-motion'
import { BookMarked, Leaf } from 'lucide-react'
import { Card } from '../common/Card.jsx'
import { renderRichText } from '../../utils/richText.jsx'

export function TellShowPanels({ concept, explanation, story, context }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card hover={false} className="p-6 lg:p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
          <BookMarked className="h-4 w-4" aria-hidden />
          Tell — textbook clarity
        </div>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-emerald-950">
          {concept}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-emerald-950/80">
          {explanation}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-900/10">
          <Leaf className="h-4 w-4" aria-hidden />
          Sri Lankan context lane:{' '}
          <span className="capitalize">{context}</span>
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card hover={false} className="h-full p-6 lg:p-7">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <span aria-hidden>📖</span>
            Show — story card
          </div>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-5 ring-1 ring-emerald-900/10">
            <p className="text-lg leading-relaxed text-emerald-950/85 whitespace-pre-wrap">
              {renderRichText(story)}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
