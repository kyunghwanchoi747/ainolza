import { NextRequest, NextResponse } from 'next/server'

/**
 * base64url → Uint8Array (JWT 표준은 padding 없는 base64url)
 */
function base64UrlDecode(input: string): Uint8Array {
  // base64url → base64
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  // padding 추가
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/**
 * 네이티브 Web Crypto API로 HS256 JWT 검증
 */
async function verifyJwtHS256(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
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
    if (!valid) return null

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64))
    const payload = JSON.parse(payloadJson) as Record<string, unknown>

    const exp = payload.exp as number | undefined
    if (exp && Date.now() / 1000 > exp) return null

    return payload
  } catch {
    return null
  }
}

interface NavItem {
  label: string
  path: string
  type: string
  customPageSlug?: string
  enabled: boolean
  order: number
}

interface SiteConfig {
  navigation: NavItem[]
  homePath: string
}

// Type → internal route mapping
const TYPE_TO_INTERNAL: Record<string, string> = {
  home: '/',
  store: '/store',
  community: '/community',
  programs: '/programs',
}

// In-memory cache for settings
let cachedConfig: SiteConfig | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60_000 // 60 seconds

const DEFAULT_CONFIG: SiteConfig = {
  navigation: [
    { label: '홈', path: '/home', type: 'home', enabled: true, order: 0 },
    { label: '스토어', path: '/store', type: 'store', enabled: true, order: 1 },
    { label: '커뮤니티', path: '/community', type: 'community', enabled: true, order: 2 },
    { label: '프로그램', path: '/programs', type: 'programs', enabled: true, order: 3 },
  ],
  homePath: '/home',
}

async function getConfig(request: NextRequest): Promise<SiteConfig> {
  const now = Date.now()
  if (cachedConfig && now - cacheTimestamp < CACHE_TTL) {
    return cachedConfig
  }

  try {
    const origin = request.nextUrl.origin
    const res = await fetch(`${origin}/api/site-config`, {
      headers: { 'x-middleware-internal': '1' },
    })
    if (res.ok) {
      cachedConfig = await res.json()
      cacheTimestamp = now
      return cachedConfig!
    }
  } catch {
    // Fallback to default
  }

  return DEFAULT_CONFIG
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip internal, API, admin, static routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // /manager → 관리자 전용 (JWT 검증 + role==='admin' 필수)
  if (pathname.startsWith('/manager')) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login?reason=no_token', request.url))
    }

    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      return NextResponse.redirect(new URL('/login?reason=no_secret', request.url))
    }

    const payload = await verifyJwtHS256(token, secret)
    if (!payload) {
      return NextResponse.redirect(new URL('/login?reason=verify_failed', request.url))
    }

    const role = payload.role as string | undefined
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/?error=admin_only&role=' + (role || 'none'), request.url))
    }
    return NextResponse.next()
  }

  // /mypage → 로그인 필수
  if (pathname.startsWith('/mypage')) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  const config = await getConfig(request)
  const enabledNav = config.navigation.filter((n) => n.enabled)

  // Redirect root to home path
  if (pathname === '/') {
    const homePath = config.homePath || '/home'
    if (homePath !== '/') {
      return NextResponse.redirect(new URL(homePath, request.url))
    }
    return NextResponse.next()
  }

  // Find matching nav item by path prefix
  // Sort by path length descending to match most specific first
  const sorted = [...enabledNav].sort((a, b) => b.path.length - a.path.length)

  for (const nav of sorted) {
    const navPath = nav.path
    if (pathname === navPath || pathname.startsWith(navPath + '/')) {
      const internalBase =
        nav.type === 'custom'
          ? `/p/${nav.customPageSlug || ''}`
          : TYPE_TO_INTERNAL[nav.type]

      if (!internalBase) continue

      // If custom path matches the internal path, no rewrite needed
      if (navPath === internalBase) continue

      // Rewrite: replace the custom prefix with the internal prefix
      const rest = pathname.slice(navPath.length) // e.g., "/ai-course" or ""
      const internalPath = internalBase + rest

      return NextResponse.rewrite(new URL(internalPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|admin|_next|favicon).*)'],
}
