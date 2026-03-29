'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const termsContent = `제1조 목적

본 이용약관은 "AI놀자"(이하"사이트")의 서비스의 이용조건과 운영에 관한 제반 사항 규정을 목적으로 합니다.
본 사이트는 AI 자동화 템플릿 및 관련 콘텐츠를 제공하며 회원은 본 사이트를 통해 AI 템플릿을 구매 다운로드 및 활용할 수 있습니다.

제2조 용어의 정의

① 회원 : 사이트의 약관에 동의하고 개인정보를 제공하여 회원등록을 한 자
② 이용계약 : 사이트 이용과 관련하여 사이트와 회원간에 체결하는 계약
③ 디지털 상품 : AI 자동화 템플릿, 코드, 프롬프트, 설정 파일 등 무형의 콘텐츠
④ 라이선스 : 구매자가 디지털 상품을 사용할 수 있는 사용 권한

제3조 약관 외 준칙

운영자는 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.

제4조 이용계약 체결

이용계약은 회원으로 등록하여 사이트를 이용하려는 자의 본 약관 내용에 대한 동의와 가입신청에 대하여 운영자의 이용승낙으로 성립합니다.

제5조 서비스 이용 신청

① 회원으로 등록하여 사이트를 이용하려는 이용자는 사이트에서 요청하는 제반정보를 제공해야 합니다.
② 디지털 상품의 특성상, 결제가 완료된 후에는 환불이 불가합니다. 단, 법적으로 요구되는 경우(결제 오류, 중복 결제 등)에는 예외적으로 환불이 가능할 수 있습니다.

제6조 개인정보처리방침

운영자는 관계 법령이 정하는 바에 따라 회원등록정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다.

제7조 운영자의 의무

운영자는 서비스 제공과 관련하여 알고 있는 회원의 신상정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다.`

const privacyContent = `AI놀자 개인정보 처리방침

AI놀자(이하 '회사')는 개인정보 보호법 제30조에 따라 정보 주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립, 공개합니다.

제1조 (개인정보의 처리목적)

회사는 다음의 목적을 위하여 개인정보를 처리합니다.

회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정 이용 방지, 각종 고지·통지, 고충 처리 등을 목적으로 개인정보를 처리합니다.

서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 요금 결제 및 정산 등을 목적으로 개인정보를 처리합니다.

제2조 (개인정보의 처리 및 보유기간)

회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

제3조 (정보주체의 권리·의무 및 행사방법)

정보주체는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.

제4조 (개인정보의 파기)

개인정보 보유 기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.

제5조 (개인정보 보호책임자)

성명: 최경환
연락처: rex39@naver.com

관련 기관:
1. 개인정보 분쟁조정위원회: 1833-6972 (www.kopico.go.kr)
2. 개인정보침해신고센터: 118 (privacy.kisa.or.kr)
3. 대검찰청: 1301 (www.spo.go.kr)
4. 경찰청: 182 (ecrm.cyber.go.kr)

이 개인정보 처리방침은 2025년 3월 1일부터 적용됩니다.`

function Modal({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-foreground/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <h2 className="text-lg font-medium text-foreground">{title}</h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 text-sm text-foreground/60 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  )
}

export function SiteFooter() {
  const [modal, setModal] = useState<'terms' | 'privacy' | null>(null)

  return (
    <>
      <footer className="bg-[#111] text-white/60 py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center space-y-4">
          <div className="flex justify-center gap-4 text-sm">
            <button onClick={() => setModal('privacy')} className="hover:text-white transition-colors">개인정보처리방침</button>
            <span className="text-white/20">|</span>
            <button onClick={() => setModal('terms')} className="hover:text-white transition-colors">이용약관</button>
          </div>
          <div className="text-xs text-white/30 leading-relaxed space-y-1">
            <p>에이아이놀자 (AI놀자) 대표자: 최경환 | 개인정보관리책임자: 최경환 | 이메일: ainolza@naver.com</p>
            <p>사업자 등록번호: 317-52-01191 | 통신판매신고번호: 2025-성남분당A-0508</p>
            <p>연락처: 070-8028-2616 | 주소: 경기도 성남시 분당구 판교백현로 65, 3층(백현동)</p>
          </div>
          <p className="text-xs text-white/20">&copy; 2026 AI놀자. All rights reserved.</p>
        </div>
      </footer>

      {modal && (
        <Modal
          title={modal === 'terms' ? '이용약관' : '개인정보처리방침'}
          content={modal === 'terms' ? termsContent : privacyContent}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
