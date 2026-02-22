import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageHeader } from '@/components/manager/PageHeader'
import { PaymentSettingsForm } from '@/components/manager/Forms/PaymentSettingsForm'

export default async function PaymentPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  let settings: any = {}
  try {
    settings = await payload.findGlobal({ slug: 'payment-settings' })
  } catch {}

  return (
    <div>
      <PageHeader title="결제 설정" description="PG사 및 결제 수단을 설정합니다." />
      <div className="max-w-lg bg-white rounded-xl border border-slate-200 p-6">
        <PaymentSettingsForm defaultValues={settings} />
      </div>
    </div>
  )
}
