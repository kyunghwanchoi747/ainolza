import type { Metadata } from 'next'
import MovingForm from './moving-form'
import { MovingTracker, MovingCtaLink } from './moving-tracker'
import './moving.css'

export const metadata: Metadata = {
  title: '이사 고객에게 가구도 함께 | AI놀자',
  description: '이사·용달 업체를 위한 가구 판매 페이지. 제작비 165만원, 월 관리비 5만5천원. 구성과 운영 조건을 확인하고 제작을 신청하세요.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://ainolza.kr/moving' },
  openGraph: { title: '이사비만 받고 끝내기엔, 고객은 새집에 살 게 많습니다.', description: '이사·용달 업체 전용 가구 판매 페이지 제작 · AI놀자', url: 'https://ainolza.kr/moving', images: [] },
  twitter: { card: 'summary', title: '이사 고객에게 가구도 함께 | AI놀자', images: [] },
}

const steps = [
  ['예약 고객에게 안내', '“새집에 필요한 가구 있으세요?” 준비된 상품 목록을 문자나 카카오톡으로 보내세요.'],
  ['상품과 조건 상담', '고객이 고른 상품과 수량, 가격, 반입 장소와 일정을 함께 확인합니다.'],
  ['주문 확정 후 준비', '구매 비용과 준비 가능한 날짜를 확인하고 상품을 준비합니다.'],
  ['약속한 서비스 제공', '사장님이 제공할 수 있는 배송·반입·배치 범위를 정해 진행합니다.'],
]

