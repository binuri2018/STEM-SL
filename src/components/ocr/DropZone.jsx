import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, UploadCloud } from 'lucide-react'

const MAX_BYTES = 10 * 1024 * 1024

/**
 * @param {{ onFileChosen: (file: File) => void; theme?: 'stem' | 'science' }} props
 */
export function DropZone({ onFileChosen, theme = 'stem' }) {
  const [dragActive, setDragActive] = useState(false)

  const activate = useCallback(() => setDragActive(true), [])
  const deactivate = useCallback(() => setDragActive(false), [])

  const science = theme === 'science'

  const pickAndForward = useCallback(
    (file) => {
      if (!file) return
      if (file.size > MAX_BYTES) {
        window.alert('Please choose an image under 10 MB.')
        return
      }
      onFileChosen(file)
    },
    [onFileChosen],
  )

  const shell = science
    ? [
        'relative overflow-hidden rounded-2xl border border-dashed p-10 text-center transition-colors',
        dragActive
          ? 'border-[#2eb88a] bg-[#2eb88a]/10 shadow-[0_0_0_1px_rgba(46,184,138,0.35)]'
          : 'border-zinc-600 bg-zinc-900/40',
      ].join(' ')
    : [
        'relative overflow-hidden rounded-3xl border border-dashed border-emerald-300/80 bg-white/70 p-10 text-center ring-1 ring-emerald-900/10',
        dragActive ? 'border-emerald-500 bg-emerald-50/70' : '',
      ].join(' ')

  return (
    <motion.div
      onDragEnter={(e) => {
        e.preventDefault()
        activate()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        activate()
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        deactivate()
      }}
      onDrop={(e) => {
        e.preventDefault()
        deactivate()
        const file = e.dataTransfer.files?.[0]
        if (file) pickAndForward(file)
      }}
      animate={
        science
          ? { scale: dragActive ? 1.005 : 1 }
          : {
              scale: dragActive ? 1.01 : 1,
              boxShadow: dragActive
                ? '0 18px 55px -26px rgba(16, 185, 129, 0.55)'
                : '0 14px 48px -28px rgba(15,118,110,0.25)',
            }
      }
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={shell}
    >
      {science ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400">
            <ImageIcon className="h-6 w-6" aria-hidden />
          </span>
          <div className="text-base font-medium text-zinc-200">
            Drop image here or{' '}
            <label className="cursor-pointer font-semibold text-[#2eb88a] underline-offset-2 hover:underline">
              browse
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  pickAndForward(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
          <p className="text-xs text-zinc-500">PNG, JPG, JPEG · max 10 MB</p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25">
            <UploadCloud className="h-7 w-7" aria-hidden />
          </span>
          <div className="text-lg font-extrabold tracking-tight text-emerald-950">
            Drag & drop your handwritten notes
          </div>
          <p className="text-sm leading-relaxed text-emerald-950/65">
            PNG or JPG works for this demo — processing is mocked locally.
          </p>

          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] ring-1 ring-emerald-700/25 hover:bg-[#2ECC71]">
            <span>Choose file</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                pickAndForward(file)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      )}
    </motion.div>
  )
}
