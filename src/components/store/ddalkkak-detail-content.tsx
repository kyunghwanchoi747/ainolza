/**
 * 『딸깍의 시대 — 그래서, 뭘 만들 건데』 전자책 상품 상세페이지 본문.
 * slug: ddalkkak-era  (custom-detail-registry.tsx 에 등록)
 *
 * 디자인 룰(CLAUDE.md): ink/body/sub/line/surface/brand 만 사용, 이모지 금지, 색 박스 대신 선 구분.
 * 본문에 쓴 숫자·문장은 모두 책 원고(최종_본문_스크라이버스용.txt)에 있는 것만 사용했다.
 * 가격 단계(슈퍼 얼리버드/얼리버드/출간가)는 admin 의 priceSchedule 이 자동 적용하고,
 * 위쪽 가격 박스의 카운트다운이 다음 인상 시점을 보여 준다. 이 컴포넌트는 가격 숫자를 하드코딩하지 않는다.
 */

const QUESTIONS = [
  '누가 이 문제를 겪고 있는가?',
  '그 사람은 무엇이 불편한가?',
  '지금은 어떻게 해결하고 있는가?',
  '왜 기존 방식 대신 내 것을 써야 할까?',
  '만들기 전에 무엇으로 확인할 수 있는가?',
  '어디에서 고객을 만나 결제까지 연결할 것인가?',
  '무엇을 보고 계속할지, 고칠지, 접을지 결정할 수 있을까?',
]

const CASES = [
  {
    tag: '실패한 스타트업 101곳',
    head: '실패 이유 1위는 돈도, 기술도 아니었습니다.',
    body: '투자 데이터 회사 CB Insights가 2014년, 실패한 스타트업 101곳의 창업자가 직접 쓴 사후 분석을 모아 이유를 세어봤습니다. 42%가 꼽은 1위는 “시장이 필요로 하지 않았다”였습니다. 만드는 데는 성공했지만 아무도 필요로 하지 않았다는 얘기입니다.',
  },
  {
    tag: '퀴비',
    head: '17억 5천만 달러를 투자받고, 출시 6개월 만에 문을 닫았습니다.',
    body: '할리우드 거물이 만들고 유명 감독과 배우들이 콘텐츠를 찍었습니다. 이동 중에 휴대전화로 보기 편하게 만든 서비스였지만, 출시 무렵 사람들은 집에서 TV로 보고 싶어 했습니다.',
  },
  {
    tag: '구글 웨이브',
    head: '무료였고, 초대장은 경매에 5,100달러 호가가 붙었습니다.',
    body: '2009년 5월 공개된 이 서비스는 2010년 8월 더 이상 개발하지 않겠다고 발표했습니다. 들어가서 뭘 해야 할지 모르겠다는 반응이 많았습니다. 호기심은 무료로 모을 수 있지만 습관은 무료로 모이지 않습니다.',
  },
]

const TOC: { label: string; title: string }[] = [
  { label: '프롤로그', title: '다들 만드는 법을 말한다. 그런데 왜 만드는지는 묻지 않는다' },
  { label: '1장', title: '만들었다는 자랑과 팔렸다는 결과 사이' },
  { label: '2장', title: '기획은 아이디어 회의가 아니다' },
  { label: '3장', title: '만들기 전에 답할 일곱 가지 질문' },
  { label: '4장', title: 'AI에게 맡길 일, 끝까지 직접 결정할 일' },
  { label: '5장', title: '이제 만들기 전에 한 장을 채워보자' },
  { label: '에필로그', title: 'AI가 답을 빨리 내놓을수록 질문은 더 중요해진다' },
  { label: '부록 1', title: '7문항 기획 점검표' },
  { label: '부록 2', title: '한 장짜리 기획서' },
  { label: '부록 3', title: 'AI 반박 프롬프트' },
  { label: '부록 4', title: '출시 전 최종 점검표' },
]

const WORKSHEETS = [
  { name: '7문항 기획 점검표', desc: '예 / 아직 모름 / 아니요로 표시하고, 가장 먼저 확인할 빈칸과 이번 주에 할 한 가지 행동을 적습니다.' },
  { name: '한 장짜리 기획서', desc: '고객, 문제, 현재 대안, 제안, 차이, 첫 실험, 판매 경로, 판단 날짜를 한 장에 채웁니다. 작성 예시가 함께 있습니다.' },
  { name: 'AI 반박 프롬프트', desc: 'AI에게 칭찬이 아니라 반박을 시키는 프롬프트. 기본 프롬프트와 상황별 7개를 그대로 붙여 넣어 쓸 수 있습니다.' },
  { name: '출시 전 최종 점검표', desc: '내용, 구매 경험, 홍보 경로를 출시 전에 한 번씩 확인하는 체크리스트입니다.' },
]