export default function MovingPage() {
  return <main className="moving">
    <MovingTracker/>
    <header className="mv-header"><span className="mv-brand">AI놀자<span> BUSINESS</span></span><span>이사·용달 업체 전용</span></header>
    <section className="mv-hero mv-wrap">
      <div><p className="mv-eyebrow">이미 잡힌 이사 한 건에서, 다음 기회를</p><h1>이사비만 받고<br/>끝내기엔,<br/><em>고객은 새집에<br/>살 게 많습니다.</em></h1>
        <p className="mv-lead">식탁, 의자, 수납장.<br/>이사할 때 필요한 새 가구까지 함께 제안해보세요.</p>
        <p>고객에게 보낼 가구 목록부터 주문 문의받는 준비까지,<br/>AI놀자가 만들어드립니다.</p>
        <MovingCtaLink className="mv-button" href="#package">구성과 가격 확인하기 <span>↗</span></MovingCtaLink><p className="mv-small">유료 제작 서비스 · 제작 165만원 / 관리 월 5만5천원 · VAT 포함</p>
      </div>
      <div className="mv-preview" aria-label="고객 안내 및 상품 페이지 제작 예시">
        <span className="mv-tag">이렇게 고객에게 안내합니다 · 제작 예시</span>
        <div className="mv-bubble">사장님, 새집에 놓을 식탁도<br/>같이 준비할 수 있을까요?</div>
        <div className="mv-phone"><div className="mv-phone-head">우리 이사 · 새집 가구 안내</div><div className="mv-room"><div className="mv-table"/><div className="mv-chair"/></div><div className="mv-phone-body"><small>새집에 맞는 가구</small><h3>함께 고르고,<br/>일정에 맞춰 준비하세요.</h3><div className="mv-product"><span>01</span> 식탁과 의자 <b>→</b></div><div className="mv-product"><span>02</span> 작은 공간 수납장 <b>→</b></div><p className="mv-mock-button">상품·배송 조건 문의</p></div></div>
        <p className="mv-small">화면 구성 예시입니다. 실제 판매 상품은 협의해 정합니다.</p>
      </div>
    </section>
    <section className="mv-dark"><div className="mv-wrap"><p className="mv-eyebrow">사장님이 가진 것은 이미 있습니다</p><h2>이사를 앞둔 고객.<br/>물건을 옮기는 경험.<br/><em>이제, 제안할 상품을 더하세요.</em></h2><p className="mv-lead">상품만 소개하는 것으로 끝나지 않습니다. 고객은 필요한 가구와 반입 조건을 한 번에 상담할 수 있습니다.</p><p>배송·배치·조립은 실제 제공할 수 있는 범위로 안내합니다. 별도 작업에 드는 시간과 비용도 판매가격에 반영해야 합니다.</p></div></section>
    <section className="mv-wrap mv-section"><p className="mv-eyebrow">컴퓨터 용어 대신, 실제 일하는 순서로</p><h2>“새집에 필요한 가구 있으세요?”<br/>그 한마디에서 시작합니다.</h2><div className="mv-grid">{steps.map(([title, text], i) => <article className="mv-card" key={title}><span className="mv-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><aside className="mv-note">상품 판매대금 전체가 수익은 아닙니다. 상품 매입비·배송 및 추가 작업비·결제 수수료·반품 비용 등을 빼고 남는 금액을 확인해야 합니다.</aside></section>
    <section id="package" className="mv-package"><div className="mv-wrap"><p className="mv-eyebrow">무엇을 만들어드리나요?</p><h2>처음 안내할 상품부터,<br/>고객이 문의할 곳까지.</h2><div className="mv-price-grid"><article className="mv-price"><p>가구 판매 시작 패키지</p><h3>165<span>만원</span></h3><p>제작비 · VAT 포함</p><ul><li>모바일 업체 소개 + 가구 상품 목록</li><li>첫 상품 5개 상세페이지 등록</li><li>상품·배송 문의 접수 경로</li><li>고객에게 보낼 안내 문구</li><li>운영 교육 1회 + 취합 수정 2회</li></ul><p className="mv-small">공통 디자인 기반 제작. 사용 가능한 상품 사진·정보 제공 기준.</p></article><article className="mv-price mv-price-light"><p>공개 후 유지관리</p><h3>5.5<span>만원 / 월</span></h3><p>사이트 공개일부터 · VAT 포함</p><ul><li>호스팅·SSL 관리</li><li>문의 폼 작동 점검과 백업</li><li>기존 문구·가격·사진 교체 월 2건</li><li>수정 작업 합계 월 30분 이내</li></ul><p className="mv-small">신규 상품 등록, 매일 가격·재고 확인, 고객 응대는 포함되지 않습니다. 제작 오류 수정은 일반 수정 횟수와 구분합니다.</p></article></div><aside className="mv-note"><strong>별도 비용도 먼저 확인하세요.</strong><br/>상품 구매·샘플 촬영·추가 상품 등록·온라인 결제 기능·맞춤 개발·광고 운영은 포함되지 않습니다. 도메인 비용과 이용 한도, 해지·이관 조건, 납기는 계약 전에 서면으로 안내합니다.</aside></div></section>
    <section className="mv-wrap mv-section"><p className="mv-eyebrow">서로 맡을 일을 분명하게</p><h2>판매는 사장님이.<br/>온라인 준비는 AI놀자가.</h2><div className="mv-grid mv-two"><article className="mv-card"><h3>AI놀자가 맡습니다</h3><p>페이지 제작, 합의한 첫 상품 등록, 문의 경로 연결, 고객 안내 문구와 운영 방법 안내.</p></article><article className="mv-card"><h3>사장님이 맡습니다</h3><p>고객 안내, 판매가격 결정, 상품 주문과 비용 부담, 배송·반품·고객 응대. 구체적인 상품 준비 절차는 결제 후 운영 안내에서 전달합니다.</p></article></div><p className="mv-small">독점 공급이나 도매가격, 자동 매출을 보장하는 상품이 아닙니다. 실제 운영할 업체를 위한 제작 서비스입니다.</p></section>
    <section className="mv-wrap mv-section mv-faq"><h2>결정하기 전에 확인하세요.</h2>{[
      ['가구를 판매해본 적이 없어도 되나요?', '이사·용달 업체를 운영하고 고객 안내와 상품 준비·배송을 직접 맡을 수 있다면 적용 조건을 확인할 수 있습니다.'],
      ['컴퓨터를 잘 몰라도 되나요?', '고객에게 상품 목록을 보내는 방법부터 운영에 필요한 작업을 안내합니다. 상품 정보를 계속 대신 등록하는 업무는 별도 협의합니다.'],
      ['신청하면 바로 결제되나요?', '아닙니다. 신청 내용을 확인하고 제작 범위·일정·계약 조건을 안내합니다. 조건에 합의한 뒤 계약과 결제를 진행합니다.'],
      ['제작 후 고객 유입도 맡아주나요?', '기본 상품은 홈페이지와 판매 준비 구축입니다. 광고 운영과 실제 판매는 포함되지 않으며 문의 수나 매출을 보장하지 않습니다.'],
    ].map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <section id="apply" className="mv-apply"><div className="mv-wrap mv-form-wrap"><p className="mv-eyebrow">가격과 운영 조건을 확인하셨다면</p><h2>우리 업체의 제작을<br/>신청하세요.</h2><p>제작비 165만원 · 월 관리비 5만5천원(VAT 포함).<br/>조건이 맞으면 계약을 검토하실 업체의 신청을 받습니다.</p><MovingForm/></div></section>
    <footer className="mv-wrap mv-footer"><strong>AI놀자</strong><p>이사·용달 업체를 위한 가구 판매 페이지 제작</p><a href="/contact">운영자 문의</a><p className="mv-small">주소로 직접 접속하는 광고 전용 안내 페이지입니다.</p></footer>
  </main>
}
