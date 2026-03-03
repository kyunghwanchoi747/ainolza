'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) {
      toast.error('이름과 내용을 입력해주세요.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/manager/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment',
          postId,
          author: author.trim(),
          content: content.trim(),
        }),
      })

      if (res.ok) {
        const newComment: any = await res.json()
        setComments(prev => [...prev, {
          id: String(newComment.id),
          author: newComment.author,
          content: newComment.content,
          createdAt: newComment.createdAt,
        }])
        setContent('')
        toast.success('댓글이 등록되었습니다.')
      } else {
        toast.error('댓글 등록에 실패했습니다.')
      }
    } catch {
      toast.error('오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">댓글 {comments.length}개</h3>

      {/* Comment list */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="이름"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="max-w-xs"
        />
        <textarea
          placeholder="댓글을 입력하세요..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? '등록 중...' : '댓글 등록'}
        </Button>
      </form>
    </div>
  )
}
