import Link from 'next/link'
import { ScrollRevealInit } from '@/components/ui/scroll-reveal'

/**
 * 바이브 코딩 [입문] VOD 상세페이지 본문.
 * 기존 캔바 상세페이지(라이브 기수용)의 카피·후기·비용표를 코드로 재구성한 버전.
 * 시니어 타깃이라 글자 크게. 톤은 ink/sub/line/surface/brand + dark 섹션(기존 캔바 페이지의 검정 섹션 리듬).
 * 인증샷 이미지: public/store/vibe-coding-101-vod/proof-1~3.png (실제 수강생 카톡 캡처)
 *
 * 스크롤 등장 애니메이션: data-reveal (globals.css 정의).
 * 레이아웃의 ScrollRevealInit은 클라이언트 내비게이션 시 재실행되지 않으므로
 * 이 컴포넌트 안에 한 번 더 마운트한다 (중복 마운트 무해).
 */

const CHECKOUT_URL = '/checkout?slug=vibe-coding-101-vod&pay=transfer'

// 실제 강의실 커리큘럼 기준 (classrooms/vibe-coding-101-vod)
const CURRICULUM_GROUPS = [
  {
    name: '오리엔테이션',
    count: '3강',
    desc: '계정 만들기부터 도구 설치까지, 시작 전 준비를 함께합니다',
    items: ['강사 소개', '사전 준비 가이드', '실제 레퍼런스 공개 — 24시간 알아서 돈을 버는 자동화 시스템'],
  },
  {
    name: '전반전 — 내 웹사이트 만들기',
    count: '11강',
    desc: '기획, 설계, 코드 요청, 배포까지. 화면에 보이는 내 사이트가 생깁니다',
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
    desc: '사이트가 스스로 일하게 만들고, 구글 애드센스로 수익을 연결합니다',
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

// 수강생 단톡방 실제 반응 (인증샷 원문)
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

const KAKAO_REACTIONS = ['결국 차분과 인내심!!!!!', '아직도 어리둥절하네요', '저도 된건가요??? 눈물이 그렁그렁', '왕, 드디어 성공했어요~~']

// 도구 비용 — 기존 상세페이지 표 그대로 (정직한 고지)
const TOOL_COSTS = [
  { tool: 'Google 계정', use: '기본 도구 + AdSense', cost: '무료' },
  { tool: 'GitHub', use: '코드 저장 + 배포', cost: '무료' },
  { tool: 'Cloudflare', use: '웹사이트 호스팅', cost: '무료' },
  { tool: 'Antigravity', use: '바이브코딩 핵심 도구', cost: '무료 (pro 플랜 선택)' },
  { tool: '도메인', use: '나만의 주소', cost: '연 1~2만원 (선택)' },
]

export function VodDetailContent() {
  return (
    <div className="border-t border-line overflow-hidden">
      <ScrollRevealInit />

      {/* 1. 후킹 — 다크 오프닝 */}
      <section className="py-24 md:py-32 px-6 bg-dark">
        <div className="max-w-[900px] mx-auto text-center">
          <div data-reveal>
            <p className="text-brand text-sm md:text-base font-bold mb-5 tracking-[0.2em] uppercase">
              30~60대 왕초보를 위한 바이브 코딩 실전
            </p>
            <h2 className="text-4xl md:text-[56px] font-extrabold text-white leading-[1.25] mb-8">
              코딩 몰라도
              <br />
              괜찮아요.
            </h2>
            <p className="text-white/60 text-lg md:text-2xl font-bold mb-8">
              처음부터 끝까지 <span className="text-brand">따라만 하면 완성</span>
            </p>
          </div>
          <p data-reveal data-reveal-delay="150" className="text-white/70 text-base md:text-lg leading-relaxed mb-10">
            AI와 함께 내 웹서비스를 만들고, 광고 수익까지 연결합니다.
            <br className="hidden md:block" />
            HTML, CSS 같은 건 몰라도 됩니다 — AI가 다 써줍니다.
          </p>
          <div data-reveal data-reveal-delay="300" className="flex flex-wrap justify-center gap-2">
            {['초보자도 OK', '실습 워크북 증정', '반복 시청'].map((tag) => (
              <span key={tag} className="px-5 py-2 rounded-full border border-white/25 text-white/80 text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 수강생 후기 + 인증샷 */}
      <section className="py-20 px-6 bg-surface relative">
        <div className="max-w-[720px] mx-auto relative">
          <p aria-hidden className="absolute -top-10 left-0 text-[140px] md:text-[180px] leading-none font-serif text-brand/15 select-none pointer-events-none">
            &ldquo;
          </p>
          <div data-reveal className="text-center mb-12 relative">
            <p className="text-brand text-sm font-bold mb-3 tracking-wide">수강생 전용방</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink leading-snug">
              &ldquo;어쩌다 보니 성공&rdquo;
            </h2>
            <p className="text-sub text-base mt-3">계속되는 성공 인증샷</p>
          </div>

          {/* 핵심 후기 말풍선 — 카톡처럼 왼쪽에서 등장 */}
          <div className="space-y-6 mb-14 relative">
            {REVIEWS.map((r, i) => (
              <div key={r.quote} data-reveal="right" data-reveal-delay={String(i * 150)} className={i % 2 === 1 ? 'md:ml-16' : 'md:mr-16'}>
                <div className="bg-white border border-line rounded-2xl rounded-bl-md px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <p className="text-ink text-base md:text-lg font-medium leading-relaxed">
                    {r.quote}
                  </p>
                </div>
                <p className="text-sub text-sm mt-2 ml-2">{r.who}</p>
              </div>
            ))}
          </div>

          {/* 실제 카톡 인증샷 */}
          <div className="space-y-5 mb-10">
            {[1, 2, 3].map((n) => (
              <div key={n} data-reveal className="rounded-2xl overflow-hidden border border-line bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/store/vibe-coding-101-vod/proof-${n}.png`}
                  alt={`수강생 성공 인증샷 ${n}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* 단톡방 반응 한 줄 모음 */}
          <div data-reveal className="flex flex-wrap justify-center gap-2">
            {KAKAO_REACTIONS.map((t) => (
              <span key={t} className="px-4 py-1.5 rounded-full bg-white border border-line text-sub text-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 결과물 — 브라우저 목업 */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-[900px] mx-auto">
          <div data-reveal className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-ink leading-snug">
              이 강의가 끝나면,
              <br className="md:hidden" /> 이런 웹사이트가 내 것이 됩니다
            </h2>
            <p className="text-body text-base md:text-lg mt-4 leading-relaxed">
              24시간 알아서 돌아가는 자동화 시스템.
              <br className="hidden md:block" />
              매일 아침, 내가 자는 동안에도 사이트가 스스로 새 글을 올립니다.
            </p>
          </div>

          {/* 브라우저 창 목업 프레임 */}
          <div data-reveal data-reveal-delay="150" className="rounded-2xl border border-line bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* 브라우저 헤더 */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-surface border-b border-line">
              <span className="w-3 h-3 rounded-full bg-line" />
              <span className="w-3 h-3 rounded-full bg-line" />
              <span className="w-3 h-3 rounded-full bg-line" />
              <span className="ml-3 flex-1 max-w-[320px] px-4 py-1 rounded-full bg-white border border-line text-hint text-xs truncate">
                내가-만든-사이트.com
              </span>
            </div>
            {/* 내부: 자동화 3단계 */}
            <div className="grid md:grid-cols-3 gap-0 md:divide-x divide-y md:divide-y-0 divide-line">
              {[
                { step: '1', title: '자동 수집', desc: '공공데이터를 매일 자동으로 가져옵니다' },
                { step: '2', title: 'AI가 글 작성', desc: 'AI가 수집한 정보로 블로그 글을 씁니다' },
                { step: '3', title: '자동 발행', desc: '완성된 글이 사이트에 자동으로 올라갑니다' },
              ].map((s) => (
                <div key={s.step} className="p-8 text-center">
                  <p className="text-brand font-extrabold text-4xl md:text-5xl mb-3">{s.step}</p>
                  <p className="text-ink font-bold text-lg mb-2">{s.title}</p>
                  <p className="text-sub text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <p data-reveal className="text-center text-sub text-sm mt-6">
            실제로 1·2기 수강생들이 이 구조 그대로 자기 사이트를 운영하고 있습니다
          </p>
        </div>
      </section>

      {/* 4. 비용 구조 — 초대형 0원 */}
      <section className="py-24 px-6 bg-surface border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <div data-reveal className="text-center mb-12">
            <p className="text-sub text-base md:text-lg mb-2">사이트 월 유지비</p>
            <p className="text-ink text-[88px] md:text-[128px] font-extrabold leading-none tracking-tight mb-6">
              0<span className="text-[0.5em] align-baseline">원</span>
            </p>
            <p className="text-body text-base md:text-lg leading-relaxed">
              전부 무료 도구만으로 만들고 운영합니다.
              <br className="hidden md:block" />
              그래서 광고 수익이 100원이 나와도 전부 이익입니다.
              <br />
              <strong className="text-ink">손해 볼 수 없는 구조</strong>로 시작하세요.
            </p>
          </div>
          <div data-reveal data-reveal-delay="150" className="border-t-2 border-ink bg-white rounded-b-2xl px-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <div className="flex py-3.5 border-b border-line text-sm font-bold text-ink">
              <span className="w-32 shrink-0">도구</span>
              <span className="flex-1">용도</span>
              <span className="w-36 shrink-0 text-right">비용</span>
            </div>
            {TOOL_COSTS.map((row, i) => (
              <div key={row.tool} className={`flex py-3.5 text-sm md:text-base ${i < TOOL_COSTS.length - 1 ? 'border-b border-line' : ''}`}>
                <span className="w-32 shrink-0 font-bold text-ink">{row.tool}</span>
                <span className="flex-1 text-sub">{row.use}</span>
                <span className={`w-36 shrink-0 text-right font-bold ${row.cost === '무료' ? 'text-brand' : 'text-sub'}`}>
                  {row.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 커리큘럼 */}
      <section className="py-20 px-6 border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <div data-reveal className="text-center mb-12">
            <p className="text-brand text-sm font-bold mb-3 tracking-wide">
              Antigravity + Cloudflare + GitHub + Google AdSense
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              총 <span className="text-brand">27강</span> — 따라만 하면 되는 순서로
            </h2>
            <p className="text-body text-base leading-relaxed">
              전 회차 VOD로 제공됩니다. 매 회차 노션 가이드북이 함께 제공되어
              <br className="hidden md:block" />
              영상을 보며 그대로 따라 하면 됩니다.
            </p>
          </div>

          {/* 3단계 요약 */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {[
              { n: '01', t: '기초 환경 세팅', d: '계정 만들기, GitHub·Cloudflare 가입, Antigravity 설치' },
              { n: '02', t: '바이브 코딩', d: '기획, 설계, 코드 요청, 배포. 도메인 연결까지' },
              { n: '03', t: '애드센스 수익화', d: 'AdSense 가입, 사이트 연결, 승인 후 광고 게재' },
            ].map((s, i) => (
              <div
                key={s.n}
                data-reveal
                data-reveal-delay={String(i * 150)}
                className="relative border border-line rounded-2xl p-6 pt-8 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <p aria-hidden className="absolute -top-3 -right-1 text-[72px] font-extrabold text-brand/10 leading-none select-none">
                  {s.n}
                </p>
                <p className="text-brand font-extrabold text-sm mb-1">{s.n}</p>
                <p className="text-ink font-bold text-lg mb-2">{s.t}</p>
                <p className="text-sub text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          {/* 27강 상세 */}
          <div className="space-y-10">
            {CURRICULUM_GROUPS.map((g) => (
              <div key={g.name} data-reveal>
                <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-4">
                  <h3 className="text-ink font-extrabold text-lg md:text-xl">{g.name}</h3>
                  <span className="text-brand font-bold text-sm shrink-0 ml-3">{g.count}</span>
                </div>
                <p className="text-sub text-sm mb-4">{g.desc}</p>
                <ul className="space-y-2">
                  {g.items.map((item, i) => (
                    <li key={item} className="flex gap-3 text-base text-body border-b border-line pb-2">
                      <span className="text-brand/60 font-bold text-sm shrink-0 w-6 text-right">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 성공은 우연이 아닙니다 */}
      <section className="py-20 px-6 bg-surface border-t border-line">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 data-reveal className="text-3xl md:text-4xl font-extrabold text-ink mb-12">
            성공은 우연이 아닙니다
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-16 text-left">
            {[
              { t: '잘 짜여진 커리큘럼', d: '핵심만 쏙쏙, 단시간에 결과가 나오는 순서' },
              { t: '반복 시청 VOD', d: '이해될 때까지 몇 번이고 다시 볼 수 있습니다' },
              { t: '따라만 해도 완성되는 가이드북', d: '매 회차 노션 가이드북으로 그대로 따라 하기' },
            ].map((p, i) => (
              <div
                key={p.t}
                data-reveal
                data-reveal-delay={String(i * 150)}
                className="bg-white border border-line border-t-2 border-t-brand rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <p className="text-ink font-bold text-base mb-2">{p.t}</p>
                <p className="text-sub text-sm leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <div data-reveal>
            <p className="text-ink text-2xl md:text-3xl font-extrabold mb-5">
              하지만 여전히 &lsquo;딸깍&rsquo;은 없습니다.
            </p>
            <p className="text-body text-base md:text-lg leading-relaxed">
              수강생들의 이야기처럼 차분함과 인내심을 가지면,
              <br className="hidden md:block" />
              어리둥절한 사이 어느새 성공해서 눈물이 그렁그렁해집니다.
            </p>
            <p className="text-ink text-xl md:text-2xl font-extrabold mt-6">
              &ldquo;이걸 내가 했다고?&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 7. 이런 분께 추천 — 다크 섹션 */}
      <section className="py-24 px-6 bg-dark">
        <div className="max-w-[720px] mx-auto">
          <h2 data-reveal className="text-3xl md:text-4xl font-extrabold text-white text-center mb-14">
            이런 분들께 <span className="text-brand">추천</span> 드려요
          </h2>
          <ul className="space-y-5">
            {[
              { t: '코딩을 한 번도 배운 적 없는 분', d: 'HTML, CSS, JS 몰라도 AI가 다 써줍니다' },
              { t: '부업·수익화를 원하는 분', d: '광고 수익형 웹사이트로 비용 부담 없는 부수입 구조' },
              { t: '내 아이디어를 빠르게 웹으로 만들고 싶은 분', d: '기획부터 개발, 배포까지 원스톱' },
            ].map((row, i) => (
              <li
                key={row.t}
                data-reveal="right"
                data-reveal-delay={String(i * 150)}
                className="bg-white/[0.06] border border-white/10 border-l-2 border-l-brand rounded-2xl px-7 py-6"
              >
                <p className="text-white text-lg md:text-xl font-bold leading-relaxed">{row.t}</p>
                <p className="text-white/60 text-sm md:text-base mt-1.5">{row.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. 강사 한마디 */}
      <section className="py-24 px-6 border-t border-line relative">
        <div data-reveal className="max-w-[720px] mx-auto text-center relative">
          <p aria-hidden className="absolute -top-14 left-1/2 -translate-x-1/2 text-[120px] leading-none font-serif text-brand/15 select-none pointer-events-none">
            &ldquo;
          </p>
          <p className="text-brand text-sm font-bold mb-8 tracking-wide">강사의 한마디</p>
          <p className="text-body text-base md:text-lg leading-loose mb-10">
            상상력이 곧 현실이 되는 시대입니다. 과거에는 꿈으로만 여겨졌던 아이디어들이
            코딩의 장벽이 무너지며 현실로 만들어지고 있습니다.
            이제 중요한 것은 독창적인 아이디어와, 그것을 현실로 만들어 본 실행 경험입니다.
            제 경험을 발판 삼아 시행착오를 줄이고 당신의 경험을 한 단계 발전시키세요.
          </p>
          <p className="text-ink text-xl md:text-2xl font-extrabold leading-relaxed mb-4">
            바이브 코딩 클래스는 단순한 강의가 아닙니다.
            <br />
            당신의 <span className="text-brand">상상을 현실로</span> 만드는 시작점입니다.
          </p>
          <p className="text-sub text-sm">AI놀자 대표 강사 최경환</p>
        </div>
      </section>

      {/* 9. 수강 방식 */}
      <section className="py-20 px-6 bg-surface border-t border-line">
        <div className="max-w-[720px] mx-auto">
          <h2 data-reveal className="text-3xl md:text-4xl font-extrabold text-ink text-center mb-12">
            결제 즉시, <span className="text-brand">100일</span> 동안
          </h2>
          <div data-reveal data-reveal-delay="150" className="grid md:grid-cols-2 gap-4">
            {[
              { t: '즉시 시청', d: '결제 즉시 전 회차를 바로 볼 수 있습니다' },
              { t: '100일 수강', d: '결제일로부터 100일간 무제한 반복 시청' },
              { t: '노션 가이드북', d: '매 회차 따라 하기 가이드북 제공' },
              { t: '진도 체크', d: '회차별 진도율이 기록되어 어디까지 들었는지 한눈에' },
            ].map((row) => (
              <div key={row.t} className="bg-white border border-line rounded-2xl px-6 py-5">
                <p className="text-ink font-bold text-base mb-1">{row.t}</p>
                <p className="text-sub text-sm leading-relaxed">{row.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. 현금 할인 이벤트 CTA — 브랜드 코랄 마감 */}
      <section className="py-24 md:py-28 px-6 bg-brand">
        <div className="max-w-[720px] mx-auto text-center">
          <p data-reveal className="text-white text-2xl md:text-3xl font-extrabold mb-10">
            고민은 시작만 늦출 뿐
          </p>
          <div data-reveal data-reveal-delay="150">
            <p className="text-white/80 text-sm md:text-base font-bold mb-3 tracking-[0.15em]">
              VOD 런칭 기념 · 기간 한정
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
              현금 할인 이벤트
            </h2>
            <div className="flex items-baseline justify-center gap-4 mb-3">
              <span className="text-white/50 text-xl md:text-2xl line-through">119,000원</span>
              <span className="text-white text-5xl md:text-6xl font-extrabold">89,000원</span>
            </div>
            <p className="text-white/70 text-sm mb-12">계좌이체 · 무통장 입금 결제 시 적용됩니다</p>
          </div>
          <div data-reveal data-reveal-delay="300">
            <Link
              href={CHECKOUT_URL}
              className="inline-block px-14 py-5 bg-white text-brand font-extrabold text-lg rounded-2xl hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all"
            >
              할인가로 수강 신청하기 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
