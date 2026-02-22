import React from 'react'
import { HomeClient } from './HomeClient'
import { getPayload } from '@/lib/payload'
import { Render } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck/config'
import '@puckeditor/core/dist/index.css'

async function getHomePuckPage() {
  try {
    const payload = await getPayload()
    const result = await (payload as any).find({
      collection: 'pages',
      where: { slug: { equals: 'home' }, status: { equals: 'published' } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

async function getHomeContent() {
  try {
    const payload = await getPayload()
    const hero = await payload.findGlobal({ slug: 'hero' })
    return hero
  } catch (err) {
    console.error('Failed to fetch Hero content:', err)
    return null
  }
}

export default async function HomePage() {
  const puckPage = await getHomePuckPage()

  if (puckPage?.puckData) {
    return <Render config={puckConfig} data={puckPage.puckData as Data} />
  }

  const content = await getHomeContent()
  return <HomeClient content={content} />
}
