import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SEOToolsPage() {
  const siteUrl = 'ainolza-web.stressoutcompany.workers.dev' // 도메인 변경 시 업데이트

  const seoChecklist = [
    { label: 'sitemap.xml', status: 'done', desc: '23개 URL 등록됨', link: `https://${siteUrl}/sitemap.xml` },
    { label: 'robots.txt', status: 'done', desc: '/manager, /admin 차단', link: `https://${siteUrl}/robots.txt` },
    { label: '메타 타이틀', status: 'done', desc: '전 페이지 적용 (template: "% | AI놀자")' },
    { label: 'Open Graph', status: 'done', desc: '기본 OG 설정 완료' },
    { label: '모바일 최적화', status: 'done', desc: 'viewport 설정 + 반응형' },
    { label: 'OG 이미지', status: 'todo', desc: '페이지별 미리보기 이미지 미설정' },
    { label: '구조화 데이터 (JSON-LD)', status: 'todo', desc: '상품/교육 스키마 미적용' },
  ]

  const searchEngines = [
    {
      name: 'Google Search Console',
      url: 'https://search.google.com/search-console',
      status: 'todo',
      steps: [
        '1. Search Console 접속 → 속성 추가',
        '2. 도메인 또는 URL 접두어 선택',
        '3. DNS/HTML 태그로 소유권 확인',
        `4. sitemap 제출: https://${siteUrl}/sitemap.xml`,
      ],
    },
    {
      name: '네이버 서치어드바이저',
      url: 'https://searchadvisor.naver.com',
      status: 'todo',
      steps: [
        '1. 서치어드바이저 접속 → 사이트 등록',
        '2. HTML 태그 또는 파일로 소유권 확인',
        `3. sitemap 제출: https://${siteUrl}/sitemap.xml`,
        '4. RSS 등록 (블로그 있는 경우)',
      ],
    },
    {
      name: 'Bing Webmaster Tools',
      url: 'https://www.bing.com/webmasters',
      status: 'todo',
      steps: [
        '1. Google Search Console 연동으로 자동 등록 가능',
        '2. 또는 직접 등록 후 sitemap 제출',
      ],
    },
  ]

  const pages = [
    { path: '/', title: 'AI놀자 - 놀면서 배우는 AI 교육 플랫폼' },
    { path: '/store', title: '강의/전자책 | AI놀자' },
    { path: '/store/uncomfortable-ai', title: '불편한 AI | AI놀자' },
    { path: '/store/personal-intelligence', title: '퍼스널 인텔리전스 | AI놀자' },
    { path: '/programs/vibe-coding', title: 'AI 바이브 코딩 클래스 | AI놀자' },
    { path: '/labs', title: 'AI 실험실 | AI놀자' },
    { path: '/community', title: '후기 | AI놀자' },
    { path: '/contact', title: '문의하기 | AI놀자' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO 도구</h1>
        <p className="text-muted-foreground mt-1">검색엔진 최적화 현황을 확인하고 관리하세요.</p>
      </div>

      {/* SEO 체크리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>SEO 체크리스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {seoChecklist.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Badge variant={item.status === 'done' ? 'success' : 'warning'}>
                    {item.status === 'done' ? '완료' : '미완'}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    확인
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 검색엔진 등록 */}
      <Card>
        <CardHeader>
          <CardTitle>검색엔진 등록</CardTitle>
          <CardDescription>도메인 연결 후 아래 검색엔진에 등록하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {searchEngines.map((engine, i) => (
              <div key={i} className="p-4 rounded-xl border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{engine.name}</h3>
                    <Badge variant="warning">미등록</Badge>
                  </div>
                  <a href={engine.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                    바로가기
                  </a>
                </div>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {engine.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 페이지별 메타 타이틀 */}
      <Card>
        <CardHeader>
          <CardTitle>페이지별 메타 타이틀</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">경로</th>
                  <th className="text-left p-3 font-medium">타이틀</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 font-mono text-xs text-muted-foreground">{p.path}</td>
                    <td className="p-3">{p.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
