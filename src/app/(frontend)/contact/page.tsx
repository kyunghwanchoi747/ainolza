import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문의하기',
  description: 'AI놀자에 궁금한 점을 문의해보세요.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold text-[#333] mb-2">문의하기</h1>
          <p className="text-[#666] mb-10">궁금한 점이 있으시면 아래 방법으로 연락해주세요.</p>

          <div className="space-y-4">
            {/* 카카오 오픈채팅 */}
            <a
              href="https://open.kakao.com/o/s7kkWTfh"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-xl border border-[#e5e5e5] hover:border-[#FEE500]/50 hover:bg-[#FEE500]/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEE500] flex items-center justify-center text-xl shrink-0">&#128172;</div>
                <div>
                  <h3 className="font-bold text-[#333]">카카오톡 오픈채팅</h3>
                  <p className="text-[#999] text-sm">가장 빠르게 답변받을 수 있어요</p>
                </div>
              </div>
            </a>

            {/* 이메일 */}
            <a
              href="mailto:ainolza@naver.com"
              className="block p-6 rounded-xl border border-[#e5e5e5] hover:border-[#D4756E]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f8f8f8] flex items-center justify-center text-xl shrink-0">&#9993;</div>
                <div>
                  <h3 className="font-bold text-[#333]">이메일</h3>
                  <p className="text-[#999] text-sm">ainolza@naver.com</p>
                </div>
              </div>
            </a>

          </div>

          {/* 운영 시간 */}
          <div className="mt-10 p-5 rounded-xl bg-[#f8f8f8] text-sm text-[#666]">
            <h3 className="font-bold text-[#333] mb-2">운영 안내</h3>
            <ul className="space-y-1">
              <li>카카오톡: 평일/주말 수시 응답</li>
              <li>이메일: 1~2 영업일 이내 답변</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
