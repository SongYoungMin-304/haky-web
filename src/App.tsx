import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getMe } from './api/auth'
import Layout from './components/Layout'
import AdminClassesPage from './pages/AdminClassesPage'
import AdminPointsPage from './pages/AdminPointsPage'
import ClassDetailPage from './pages/ClassDetailPage'
import ClassFormPage from './pages/ClassFormPage'
import ClassListPage from './pages/ClassListPage'
import CoachClassesPage from './pages/CoachClassesPage'
import CoachTeamsPage from './pages/CoachTeamsPage'
import LoginPage from './pages/LoginPage'
import MyBookingsPage from './pages/MyBookingsPage'
import MyPointsPage from './pages/MyPointsPage'
import MyTeamPage from './pages/MyTeamPage'
import PointRequestPage from './pages/PointRequestPage'
import SignupPage from './pages/SignupPage'
import TeamListPage from './pages/TeamListPage'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { token, setUser } = useAuthStore()

  useEffect(() => {
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => {})
    }
  }, [token, setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/teams" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="classes" element={<ClassListPage />} />
          <Route path="classes/:id" element={<ClassDetailPage />} />
          <Route path="my/points" element={<MyPointsPage />} />
          <Route path="my/points/request" element={<PointRequestPage />} />
          <Route path="my/bookings" element={<MyBookingsPage />} />
          <Route path="my/teams" element={<MyTeamPage />} />
          <Route path="teams" element={<TeamListPage />} />
          <Route path="coach/classes" element={<CoachClassesPage />} />
          <Route path="coach/classes/new" element={<ClassFormPage />} />
          <Route path="coach/classes/:id/edit" element={<ClassFormPage />} />
          <Route path="coach/teams" element={<CoachTeamsPage />} />
          <Route path="admin/points" element={<AdminPointsPage />} />
          <Route path="admin/classes" element={<AdminClassesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
