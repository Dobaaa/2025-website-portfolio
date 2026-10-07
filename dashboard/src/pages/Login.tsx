import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('elhwtdoba@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/login', { email, password })
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { email?: string[] } } }).response?.data?.email?.[0] ||
        'تعذر تسجيل الدخول'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-panel p-8 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-purple">Ahmed Jamal</p>
        <h1 className="mt-3 text-2xl font-bold">لوحة تحكم البورتفوليو</h1>
        <p className="mt-2 text-sm text-slate-400">أدخل بيانات الدخول للتحكم في المحتوى.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label>البريد</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label>كلمة المرور</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-purple px-4 py-3 font-semibold text-night"
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
