import type { CollectionConfig } from 'payload'

/**
 * Ebooks — 전자책 PDF 파일 전용 컬렉션 (R2 비공개 저장)
 *
 * 운영 흐름:
 * 1. 매니저가 Payload admin에서 Ebooks 컬렉션에 PDF 업로드
 *    → 파일은 R2 버킷(ainolzamedia)에 자동 저장
 * 2. Products의 ebookFile 필드에 해당 Ebook 연결
 * 3. 결제 완료된 회원이 /api/download/[orderId] 호출
 *    → 서버가 인증/권한 검증 후 R2 binding(env.R2)으로 객체를 직접 스트리밍
 *    → 응답 끝나면 자동 만료 (시간 제한 없음, 매 요청마다 새로 발급)
 *
 * 노출 정책: 누구나 메타정보 읽기 X. 다운로드는 /api/download만 허용.
 */
export const Ebooks: CollectionConfig = {
  slug: 'ebooks',
  access: {
    // 메타정보 읽기는 admin만 (사용자는 /api/download 통해서만 접근)
    read: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'updatedAt'],
  },
  upload: {
    mimeTypes: ['application/pdf'],
    // R2에 저장될 디렉토리 prefix는 r2Storage 플러그인 설정으로 처리
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '전자책 제목 (관리용)',
      admin: { description: '예: 불편한 AI 전자책 v1.0' },
    },
  ],
}
