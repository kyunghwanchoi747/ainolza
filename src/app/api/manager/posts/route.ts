import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const post = await payload.findByID({ collection: 'posts', id })

      // Fetch comments for this post
      const comments = await payload.find({
        collection: 'comments',
        where: { post: { equals: id } },
        sort: '-createdAt',
        limit: 100,
      })

      return NextResponse.json({ ...post, comments: comments.docs })
    }

    const posts = await payload.find({
      collection: 'posts',
      sort: '-updatedAt',
      limit: 100,
    })
    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()

    // Check if this is a comment creation
    if (body.type === 'comment') {
      const { postId, author, content } = body
      const created = await payload.create({
        collection: 'comments',
        data: { post: postId, author, content, status: 'approved' },
      })
      return NextResponse.json(created)
    }

    // Regular post creation
    const { title, content, author, category, status, pinned } = body
    const created = await payload.create({
      collection: 'posts',
      data: {
        title: title || 'Untitled',
        content: content || '',
        author: author || '관리자',
        category: category || 'free',
        status: status || 'draft',
        pinned: pinned || false,
        views: 0,
      },
    })
    return NextResponse.json(created)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body: any = await req.json()
    const { id, ...fields } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updateData[key] = value
    }

    const updated = await payload.update({ collection: 'posts', id, data: updateData })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const commentId = searchParams.get('commentId')

    if (commentId) {
      await payload.delete({ collection: 'comments', id: commentId })
      return NextResponse.json({ success: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Delete all comments for this post first
    const comments = await payload.find({
      collection: 'comments',
      where: { post: { equals: id } },
      limit: 1000,
    })
    for (const comment of comments.docs) {
      await payload.delete({ collection: 'comments', id: String(comment.id) })
    }

    await payload.delete({ collection: 'posts', id })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
