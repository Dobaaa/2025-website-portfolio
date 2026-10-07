import { FormEvent, useEffect, useState } from 'react'
import api from '../api'
import type { Settings } from '../types'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [heroImage, setHeroImage] = useState<File | null>(null)
  const [cv, setCv] = useState<File | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data))
  }, [])

  async function saveSettings(event: FormEvent) {
    event.preventDefault()
    if (!settings) return
    const form = new FormData()
    form.append('hero_label', settings.hero_label || '')
    form.append('hero_title', settings.hero_title || '')
    form.append('hero_subtitle', settings.hero_subtitle || '')
    form.append('footer_heading', settings.footer_heading || '')
    form.append('footer_text', settings.footer_text || '')
    form.append('contact_email', settings.contact_email || '')
    form.append('copyright_text', settings.copyright_text || '')
    form.append('confidential_default_message', settings.confidential_default_message || '')
    if (heroImage) form.append('hero_image', heroImage)
    if (cv) form.append('cv', cv)
    const { data } = await api.post('/settings', form)
    setSettings(data)
    setMessage('تم حفظ إعدادات الموقع والـ CV')
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault()
    await api.put('/password', {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    })
    setCurrentPassword('')
    setPassword('')
    setPasswordConfirmation('')
    setMessage('تم تحديث كلمة المرور')
  }

  if (!settings) return <p>جاري التحميل...</p>

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold">الإعدادات والسيرة الذاتية</h2>
        <p className="mt-2 text-slate-400">تحكم في الهيرو، التواصل، رسالة المشاريع الخاصة، وملف الـ CV.</p>
      </div>
      {message ? <p className="rounded-xl bg-emerald-500/10 p-3 text-emerald-300">{message}</p> : null}
      <form onSubmit={saveSettings} className="space-y-4 rounded-2xl border border-white/10 bg-panel p-6">
        <div>
          <label>عنوان صغير فوق الهيرو</label>
          <input
            value={settings.hero_label || ''}
            onChange={(e) => setSettings({ ...settings, hero_label: e.target.value })}
          />
        </div>
        <div>
          <label>عنوان الهيرو</label>
          <input
            value={settings.hero_title || ''}
            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
          />
        </div>
        <div>
          <label>الوصف تحت العنوان</label>
          <textarea
            rows={3}
            value={settings.hero_subtitle || ''}
            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
          />
        </div>
        <div>
          <label>صورة الهيرو</label>
          <input type="file" accept="image/*" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label>عنوان الفوتر</label>
          <input
            value={settings.footer_heading || ''}
            onChange={(e) => setSettings({ ...settings, footer_heading: e.target.value })}
          />
        </div>
        <div>
          <label>نص الفوتر</label>
          <textarea
            rows={3}
            value={settings.footer_text || ''}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
          />
        </div>
        <div>
          <label>إيميل التواصل</label>
          <input
            type="email"
            value={settings.contact_email || ''}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
          />
        </div>
        <div>
          <label>رسالة المشاريع الخاصة الافتراضية</label>
          <textarea
            rows={4}
            value={settings.confidential_default_message || ''}
            onChange={(e) => setSettings({ ...settings, confidential_default_message: e.target.value })}
          />
        </div>
        <div>
          <label>رفع CV جديد (PDF)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files?.[0] || null)} />
          {settings.cv_path ? (
            <a href={settings.cv_path} className="mt-2 inline-block text-sm text-purple" target="_blank" rel="noreferrer">
              تحميل الملف الحالي: {settings.cv_original_name || 'CV'}
            </a>
          ) : (
            <p className="mt-2 text-sm text-slate-400">لا يوجد CV مرفوع بعد.</p>
          )}
        </div>
        <button className="rounded-xl bg-purple px-5 py-3 font-semibold text-night">حفظ الإعدادات</button>
      </form>

      <form onSubmit={savePassword} className="space-y-4 rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="text-xl font-bold">تغيير كلمة المرور</h3>
        <div>
          <label>الحالية</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label>الجديدة</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>تأكيد الجديدة</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button className="rounded-xl border border-white/15 px-5 py-3">تحديث كلمة المرور</button>
      </form>
    </div>
  )
}
