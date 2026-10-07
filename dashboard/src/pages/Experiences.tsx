import { FormEvent, useEffect, useState } from 'react'
import api from '../api'
import type { Experience } from '../types'

const empty = {
  title: '',
  description: '',
  sort_order: 0,
  is_published: true,
}

export default function Experiences() {
  const [items, setItems] = useState<Experience[]>([])
  const [form, setForm] = useState(empty)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [editing, setEditing] = useState<number | null>(null)

  async function load() {
    const { data } = await api.get('/experiences')
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('description', form.description)
    payload.append('sort_order', String(form.sort_order))
    payload.append('is_published', form.is_published ? '1' : '0')
    if (thumbnail) payload.append('thumbnail', thumbnail)
    if (editing) {
      await api.post(`/experiences/${editing}`, payload)
    } else {
      await api.post('/experiences', payload)
    }
    setForm(empty)
    setThumbnail(null)
    setEditing(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('حذف هذه الخبرة؟')) return
    await api.delete(`/experiences/${id}`)
    load()
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <div>
        <h2 className="text-3xl font-bold">الخبرات السابقة</h2>
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-panel p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-slate-300">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(item.id)
                    setForm({
                      title: item.title,
                      description: item.description || '',
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
        <h3 className="text-lg font-bold">{editing ? 'تعديل خبرة' : 'خبرة جديدة'}</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label>المسمى</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label>الوصف</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label>أيقونة / صورة</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
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
