'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    q: 'AI놀자는 어떤 사이트인가요?',
    a: '평범한 사람을 위한 AI 활용을 돕는 공간입니다. 직접 만든 무료 도구·실험실, 그리고 강의·도서를 제공합니다. 회원가입 없이도 도구와 실험실은 자유롭게 이용할 수 있어요.',
  },
  {
    q: '회원가입 / 로그인은 어떻게 하나요?',
    a: '이메일로 가입하거나 Google 계정으로 즉시 로그인할 수 있습니다. 기존에 아임웹에서 가입하셨던 분은 같은 이메일로 다시 가입하시거나, \'비밀번호 찾기\'로 새 비밀번호를 설정해 주세요.',
  },
  {
    q: '결제는 어떻게 진행되나요?',
    a: '현재 홈페이지 이전 작업으로 카드 결제는 일시 중단된 상태입니다. 강의·도서 구매를 원하시면 카카오톡 오픈채팅으로 문의해 주세요. 계좌이체로 안내드립니다.',
  },
  {
    q: '환불은 가능한가요?',
    a: '강의는 수강 시작 7일 이내, 진도율 30% 미만인 경우 전액 환불 가능합니다. 자세한 환불 규정은 각 상품 페이지를 참고해 주세요.',
  },
  {
    q: '도구와 실험실은 무료인가요?',
    a: '네, 모두 무료입니다. 캠페인이나 결제 없이 누구나 이용할 수 있습니다.',
  },
]

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-12">
          <p className="text-brand text-sm font-bold mb-3 tracking-wide">자주 묻는 질문</p>
          <h1 className="text-4xl font-extrabold text-ink">FAQ</h1>
          <p className="text-body mt-4">강의별 FAQ는 각 상품 페이지를 참고해 주세요.</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#D4756E]/20 transition-all"
            >
              <button
                type="button"
                className="w-full text-left p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="flex items-center gap-4">
                  <span className="text-brand text-sm font-extrabold">Q</span>
                  <span className="text-base font-bold text-ink">{item.q}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-sub transition-transform shrink-0 ml-3 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-body text-sm leading-relaxed pl-14">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
