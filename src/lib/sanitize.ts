// 기본 XSS 방지 — HTML 태그 제거
export function sanitize(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

// 이메일 형식 검증
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 전화번호 형식 검증
export function isValidPhone(phone: string): boolean {
  if (!phone) return true // 선택 필드
  const numbers = phone.replace(/[^0-9]/g, '')
  return numbers.length >= 10 && numbers.length <= 11
}
