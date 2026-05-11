import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout.jsx'
import AdaptiveQuiz from './pages/AdaptiveQuiz.jsx'
import Dashboard from './pages/Dashboard.jsx'
import KnowledgeSynthesis from './pages/KnowledgeSynthesis.jsx'
import NarrativeLearning from './pages/NarrativeLearning.jsx'
import VoiceTutor from './pages/VoiceTutor.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="learn" element={<NarrativeLearning />} />
        <Route path="tutor" element={<VoiceTutor />} />
        <Route path="quiz" element={<AdaptiveQuiz />} />
        <Route path="synthesis" element={<KnowledgeSynthesis />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
