'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Cpu } from 'lucide-react'

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
      <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 text-sm text-white/60 leading-relaxed whitespace-pre-line">
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
      <footer className="pt-20 pb-10 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          {/* 상단: 로고 + 링크 컬럼 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
  <span className="text-xl font-bold tracking-tighter text-white">AI놀자</span>
</Link>

              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                미래를 여는 AI 교육의 시작. <br />
                우리는 모든 아이들이 AI와 함께 꿈꾸는 세상을 만듭니다.
              </p>
            </div>

            <div className="space-y-4">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">서비스</h6>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/programs" className="hover:text-white transition-colors">프로그램</Link></li>
                <li><Link href="/store" className="hover:text-white transition-colors">스토어</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">회사</h6>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="https://www.notion.so/229cd6961b4180fabd19f6c8ce7ca699?source=copy_link" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">소개</a></li>

                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="https://open.kakao.com/o/s7kkWTfh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">문의</a></li>

              </ul>
            </div>

            <div className="space-y-4">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">소셜</h6>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="https://www.threads.com/@ainolza.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Threads</a></li>

                <li><a href="https://www.instagram.com/ainolza.kr/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>

                <li><a href="https://www.youtube.com/@AINOLZA" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a></li>

              </ul>
            </div>

            <div className="space-y-4">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">법적 고지</h6>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <button onClick={() => setModal('privacy')} className="hover:text-white transition-colors text-left">
                    개인정보처리방침
                  </button>
                </li>
                <li>
                  <button onClick={() => setModal('terms')} className="hover:text-white transition-colors text-left">
                    이용약관
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div className="text-xs text-white/20 leading-relaxed space-y-1 mb-8">
            <p>에이아이놀자 (AI놀자) 대표자: 최경환 | 개인정보관리책임자: 최경환 | 이메일: ainolza@naver.com</p>
            <p>사업자 등록번호: 317-52-01191 | 통신판매신고번호: 2025-성남분당A-0508</p>
            <p>연락처: 070-8028-2616 | 주소: 경기도 성남시 분당구 판교백현로 65, 3층(백현동)</p>
          </div>

          {/* 하단 카피라이트 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest text-white/20 font-bold">
            <p>&copy; 2026 AI놀자. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => setModal('privacy')} className="hover:text-white/50 transition-colors">Privacy Policy</button>
              <button onClick={() => setModal('terms')} className="hover:text-white/50 transition-colors">Terms of Service</button>
            </div>
          </div>
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
