import type { CollectionConfig } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'program', 'status', 'createdAt'],
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
