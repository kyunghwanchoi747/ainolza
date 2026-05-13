import type { CollectionConfig } from 'payload'

/**
 * WebhookEvents — 외부 시스템(PortOne 등)에서 받은 웹훅의 영구 로그.
 *
 * 목적:
 *  1) Idempotency — 같은 webhookId 재시도가 와도 한 번만 실제 처리하게 dedup
 *  2) 관측성 — 어떤 이벤트가 어떤 단계에서 실패했는지 사후 추적
 *  3) 재처리 — 실패한 이벤트를 어드민에서 수동 재실행할 수 있는 근거 자료
 *
 * 응답 코드 정책 (PortOne 기준):
 *  - 200: 처리 성공 / 이미 처리됨 / 우리가 무시하기로 한 이벤트
 *  - 4xx: 영구 실패 (서명 위조, 페이로드 불량) — 포트원 재시도 안 함
 *  - 5xx: 일시 장애 (DB 다운 등) — 포트원이 재시도해야 의미 있는 케이스만
 */
export const WebhookEvents: CollectionConfig = {
  slug: 'webhook_events',
  admin: {
    useAsTitle: 'webhookId',
    defaultColumns: ['source', 'eventType', 'paymentId', 'status', 'attempts', 'createdAt'],
    listSearchableFields: ['webhookId', 'paymentId', 'eventType'],
    description: 'PortOne 등 외부 웹훅 수신 로그. dedup·재처리·디버깅 용도.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return (user as { role?: string }).role === 'admin'
    },
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as { role?: string }).role === 'admin'
    },
  },
  fields: [
    {
      name: 'webhookId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Webhook ID (PK, dedup 기준)',
      admin: { description: 'PortOne의 webhook-id 헤더 값. 같은 ID는 두 번 처리되지 않음.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'portone',
      label: '발신 시스템',
      options: [
        { label: 'PortOne', value: 'portone' },
        { label: '기타', value: 'other' },
      ],
    },
    {
      name: 'eventType',
      type: 'text',
      label: '이벤트 타입 (Transaction.Paid 등)',
      index: true,
    },
    {
      name: 'paymentId',
      type: 'text',
      label: '결제 ID (merchantUid)',
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: '처리 상태',
      options: [
        { label: '처리 대기', value: 'pending' },
        { label: '처리중', value: 'processing' },
        { label: '처리 완료', value: 'processed' },
        { label: '무시됨 (정상)', value: 'ignored' },
        { label: '처리 실패', value: 'failed' },
      ],
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 1,
      label: '수신 횟수 (재시도 카운트)',
    },
    {
      name: 'lastError',
      type: 'textarea',
      label: '마지막 에러 메시지 (status=failed일 때)',
    },
    {
      name: 'processedAt',
      type: 'date',
      label: '처리 완료 일시',
    },
    {
      name: 'rawPayload',
      type: 'textarea',
      label: '원본 페이로드 (JSON)',
      admin: { description: '디버깅용 raw body. 민감정보 없음(서명 검증 후 저장).' },
    },
  ],
  timestamps: true,
}
