import { getPayloadClient } from '@/lib/payload'
import Link from 'next/link'

export default async function Home() {
  let page = null

  try {
    const payload = await getPayloadClient()
    const pages = await payload.find({
      collection: 'design-pages',
      where: {
        slug: { equals: 'home' },
        status: { equals: 'published' },
      },
      limit: 1,
    })
    page = pages.docs[0]
  } catch {
    // DB not ready yet
  }

  // 백엔드에 홈페이지가 있으면 그걸 표시
  if (page) {
    const scopedCss = (page.css as string || '').replace(
      /([^\r\n,{}]+)(,(?=[^}]*\{)|\s*\{)/g,
      '.gjs-rendered $1$2'
    )

    return (
      <div className="gjs-rendered">
        <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
        <div dangerouslySetInnerHTML={{ __html: page.html as string || '' }} />
      </div>
    )
  }

  // 아직 백엔드에 홈페이지가 없으면 안내 메시지
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-3xl font-bold mb-4">홈페이지가 아직 만들어지지 않았습니다</h1>
      <p className="text-muted-foreground mb-8">관리자 페이지 빌더에서 홈페이지를 만들어주세요.</p>
      <Link
        href="/manager/design/editor/new"
        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        페이지 빌더 열기
      </Link>
    </div>
  )
}
