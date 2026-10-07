import { FormEvent, useEffect, useState } from 'react'
import api from '../api'
import type { Testimonial } from '../types'

const empty = {
  quote: '',
  name: '',
  title: '',
  sort_order: 0,
  is_published: true,
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [form, setForm] = useState(empty)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [editing, setEditing] = useState<number | null>(null)

  async function load() {
    const { data } = await api.get('/testimonials')
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = new FormData()
    payload.append('quote', form.quote)
    payload.append('name', form.name)
    payload.append('title', form.title)
    payload.append('sort_order', String(form.sort_order))
    payload.append('is_published', form.is_published ? '1' : '0')
    if (avatar) payload.append('avatar', avatar)
    if (editing) {
      await api.post(`/testimonials/${editing}`, payload)
    } else {
      await api.post('/testimonials', payload)
    }
    setForm(empty)
    setAvatar(null)
    setEditing(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('حذف هذا التقييم؟')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <div>
        <h2 className="text-3xl font-bold">التقييمات</h2>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-panel p-5">
              <p className="text-slate-200">“{item.quote}”</p>
              <p className="mt-3 font-semibold">{item.name}</p>
              <p className="text-sm text-slate-400">{item.title}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(item.id)
                    setForm({
                      quote: item.quote,
                      name: item.name,
                      title: item.title || '',
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
            </article>
          ))}
        </div>
      </div>
      <form onSubmit={onSubmit} className="h-fit rounded-2xl border border-white/10 bg-panel p-5">
        <h3 className="text-lg font-bold">{editing ? 'تعديل تقييم' : 'تقييم جديد'}</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label>الرأي</label>
            <textarea rows={5} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
          </div>
          <div>
            <label>الاسم</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label>المسمى</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label>صورة</label>
            <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            منشور
          </label>
        </div>
        <button className="mt-5 w-full rounded-xl bg-purple py-3 font-semibold text-night">حفظ</button>
      </form>
    </div>
  )
}
