'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export function PaymentSettingsForm({ defaultValues }: { defaultValues: any }) {
  const [values, setValues] = useState({
    pgProvider: defaultValues.pgProvider ?? 'toss',
    merchantId: defaultValues.merchantId ?? '',
    apiKey: defaultValues.apiKey ?? '',
    secretKey: defaultValues.secretKey ?? '',
    testMode: defaultValues.testMode ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/manager/globals/payment-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">PG사</label>
        <select
          value={values.pgProvider}
          onChange={(e) => setValues((v) => ({ ...v, pgProvider: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="toss">토스페이먼츠</option>
          <option value="inicis">KG이니시스</option>
          <option value="portone">PortOne</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">상점 ID (MID)</label>
        <input
          type="text"
          value={values.merchantId}
          onChange={(e) => setValues((v) => ({ ...v, merchantId: e.target.value }))}
          placeholder="상점 ID 입력"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">API 키</label>
        <input
          type="password"
          value={values.apiKey}
          onChange={(e) => setValues((v) => ({ ...v, apiKey: e.target.value }))}
          placeholder="API 키 입력"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="testMode"
          checked={values.testMode}
          onChange={(e) => setValues((v) => ({ ...v, testMode: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded border-slate-300"
        />
        <label htmlFor="testMode" className="text-sm text-slate-700">테스트 모드 활성화</label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saved && <Check size={14} />}
        {saving ? '저장 중...' : saved ? '저장 완료!' : '저장'}
      </button>
    </form>
  )
}
