import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const pages = await payload.find({
    collection: 'design-pages',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const page = pages.docs[0]
  if (!page) return notFound()

  // Scope CSS to prevent conflicts with Tailwind
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
