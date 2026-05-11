import { NavLink } from 'react-router-dom'
import { Leaf, X } from 'lucide-react'
import { NAV_LINKS } from '../../utils/navConfig.jsx'

function linkClass(isActive) {
  return [
    'group flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-colors',
    isActive
      ? 'bg-emerald-600 text-white shadow-[var(--shadow-soft)]'
      : 'text-emerald-950/80 hover:bg-emerald-50',
  ].join(' ')
}

export function Sidebar({ open, onClose }) {
  return (
    <>
      <aside
        className={[
          'fixed inset-y-0 left-0 z-[60] w-[min(320px,88vw)] border-r border-emerald-900/10 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:z-auto lg:h-dvh lg:w-72 lg:translate-x-0 lg:border-r lg:bg-white/85',
        ].join(' ')}
      >
        <div className="flex h-full flex-col px-4 pb-6 pt-6 lg:pt-8">
          <div className="mb-8 flex items-start justify-between gap-3 lg:mb-10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/20">
                <Leaf className="h-6 w-6" />
              </span>
              <div>
                <div className="text-xs font-semibold text-emerald-700">
                  AI STEM Ecosystem
                </div>
                <div className="text-lg font-extrabold tracking-tight text-emerald-950">
                  STEM Learn LK
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-2 text-emerald-900/70 hover:bg-emerald-50 lg:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2" aria-label="Primary">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => onClose?.()}
                className={({ isActive }) => linkClass(isActive)}
              >
                <Icon className="h-5 w-5 opacity-90" aria-hidden />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-4 ring-1 ring-emerald-900/10">
            <div className="text-sm font-bold text-emerald-950">Study loop</div>
            <div className="mt-1 text-sm leading-relaxed text-emerald-950/70">
              Learn → Interact → Assess → Revise
            </div>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-[55] bg-emerald-950/25 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      ) : null}
    </>
  )
}
