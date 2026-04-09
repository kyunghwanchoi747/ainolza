import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

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
      return NextResponse.redirect(new URL('/login?next=' + pathname, request.url))
    }

    // JWT 검증 + role 체크
    try {
      const secret = process.env.PAYLOAD_SECRET
      if (!secret) {
        // 시크릿 미설정 시 안전을 위해 차단
        return NextResponse.redirect(new URL('/login', request.url))
      }
      const secretKey = new TextEncoder().encode(secret)
      const { payload } = await jwtVerify(token, secretKey)
      const role = (payload as { role?: string }).role
      if (role !== 'admin') {
        // 일반 사용자는 홈으로 (로그인 페이지로 보내면 무한 루프 가능)
        return NextResponse.redirect(new URL('/?error=admin_only', request.url))
      }
      return NextResponse.next()
    } catch {
      // JWT 검증 실패 (만료/위조/구버전 토큰) → 로그인 페이지로
      return NextResponse.redirect(new URL('/login?next=' + pathname, request.url))
    }
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
