import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 실험실',
  description: '놀면서 배우는 AI 체험 프로그램. 프롬프트 챌린지, AI 퀴즈, 직업 탐색기까지.',
}

const labs = [
  { href: "/labs/prompt-challenge.html", title: "프롬프트 챌린지", desc: "이미지를 보고 AI처럼 묘사해보세요. 프롬프트 작성 실력을 키울 수 있어요.", tag: "인기", color: "#D4756E" },
  { href: "/labs/ai-vs-me.html", title: "AI vs 나", desc: "같은 질문에 AI와 내가 함께 답변. 사고방식의 차이를 발견해보세요.", color: "#7C3AED" },
  { href: "/labs/prompt-builder.html", title: "프롬프트 빌더", desc: "요소를 조합해서 완성도 높은 프롬프트를 만들어보세요.", color: "#10b981" },
  { href: "/labs/career-explorer.html", title: "AI 직업 탐색기", desc: "내 관심사를 입력하면 AI가 미래 직업과 활용법을 제안해줘요.", color: "#3B82F6" },
  { href: "/labs/ai-word-quiz.html", title: "AI 단어 퀴즈", desc: "AI 용어를 배우면서 두뇌도 훈련! 15초 안에 정답을 맞춰보세요.", color: "#F59E0B" },
  { href: "/labs/ai-or-human.html", title: "AI일까? 사람일까?", desc: "이 글을 만든 건 AI일까요, 사람일까요? 감별력을 테스트해보세요.", color: "#EC4899" },
]

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-[1200px] mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#333]">AI 실험실</h1>
            <p className="text-[#666] mt-2">놀면서 배우는 AI 체험 프로그램</p>
          </div>
          <Image src="/mascot.png" alt="AI놀자 마스코트" width={60} height={60} className="object-contain" />
        </div>
      </section>

      {/* 오늘의 퀴즈 배너 */}
      <section className="px-6 pb-6">
        <Link href="/labs/daily-quiz.html" className="group block max-w-[1200px] mx-auto p-5 bg-[#f8f8f8] rounded-xl border border-[#e5e5e5] hover:border-[#D4A853]/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">&#128218;</span>
              <div>
                <span className="text-[11px] text-[#D4A853] font-bold">DAILY</span>
                <h3 className="font-bold text-[#333]">오늘의 AI 퀴즈</h3>
                <p className="text-[#999] text-sm">매일 1문제! 출석 도장도 모으고 AI 상식도 쌓아보세요.</p>
              </div>
            </div>
            <span className="text-sm text-[#D4A853] font-medium flex items-center gap-1 shrink-0">
              오늘의 문제 풀기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      {/* 게임 카드 */}
      <section className="px-6 pb-20">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-6 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-[#333]">{item.title}</h3>
                {item.tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color + '20', color: item.color }}>{item.tag}</span>}
              </div>
              <p className="text-[#666] text-sm mb-4">{item.desc}</p>
              <span className="text-sm font-medium flex items-center gap-1" style={{ color: item.color }}>
                시작하기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
