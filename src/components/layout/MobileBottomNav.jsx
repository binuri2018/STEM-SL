import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../../utils/navConfig.jsx'

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-900/10 bg-white/90 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-5 gap-1 px-2 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
        {NAV_LINKS.map(({ to, shortLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition-colors',
                isActive
                  ? 'bg-emerald-600 text-white shadow-[var(--shadow-soft)]'
                  : 'text-emerald-950/70 hover:bg-emerald-50',
              ].join(' ')
            }
          >
            <Icon className="mb-1 h-5 w-5" aria-hidden />
            <span className="leading-none">{shortLabel}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
