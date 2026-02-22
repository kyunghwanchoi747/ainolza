'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export function SEOSettingsForm({ defaultValues }: { defaultValues: any }) {
  const [values, setValues] = useState({
    siteTitle: defaultValues.siteTitle ?? '',
    siteDescription: defaultValues.siteDescription ?? '',
    siteKeywords: defaultValues.siteKeywords ?? '',
    googleAnalyticsId: defaultValues.googleAnalyticsId ?? '',
    naverVerification: defaultValues.naverVerification ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/manager/globals/seo-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Field = ({ label, name, type = 'text', placeholder }: { label: string; name: keyof typeof values; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={values[name] as string}
          onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      ) : (
        <input
          type={type}
          value={values[name] as string}
          onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="사이트 제목" name="siteTitle" placeholder="AI놀자" />
      <Field label="사이트 설명" name="siteDescription" type="textarea" placeholder="사이트 메타 설명..." />
      <Field label="키워드" name="siteKeywords" placeholder="AI, 교육, 강의" />
      <Field label="Google Analytics ID" name="googleAnalyticsId" placeholder="G-XXXXXXXXXX" />
      <Field label="네이버 웹마스터 인증코드" name="naverVerification" placeholder="인증 코드" />
      <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {saved && <Check size={14} />}
        {saving ? '저장 중...' : saved ? '저장 완료!' : '저장'}
      </button>
    </form>
  )
}
