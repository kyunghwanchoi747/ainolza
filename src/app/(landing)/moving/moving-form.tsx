'use client'
import { useRef, useState, type FormEvent } from 'react'

export default function MovingForm() {
  const [busy,setBusy] = useState(false)
  const [done,setDone] = useState(false)
  const [error,setError] = useState('')
  const lock = useRef(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(lock.current) return
    lock.current=true; setBusy(true); setError('')
    const form = new FormData(e.currentTarget)
    try {
      const body = Object.fromEntries(form.entries())
      const response = await fetch('/api/moving-inquiry', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      const result = await response.json() as {ok?:boolean;error?:string}
      if(!response.ok || !result.ok) throw new Error(result.error || '접수하지 못했습니다. 다시 시도해주세요.')
      setDone(true)
      const w = window as typeof window & {gtag?:(...args:unknown[])=>void}
      w.gtag?.('event','generate_lead',{service:'moving',method:'website_form'})
    } catch(err) {setError(err instanceof Error ? err.message : '접수하지 못했습니다. 다시 시도해주세요.')} finally {setBusy(false);lock.current=false}
  }
  if(done) return <div className="mv-success" role="status"><h3>제작 신청이 접수되었습니다.</h3><p>남겨주신 연락처로 제작 조건을 안내드리겠습니다.<br/>아직 계약이나 결제가 이루어진 것은 아닙니다.</p></div>
  return <form className="mv-form" onSubmit={submit}>
    <div className="mv-two mv-grid"><label>업체명<input name="company" required maxLength={80} autoComplete="organization"/></label><label>담당자 이름<input name="name" required maxLength={50} autoComplete="name"/></label><label>연락처<input name="phone" type="tel" required maxLength={20} autoComplete="tel"/></label><label>이메일<input name="email" type="email" required maxLength={120} autoComplete="email"/></label><label>운영 지역<input name="region" required maxLength={80}/></label><label>희망 착수 시기<select name="timing" required defaultValue=""><option value="" disabled>선택해주세요</option><option>2주 이내</option><option>1개월 이내</option><option>2개월 이내</option><option>일정 협의</option></select></label></div>
    <label>업종<select name="business" required defaultValue=""><option value="" disabled>선택해주세요</option><option>이사</option><option>용달</option><option>이사·용달 겸업</option></select></label>
    <label>확인하고 싶은 내용 (선택)<textarea name="message" maxLength={1000} rows={3}/></label>
    <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off"/></div>
    <fieldset><legend>제작 신청 전 확인</legend><label className="mv-check"><input type="checkbox" name="operator" value="yes" required/>이사·용달 업체 운영자 또는 담당자이며, 예약 고객에게 상품을 안내할 수 있습니다.</label><label className="mv-check"><input type="checkbox" name="price" value="yes" required/>제작비 165만원과 월 관리비 5만5천원(VAT 포함)을 확인했고, 조건이 맞으면 계약을 검토하겠습니다.</label><label className="mv-check"><input type="checkbox" name="responsibility" value="yes" required/>상품 구매비는 별도이며, 상품 준비·배송·반품·고객 응대는 업체가 맡는 것을 확인했습니다.</label></fieldset>
    <details className="mv-consent"><summary>개인정보 수집·이용 안내</summary><p>수집 주체: AI놀자. 항목: 업체명, 담당자 이름, 연락처, 이메일, 지역, 업종, 희망 시기, 문의 내용 및 동의 기록. 목적: 제작 신청 확인과 계약 전 상담. 상담 목적 달성 또는 철회 요청 시 파기하며, 계약으로 이어지는 정보는 계약 시 안내하는 보유 기준을 적용합니다. 동의를 거부할 수 있으나 이 경우 온라인 신청은 제한됩니다. 별도 광고성 메시지 수신에 동의하는 것은 아닙니다.</p></details>
    <label className="mv-check"><input type="checkbox" name="privacy" value="yes" required/>위 개인정보 수집·이용에 동의합니다.</label>
    {error && <p role="alert" className="mv-error">{error}</p>}
    <button className="mv-button" disabled={busy} type="submit">{busy?'접수 중…':'가격·구성 확인 후 제작 신청'} <span>↗</span></button><p className="mv-small">신청만으로 결제되지 않습니다. 계약 조건 확인 후 진행합니다.</p>
  </form>
}