const FOR_WHO = [
  '열심히 만들었는데 팔리지 않는 분',
  'AI로 빠르게 만들 수는 있지만 무엇을 만들지 정하지 못한 분',
  '아이디어를 제품으로 만들기 전에 싸게 확인하고 싶은 분',
  '1인 창업자, 크리에이터, 강의·전자책을 팔고 싶은 분',
]

const NOT_FOR = [
  '코딩이나 프롬프트 기술 자체를 배우고 싶은 분 (이 책은 만들기 전의 질문을 다룹니다)',
  '“딸깍 한 번으로 돈 버는 법”을 찾는 분',
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-brand text-xs md:text-sm font-bold tracking-[0.18em] mb-3">{children}</p>
}

export function DdalkkakDetailContent() {
  return (
    <div className="break-keep text-body">
      {/* 1. 후킹 */}
      <section className="px-6 py-20 md:py-28 border-t border-line">
        <div className="max-w-[760px] mx-auto text-center">
          <p className="text-sub text-base md:text-lg mb-6">누구나 만들 수 있는 시대, 결국 중요한 건 무엇을 만들 것인가</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ink leading-[1.35] tracking-tight">
            딸깍 한 번이면
            <br />
            만들어집니다.
          </h2>
          <p className="mt-8 text-2xl md:text-4xl font-extrabold text-brand leading-snug">
            그래서, 뭘 만들 건데요?
          </p>
          <p className="mt-10 text-base md:text-lg leading-relaxed">
            AI가 다 해주는 시대에
            <br />
            가장 중요한 것은 기획입니다.
          </p>
        </div>
      </section>

      {/* 2. 문제 제기 */}
      <section className="px-6 py-16 md:py-24 bg-surface border-y border-line">
        <div className="max-w-[820px] mx-auto">
          <SectionLabel>1장 · 만들었다는 자랑과 팔렸다는 결과 사이</SectionLabel>
          <h3 className="text-2xl md:text-4xl font-extrabold text-ink leading-snug mb-4">
            “3시간 만에 웹서비스 완성.”
            <br />
            그 문장이 증명하는 것은 무엇일까요?
          </h3>
          <p className="text-base md:text-lg leading-relaxed mb-12">
            제작 능력은 증명하지만 수요는 증명하지 않습니다. ‘3시간’이 말해주는 10배는 만드는 사람 쪽의 10배일 뿐,
            쓰는 사람 쪽의 일이 10배 나아졌는지는 어디에도 없습니다.
          </p>
          <ul className="divide-y divide-line border-y border-line bg-white">
            {CASES.map((c) => (
              <li key={c.tag} className="px-5 md:px-8 py-7">
                <p className="text-sub text-xs md:text-sm font-bold tracking-wide mb-2">{c.tag}</p>
                <p className="text-ink text-lg md:text-2xl font-extrabold leading-snug mb-3">{c.head}</p>
                <p className="text-sm md:text-base leading-relaxed">{c.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-ink text-xl md:text-3xl font-extrabold">0에 얼마를 곱해도 0이다.</p>
        </div>
      </section>

      {/* 3. 책의 핵심 */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-[820px] mx-auto">
          <SectionLabel>3장 · 만들기 전에 답할 일곱 가지 질문</SectionLabel>
          <h3 className="text-2xl md:text-4xl font-extrabold text-ink leading-snug mb-4">
            만들기 전에,
            <br />
            일곱 가지만 먼저 물어봅니다.
          </h3>
          <p className="text-base md:text-lg leading-relaxed mb-10">
            이 책의 중심은 사례를 읽고 끄덕이는 데서 끝나지 않습니다. 지금 만들고 있는 내 아이디어를 일곱 질문 앞에
            세워 보고, 가장 모르고 틀리면 가장 아픈 칸부터 이번 주에 확인하도록 순서를 정해 줍니다.
          </p>
          <ol className="border-t border-line">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="flex gap-5 items-baseline py-4 border-b border-line">
                <span className="w-7 shrink-0 text-brand font-extrabold text-lg md:text-xl tabular-nums">{i + 1}</span>
                <span className="text-ink text-base md:text-xl font-bold leading-snug">{q}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm md:text-base text-sub leading-relaxed">
            기획은 실행을 늦추는 장벽이 아닙니다. 무엇을 먼저 실행할지 정하는 순서표입니다.
          </p>
        </div>
      </section>

      {/* 4. 직접 써 보는 종이 */}
      <section className="px-6 py-16 md:py-24 bg-surface border-y border-line">
        <div className="max-w-[820px] mx-auto">
          <SectionLabel>부록 1 ~ 4 · 직접 써 보는 종이와 프롬프트</SectionLabel>
          <h3 className="text-2xl md:text-4xl font-extrabold text-ink leading-snug mb-4">
            읽고 끝나지 않도록,
            <br />
            채워 쓰는 쪽을 넣었습니다.
          </h3>
          <p className="text-base md:text-lg leading-relaxed mb-10">
            3장의 질문 카드와 부록 양식은 PDF에서 바로 출력해 쓸 수 있습니다.
          </p>
          <ul className="border-t border-line">
            {WORKSHEETS.map((w) => (
              <li key={w.name} className="py-5 border-b border-line md:grid md:grid-cols-[220px_1fr] md:gap-8">
                <p className="text-ink font-extrabold text-base md:text-lg mb-1 md:mb-0">{w.name}</p>
                <p className="text-sm md:text-base leading-relaxed">{w.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. 목차 */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-[820px] mx-auto">
          <SectionLabel>목차</SectionLabel>
          <ul className="border-t border-line">
            {TOC.map((t) => (
              <li key={t.label + t.title} className="flex gap-5 items-baseline py-3.5 border-b border-line">
                <span className="w-16 md:w-20 shrink-0 text-brand font-extrabold text-sm md:text-base">{t.label}</span>
                <span className="text-ink text-base md:text-lg font-semibold leading-snug">{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. 대상 */}
      <section className="px-6 py-16 md:py-24 bg-surface border-y border-line">
        <div className="max-w-[820px] mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <SectionLabel>이런 분께 권합니다</SectionLabel>
            <ul className="border-t border-line">
              {FOR_WHO.map((t) => (
                <li key={t} className="py-4 border-b border-line text-ink font-semibold text-base md:text-lg leading-snug">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>이런 분께는 맞지 않습니다</SectionLabel>
            <ul className="border-t border-line">
              {NOT_FOR.map((t) => (
                <li key={t} className="py-4 border-b border-line text-body text-base md:text-lg leading-snug">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. 저자 */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-[820px] mx-auto">
          <SectionLabel>저자</SectionLabel>
          <h3 className="text-2xl md:text-3xl font-extrabold text-ink mb-4">최경환</h3>
          <p className="text-base md:text-lg leading-relaxed">
            AI놀자 대표. 『불편한 AI』와 『퍼스널 인텔리전스』를 썼고, 바이브 코딩 강의를 운영합니다. 바이브 코딩으로
            직접 만든 프로그램들을 무료로 공개해 왔고, 그 과정에서 겪은 성공과 실패를 이 책에 담았습니다.
          </p>
        </div>
      </section>

      {/* 8. 가격·구매 안내 */}
      <section className="px-6 py-16 md:py-24 bg-surface border-t border-line">
        <div className="max-w-[820px] mx-auto">
          <SectionLabel>구매 안내</SectionLabel>
          <ul className="border-t border-line">
            <li className="py-4 border-b border-line md:grid md:grid-cols-[180px_1fr] md:gap-8">
              <p className="text-ink font-extrabold mb-1 md:mb-0">가격</p>
              <p className="text-sm md:text-base leading-relaxed">
                출간 직후에는 단계별로 낮은 가격에서 시작하고, 시간이 지나면 자동으로 오릅니다. 위쪽 가격 박스의
                카운트다운에서 다음 인상 시점을 확인할 수 있습니다.
              </p>
            </li>
            <li className="py-4 border-b border-line md:grid md:grid-cols-[180px_1fr] md:gap-8">
              <p className="text-ink font-extrabold mb-1 md:mb-0">형식</p>
              <p className="text-sm md:text-base leading-relaxed">
                PDF 전자책. 휴대전화·태블릿·컴퓨터 화면에서 읽도록 만든 단면 편집이고, 부록 양식은 출력해서 쓸 수 있습니다.
              </p>
            </li>
            <li className="py-4 border-b border-line md:grid md:grid-cols-[180px_1fr] md:gap-8">
              <p className="text-ink font-extrabold mb-1 md:mb-0">받는 방법</p>
              <p className="text-sm md:text-base leading-relaxed">
                결제가 끝나면 마이페이지에서 바로 다운로드할 수 있고, 결제 완료 안내 메일에도 같은 경로가 담깁니다.
              </p>
            </li>
            <li className="py-4 border-b border-line md:grid md:grid-cols-[180px_1fr] md:gap-8">
              <p className="text-ink font-extrabold mb-1 md:mb-0">유의</p>
              <p className="text-sm md:text-base leading-relaxed">
                저작권 보호를 위해 무단 복제·배포는 금지됩니다.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
