import { NextRequest, NextResponse } from 'next/server'

// 임시 디버그 — 미들웨어와 동일한 검증 로직을 API에서 실행해 비교
// (TODO: 검증 후 삭제)
function base64UrlDecode(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function verifyJwtHS256(token: string, secret: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, reason: 'parts!=3', parts: parts.length }
  const [headerB64, payloadB64, sigB64] = parts

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  const data = enc.encode(`${headerB64}.${payloadB64}`)
  const sigBytes = base64UrlDecode(sigB64)
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, data)
  if (!valid) {
    return {
      ok: false,
      reason: 'signature_invalid',
      sigLen: sigBytes.length,
      dataLen: data.length,
    }
  }

  const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64))
  const payload = JSON.parse(payloadJson)
  return { ok: true, payload }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const secret = process.env.PAYLOAD_SECRET || ''

  const result: any = {
    hasToken: !!token,
    tokenLen: token?.length,
    hasSecret: !!secret,
    secretLen: secret.length,
    secretFirst3: secret.substring(0, 3),
  }

  if (token && secret) {
    try {
      result.verify = await verifyJwtHS256(token, secret)
    } catch (e) {
      result.verifyError = (e as Error).message
    }
  }

  return NextResponse.json(result)
}
