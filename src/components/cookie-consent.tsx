'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // admin/manager 페이지에서는 표시 안 함
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/manager')) {
      return
    }
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setShow(true)
  }, [pathname])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-line shadow-lg p-4 md:p-5">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-body text-sm leading-relaxed text-center sm:text-left">
          AI놀자는 서비스 개선과 사용자 경험 향상을 위해 쿠키를 사용합니다. 사이트를 계속 이용하시면 쿠키 사용에 동의하는 것으로 간주됩니다.
        </p>
        <button
          onClick={accept}
          className="px-6 py-2 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-all shrink-0"
        >
          동의합니다
        </button>
      </div>
    </div>
  )
}
