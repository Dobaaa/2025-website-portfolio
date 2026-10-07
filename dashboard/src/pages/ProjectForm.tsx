import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import type { AccessType, Project } from '../types'
import ProjectPreview from '../components/ProjectPreview'

const defaultMessage =
  'This project is a private dashboard that controls another business, so I can\'t share a live link. You can browse the screenshots here, and I can walk you through the system in a meeting.'

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [details, setDetails] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [accessType, setAccessType] = useState<AccessType>('public')
  const [confidentialMessage, setConfidentialMessage] = useState(defaultMessage)
  const [technologies, setTechnologies] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [published, setPublished] = useState(true)
  const [cover, setCover] = useState<File | null>(null)
  const [gallery, setGallery] = useState<FileList | null>(null)
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get(`/projects/${id}`).then(({ data }: { data: Project }) => {
      setProject(data)
      setTitle(data.title)
      setShortDescription(data.short_description || '')
      setDetails(data.details || '')
      setLiveUrl(data.live_url || '')
      setGithubUrl(data.github_url || '')
      setAccessType(data.access_type)
      setConfidentialMessage(data.confidential_message || defaultMessage)
      setTechnologies((data.technologies || []).join(', '))
      setSortOrder(data.sort_order)
      setPublished(data.is_published)
    })
  }, [id])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData()
    form.append('title', title)
    form.append('short_description', shortDescription)
    form.append('details', details)
    form.append('live_url', liveUrl)
    form.append('github_url', githubUrl)
    form.append('access_type', accessType)
    form.append('confidential_message', confidentialMessage)
    form.append('technologies', technologies)
    form.append('sort_order', String(sortOrder))
    form.append('is_published', published ? '1' : '0')
    form.append('removed_image_ids', JSON.stringify(removedImageIds))
    if (cover) form.append('cover_image', cover)
    if (gallery) {
      Array.from(gallery).forEach((file) => form.append('gallery[]', file))
    }

    try {
      if (id) {
        await api.post(`/projects/${id}`, form)
      } else {
        await api.post('/projects', form)
      }
      navigate('/projects')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'تعذر حفظ المشروع'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const remainingImages = (project?.images || []).filter((image) => !removedImageIds.includes(image.id))
  const previewProject: Project = {
    id: Number(id || 0),
    title,
    short_description: shortDescription,
    details,
    cover_image: project?.cover_image,
    live_url: liveUrl || null,
    github_url: githubUrl || null,
    access_type: accessType,
    confidential_message: confidentialMessage,
    technologies: technologies.split(',').map((item) => item.trim()).filter(Boolean),
    sort_order: sortOrder,
    is_published: published,
    images: remainingImages,
    popup: {
      details,
      images: remainingImages,
      can_open_live: accessType === 'public' && Boolean(liveUrl),
      live_url: accessType === 'public' ? liveUrl : null,
      github_url: accessType === 'public' ? githubUrl : null,
      confidential_message: accessType === 'confidential' ? confidentialMessage : null,
      access_type: accessType,
    },
  }

  return (
    <div className="max-w-4xl">
      <Link to="/projects" className="text-sm text-purple">
        العودة للمشاريع
      </Link>
      <h2 className="mt-3 text-3xl font-bold">{id ? 'تعديل المشروع' : 'مشروع جديد'}</h2>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label>العنوان</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>وصف مختصر يظهر في الكارت</label>
          <textarea rows={3} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div>
          <label>تفاصيل البوب أب</label>
          <textarea rows={6} value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label>لينك الموقع الحي</label>
            <input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              disabled={accessType === 'confidential'}
              placeholder="https://"
            />
          </div>
          <div>
            <label>لينك GitHub</label>
            <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://" />
          </div>
        </div>
        <div>
          <label>نوع المشروع</label>
          <select value={accessType} onChange={(e) => setAccessType(e.target.value as AccessType)}>
            <option value="public">علني وله لينك</option>
            <option value="confidential">داشبورد خاصة بدون لينك</option>
          </select>
        </div>
        {accessType === 'confidential' ? (
          <div>
            <label>رسالة الخصوصية بدل اللينك</label>
            <textarea
              rows={4}
              value={confidentialMessage}
              onChange={(e) => setConfidentialMessage(e.target.value)}
            />
          </div>
        ) : null}
        <div>
          <label>التقنيات (مفصولة بفاصلة)</label>
          <input value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label>الترتيب</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </div>
          <label className="mt-7 flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            منشور
          </label>
        </div>
        <div>
          <label>صورة الغلاف</label>
          <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
        </div>
        {remainingImages.length ? (
          <div className="grid grid-cols-3 gap-3">
            {remainingImages.map((image) => (
              <div key={image.id} className="relative">
                <img src={image.image_path} alt="" className="h-28 w-full rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => setRemovedImageIds((current) => [...current, image.id])}
                  className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <div>
          <label>صور إضافية للبوب أب</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setGallery(e.target.files)} />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex gap-3">
          <button disabled={saving} className="rounded-xl bg-purple px-5 py-3 font-semibold text-night">
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-xl border border-white/15 px-5 py-3"
          >
            معاينة البوب أب
          </button>
        </div>
      </form>
      {previewOpen ? <ProjectPreview project={previewProject} onClose={() => setPreviewOpen(false)} /> : null}
    </div>
  )
}
