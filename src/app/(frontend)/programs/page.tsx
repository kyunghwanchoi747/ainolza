import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
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

export default async function ProgramsPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'programs',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  const programs = result.docs as any[]
  const featured = programs.filter(p => p.featured)
  const regular = programs.filter(p => !p.featured)

  return (
    <div className="container max-w-screen-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">프로그램</h1>
        <p className="text-muted-foreground mt-2">유용한 AI 도구와 유틸리티를 다운로드하세요.</p>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-20">
          <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">아직 등록된 프로그램이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...featured, ...regular].map((program: any) => (
            <Link
              key={program.id}
              href={`/programs/${program.slug}`}
              className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {program.thumbnail?.url ? (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={program.thumbnail.url}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {program.category && (
                    <Badge variant="secondary" className="text-xs">
                      {categoryLabels[program.category] || program.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {platformLabels[program.platform] || program.platform}
                  </Badge>
                  {program.version && (
                    <span className="text-xs text-muted-foreground">v{program.version}</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {program.title}
                </h3>
                {program.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{program.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
