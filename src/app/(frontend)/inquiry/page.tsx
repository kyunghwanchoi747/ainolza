import React from 'react'
import { HelpCircle, Mail, CheckCircle2 } from 'lucide-react'
import { getPayload } from '@/lib/payload'
import { Render } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck/config'
import '@puckeditor/core/dist/index.css'
import { InquiryForm } from '@/components/InquiryForm'

async function getPageBanner(slug: string) {
  try {
    const payload = await getPayload()
    const result = await (payload as any).find({
      collection: 'pages',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export default async function InquiryPage() {
  const puckPage = await getPageBanner('inquiry')

  // 문의하기는 정적 페이지라 Puck으로 전체 대체 가능
  if (puckPage?.puckData) {
    return <Render config={puckConfig} data={puckPage.puckData as Data} />
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tight text-white mb-4">문의하기</h1>
            <p className="text-gray-400">
              궁금하신 점이나 제안하고 싶은 내용이 있다면 언제든 말씀해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-8 lg:col-span-1">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-tighter">
                  Quick Contact
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-blue-600/20 p-2">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                      <p className="text-sm font-medium text-white">support@ainolja.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-purple-600/20 p-2">
                      <HelpCircle className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">kakao</p>
                      <p className="text-sm font-medium text-white">@AI놀자_공식</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-blue-600/30 bg-blue-600/5 p-8">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-black uppercase tracking-widest italic">
                    Operating Hours
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  평일 10:00 - 18:00
                  <br />
                  점심시간 12:00 - 13:00
                  <br />
                  (주말 및 공휴일 제외)
                </p>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
