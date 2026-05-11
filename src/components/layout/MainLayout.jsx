import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar.jsx'
import { Sidebar } from './Sidebar.jsx'
import { Footer } from './Footer.jsx'
import { MobileBottomNav } from './MobileBottomNav.jsx'
import { PageTransition } from '../common/PageTransition.jsx'

export function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-gradient-to-br from-white via-emerald-50/35 to-[#ecfdf5] text-emerald-950">
      <div className="flex min-h-dvh">
        <Sidebar
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        <div className="flex min-h-dvh flex-1 flex-col lg:pb-0">
          <Navbar onOpenSidebar={() => setMobileNavOpen(true)} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 lg:px-8 lg:pb-12 lg:pt-10">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
