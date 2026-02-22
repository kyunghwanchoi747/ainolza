import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageHeader } from '@/components/manager/PageHeader'
import { SEOSettingsForm } from '@/components/manager/Forms/SEOSettingsForm'

export default async function SEOSettingsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  let settings: any = {}
  try { settings = await payload.findGlobal({ slug: 'seo-settings' }) } catch {}

  return (
    <div>
      <PageHeader title="SEO 설정" description="검색엔진 최적화 및 사이트 메타 정보를 설정합니다." />
      <div className="max-w-lg bg-white rounded-xl border border-slate-200 p-6">
        <SEOSettingsForm defaultValues={settings} />
      </div>
    </div>
  )
}
