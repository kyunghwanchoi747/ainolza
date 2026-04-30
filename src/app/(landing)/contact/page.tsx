import type { Metadata } from 'next'
import { V3Header } from '@/components/landing/v3-header'
import './contact-v3.css'

export const metadata: Metadata = {
  title: '문의하기 | AI놀자',
  description: 'AI놀자에 궁금한 점을 문의해보세요.',
}

const KAKAO_OPEN_CHAT = 'https://open.kakao.com/o/s7kkWTfh'

export default function ContactPage() {
  return (
    <div className="contactPageRoot">
      <V3Header />

      <section className="contactPageHero">
        <p className="pageEyebrow"><span className="line"></span> CONTACT</p>
        <h1 className="pageTitle"><span className="grad">문의하기</span></h1>
        <p className="pageLead">
          궁금한 점이 있으시면 아래 방법으로 편하게 연락해주세요.<br />
          빠르게 답변드리겠습니다.
        </p>
      </section>

      <section className="contactContainer">
        <div className="contactGrid">
          {/* 카카오톡 카드 */}
          <a
            className="contactCard contactCard--kakao"
            href={KAKAO_OPEN_CHAT}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="contactIcon contactIcon--kakao">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.88 5.37 4.7 6.78l-.98 3.6c-.1.38.32.68.66.47L10.62 19.3c.45.04.91.07 1.38.07 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
              </svg>
            </div>
            <div className="contactBody">
              <h3 className="contactName">카카오톡 오픈채팅</h3>
              <p className="contactDesc">평일·주말 수시 응답<br />가장 빠르게 답변받을 수 있어요</p>
              <span className="contactCTA">대화 시작하기 →</span>
            </div>
          </a>

          {/* 이메일 카드 */}
          <a
            className="contactCard contactCard--email"
            href="mailto:ainolza@naver.com"
          >
            <div className="contactIcon contactIcon--email">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <div className="contactBody">
              <h3 className="contactName">이메일</h3>
              <p className="contactDesc">ainolza@naver.com<br />1~2 영업일 이내 답변</p>
              <span className="contactCTA">메일 보내기 →</span>
            </div>
          </a>
        </div>

        {/* 운영 안내 박스 */}
        <div className="contactNotice">
          <h3 className="noticeTitle">📌 운영 안내</h3>
          <ul className="noticeList">
            <li><strong>카카오톡 오픈채팅</strong> — 평일·주말 수시 응답 (가장 빠릅니다)</li>
            <li><strong>이메일</strong> — 평일 기준 1~2 영업일 이내 답변</li>
            <li><strong>전화 문의</strong> — 070-8028-2616 (평일 09:00~18:00)</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
