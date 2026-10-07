import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import api from '../api'
import type { Project } from '../types'
import ProjectPreview from '../components/ProjectPreview'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [preview, setPreview] = useState<Project | null>(null)

  async function load() {
    const { data } = await api.get('/projects')
    setProjects(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function remove(id: number) {
    if (!confirm('حذف هذا المشروع؟')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">المشاريع</h2>
          <p className="mt-2 text-slate-400">
            المشاريع العامة لها لينك. مشاريع الداشبورد الخاصة تظهر رسالة بدل اللينك.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-purple px-4 py-2 font-semibold text-night"
        >
          <Plus size={16} /> مشروع جديد
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-right text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="p-4">المشروع</th>
              <th className="p-4">النوع</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-white/10">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt=""
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded-lg bg-white/5" />
                    )}
                    <div>
                      <p className="font-semibold">{project.title}</p>
                      <p className="line-clamp-1 max-w-md text-slate-400">
                        {project.short_description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {project.access_type === 'confidential' ? 'داشبورد خاصة' : 'علنية'}
                </td>
                <td className="p-4">{project.is_published ? 'منشور' : 'مخفي'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreview(project)}
                      className="rounded-lg border border-white/15 px-3 py-1"
                    >
                      معاينة البوب أب
                    </button>
                    <Link
                      to={`/projects/${project.id}`}
                      className="rounded-lg border border-white/15 px-3 py-1"
                    >
                      تعديل
                    </Link>
                    <button
                      onClick={() => remove(project.id)}
                      className="rounded-lg border border-red-400/30 px-3 py-1 text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {preview ? <ProjectPreview project={preview} onClose={() => setPreview(null)} /> : null}
    </div>
  )
}
