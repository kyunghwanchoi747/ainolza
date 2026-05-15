/**
 * 이키가이 4축 데이터셋.
 *
 * 일본 본토의 이키가이(미하라 미에코 1966)는 "거대한 천직"이 아니라
 * "아침에 일어날 이유"에 가까운 개념. 따라서 항목들은 직업 명칭이 아니라
 * 가치·활동·관계 키워드로 구성. 시니어가 봐도 어색하지 않게 다듬음.
 *
 * 서양 4원 다이어그램(love · good_at · world · paid)을 뼈대로,
 * 결과 해석은 일본 본토 정신(작은 기쁨, 작은 첫걸음)에 맞춰 AI가 풀어냄.
 */

export type IkigaiOption = {
  value: string
  label: string
  hint?: string
}

export type IkigaiAxis = {
  key: 'love' | 'good_at' | 'world' | 'paid'
  title: string
  subtitle: string
  prompt: string
  minSelect: number
  maxSelect: number
  options: IkigaiOption[]
}

export const AXES: IkigaiAxis[] = [
  // ───────────────────────── 1. 좋아하는 것 ─────────────────────────
  {
    key: 'love',
    title: '좋아하는 것',
    subtitle: '시간이 가는 줄 모르는 활동',
    prompt: '하고 있으면 시간이 빨리 가는 것, 다시 하고 싶어지는 것을 골라보세요.',
    minSelect: 3,
    maxSelect: 5,
    options: [
      { value: '자연 속에 있기', label: '자연 속에 있기', hint: '산책·등산·정원' },
      { value: '사람들과 어울리기', label: '사람들과 어울리기', hint: '대화·모임' },
      { value: '혼자 사색하기', label: '혼자 사색하기', hint: '조용한 시간' },
      { value: '만들고 고치기', label: '만들고 고치기', hint: '손으로 무언가' },
      { value: '가르치고 알려주기', label: '가르치고 알려주기' },
      { value: '글쓰기', label: '글쓰기', hint: '일기·블로그' },
      { value: '그림 그리기', label: '그림 그리기' },
      { value: '음악과 소리', label: '음악과 소리', hint: '듣기·연주' },
      { value: '요리하기', label: '요리하기' },
      { value: '동물과 식물 돌보기', label: '동물·식물 돌보기' },
      { value: '여행', label: '여행' },
      { value: '운동하기', label: '운동하기' },
      { value: '책과 이야기', label: '책과 이야기' },
      { value: '게임과 퍼즐', label: '게임과 퍼즐' },
      { value: '디지털 기기 다루기', label: '디지털 기기 다루기' },
      { value: '정리하고 분류하기', label: '정리하고 분류하기' },
    ],
  },
  // ───────────────────────── 2. 잘하는 것 ─────────────────────────
  {
    key: 'good_at',
    title: '잘하는 것',
    subtitle: '주위에서 칭찬 받았던 강점',
    prompt: '스스로 인정하는 강점, 다른 사람이 자주 칭찬해주는 능력을 골라보세요.',
    minSelect: 3,
    maxSelect: 5,
    options: [
      { value: '듣고 공감하기', label: '듣고 공감하기' },
      { value: '차분히 분석하기', label: '차분히 분석하기' },
      { value: '손재주', label: '손재주' },
      { value: '글솜씨', label: '글솜씨' },
      { value: '말솜씨', label: '말솜씨' },
      { value: '끈기와 인내', label: '끈기와 인내' },
      { value: '빠르게 배우기', label: '빠르게 배우기' },
      { value: '가르치는 능력', label: '가르치는 능력' },
      { value: '정리와 계획', label: '정리와 계획' },
      { value: '문제 해결', label: '문제 해결' },
      { value: '사람 모으기', label: '사람 모으기' },
      { value: '새로운 아이디어', label: '새로운 아이디어' },
    ],
  },
  // ───────────────────────── 3. 세상이 필요로 하는 것 ─────────────────────────
  {
    key: 'world',
    title: '세상이 필요로 하는 것',
    subtitle: '어디에 기여하고 싶은가',
    prompt: '내가 보탤 수 있다면 좋겠다 싶은 영역을 골라보세요.',
    minSelect: 2,
    maxSelect: 3,
    options: [
      { value: '약한 사람의 곁', label: '약한 사람의 곁', hint: '돌봄·복지' },
      { value: '다음 세대 키우기', label: '다음 세대 키우기', hint: '교육·멘토' },
      { value: '환경과 동물', label: '환경과 동물' },
      { value: '건강과 치유', label: '건강과 치유' },
      { value: '지식과 정보의 전달', label: '지식·정보 전달' },
      { value: '아름다움과 문화', label: '아름다움·문화' },
      { value: '동네와 지역사회', label: '동네·지역사회' },
      { value: '가족과 가까운 사람', label: '가족·가까운 사람' },
      { value: '더 나은 도구 만들기', label: '더 나은 도구 만들기' },
      { value: '의미와 영성', label: '의미와 영성' },
    ],
  },
  // ───────────────────────── 4. 돈을 받을 수 있는 것 ─────────────────────────
  // 이건 자유 입력. "아직 모르겠음"을 누르면 AI가 1~3번 답에서 추정.
  {
    key: 'paid',
    title: '돈으로 연결되는 것',
    subtitle: '지금까지 받아온 일, 또는 받을 만한 일',
    prompt:
      '지금까지 일해 온 분야, 사람들이 나에게 기꺼이 지불할 만한 것을 자유롭게 적어주세요. 잘 떠오르지 않으면 "아직 모르겠어요"를 눌러도 좋습니다.',
    minSelect: 0,
    maxSelect: 0,
    options: [], // 자유 입력 단계는 UI에서 별도 처리
  },
]
