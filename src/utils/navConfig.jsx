import {
  BookOpen,
  Brain,
  LayoutDashboard,
  Mic,
  ScanLine,
} from 'lucide-react'
import { ROUTES } from './routes'

export const NAV_LINKS = [
  {
    to: ROUTES.home,
    label: 'Home',
    shortLabel: 'Home',
    icon: LayoutDashboard,
  },
  {
    to: ROUTES.narrative,
    label: 'Narrative Learning',
    shortLabel: 'Story',
    icon: BookOpen,
  },
  {
    to: ROUTES.tutor,
    label: 'Voice Tutor',
    shortLabel: 'Tutor',
    icon: Mic,
  },
  {
    to: ROUTES.quiz,
    label: 'Adaptive Quiz',
    shortLabel: 'Quiz',
    icon: Brain,
  },
  {
    to: ROUTES.synthesis,
    label: 'Knowledge Maps',
    shortLabel: 'Maps',
    icon: ScanLine,
  },
]
