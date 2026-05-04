import type { CollectionConfig } from 'payload'

/**
 * Classrooms — 강의실 (기수별로 별도 강의실)
 *
 * 운영 흐름:
 * 1. 기수별로 강의실 1개씩 생성 (예: "바이브 코딩 심화 1기", "2기")
 * 2. Products에서 grantedClassroom 관계로 연결
 * 3. 결제 완료 시 Order.classrooms 배열에 강의실 slug 자동 추가
 * 4. /classroom/[slug] 페이지에서 권한 확인
 */
export const Classrooms: CollectionConfig = {
  slug: 'classrooms',
  access: {
    // 누구나 강의실 메타정보 읽기 가능 (목록 등)
    read: () => true,
    // 생성/수정/삭제는 admin만
    create: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string })?.role === 'admin',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'cohort', 'level', 'status'],
    listSearchableFields: ['title', 'slug', 'shortTitle'],
  },
  fields: [
    // 기본 정보
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '강의실 풀 제목',
      admin: { description: '예: AI 바이브 코딩 [심화] 2기 — 백지 위의 바이브코더' },
    },
    {
      name: 'shortTitle',
      type: 'text',
      required: true,
      label: '짧은 제목 (UI 표시용)',
      admin: { description: '예: 바이브 코딩 심화 2기' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: '슬러그 (URL용, 영문)',
      admin: { description: '예: vibe-coding-advanced-2 — 이 값으로 /classroom/{slug} URL이 만들어짐' },
    },
    {
      name: 'cohort',
      type: 'number',
      label: '기수',
      admin: { description: '1기, 2기 등. 같은 강의의 다른 차수를 구분' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '강의실 설명',
    },
    {
      name: 'level',
      type: 'select',
      label: '난이도',
      defaultValue: '입문',
      options: [
        { label: '입문', value: '입문' },
        { label: '심화', value: '심화' },
        { label: '특강', value: '특강' },
      ],
    },

    // 진행 정보
    {
      name: 'schedule',
      type: 'textarea',
      label: '일정 안내 텍스트',
      admin: { description: '강의실 상단에 표시. 예: 매주 수 21시, 4회차' },
    },
    {
      name: 'liveUrl',
      type: 'text',
      label: '라이브 URL (진행 중일 때만)',
      admin: { description: '있으면 강의실 상단에 강조 표시' },
    },
    {
      name: 'resourceUrl',
      type: 'text',
      label: '강의 전체 자료 URL (노션 메인 등)',
    },

    // 회차별 세션 (배열로 관리 — 회차 추가가 자주 일어남)
    {
      name: 'sessions',
      type: 'array',
      label: '회차별 강의',
      labels: { singular: '회차', plural: '회차들' },
      admin: { description: '각 회차의 영상, 가이드북, 비밀자료를 등록' },
      fields: [
        { name: 'week', type: 'number', required: true, label: '회차 (예: 1, 2, 3)' },
        { name: 'title', type: 'text', required: true, label: '회차 제목' },
        {
          name: 'date',
          type: 'text',
          label: '강의 날짜 (예: 2026-04-15)',
        },
        {
          name: 'vimeoId',
          type: 'text',
          label: 'Vimeo 영상 ID (녹화본)',
          admin: { description: '있으면 우선 표시. 예: 1186484969' },
        },
        {
          name: 'youtubeLiveUrl',
          type: 'text',
          label: 'YouTube 라이브 URL',
          admin: { description: 'vimeoId 없을 때만 표시. 라이브 종료 후엔 vimeoId로 교체' },
        },
        {
          name: 'guidebookUrl',
          type: 'text',
          label: '가이드북 URL (노션 등)',
        },
        {
          name: 'secretEnabled',
          type: 'checkbox',
          label: '비밀자료 사용',
          defaultValue: false,
        },
        {
          name: 'secretPassword',
          type: 'text',
          label: '비밀자료 비밀번호',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.secretEnabled),
          },
        },
        {
          name: 'secretNotionUrl',
          type: 'text',
          label: '비밀자료 노션 URL',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.secretEnabled),
          },
        },
        {
          name: 'secretLabel',
          type: 'text',
          label: '비밀자료 버튼 라벨',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.secretEnabled),
            description: "기본값: '비밀 자료 열기'",
          },
        },
      ],
    },

    // 노출 제어
    {
      name: 'status',
      type: 'select',
      label: '상태',
      required: true,
      defaultValue: 'active',
      options: [
        { label: '운영중 (수강생 입장 가능)', value: 'active' },
        { label: '준비중 (입장 불가)', value: 'draft' },
        { label: '종료 (이전 기수)', value: 'closed' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: '정렬 순서 (작을수록 앞)',
      defaultValue: 999,
    },
  ],
}
