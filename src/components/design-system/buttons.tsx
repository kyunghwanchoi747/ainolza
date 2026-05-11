/**
 * AI놀자 디자인 시스템 — 버튼.
 *
 * 사용 원칙:
 *  - 텍스트만 바꿔 어디든 재사용. 폰트·크기·비율·간격은 컴포넌트가 책임짐.
 *  - 외부에서 className으로 색/폰트 덮어쓰지 말 것. 변경 필요 시 컴포넌트에 옵션 추가.
 *  - 새 페이지에서 시각 톤 유지하려면 이 컴포넌트를 그대로 쓸 것.
 */
import Link from 'next/link'

type CommonProps = {
  href: string
  external?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * 메인 CTA 버튼 — 흰 배경 + 보더 없음 + 부드러운 이중 그림자.
 * "수강 신청하기 →" 같은 1순위 행동에 사용.
 *
 * 시각 톤:
 *  - 폰트: 18~20px, ink(#1a1a1a), font-extrabold, tracking-tight
 *  - 패딩: py-5 (세로 20px)
 *  - radius: 2xl (16px)
 *  - shadow: 가까운 + 멀리 이중. hover 시 더 깊어지고 1px 부상.
 */
export function PrimaryButtonCard({ href, external, className = '', children }: CommonProps) {
  const cls = `block w-full py-5 bg-white text-ink font-extrabold rounded-2xl text-center text-lg md:text-xl tracking-tight cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[1px] ${className}`.trim()
  if (external || /^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

/**
 * 카카오톡 버튼 — 카카오 노랑 + 검정 K 마크 + 검정 굵은 글씨.
 * 보조 행동(문의)에 사용.
 *
 * 시각 톤:
 *  - 배경: #FEE500, 호버 #FFE000
 *  - 폰트: 16~18px, #191919, font-extrabold
 *  - K 마크: 18px 정사각형 + 검정 배경 + 노란 글자
 */
export function KakaoButton({ href, className = '', children }: CommonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 w-full py-5 bg-[#FEE500] text-[#191919] font-extrabold rounded-2xl hover:bg-[#FFE000] transition-all text-base md:text-lg cursor-pointer ${className}`.trim()}
    >
      <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded bg-[#191919] text-[#FEE500] text-[10px] font-extrabold">
        K
      </span>
      {children}
    </a>
  )
}

/**
 * 보조 outline 버튼 — 회색 보더 + 흰 배경.
 * 사이드/하단의 secondary 액션에 사용.
 */
export function OutlineButton({ href, external, className = '', children }: CommonProps) {
  const cls = `block w-full py-5 border border-line text-ink font-extrabold rounded-2xl text-center text-base md:text-lg cursor-pointer hover:bg-surface transition-all ${className}`.trim()
  if (external || /^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
