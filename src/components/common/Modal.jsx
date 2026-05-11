import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close dialog overlay"
            className="absolute inset-0 bg-emerald-950/25 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="relative z-[81] w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl ring-1 ring-emerald-950/10 sm:rounded-3xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold tracking-tight text-emerald-950">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-emerald-900/60 hover:bg-emerald-50 hover:text-emerald-900"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-base leading-relaxed text-emerald-950/80">
              {children}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" type="button" onClick={onClose}>
                Got it
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
