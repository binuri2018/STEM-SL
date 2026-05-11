import { Leaf, Menu, Sparkles } from 'lucide-react'

export function Navbar({ onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/75 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-950 ring-1 ring-emerald-900/10"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
          <span className="text-sm font-semibold">Menu</span>
        </button>

        <div className="flex items-center gap-2 text-emerald-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/20">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              STEM Learn LK
            </div>
            <div className="text-sm font-bold tracking-tight">Grade 10–11</div>
          </div>
        </div>

        <div className="w-[76px]" aria-hidden />
      </div>
    </header>
  )
}
