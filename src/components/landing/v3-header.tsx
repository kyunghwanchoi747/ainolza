'use client'

import Link from 'next/link'
import './landing-v3.css'

/**
 * V3 디자인의 공용 헤더 (검정 fixed bar)
 * 홈(LandingPageV3)과 /labs 등에서 공통으로 사용
 */
export function V3Header() {
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
            <Link className="loginLink" href="/login">로그인</Link>
            <span className="headerDivider"></span>
            <Link className="signupLink" href="/signup">회원가입</Link>
          </div>
        </div>
      </header>
    </div>
  )
}
