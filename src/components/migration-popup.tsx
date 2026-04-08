'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

export function MigrationPopup() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // admin/manager 페이지에서는 팝업 안 보임
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/manager')) {
      return
    }
    const today = new Date().toISOString().split('T')[0]
    const hidden = localStorage.getItem('migration-popup-hidden')
    if (hidden !== today) {
      setShow(true)
    }
  }, [pathname])

  const handleClose = () => setShow(false)

  const handleHideToday = () => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('migration-popup-hidden', today)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-bold text-[#333]">새 홈페이지로 이전 중입니다</h2>
          <button onClick={handleClose} className="text-[#999] hover:text-[#333] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-[#666] leading-relaxed">
            안녕하세요, <strong className="text-[#D4756E]">AI놀자</strong>입니다.<br />
            홈페이지를 새로 단장하여 운영을 시작합니다.
          </p>

          <div className="p-4 rounded-xl bg-[#f8f8f8] border border-[#e5e5e5]">
            <p className="text-xs font-bold text-[#333] mb-2">&#128221; 안내사항</p>
            <ul className="text-xs text-[#666] space-y-1.5 leading-relaxed">
              <li>&#8226; 기존 회원은 비밀번호 재설정이 필요합니다</li>
              <li>&#8226; 결제 시스템은 곧 오픈됩니다</li>
              <li>&#8226; 강의 자료는 노션 페이지로 전달됩니다</li>
              <li>&#8226; 라이브 강의는 유튜브로 진행됩니다</li>
            </ul>
          </div>

          <p className="text-xs text-[#999] leading-relaxed">
            문의는 카카오톡 오픈채팅으로 부탁드립니다.
          </p>

          {/* 카카오 버튼 */}
          <a
            href="https://open.kakao.com/o/s7kkWTfh"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-xl text-center hover:bg-[#FFE000] transition-all text-sm"
          >
            카카오 오픈채팅으로 문의하기
          </a>
        </div>

        {/* 푸터 버튼 */}
        <div className="flex border-t border-[#e5e5e5]">
          <button
            onClick={handleHideToday}
            className="flex-1 py-4 text-sm text-[#666] hover:bg-[#f8f8f8] transition-colors border-r border-[#e5e5e5]"
          >
            오늘 다시 보지 않기
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-4 text-sm font-bold text-[#333] hover:bg-[#f8f8f8] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
