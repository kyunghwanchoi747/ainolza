import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const platformLabels: Record<string, string> = {
  windows: 'Windows',
  mac: 'Mac',
  linux: 'Linux',
  web: 'Web',
  all: '전체',
}

const categoryLabels: Record<string, string> = {
  utility: '유틸리티',
  'ai-tool': 'AI 도구',
  plugin: '플러그인',
  other: '기타',
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'programs',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })

  const program = result.docs[0] as any
  if (!program) return notFound()

  return (
    <div className="container max-w-screen-lg px-4 py-8">
      <Link href="/programs" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        &larr; 프로그램 목록으로 돌아가기
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Thumbnail */}
        <div className="rounded-xl overflow-hidden bg-muted">
          {program.thumbnail?.url ? (
            <img src={program.thumbnail.url} alt={program.title} className="w-full h-full object-cover" />
          ) : (
            <div className="aspect-video flex items-center justify-center">
              <Download className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {program.category && (
              <Badge variant="secondary">
                {categoryLabels[program.category] || program.category}
              </Badge>
            )}
            <Badge variant="outline">
              {platformLabels[program.platform] || program.platform}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold mb-2">{program.title}</h1>

          {program.version && (
            <p className="text-sm text-muted-foreground mb-4">버전 {program.version}</p>
          )}

          {program.description && (
            <p className="text-muted-foreground mb-6">{program.description}</p>
          )}

          {program.downloadUrl ? (
            <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full gap-2">
                <Download className="h-5 w-5" />
                다운로드
              </Button>
            </a>
          ) : (
            <Button size="lg" className="w-full" disabled>
              다운로드 링크 준비 중
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
