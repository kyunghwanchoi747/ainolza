import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '후기',
  description: 'AI놀자 수강생들의 실제 후기를 확인해보세요.',
}

const reviews = [
  { name: "김**", date: "2026-03-28", product: "AI 바이브 코딩 클래스", rating: 5, text: "코딩을 전혀 몰랐는데 4주 만에 블로그를 완성했어요. 강의가 정말 체계적이고, 막히는 부분마다 바로 도움을 받을 수 있어서 좋았습니다." },
  { name: "이**", date: "2026-03-26", product: "AI 바이브 코딩 클래스", rating: 5, text: "50대인데 이런 강의 처음이에요. 어렵지 않게 설명해주셔서 따라갈 수 있었습니다. 이제 제 블로그에서 애드센스 수익이 나오기 시작했어요!" },
  { name: "박**", date: "2026-03-24", product: "AI 바이브 코딩 클래스", rating: 5, text: "유튜브로 먼저 접하고 수강했는데, 영상에서 못 다룬 실전 노하우가 정말 많아요. 가격 대비 최고의 투자였습니다." },
  { name: "최**", date: "2026-03-22", product: "AI 바이브 코딩 클래스", rating: 5, text: "강의 퀄리티가 너무 좋아요. 만족합니다. 선생님이 하나하나 꼼꼼하게 알려주셔서 초보자도 충분히 따라갈 수 있습니다." },
  { name: "정**", date: "2026-03-20", product: "AI 바이브 코딩 클래스", rating: 4, text: "개인적으로 관심이 많은 분야인데 도움이 될것 같습니다. 감사합니다. 다음 기수도 기대돼요." },
  { name: "한**", date: "2026-03-18", product: "AI 바이브 코딩 클래스", rating: 5, text: "찾고있던 정보라 너무 반가웠어요^^ 정보가 보배거든요. 너무 감사해요~~ 잘 설치해서 유용하게 써볼게요.!!..." },
  { name: "송**", date: "2026-03-15", product: "AI 바이브 코딩 클래스", rating: 5, text: "우연히 유튜브 채널을 통해 강의를 봤는데~ 대박입니다. 앞으로 열심히 배우겠습니다." },
  { name: "임**", date: "2026-03-12", product: "AI 바이브 코딩 클래스", rating: 5, text: "구직자입니다. 무조껀 따라서 묵묵히 배워보겠습니다. 고맙습니다. AI 시대에 이런 실전 강의가 정말 필요해요." },
]

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-[#333] mb-2">후기</h1>
          <p className="text-[#666] mb-10">AI놀자가 제작하고 판매한 전자책과 강의, 패키지 콘텐츠의 실제 구매 후기를 모아둔 공간입니다.</p>

          <div className="border-t border-[#e5e5e5]">
            {reviews.map((r, i) => (
              <div key={i} className="py-6 border-b border-[#e5e5e5]">
                <p className="text-[#D4756E] text-sm font-medium mb-1">{r.product}</p>
                <p className="text-[#333] leading-relaxed mb-3">{r.text}</p>
                <div className="flex items-center gap-3 text-sm text-[#999]">
                  <span>{r.name}</span>
                  <span>|</span>
                  <span>{r.date}</span>
                </div>
                <div className="mt-2 text-[#F59E0B]">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
