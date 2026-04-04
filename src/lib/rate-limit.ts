// 간단한 인메모리 Rate Limiter
// Cloudflare Workers 환경에서는 인스턴스 간 공유 안 되지만 기본 방어로 충분

const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = requests.get(identifier)

  if (!entry || now > entry.resetAt) {
    requests.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

// IP 추출 헬퍼
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown'
  return forwarded.split(',')[0].trim()
}
