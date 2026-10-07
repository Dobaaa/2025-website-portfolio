import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageSquareQuote,
  Settings,
} from 'lucide-react'
import api from '../api'

const links = [
  { to: '/', label: 'نظرة عامة', icon: LayoutDashboard },
  { to: '/projects', label: 'المشاريع', icon: FolderKanban },
  { to: '/testimonials', label: 'التقييمات', icon: MessageSquareQuote },
  { to: '/experiences', label: 'الخبرات', icon: Briefcase },
  { to: '/social', label: 'روابط التواصل', icon: Link2 },
  { to: '/settings', label: 'الإعدادات والسيرة', icon: Settings },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="border-l border-white/10 bg-panel p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-purple">Portfolio CMS</p>
        <h1 className="mt-2 text-xl font-bold">لوحة التحكم</h1>
        <nav className="mt-8 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </aside>
      <main className="p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
