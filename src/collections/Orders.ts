import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'buyerName', 'productName', 'amount', 'status', 'createdAt'],
    listSearchableFields: ['orderNumber', 'buyerName', 'buyerEmail', 'buyerPhone', 'productName'],
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, label: '주문번호' },
    { name: 'buyerName', type: 'text', required: true, label: '구매자' },
    { name: 'buyerEmail', type: 'email', required: true, label: '이메일' },
    { name: 'buyerPhone', type: 'text', label: '연락처' },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: '회원',
    },
    { name: 'productName', type: 'text', required: true, label: '상품명' },
    { name: 'productSlug', type: 'text', label: '상품 슬러그' },
    {
      name: 'productType',
      type: 'select',
      label: '상품 유형',
      options: [
        { label: '강의', value: 'class' },
        { label: '전자책', value: 'ebook' },
        { label: '종이책', value: 'book' },
        { label: '번들', value: 'bundle' },
      ],
    },
    { name: 'amount', type: 'number', required: true, label: '결제금액' },
    { name: 'originalAmount', type: 'number', label: '정가' },
    {
      name: 'payMethod',
      type: 'select',
      label: '결제수단',
      options: [
        { label: '카드', value: 'card' },
        { label: '가상계좌', value: 'vbank' },
        { label: '계좌이체', value: 'trans' },
        { label: '휴대폰', value: 'phone' },
        { label: '카카오페이', value: 'kakaopay' },
        { label: '네이버페이', value: 'naverpay' },
        { label: '토스페이', value: 'tosspay' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: '주문상태',
      defaultValue: 'pending',
      options: [
        { label: '주문접수', value: 'pending' },
        { label: '결제완료', value: 'paid' },
        { label: '이용중', value: 'active' },
        { label: '완료', value: 'completed' },
        { label: '환불요청', value: 'refund_requested' },
        { label: '환불완료', value: 'refunded' },
        { label: '결제실패', value: 'failed' },
        { label: '주문취소', value: 'cancelled' },
      ],
    },
    // PortOne 연동 필드
    { name: 'impUid', type: 'text', label: 'PortOne imp_uid' },
    { name: 'merchantUid', type: 'text', label: 'Merchant UID' },
    { name: 'pgProvider', type: 'text', label: 'PG사' },
    { name: 'receiptUrl', type: 'text', label: '영수증 URL' },
    // 가상계좌
    { name: 'vbankName', type: 'text', label: '가상계좌 은행' },
    { name: 'vbankNum', type: 'text', label: '가상계좌 번호' },
    { name: 'vbankDate', type: 'date', label: '입금기한' },
    // 환불
    { name: 'refundReason', type: 'textarea', label: '환불 사유' },
    { name: 'refundedAt', type: 'date', label: '환불일' },
    { name: 'refundAmount', type: 'number', label: '환불금액' },
    // 현금영수증
    {
      name: 'cashReceiptType',
      type: 'select',
      label: '현금영수증',
      options: [
        { label: '미발행', value: 'none' },
        { label: '소득공제용', value: 'income' },
        { label: '지출증빙용', value: 'expense' },
      ],
      defaultValue: 'none',
    },
    { name: 'cashReceiptNumber', type: 'text', label: '현금영수증 번호' },
    // 메모
    { name: 'adminMemo', type: 'textarea', label: '관리자 메모' },
    // 강의실 / 도서 액세스 권한 (다중 선택)
    {
      name: 'classrooms',
      type: 'select',
      hasMany: true,
      label: '강의실',
      options: [
        { label: '바이브 코딩 101 (입문)', value: 'vibe-coding-101' },
        { label: '바이브 코딩 심화', value: 'vibe-coding-advanced' },
      ],
    },
    {
      name: 'books',
      type: 'select',
      hasMany: true,
      label: '도서',
      options: [
        { label: '퍼스널 인텔리젠스', value: 'personal-intelligence' },
        { label: '불편한 AI', value: 'uncomfortable-ai' },
        { label: 'AI시대의 15가지 프롬프트 전략', value: 'prompt-15' },
        { label: 'NotebookLM 학습용 프롬프트 가이드', value: 'notebooklm-guide' },
      ],
    },
  ],
}
