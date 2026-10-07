import { X } from 'lucide-react'
import type { Project } from '../types'

export default function ProjectPreview({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const popup = project.popup
  const images = popup.images?.length ? popup.images : project.cover_image
    ? [{ id: 0, image_path: project.cover_image }]
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-white/10 bg-night p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple">Project details</p>
            <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/15 p-2">
            <X size={16} />
          </button>
        </div>
        <p className="mt-4 text-slate-300">{project.short_description}</p>
        <p className="mt-3 whitespace-pre-line text-slate-200">{project.details}</p>
        {images.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.image_path}
                alt={image.caption || project.title}
                className="h-40 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        ) : null}
        <div className="mt-6 rounded-2xl border border-white/10 bg-panel p-4">
          {popup.access_type === 'confidential' ? (
            <p className="text-slate-200">{popup.confidential_message}</p>
          ) : (
            <div className="space-y-2">
              {popup.live_url ? (
                <a href={popup.live_url} target="_blank" rel="noreferrer" className="block text-purple">
                  فتح الموقع الحي
                </a>
              ) : null}
              {popup.github_url ? (
                <a href={popup.github_url} target="_blank" rel="noreferrer" className="block text-purple">
                  فتح GitHub
                </a>
              ) : null}
              {!popup.live_url && !popup.github_url ? (
                <p className="text-slate-400">لا يوجد لينك حالياً.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
