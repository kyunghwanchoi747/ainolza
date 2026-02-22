import type { GlobalConfig } from 'payload'

export const MessageSettings: GlobalConfig = {
  slug: 'message-settings',
  label: '메시지 설정',
  admin: {
    group: '홍보·마케팅',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'notificationTalk',
      type: 'group',
      label: '알림톡 설정',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: '알림톡 사용 여부',
          defaultValue: false,
        },
        {
          name: 'senderKey',
          type: 'text',
          label: '카카오 비즈니스 채널 발신 키',
        },
      ],
    },
    {
      name: 'templates',
      type: 'array',
      label: '메시지 템플릿',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '템플릿 명',
        },
        {
          name: 'content',
          type: 'textarea',
          label: '내용',
        },
      ],
    },
  ],
}
