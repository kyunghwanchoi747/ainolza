import React from 'react'
import { HomeClient } from './HomeClient'
import { getPayload } from '@/lib/payload'

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
  const content = await getHomeContent()
  return <HomeClient content={content} />
}
