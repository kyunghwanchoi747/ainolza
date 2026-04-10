import type { CollectionConfig } from 'payload'
import { sendEnrollmentToAdmin, sendEnrollmentConfirmToBuyer } from '../lib/email-templates'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'program', 'status', 'createdAt'],
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        const d = doc as any
        try {
          await sendEnrollmentToAdmin(req.payload, d)
        // await logEmailSent(req.payload, { to: 'admin', subject: `수강신청 ${d.name}`, type: 'enrollment-admin', relatedId: d.email })  // TODO: 로깅 재활성화
        } catch (e) {
        // await logEmailSent(req.payload, { to: 'admin', subject: `수강신청`, type: 'enrollment-admin', status: 'failed', error: (e as Error).message })  // TODO: 로깅 재활성화
        }

        try {
          let product: { title?: string; price?: number; originalPrice?: number } | null = null
          if (d.program) {
            const result = await req.payload.find({ collection: 'products', where: { slug: { equals: d.program } }, limit: 1, depth: 0 })
            const p = result.docs[0] as any
            if (p) product = { title: p.title, price: p.price, originalPrice: p.originalPrice }
          }
          await sendEnrollmentConfirmToBuyer(req.payload, d, product)
        // await logEmailSent(req.payload, { to: d.email, subject: `수강신청 계좌안내`, type: 'enrollment-buyer', relatedId: d.program })  // TODO: 로깅 재활성화
        } catch (e) {
        // await logEmailSent(req.payload, { to: d.email || '', subject: `수강신청 계좌안내`, type: 'enrollment-buyer', status: 'failed', error: (e as Error).message })  // TODO: 로깅 재활성화
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '이름' },
    { name: 'phone', type: 'text', required: true, label: '연락처' },
    { name: 'email', type: 'email', required: true, label: '이메일' },
    { name: 'program', type: 'text', required: true, label: '프로그램', defaultValue: 'vibe-coding' },
    { name: 'message', type: 'textarea', label: '문의사항' },
    {
      name: 'status',
      type: 'select',
      label: '상태',
      defaultValue: 'pending',
      options: [
        { label: '대기', value: 'pending' },
        { label: '확인', value: 'confirmed' },
        { label: '결제완료', value: 'paid' },
        { label: '취소', value: 'cancelled' },
      ],
    },
  ],
}
