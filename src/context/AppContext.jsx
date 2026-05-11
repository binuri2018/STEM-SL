import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const AppContext = createContext(null)

const initialStudent = {
  name: 'Imandi Perera',
  /** Stable learner id shown in quiz / reports (replace with auth when available). */
  studentId: 'STU-SL-10-2010-8842',
  grade: 'Grade 10',
  school: 'Govigama Maha Vidyalaya',
  streakDays: 5,
  focusSubject: "Physics • Ohm's Law",
}

const initialWeekly = [
  { label: 'Mon', minutes: 35 },
  { label: 'Tue', minutes: 20 },
  { label: 'Wed', minutes: 45 },
  { label: 'Thu', minutes: 15 },
  { label: 'Fri', minutes: 40 },
  { label: 'Sat', minutes: 55 },
  { label: 'Sun', minutes: 25 },
]

export function AppProvider({ children }) {
  const [student] = useState(initialStudent)
  const [weeklyMinutes] = useState(initialWeekly)
  const [emotionQuiz, setEmotionQuiz] = useState(
    /** @type {'neutral' | 'happy' | 'confused' | 'stressed'} */ ('neutral'),
  )
  const [tutorMemoryTopic, setTutorMemoryTopic] = useState("Ohm's Law (V = IR)")

  const weeklyTotal = useMemo(
    () => weeklyMinutes.reduce((a, d) => a + d.minutes, 0),
    [weeklyMinutes],
  )

  const resetQuizEmotion = useCallback(() => setEmotionQuiz('neutral'), [])

  const value = useMemo(
    () => ({
      student,
      weeklyMinutes,
      weeklyTotal,
      emotionQuiz,
      setEmotionQuiz,
      resetQuizEmotion,
      tutorMemoryTopic,
      setTutorMemoryTopic,
    }),
    [
      student,
      weeklyMinutes,
      weeklyTotal,
      emotionQuiz,
      resetQuizEmotion,
      tutorMemoryTopic,
      setTutorMemoryTopic,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
