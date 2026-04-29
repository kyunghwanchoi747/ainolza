import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    // 누구나 상품 정보 읽기 가능 (스토어 페이지용)
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'productType', 'price', 'status', 'order'],
    listSearchableFields: ['title', 'slug', 'subtitle', 'shortDescription'],
  },
  fields: [
    // 기본 정보
    { name: 'title', type: 'text', required: true, label: '제목 (\\n으로 줄바꿈)' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: '슬러그 (URL용, 영문)',
      admin: { description: '예: vibe-coding-101 — 이 값으로 /store/{slug} URL이 만들어짐' },
    },
    { name: 'subtitle', type: 'text', label: '부제 (한 줄)' },
    { name: 'shortDescription', type: 'text', label: '카드용 짧은 설명' },

    // 카테고리 / 종류
    {
      name: 'productType',
      type: 'select',
      label: '상품 유형',
      required: true,
      defaultValue: 'class',
      options: [
        { label: '강의', value: 'class' },
        { label: '전자책', value: 'ebook' },
        { label: '종이책', value: 'book' },
        { label: '번들', value: 'bundle' },
      ],
    },
    {
      name: 'category',
      type: 'text',
      label: '카테고리 라벨',
      admin: { description: '카드 상단에 표시. 예: "강의" / "전자책 / 종이책"' },
    },

    // 가격
    { name: 'price', type: 'number', label: '판매가 (원)', min: 0 },
    { name: 'originalPrice', type: 'number', label: '정가 (할인 전, 원)', min: 0 },
    {
      name: 'priceLabel',
      type: 'text',
      label: '가격 대신 표시할 텍스트',
      admin: { description: '가격이 없는 외부 판매 등. 예: "교보문고 판매 중"' },
    },
    {
      name: 'discountUntil',
      type: 'date',
      label: '할인 마감일',
      admin: { description: '있으면 D-N 카운트다운이 카드/상세에 표시됨' },
    },

    // 액션 버튼 (여러 개 가능)
    {
      name: 'actions',
      type: 'array',
      label: '버튼들',
      admin: { description: '구매하기, 외부 링크 등' },
      fields: [
        { name: 'label', type: 'text', required: true, label: '버튼 텍스트' },
        { name: 'url', type: 'text', required: true, label: 'URL (내부 경로 또는 외부 https://)' },
        { name: 'primary', type: 'checkbox', label: '주요 버튼 (강조 색상)' },
        { name: 'external', type: 'checkbox', label: '새 탭으로 열기' },
      ],
    },

    // 태그 (수강 신청 페이지에 노출)
    {
      name: 'tags',
      type: 'array',
      label: '태그 (수강 신청 페이지에 표시)',
      admin: { description: '예: AI 웹사이트 구축, 4주 과정, 온라인' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'duration',
      type: 'text',
      label: '기간/형식 (예: 4주 과정 | 온라인)',
    },

    // 상품별 FAQ (상세 페이지에 노출)
    {
      name: 'faq',
      type: 'array',
      label: 'FAQ (자주 묻는 질문)',
      admin: { description: '이 상품 전용 질문/답변. 상세 페이지에 노출' },
      fields: [
        { name: 'question', type: 'text', required: true, label: '질문' },
        { name: 'answer', type: 'textarea', required: true, label: '답변' },
      ],
    },

    // 강의실 연결 (수강 상품 결제 시 자동 부여될 강의실)
    {
      name: 'grantedClassroomSlugs',
      type: 'array',
      label: '결제 시 부여될 강의실 슬러그',
      admin: {
        description:
          '강의 상품인 경우 결제 완료 시 여기 입력한 슬러그의 강의실 입장 권한이 자동 부여됩니다. 책/전자책은 비워두세요. 기수가 다르면 별도 강의실을 만들어 슬러그를 등록하세요. 예: vibe-coding-advanced-2',
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: '강의실 슬러그',
        },
      ],
    },
    // 구버전 호환 — DB 스키마 유지용 (사용 안 함)
    {
      name: 'classroomSlug',
      type: 'text',
      label: '구 강의실 슬러그 (사용 안 함)',
      admin: { hidden: true },
    },

    // 이미지
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: '카드 썸네일',
      admin: { description: '카드 목록에 표시되는 정사각형 이미지' },
    },
    {
      name: 'detailImages',
      type: 'array',
      label: '상세 페이지 이미지 (위에서 아래로)',
      admin: { description: '캔바 등으로 만든 상세 이미지를 순서대로 추가' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // 노출 제어
    {
      name: 'order',
      type: 'number',
      label: '정렬 순서 (작을수록 앞)',
      defaultValue: 999,
    },
    {
      name: 'status',
      type: 'select',
      label: '상태',
      required: true,
      defaultValue: 'published',
      options: [
        { label: '게시', value: 'published' },
        { label: '임시저장', value: 'draft' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '추천 상품',
      defaultValue: false,
    },

    // SEO
    {
      name: 'seoType',
      type: 'select',
      label: 'SEO 유형',
      defaultValue: 'Product',
      options: [
        { label: 'Product (일반)', value: 'Product' },
        { label: 'Course (강의)', value: 'Course' },
        { label: 'Book (도서)', value: 'Book' },
      ],
    },
    { name: 'seoAuthor', type: 'text', label: 'SEO 저자명 (도서)' },

    // 기존 호환 필드 (사용 안 하지만 DB에 존재)
    { name: 'description', type: 'textarea', label: '설명 (구버전 — 사용 안 함)', admin: { hidden: true } },
    { name: 'content', type: 'textarea', label: '내용 (구버전 — 사용 안 함)', admin: { hidden: true } },
  ],
}
