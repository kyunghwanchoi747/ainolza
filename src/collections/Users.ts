import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        try {
          await req.payload.create({
            collection: 'notifications',
            data: {
              type: 'user_signup',
              title: '회원가입',
              body: `${doc.nickname || doc.email}님이 회원이 되셨어요. ${doc.email}`,
              isRead: false,
              relatedId: String(doc.id),
              href: '/manager/customers',
            },
          })
        } catch (err) {
          console.error('[Notifications] user_signup 알림 생성 실패:', err)
        }
      },
    ],
  },
  admin: {
    useAsTitle: 'nickname', // Using nickname as title for better recognition in lists
    group: '브랜드 운영',
    defaultColumns: ['nickname', 'email', 'userType', 'group', 'points', 'purchaseAmount'],
  },
  auth: true,
  access: {
    // 관리자 패널 접근: 관리자(admin) 권한을 가진 사용자만 허용
    admin: ({ req }) => (req.user as any)?.userType === 'admin',
    // 읽기: 관리자는 전체, 나머지는 자신의 정보만
    read: ({ req }) => {
      if ((req.user as any)?.userType === 'admin') return true
      if (req.user) {
        return {
          id: {
            equals: req.user.id,
          },
        }
      }
      return false
    },
    // 생성: 모두 가능 (회원가입)
    create: () => true,
    // 수정: 관리자는 전체, 나머지는 자신의 정보만
    update: ({ req }) => {
      if ((req.user as any)?.userType === 'admin') return true
      if (req.user) {
        return {
          id: {
            equals: req.user.id,
          },
        }
      }
      return false
    },
    // 삭제: 관리자만
    delete: ({ req }) => (req.user as any)?.userType === 'admin',
  },
  fields: [
    {
      name: 'nickname',
      type: 'text',
      unique: true,
      required: false,
      admin: {
        description: '닉네임을 설정해 주세요.',
      },
    },
    {
      name: 'userType',
      type: 'select',
      label: '회원 유형',
      options: [
        { label: '일반회원', value: 'general' },
        { label: '우수회원', value: 'vip' },
        { label: '관리자', value: 'admin' },
      ],
      defaultValue: 'general',
      required: true,
    },
    {
      name: 'group',
      type: 'select',
      label: '그룹',
      options: [
        { label: '그룹 없음', value: 'none' },
        { label: 'AI놀자 1기', value: 'batch1' },
        { label: 'PDF자료구매', value: 'pdf_buyer' },
      ],
      defaultValue: 'none',
    },
    {
      name: 'points',
      type: 'number',
      label: '적립금',
      defaultValue: 0,
    },
    {
      name: 'purchaseAmount',
      type: 'number',
      label: '누적 구매금액',
      defaultValue: 0,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'memo',
      type: 'textarea',
      label: '관리자 메모',
      admin: {
        description: '관리자들끼리 공유할 메모를 남겨주세요.',
      },
    },
    {
      name: 'notificationSettings',
      type: 'group',
      fields: [
        {
          name: 'comments',
          type: 'checkbox',
          label: '댓글 알림',
          defaultValue: true,
        },
        {
          name: 'marketing',
          type: 'checkbox',
          label: '마케팅 알림',
          defaultValue: false,
        },
      ],
    },
  ],
}
