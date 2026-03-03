import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    const uploadedAssets: string[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      const mediaDoc = await payload.create({
        collection: 'media',
        data: {
          alt: file.name,
        },
        file: {
          data: buffer,
          mimetype: file.type,
          name: file.name,
          size: file.size,
        },
      })

      if (mediaDoc.url) {
        uploadedAssets.push(mediaDoc.url)
      }
    }

    // GrapeJS expects { data: [...urls] }
    return NextResponse.json({ data: uploadedAssets })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
