'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const GrapesEditor = dynamic(
  () => import('@/components/manager/GrapesEditor'),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1a2e', color: 'white' }}>
        <p>에디터 로딩 중...</p>
      </div>
    ),
  }
)

interface PageMeta {
  title: string
  slug: string
  status: string
}

export default function EditorPage() {
  const params = useParams()
  const pageId = params.id as string
  const isNew = pageId === 'new'
  const [initialData, setInitialData] = useState<Record<string, any> | undefined>(undefined)
  const [initialMeta, setInitialMeta] = useState<PageMeta | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/manager/pages?id=${pageId}`)
        .then(res => res.json())
        .then((data: any) => {
          if (data?.projectData) {
            setInitialData(data.projectData)
          }
          setInitialMeta({
            title: data?.title || '',
            slug: data?.slug || '',
            status: data?.status || 'draft',
          })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [pageId, isNew])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1a2e', color: 'white' }}>
        <p>페이지 데이터 로딩 중...</p>
      </div>
    )
  }

  return (
    <GrapesEditor
      pageId={isNew ? undefined : pageId}
      initialData={initialData}
      initialMeta={initialMeta}
    />
  )
}
