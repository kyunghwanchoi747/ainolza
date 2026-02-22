'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface ShopSettingsFormProps {
  defaultValues: {
    currency?: string
    baseShippingFee?: number
    freeShippingThreshold?: number
  }
}

export function ShopSettingsForm({ defaultValues }: ShopSettingsFormProps) {
  const [values, setValues] = useState({
    currency: defaultValues.currency ?? '원',
    baseShippingFee: defaultValues.baseShippingFee ?? 3000,
    freeShippingThreshold: defaultValues.freeShippingThreshold ?? 50000,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/manager/globals/shop-settings', {
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
        <label className="block text-sm font-medium text-slate-700 mb-1.5">통화</label>
        <input
          type="text"
          value={values.currency}
          onChange={(e) => setValues((v) => ({ ...v, currency: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">기본 배송비 (원)</label>
        <input
          type="number"
          value={values.baseShippingFee}
          onChange={(e) => setValues((v) => ({ ...v, baseShippingFee: Number(e.target.value) }))}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">무료배송 기준금액 (원)</label>
        <input
          type="number"
          value={values.freeShippingThreshold}
          onChange={(e) => setValues((v) => ({ ...v, freeShippingThreshold: Number(e.target.value) }))}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400 mt-1">이 금액 이상 구매 시 배송비 무료</p>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saved ? <Check size={14} /> : null}
        {saving ? '저장 중...' : saved ? '저장 완료!' : '저장'}
      </button>
    </form>
  )
}
