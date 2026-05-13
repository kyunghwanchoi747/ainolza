'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * 추천 코드 추적기.
 * URL에 ?ref=CODE 가 있으면:
 *  1) 30일짜리 쿠키 'ainolza_ref'에 저장 (브라우저 어디서든 결제 시까지 유지)
 *  2) 로그인 회원이면 /api/referrals/claim 호출하여 10% 쿠폰 자동 발급
 *
 * 어느 페이지든 마운트만 시키면 동작. 보통 layout 또는 메인 진입 페이지.
 */
export function ReferralTracker(): null {
  const sp = useSearchParams()

  useEffect(() => {
    const ref = sp.get('ref')
    if (!ref) return
    const code = ref.trim().toUpperCase()
    if (!/^[A-Z0-9]{3,12}$/.test(code)) return

    // 쿠키 저장 (30일)
    try {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `ainolza_ref=${encodeURIComponent(code)}; path=/; expires=${expires}; SameSite=Lax`
    } catch {
      // ignore
    }

    // 로그인 회원이면 쿠폰 발급. 비로그인이면 401 — 클라이언트는 무시하고 쿠키만 둠.
    fetch('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    }).catch(() => {
      // 실패해도 사용자 흐름은 방해하지 않음
    })
  }, [sp])

  return null
}
