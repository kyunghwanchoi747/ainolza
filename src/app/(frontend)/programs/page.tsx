'use client'

import Link from 'next/link'


export const dynamic = 'force-dynamic'

export default function ProgramsPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* 히어로 */}
      <section className="pt-24 pb-16 px-6 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-white/40 uppercase tracking-[0.2em] mb-4">Program</p>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight mb-6">
            AI 바이브<br />코딩 클래스
          </h1>
          <p className="text-white/50 text-lg">나만의 독립된 웹사이트를 AI로 직접 만드는 실전 과정</p>
        </div>
      </section>

      {/* 이미지 4장 세로 */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-full rounded-2xl overflow-hidden border border-white/10">
              <img
                src={`/programs/바이브코딩상세${n}.png`}
                alt={`바이브 코딩 클래스 ${n}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 본문 */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-20">

          {/* 섹션 1 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-medium leading-tight mb-8">
              {'"'}아직도 남의 땅에서 농사짓고 계신가요?{'"'}
            </h2>
            <div className="space-y-5 text-white/60 text-lg leading-relaxed">
              <p>네이버 블로그, 유튜브... 언제까지 플랫폼의 알고리즘 눈치만 보실 건가요?</p>
              <p>진정한 온라인 수익화는 <span className="text-white">&apos;나만의 독립된 성(웹사이트)&apos;</span>을 구축하는 것에서 시작합니다.</p>
              <p>시행착오 끝에 깨달은 비즈니스 로직, 그 본질을 투명하게 공개합니다.</p>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* 섹션 2 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-medium mb-10">왜 &apos;AI 바이브 코딩&apos;인가?</h2>
            <div className="space-y-8">
              {[
                {
                  title: '시니어를 위한 AI',
                  desc: '경험은 많지만 기술이 두려웠던 분들에게 AI는 최고의 플레이어가 됩니다.',
                },
                {
                  title: '기획만 하세요',
                  desc: '파이썬, 자바스크립트 몰라도 됩니다. AI가 뼈대를 잡고 정보를 수집합니다.',
                },
                {
                  title: '강력한 무기',
                  desc: '단순히 AI 쓰는 법이 아니라, 실제 돈이 되는 웹을 만드는 디렉팅 기술을 배웁니다.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm text-white/40 shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg mb-2">{item.title}</h3>
                    <p className="text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* 섹션 3 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-medium mb-10">무엇을 배우나요?</h2>
            <div className="grid gap-4">
              {[
                {
                  tag: '01',
                  title: '관점의 전환',
                  desc: '소비자의 눈이 아닌 생산자의 눈으로 시장(수요) 읽기.',
                },
                {
                  tag: '02',
                  title: '틈새 전략',
                  desc: '대형 매체가 다루지 않는 지역 정보로 꾸준한 트래픽 만들기.',
                },
                {
                  tag: '03',
                  title: '바이브 코딩 실전',
                  desc: 'AI로 독립 웹사이트 구축 및 커스터마이징.',
                },
                {
                  tag: '04',
                  title: '수익 자동화',
                  desc: '구글 애드센스 연동 및 실질적인 현금 흐름 창출.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                  <span className="text-white/20 text-sm font-mono shrink-0">{item.tag}</span>
                  <div>
                    <h3 className="text-white font-medium mb-1">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/manager"
              className="inline-block px-10 py-5 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all text-base"
            >
              수강 신청하기
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
