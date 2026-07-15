import type { CollectionConfig } from 'payload'

export const ClassroomProgress: CollectionConfig = {
  slug: 'classroom-progress',
  // 진도 기록 보호: 본인 것만 읽기. 쓰기는 admin만
  // (실제 기록은 /api/classroom-progress에서 overrideAccess로 처리)
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as { role?: string }).role === 'admin') return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'classroom', 'completedSessions', 'progressPercent', 'updatedAt'],
    listSearchableFields: ['user', 'classroom'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      label: '수강생',
    },
    {
      name: 'classroom',
      type: 'relationship',
      relationTo: 'classrooms',
      required: true,
      index: true,
      label: '강의실',
    },
    {
      name: 'completedSessions',
      type: 'array',
      label: '완료한 회차',
      labels: {
        singular: '회차',
        plural: '회차들',
      },
      fields: [
        {
          name: 'sessionNumber',
          type: 'number',
          required: true,
          min: 1,
          label: '회차 번호',
        },
        {
          name: 'completedAt',
          type: 'date',
          required: true,
          label: '완료 시간',
        },
      ],
    },
    {
      name: 'progressPercent',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 0,
      label: '진도율 (%)',
      admin: {
        readOnly: true,
        description: '완료한 회차 수 / 강의실 전체 회차 수 × 100 (자동 계산)',
      },
    },
    {
      name: 'lastAccessedAt',
      type: 'date',
      label: '마지막 접근 시간',
    },
    {
      name: 'memo',
      type: 'textarea',
      label: '관리자 메모',
    },
  ],
}
