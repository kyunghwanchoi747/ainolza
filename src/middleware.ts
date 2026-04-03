import { NextRequest, NextResponse } from 'next/server'

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

  // /manager → 관리자 전용 (쿠키에 JWT 없으면 로그인 페이지로)
  if (pathname.startsWith('/manager')) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
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
