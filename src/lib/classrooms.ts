// 강의실 메타데이터 (정적)
// 새 강의가 생기면 여기에 항목을 추가하고 Orders.ts의 select options에도 추가
export type Classroom = {
  slug: string
  title: string
  shortTitle: string
  description: string
  level: '입문' | '심화' | '특강'
  liveUrl?: string // 유튜브 라이브 등 (수업 직전 채워넣기)
  resourceUrl?: string // 노션 페이지 등
  schedule?: string // 일정 안내 텍스트
}

export const CLASSROOMS: Classroom[] = [
  {
    slug: 'vibe-coding-101',
    title: 'AI 바이브 코딩 [입문] — AI로 만드는 자동 수익 웹사이트 구축 실전',
    shortTitle: '바이브 코딩 입문',
    description: 'AI 도구를 활용해 자동 수익 웹사이트를 만드는 입문 과정입니다.',
    level: '입문',
  },
  {
    slug: 'vibe-coding-advanced',
    title: 'AI 바이브 코딩 [심화] — 백지 위의 바이브코더 (심화 4주 과정)',
    shortTitle: '바이브 코딩 심화',
    description: '백지 상태에서 시작해 4주에 걸쳐 본격적으로 AI와 함께 코딩 능력을 키웁니다.',
    level: '심화',
  },
]

export function getClassroom(slug: string): Classroom | undefined {
  return CLASSROOMS.find((c) => c.slug === slug)
}
