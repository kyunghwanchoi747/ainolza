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

        // 1. 관리자에게 알림
        try {
          await sendEnrollmentToAdmin(req.payload, doc as any)
        } catch (e) {
          console.error('[ENROLLMENT ADMIN NOTIFY] 실패:', (e as Error).message)
        }

        // 2. 신청자에게 계좌 안내 메일
        try {
          // 해당 프로그램의 가격 조회 (DB Products에서)
          let product: { title?: string; price?: number; originalPrice?: number } | null = null
          if ((doc as any).program) {
            const result = await req.payload.find({
              collection: 'products',
              where: { slug: { equals: (doc as any).program } },
              limit: 1,
              depth: 0,
            })
            const p = result.docs[0] as any
            if (p) product = { title: p.title, price: p.price, originalPrice: p.originalPrice }
          }
          await sendEnrollmentConfirmToBuyer(req.payload, doc as any, product)
        } catch (e) {
          console.error('[ENROLLMENT BUYER NOTIFY] 실패:', (e as Error).message)
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
