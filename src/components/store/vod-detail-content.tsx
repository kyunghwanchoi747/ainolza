import Link from 'next/link'

/**
 * 바이브 코딩 [입문] VOD 상세페이지 본문.
 * 캔바 이미지 대신 코드로 구현 — 시니어 타깃이라 글자 크게, 톤은 ink/sub/line/surface/brand만 사용.
 * 수강생 사이트 캡처 등 실제 사진이 준비되면 해당 자리에 이미지를 추가한다.
 */

const CHECKOUT_URL = '/checkout?slug=vibe-coding-101-vod&pay=transfer'

// 실제 강의실 커리큘럼 기준 (classrooms/vibe-coding-101-vod)
const CURRICULUM_GROUPS = [
  {
    name: '오리엔테이션',
    count: '3강',
    desc: '시작 전 마음의 준비',
    items: ['강사 소개', '사전 준비 가이드', '실제 레퍼런스 공개'],
  },
  {
    name: '전반전 — 내 웹사이트 만들기',
    count: '11강',
    desc: '화면에 보이는 내 사이트가 생깁니다',
    items: [
      '안티그래비티 기초 세팅',
      '프로젝트 시작',
      '프로젝트 설계도 만들기',
      'Next.js 프로젝트 생성',
      '추가 도구 설치',
      'Cloudflare 배포 설정',
      '눈에 보이는 화면 만들기',
      '디자인 커스터마이징 — AI한테 말로 디자인하기',
      '상세 페이지 만들기',
      'GitHub 연동 + Cloudflare 배포',
      '전반전 마무리 과제',
    ],
  },
  {
    name: '후반전 — 자동화와 수익화',
    count: '11강',
    desc: '사이트가 스스로 일하게 만듭니다',
    items: [
      '환경변수 파일 만들기',
      '블로그 글 써보기',
      '블로그 글 배포하기',
      '텍스트 수집으로 블로그 글 작성',
      '사이트에 반영 후 배포',
      '자동화 1',
      '브랜치',
      '워크플로',
      '자동화 2',
      '도메인 설정',
      '후반전 마무리 — 최적화 + 수익화',
    ],
  },
  {
    name: '보너스',
    count: '2강',
    desc: '선택 수강',
    items: ['연장전 — 쿠팡 파트너스 (선택)', '프로젝트 삭제 방법'],
  },
]

const REVIEWS = [
  {
    quote: '뭔지 모르고 그냥 따라만 했는데… 내 웹사이트가 완성됐어요.',
    who: '1기 수강생',
  },
  {
    quote: '비용이 전혀 안 들어가는 구조라서, 한 달에 100원만 벌어도 이득이에요.',
    who: '1기 수강생',
  },
  {
    quote: '저도 따라 했는데요? 누구나 할 수 있게 정말 잘 짜인 커리큘럼이에요.',
    who: '2기 수강생',
  },
]

