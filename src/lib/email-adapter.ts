import type { EmailAdapter, SendEmailOptions } from 'payload'

type AddressLike = string | { name?: string; address: string } | undefined | null

function toUser(addr: AddressLike): { name?: string; email: string } | undefined {
  if (!addr) return undefined
  if (typeof addr === 'string') {
    // "Name <email@x.com>" 형식 파싱
    const match = addr.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/)
    if (match) return { name: match[1].trim() || undefined, email: match[2].trim() }
    return { email: addr.trim() }
  }
  return { name: addr.name, email: addr.address }
}

function toUsers(addr: any): { name?: string; email: string }[] | undefined {
  if (!addr) return undefined
  const arr = Array.isArray(addr) ? addr : [addr]
  return arr
    .map((a) => toUser(a))
    .filter((u): u is { name?: string; email: string } => !!u)
}

/**
 * Worker-mailer 기반 Payload Email Adapter
 * Cloudflare Workers 환경에서 SMTP 직접 발송 (cloudflare:sockets 사용)
 */
export const workerMailerAdapter: EmailAdapter = () => {
  const host = process.env.SMTP_HOST || 'email-smtp.ap-northeast-2.amazonaws.com'
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const username = process.env.SMTP_USER || ''
  const password = process.env.SMTP_PASS || ''
  const fromEmail = process.env.SMTP_FROM || 'info@ainolza.kr'
  const fromName = process.env.SMTP_FROM_NAME || 'AI놀자'

  return {
    name: 'worker-mailer',
    defaultFromAddress: fromEmail,
    defaultFromName: fromName,
    sendEmail: async (message: SendEmailOptions) => {
      if (!username || !password) {
        throw new Error('SMTP 자격증명이 설정되지 않았습니다 (SMTP_USER / SMTP_PASS)')
      }

      const from = toUser(message.from as AddressLike) || { name: fromName, email: fromEmail }
      const to = toUsers(message.to)
      if (!to || to.length === 0) {
        throw new Error('수신자가 지정되지 않았습니다')
      }

      const subject = (message.subject || '').toString()
      const html = typeof message.html === 'string' ? message.html : undefined
      const text = typeof message.text === 'string' ? message.text : undefined

      // 동적 import (런타임 전용) — Next.js 빌드 단계 평가 회피
      // worker-mailer는 next.config의 serverExternalPackages에 등록됨
      const { WorkerMailer } = await import('worker-mailer')
      await WorkerMailer.send(
        {
          host,
          port,
          credentials: { username, password },
          authType: 'login',
          secure: false,
          startTls: true,
          socketTimeoutMs: 15000,
          responseTimeoutMs: 15000,
        },
        {
          from,
          to: to.length === 1 ? to[0] : to,
          subject,
          html,
          text,
        },
      )
    },
  }
}
