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
  vimeoId?: string // VOD 녹화본 (있으면 우선 표시). 예: "1174594779"
  youtubeLiveUrl?: string // 라이브 송출 URL (vimeoId 없을 때만 표시)
  guidebookUrl?: string // 노션 페이지 등
  date?: string // YYYY-MM-DD (라이브 일자, 표시용)
  secret?: {
    password: string  // 강의 후반부에 수강생에게 알려줄 비밀번호
    notionUrl: string // 잠금 해제 후 열리는 노션 페이지 URL
    label?: string    // 버튼 텍스트 (기본값: '비밀 자료 열기')
  }
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
        guidebookUrl: 'https://www.notion.so/33dc7863bde28045910ae83d629ba80e?source=copy_link',
        date: '',
      },
      {
        week: 2,
        title: '바이브코딩 2회차',
        vimeoId: '1181413412',
        guidebookUrl: 'https://www.notion.so/33dc7863bde28045910ae83d629ba80e?source=copy_link',
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
    // ▶ 라이브 진행 흐름:
    //   1) 라이브 직전: 해당 회차의 youtubeLiveUrl 에 라이브 URL 입력 + push
    //      → 페이지에 자동으로 LIVE 뱃지 + YouTube 임베드 표시
    //   2) 라이브 종료 후: 녹화본 Vimeo에 업로드 → vimeoId 입력 + push
    //      → 자동으로 Vimeo 녹화본으로 전환 (youtubeLiveUrl은 그대로 두거나 비움)
    sessions: [
      {
        week: 1,
        title: '심화 1회차',
        vimeoId: '1182197874',
        // guidebookUrl: '', // ← 노션 가이드북 URL
        date: '',            // ← 강의 날짜 (예: 2026-04-15)
        secret: {
          password: 'ainolza232',
          notionUrl: 'https://www.notion.so/33fc7863bde2805889c1f7eeb7536bb8?source=copy_link',
          label: '1회차 비밀 자료',
        },
      },
      {
        week: 2,
        title: '심화 2회차',
        vimeoId: '1184517423',
        guidebookUrl: 'https://www.notion.so/2-342c7863bde280a6a621dff24e491d7a',
      },
      {
        week: 3,
        title: '심화 3회차',
      },
      {
        week: 4,
        title: '심화 4회차',
      },
    ],
  },
]

export function getClassroom(slug: string): Classroom | undefined {
  return CLASSROOMS.find((c) => c.slug === slug)
}
