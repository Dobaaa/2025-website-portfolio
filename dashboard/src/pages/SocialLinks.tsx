import { FormEvent, useEffect, useState } from 'react'
import api from '../api'
import type { SocialLink } from '../types'

const empty = { name: '', url: '', icon: '', sort_order: 0, is_published: true }

export default function SocialLinks() {
  const [items, setItems] = useState<SocialLink[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)

  async function load() {
    const { data } = await api.get('/social-links')
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (editing) {
      await api.put(`/social-links/${editing}`, form)
    } else {
      await api.post('/social-links', form)
    }
    setForm(empty)
    setEditing(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('حذف هذا الرابط؟')) return
    await api.delete(`/social-links/${id}`)
    load()
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <div>
        <h2 className="text-3xl font-bold">روابط التواصل</h2>
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-panel p-5">
              <p className="font-semibold">{item.name}</p>
              <a href={item.url} className="text-sm text-purple" target="_blank" rel="noreferrer">
                {item.url}
              </a>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(item.id)
                    setForm({
                      name: item.name,
                      url: item.url,
                      icon: item.icon || '',
                      sort_order: item.sort_order,
                      is_published: item.is_published,
                    })
                  }}
                  className="rounded-lg border border-white/15 px-3 py-1"
                >
                  تعديل
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="rounded-lg border border-red-400/30 px-3 py-1 text-red-300"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={onSubmit} className="h-fit rounded-2xl border border-white/10 bg-panel p-5">
        <h3 className="text-lg font-bold">{editing ? 'تعديل رابط' : 'رابط جديد'}</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label>الاسم</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label>الرابط</label>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          </div>
          <div>
            <label>أيقونة</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          </div>
        </div>
        <button className="mt-5 w-full rounded-xl bg-purple py-3 font-semibold text-night">حفظ</button>
      </form>
    </div>
  )
}
