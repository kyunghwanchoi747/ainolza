import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { sanitize, isValidEmail, isValidPhone } from '@/lib/sanitize'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

// Separate from /api/enroll: no course order, payment email, or membership is created.
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({error:'허용되지 않은 요청입니다.'},{status:403})
  if (!rateLimit(`moving:${getClientIP(request)}`, 3, 60_000).allowed) return NextResponse.json({error:'잠시 후 다시 시도해주세요.'},{status:429})
  let b: Record<string,unknown>
  try { const raw = await request.text(); if(raw.length>8000) return NextResponse.json({error:'입력이 너무 깁니다.'},{status:413}); b=JSON.parse(raw); if(!b || typeof b!=='object' || Array.isArray(b)) throw new Error() } catch {return NextResponse.json({error:'입력을 확인해주세요.'},{status:400})}
  if(b.website || ['operator','price','responsibility','privacy'].some(k=>b[k]!=='yes')) return NextResponse.json({error:'제작 조건과 동의 항목을 확인해주세요.'},{status:400})
  const company=sanitize(b.company), name=sanitize(b.name), email=sanitize(b.email).toLowerCase(), phone=sanitize(b.phone), region=sanitize(b.region), timing=sanitize(b.timing), business=sanitize(b.business), message=sanitize(b.message)
  if(!company || company.length>80 || !name || name.length>50 || !email || email.length>120 || !isValidEmail(email) || !phone || phone.length>20 || !isValidPhone(phone) || !region || region.length>80 || !['이사','용달','이사·용달 겸업'].includes(business) || !['2주 이내','1개월 이내','2개월 이내','일정 협의'].includes(timing) || message.length>1000) return NextResponse.json({error:'필수 항목과 연락처를 확인해주세요.'},{status:400})
  try {
    const payload=await getPayloadClient()
    // Admin-only reads on this existing collection. Fixed slug keeps this separate from course recruitment.
    const existing=await payload.find({collection:'waitlists',where:{and:[{productSlug:{equals:'moving-service'}},{buyerEmail:{equals:email}},{status:{equals:'active'}}]},limit:1,depth:0,overrideAccess:true})
    if(existing.totalDocs) return NextResponse.json({error:'이미 접수된 신청이 있습니다. 기존 문의 채널로 연락해주세요.'},{status:409})
    const created=await payload.create({collection:'waitlists',overrideAccess:true,data:{productSlug:'moving-service',productName:'이사업체 가구 판매 페이지 제작',buyerName:name,buyerEmail:email,buyerPhone:phone,motivation:`업체: ${company}\n업종: ${business}\n지역: ${region}\n착수: ${timing}\n문의: ${message}`,source:'moving-landing',status:'active',adminMemo:`제작 신청. 강의 모집/마케팅 발송 대상 제외. 가격·운영책임·개인정보 동의 ${new Date().toISOString()} / moving-v1 (165만원 + 월 5.5만원, VAT 포함). 상담 목적 달성/철회 시 파기.`}})
    return NextResponse.json({ok:true,id:created.id})
  } catch { return NextResponse.json({error:'신청을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.'},{status:503}) }
}
