import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Projects from './pages/Projects'
import ProjectForm from './pages/ProjectForm'
import Testimonials from './pages/Testimonials'
import Experiences from './pages/Experiences'
import SocialLinks from './pages/SocialLinks'
import Settings from './pages/Settings'

function Protected({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectForm />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="experiences" element={<Experiences />} />
        <Route path="social" element={<SocialLinks />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
