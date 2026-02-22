import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageHeader } from '@/components/manager/PageHeader'
import { ShopSettingsForm } from '@/components/manager/Forms/ShopSettingsForm'

export default async function ShopSettingsPage() {
  const headersList = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  let settings: any = {}
  try {
    settings = await payload.findGlobal({ slug: 'shop-settings' })
  } catch {}

  return (
    <div>
      <PageHeader title="쇼핑 설정" description="배송비 및 쇼핑 기본 설정을 관리합니다." />
      <div className="max-w-lg bg-white rounded-xl border border-slate-200 p-6">
        <ShopSettingsForm defaultValues={settings} />
      </div>
    </div>
  )
}
