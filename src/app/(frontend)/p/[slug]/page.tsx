import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Render } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck/config'
import '@puckeditor/core/dist/index.css'
import type { Metadata } from 'next'

async function getPage(slug: string) {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const result = await payload.find({
      collection: 'pages' as any,
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: '페이지 없음' }
  return {
    title: (page as any).seoTitle || (page as any).title,
    description: (page as any).seoDescription || undefined,
    keywords: (page as any).seoKeywords || undefined,
  }
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) notFound()

  const puckData: Data = (page as any).puckData ?? { content: [], root: { props: {} } }

  return <Render config={puckConfig} data={puckData} />
}
