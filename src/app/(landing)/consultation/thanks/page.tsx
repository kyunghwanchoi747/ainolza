import Link from 'next/link'
import type { Metadata } from 'next'
import { V3Header } from '@/components/landing/v3-header'
import './thanks.css'

export const metadata: Metadata = {
  title: '상담 신청이 접수되었습니다 | AI놀자',
  description: '1:1 온라인 클래스 상담 신청이 정상 접수되었습니다. 진단 후 개별 연락드리겠습니다.',
}

const KAKAO_OPEN_CHAT = 'https://open.kakao.com/o/s7kkWTfh'

export default function ConsultationThanksPage() {
  return (
    <div className="thanksRoot">
      <V3Header />

      {/* 1. 메인 메시지 — 진정성 있는 감사 인사 */}
      <section className="thanksHero">
        <div className="thanksContainer">
          <div className="thanksCheckBadge">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </div>
          <p className="thanksEyebrow">CONSULTATION RECEIVED</p>
          <h1 className="thanksTitle">신청서가 정상 접수되었습니다</h1>
          <p className="thanksLead">
            긴 신청서를 작성하시느라 정말 고생 많으셨습니다.<br />
            적어주신 이 글이 단순한 텍스트로 끝나지 않고
            <br />
            <strong>대표님의 삶을 바꾸는 강력한 실행의 첫걸음</strong>이 될 수 있도록 꼼꼼히 분석하겠습니다.
          </p>
          <p className="thanksLeadSub">
            진단이 완료되는 대로 기재해 주신 연락처를 통해<br />
            개별 상담 일정을 안내해 드리겠습니다. 감사합니다.
          </p>
          <div className="thanksNotice">
            ※ 신청자가 많을 경우, 제가 온전히 집중할 수 있는 인원 제한으로<br />
            부득이하게 반려될 수 있는 점 양해 부탁드립니다.
          </div>
        </div>
      </section>

      {/* 2. 콘텐츠 추천 — 상담 전 읽으시면 깊이가 달라집니다 */}
      <section className="thanksSection">
        <div className="thanksContainer">
          <p className="sectionEyebrow"><span className="line"></span> BEFORE WE TALK</p>
          <h2 className="sectionTitle">
            상담을 기다리시는 동안<br />
            <span className="grad">제가 가진 관점을 먼저 확인해 주세요</span>
          </h2>
          <p className="sectionLead">
            저의 비즈니스 철학과 AI를 바라보는 관점을 미리 읽어보시면<br />
            상담이 <strong>훨씬 더 깊이 있게</strong> 진행됩니다.
          </p>

          <div className="bookGrid">
            {/* 책 1: 불편한 AI */}
            <article className="bookCard">
              <div className="bookImageWrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing-v3/book-uneasy-ai.png" alt="불편한 AI" />
              </div>
              <div className="bookBody">
                <span className="bookTagB">필독서</span>
                <h3 className="bookName">『불편한 AI』</h3>
                <p className="bookSummary">
                  AI는 더 이상 선택이 아닙니다. 그러나 모두가 똑같이 사용해서는 결과가 같을 수 없습니다.
                  <br /><br />
                  <strong>&ldquo;편한 AI&rdquo;는 답을 주지만, &ldquo;불편한 AI&rdquo;는 질문을 던집니다.</strong>
                  <br />
                  진짜 변화를 만들고 싶다면, 익숙함에서 벗어나 AI에게 제대로 된 질문을 던질 줄 알아야 합니다.
                  중장년 세대를 위한 AI 리터러시의 시작점이 되어줄 책입니다.
                </p>
                <div className="bookActions">
                  <Link href="/store/uncomfortable-ai" className="bookBtnPrimary">
                    종이책 구매하기
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/store/uncomfortable-ai-ebook" className="bookBtnSecondary">
                    전자책 보기
                  </Link>
                </div>
              </div>
            </article>

            {/* 책 2: 퍼스널 인텔리전스 */}
            <article className="bookCard">
              <div className="bookImageWrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing-v3/book-personal-intelligence.png" alt="퍼스널 인텔리전스" />
              </div>
              <div className="bookBody">
                <span className="bookTagB">2026 신간</span>
                <h3 className="bookName">『퍼스널 인텔리전스』</h3>
                <p className="bookSummary">
                  AI를 단순한 도구로 보는 시대는 끝났습니다. 이제는 <strong>나만의 지식 시스템</strong>을 만들어야 합니다.
                  <br /><br />
                  구글 워크스페이스와 NotebookLM을 활용해, 흩어진 정보가 살아있는 인사이트로 변하는 과정을 다룬 책.
                  지속 가능한 1인 비즈니스의 토대를 세우는 실전 가이드입니다.
                </p>
                <div className="bookActions">
                  <Link href="/store/personal-intelligence" className="bookBtnPrimary">
                    전자책 구매하기
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. 다음 행동 카드 — AI 실험실 체험 / 강의 둘러보기 / 카카오 문의 */}
      <section className="thanksSection thanksSectionAlt">
        <div className="thanksContainer">
          <p className="sectionEyebrow"><span className="line"></span> NEXT STEP</p>
          <h2 className="sectionTitle">
            기다리는 시간을<br />
            <span className="grad">가장 가치 있게 보내는 법</span>
          </h2>
          <p className="sectionLead">
            상담 전, 직접 체험해 보세요. 제가 어떤 도구를 만들고 어떤 강의를 운영하는지 알게 됩니다.
          </p>

          <div className="nextGrid">
            <Link className="nextCard nextCard1" href="/labs">
              <div className="nextIcon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>
              </div>
              <h3>AI 실험실 체험</h3>
              <p>제가 직접 만든 7가지 AI 실험. 한 번의 클릭으로 시작.</p>
              <span className="nextLink">시작하기 →</span>
            </Link>

            <Link className="nextCard nextCard2" href="/store">
              <div className="nextIcon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></svg>
              </div>
              <h3>강의 둘러보기</h3>
              <p>바이브 코딩 입문·심화. 실전 중심으로 짜여진 커리큘럼.</p>
              <span className="nextLink">강의 보기 →</span>
            </Link>

            <a className="nextCard nextCard3" href={KAKAO_OPEN_CHAT} target="_blank" rel="noopener noreferrer">
              <div className="nextIcon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.88 5.37 4.7 6.78l-.98 3.6c-.1.38.32.68.66.47L10.62 19.3c.45.04.91.07 1.38.07 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" /></svg>
              </div>
              <h3>카카오톡 문의</h3>
              <p>급히 상담하실 일이 있으시면 카카오톡 오픈채팅으로.</p>
              <span className="nextLink">대화 시작하기 →</span>
            </a>
          </div>

          <div className="thanksHomeCta">
            <Link href="/" className="thanksHomeBtn">
              ← AI놀자 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
