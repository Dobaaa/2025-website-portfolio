import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import type { Stats } from '../types'

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data))
  }, [])

  const cards = [
    { label: 'كل المشاريع', value: stats?.projects ?? 0 },
    { label: 'منشورة', value: stats?.published_projects ?? 0 },
    { label: 'داشبورد خاصة', value: stats?.confidential_projects ?? 0 },
    { label: 'التقييمات', value: stats?.testimonials ?? 0 },
    { label: 'الخبرات', value: stats?.experiences ?? 0 },
    { label: 'ملف الـ CV', value: stats?.cv_uploaded ? 'مرفوع' : 'غير مرفوع' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold">نظرة عامة</h2>
      <p className="mt-2 text-slate-400">
        تحكم في المشاريع، التقييمات، الخبرات، والسيرة الذاتية. تصميم الموقع الحالي لم يتغير بعد.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-panel p-5">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <Link
        to="/projects/new"
        className="mt-8 inline-flex rounded-xl bg-purple px-5 py-3 font-semibold text-night"
      >
        إضافة مشروع
      </Link>
    </div>
  )
}
