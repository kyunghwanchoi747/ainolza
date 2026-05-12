import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { requireAdmin } from '@/lib/auth'
import {
  sendPaymentCompletedToBuyer,
  sendPaymentCompletedToAdmin,
  sendAdvancedClassGroupChat,
} from '@/lib/email-templates'

/**
 * 매니저 전용 — 결제완료 메일 재발송.
 * verify 누락 등으로 자동 발송이 안 된 주문에 사용.
 *
 * POST { orderNumbers: string[] }  또는  { orderIds: number[] }
 *  → 각 주문에 대해 구매자 결제완료 메일 + 관리자 알림 메일 + (해당 시) 심화반 단톡방 안내
 *
 * 동작 조건: 주문 status='paid' 인 것만. 그 외 상태는 skip.
 */
export async function POST(request: NextRequest) {
  // 매니저 인증 OR CRON_KEY 인증 — 운영 자동화/긴급 복구용
  const url = new URL(request.url)
  const providedKey = url.searchParams.get('key') || request.headers.get('x-cron-key') || ''
  const expectedKey = process.env.CRON_KEY || ''
  const hasCronAuth = expectedKey && providedKey === expectedKey
  if (!hasCronAuth) {
    const adminCheck = await requireAdmin(request)
    if (adminCheck) return adminCheck
  }

  try {
    const body = (await request.json()) as { orderNumbers?: string[]; orderIds?: number[] }
    const orderNumbers = (body.orderNumbers || []).filter(Boolean)
    const orderIds = (body.orderIds || []).filter((n) => typeof n === 'number')

    if (orderNumbers.length === 0 && orderIds.length === 0) {
      return NextResponse.json({ error: 'orderNumbers 또는 orderIds 필요' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const sent: string[] = []
    const skipped: { orderNumber: string; reason: string }[] = []
    const failed: { orderNumber: string; error: string }[] = []

    const targets: any[] = []
    if (orderIds.length > 0) {
      for (const id of orderIds) {
        try {
          const o = await payload.findByID({ collection: 'orders', id, overrideAccess: true })
          targets.push(o)
        } catch {
          failed.push({ orderNumber: `id:${id}`, error: 'not found' })
        }
      }
    }
    if (orderNumbers.length > 0) {
      const res = await payload.find({
        collection: 'orders',
        where: { orderNumber: { in: orderNumbers } },
        limit: 100,
        depth: 0,
        overrideAccess: true,
      })
      for (const o of res.docs) targets.push(o)
    }

    for (const order of targets as any[]) {
      if (order.status !== 'paid' && order.status !== 'active' && order.status !== 'completed') {
        skipped.push({ orderNumber: order.orderNumber, reason: `status=${order.status}` })
        continue
      }
      try {
        await sendPaymentCompletedToBuyer(payload, {
          orderNumber: order.orderNumber,
          buyerName: order.buyerName,
          buyerEmail: order.buyerEmail,
          productName: order.productName,
          productType: order.productType,
          productSlug: order.productSlug,
          amount: order.amount,
          classrooms: Array.isArray(order.classrooms) ? order.classrooms : [],
          shippingRecipient: order.shippingRecipient,
          shippingAddress: order.shippingAddress,
          shippingAddressDetail: order.shippingAddressDetail,
          shippingZipcode: order.shippingZipcode,
        })
        try {
          await sendPaymentCompletedToAdmin(payload, {
            id: order.id,
            orderNumber: order.orderNumber,
            buyerName: order.buyerName,
            buyerEmail: order.buyerEmail,
            productName: order.productName,
            amount: order.amount,
          })
        } catch (e) {
          console.error('[RESEND ADMIN]', (e as Error).message)
        }
        // 심화반 단톡방 안내 (해당 강의실 권한이 있으면)
        const cls = Array.isArray(order.classrooms) ? order.classrooms : []
        if (cls.some((s: string) => typeof s === 'string' && s.startsWith('vibe-coding-advanced'))) {
          try {
            await sendAdvancedClassGroupChat(payload, order)
          } catch (e) {
            console.error('[RESEND 심화반 단톡방]', (e as Error).message)
          }
        }
        sent.push(order.orderNumber)
      } catch (e) {
        failed.push({ orderNumber: order.orderNumber, error: (e as Error).message })
      }
    }

    return NextResponse.json({ ok: true, sent, skipped, failed })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