export function VodDetailContent() {
  return (
    <div className="border-t border-line">
      {/* 1. 후킹 */}
      <section className="py-20 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-brand text-sm md:text-base font-bold mb-4 tracking-wide">
            30~60대 왕초보를 위한 바이브 코딩
          </p>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-ink leading-[1.3] mb-6">
            코딩을 1도 몰라도,
            <br />
            따라 하면 내 웹사이트가 완성됩니다
          </h2>
          <p className="text-body text-base md:text-lg leading-relaxed">
            프로그래밍 지식 없이, AI에게 말로 시켜서 만듭니다.
            <br className="hidden md:block" />
            영상을 보며 그대로 따라 하는 것이 이 강의의 전부입니다.
          </p>
        </div>
      </section>

      {/* 2. 수강생 후기 */}
      <section className="py-20 px-6 bg-surface border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink text-center mb-12">
            수강생들이 가장 많이 한 말
          </h2>
          <div className="space-y-6">
            {REVIEWS.map((r) => (
              <div key={r.quote}>
                <div className="bg-white border border-line rounded-2xl rounded-bl-md px-6 py-5">
                  <p className="text-ink text-base md:text-lg font-medium leading-relaxed">
                    {r.quote}
                  </p>
                </div>
                <p className="text-sub text-sm mt-2 ml-2">{r.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 결과물 */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink leading-snug">
              이 강의가 끝나면,
              <br className="md:hidden" /> 이런 웹사이트가 내 것이 됩니다
            </h2>
            <p className="text-body text-base md:text-lg mt-4 leading-relaxed">
              매일 아침, 사이트가 스스로 새 글을 올립니다.
              <br className="hidden md:block" />
              내가 자는 동안에도 사이트가 일합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '1', title: '자동 수집', desc: '공공데이터를 매일 자동으로 가져옵니다' },
              { step: '2', title: 'AI가 글 작성', desc: 'AI가 수집한 정보로 블로그 글을 씁니다' },
              { step: '3', title: '자동 발행', desc: '완성된 글이 사이트에 자동으로 올라갑니다' },
            ].map((s) => (
              <div key={s.step} className="border border-line rounded-2xl p-6 text-center">
                <p className="text-brand font-extrabold text-sm mb-2">STEP {s.step}</p>
                <p className="text-ink font-bold text-lg mb-2">{s.title}</p>
                <p className="text-sub text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 비용 0원 구조 */}
      <section className="py-20 px-6 bg-surface border-t border-line">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">
            서버비 0원. 프로그램비 0원. 유지비 0원.
          </h2>
          <p className="text-body text-base md:text-lg leading-relaxed mb-10">
            전부 무료 도구만으로 만들고 운영합니다.
            <br className="hidden md:block" />
            그래서 광고 수익이 100원이 나와도 전부 이익입니다.
            <br />
            <strong className="text-ink">손해 볼 수 없는 구조</strong>로 시작하세요.
          </p>
          <div className="inline-block border-t-2 border-ink pt-4 px-8">
            <p className="text-sub text-sm mb-1">사이트 월 유지비</p>
            <p className="text-ink text-4xl md:text-5xl font-extrabold">0원</p>
          </div>
        </div>
      </section>

      {/* 5. 커리큘럼 */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-4">
              총 27강 — 따라만 하면 되는 순서로
            </h2>
            <p className="text-body text-base leading-relaxed">
              전 회차 VOD로 제공됩니다. 매 회차 노션 가이드북이 함께 제공되어
              <br className="hidden md:block" />
              영상을 보며 그대로 따라 하면 됩니다.
            </p>
          </div>
          <div className="space-y-10">
            {CURRICULUM_GROUPS.map((g) => (
              <div key={g.name}>
                <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-4">
                  <h3 className="text-ink font-extrabold text-lg md:text-xl">{g.name}</h3>
                  <span className="text-brand font-bold text-sm shrink-0 ml-3">{g.count}</span>
                </div>
                <p className="text-sub text-sm mb-4">{g.desc}</p>
                <ul className="space-y-2">
                  {g.items.map((item, i) => (
                    <li key={item} className="flex gap-3 text-base text-body border-b border-line pb-2">
                      <span className="text-sub text-sm shrink-0 w-6 text-right">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 수강 방식 */}
      <section className="py-20 px-6 bg-surface border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink text-center mb-12">
            결제 즉시, 100일 동안
          </h2>
          <div className="divide-y divide-line border-t border-b border-line">
            {[
              { t: '즉시 시청', d: '결제 즉시 전 회차를 바로 볼 수 있습니다' },
              { t: '100일 수강', d: '결제일로부터 100일간 무제한 반복 시청' },
              { t: '노션 가이드북', d: '매 회차 따라 하기 가이드북 제공' },
              { t: '진도 체크', d: '회차별 진도율이 기록되어 어디까지 들었는지 한눈에' },
            ].map((row) => (
              <div key={row.t} className="flex py-4 gap-4">
                <p className="w-28 shrink-0 text-ink font-bold text-base">{row.t}</p>
                <p className="text-body text-base">{row.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 이런 분께 추천 */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink text-center mb-12">
            이런 분께 추천합니다
          </h2>
          <ul className="space-y-4">
            {[
              '컴퓨터는 켤 줄만 아는데, 뭔가 만들어보고 싶은 분',
              '은퇴 전후로 비용 부담 없는 온라인 수익 구조를 갖고 싶은 분',
              '강의만 듣고 끝나는 게 아니라, 끝났을 때 "내 것"이 남길 원하는 분',
            ].map((t) => (
              <li key={t} className="border-l-2 border-brand pl-5 py-1 text-ink text-base md:text-lg font-medium leading-relaxed">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. 현금 할인 이벤트 CTA */}
      <section className="py-20 px-6 bg-brand-light border-t border-line">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-brand text-sm md:text-base font-bold mb-3 tracking-wide">
            VOD 런칭 기념 · 기간 한정
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">
            현금 할인 이벤트
          </h2>
          <div className="flex items-baseline justify-center gap-4 mb-3">
            <span className="text-sub text-xl md:text-2xl line-through">119,000원</span>
            <span className="text-brand text-4xl md:text-5xl font-extrabold">89,000원</span>
          </div>
          <p className="text-sub text-sm mb-10">계좌이체 · 무통장 입금 결제 시 적용됩니다</p>
          <Link
            href={CHECKOUT_URL}
            className="inline-block px-12 py-4 bg-brand text-white font-bold text-lg rounded-xl hover:bg-brand-dark transition-colors"
          >
            할인가로 수강 신청하기 →
          </Link>
        </div>
      </section>
    </div>
  )
}
