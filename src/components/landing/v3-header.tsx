'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import './landing-v3.css'

/**
 * V3 디자인의 공용 헤더 (검정 fixed bar)
 * 홈, /labs, /tools, /contact, /store 등에서 공통 사용
 * 로그인 상태에 따라 "로그인/회원가입" 또는 "내 이름/로그아웃" 표시
 */
export function V3Header() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = '/'
  }

  const displayName = user ? (user.name || user.email.split('@')[0]) : ''

  return (
    <div className="landingV3Root" style={{ position: 'static', height: 0 }}>
      <header className="header">
        <div className="headerInner">
          <Link className="logo" href="/">AI놀자</Link>
          <nav className="nav">
            <Link href="/store">강의/책</Link>
            <Link href="/labs">AI실험실</Link>
            <Link href="/tools">도구</Link>
            <Link href="/contact">문의</Link>
          </nav>
          <div className="headerRight">
            {user ? (
              <>
                <Link className="loginLink" href="/mypage">{displayName}님</Link>
                <span className="headerDivider"></span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="signupLink"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link className="loginLink" href="/login">로그인</Link>
                <span className="headerDivider"></span>
                <Link className="signupLink" href="/signup">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
