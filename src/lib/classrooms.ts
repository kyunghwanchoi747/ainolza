// 강의실 메타데이터 (정적)
// 새 강의가 생기면 여기에 항목을 추가하고 Orders.ts의 select options에도 추가
//
// ▶ 새 회차(영상) 추가하는 법
//   1. Vimeo에 영상 업로드 → URL에서 숫자 ID 복사 (예: vimeo.com/1174594779 → 1174594779)
//   2. 노션에서 해당 회차 가이드북 페이지 → 공유 → 웹에 게시 → URL 복사
//   3. 아래 sessions 배열에 항목 추가
//   4. git push → 자동 배포

export type Session = {
  week: number
  title: string
  vimeoId: string // 예: "1174594779" (vimeo.com/{id} 의 숫자만)
  guidebookUrl?: string // 노션 페이지 등
  date?: string // YYYY-MM-DD (라이브 일자, 표시용)
}

export type Classroom = {
  slug: string
  title: string
  shortTitle: string
  description: string
  level: '입문' | '심화' | '특강'
  liveUrl?: string // 진행 중인 라이브 (있으면 상단에 강조 표시)
  resourceUrl?: string // 강의 전체 자료 (노션 메인 페이지 등)
  schedule?: string // 일정 안내 텍스트
  sessions?: Session[] // 회차별 영상 + 가이드북
}

export const CLASSROOMS: Classroom[] = [
  {
    slug: 'vibe-coding-101',
    title: 'AI 바이브 코딩 [입문] — AI로 만드는 자동 수익 웹사이트 구축 실전',
    shortTitle: '바이브 코딩 입문',
    description: 'AI 도구를 활용해 자동 수익 웹사이트를 만드는 입문 과정입니다.',
    level: '입문',
    sessions: [
      {
        week: 1,
        title: '바이브코딩 1회차',
        vimeoId: '1174594779',
        guidebookUrl: '', // 노션 URL을 여기에 채우세요
        date: '',
      },
    ],
  },
  {
    slug: 'vibe-coding-advanced',
    title: 'AI 바이브 코딩 [심화] — 백지 위의 바이브코더 (심화 4주 과정)',
    shortTitle: '바이브 코딩 심화',
    description: '백지 상태에서 시작해 4주에 걸쳐 본격적으로 AI와 함께 코딩 능력을 키웁니다.',
    level: '심화',
    sessions: [],
  },
]

export function getClassroom(slug: string): Classroom | undefined {
  return CLASSROOMS.find((c) => c.slug === slug)
}
