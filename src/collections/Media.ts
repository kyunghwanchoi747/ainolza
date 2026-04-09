import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // 누구나 이미지 읽기 가능 (스토어/카드 썸네일 등 공개 이미지용)
    read: () => true,
    // 쓰기/삭제는 기본값 (admin only)
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
