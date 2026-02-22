'use client'

import { useCallback, useRef, useState } from 'react'
import { Puck } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import '@puckeditor/core/dist/index.css'
import { puckConfig } from '@/lib/puck/config'
import { Save } from 'lucide-react'

interface PuckEditorProps {
  pageId: string | number
  initialData: Data
  onSaved?: () => void
}

function SaveDraftButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        color: '#475569',
        fontSize: 13,
        fontWeight: 600,
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.6 : 1,
      }}
    >
      <Save size={13} />
      {saving ? '저장 중...' : '초안 저장'}
    </button>
  )
}

export default function PuckEditor({ pageId, initialData, onSaved }: PuckEditorProps) {
  const [saving, setSaving] = useState(false)
  const currentDataRef = useRef<Data>(initialData)

  const handleChange = useCallback((data: Data) => {
    currentDataRef.current = data
  }, [])

  const saveDraft = useCallback(async () => {
    setSaving(true)
    try {
      await fetch(`/api/manager/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puckData: currentDataRef.current }),
      })
      onSaved?.()
    } finally {
      setSaving(false)
    }
  }, [pageId, onSaved])

  const handlePublish = useCallback(
    async (data: Data) => {
      await fetch(`/api/manager/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puckData: data, status: 'published' }),
      })
      onSaved?.()
    },
    [pageId, onSaved],
  )

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={handlePublish}
      onChange={handleChange}
      overrides={{
        headerActions: ({ children }) => (
          <>
            <SaveDraftButton onClick={saveDraft} saving={saving} />
            {children}
          </>
        ),
      }}
    />
  )
}
