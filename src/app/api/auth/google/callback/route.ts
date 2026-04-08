import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// Google OAuth 콜백
export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const code = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_no_code`)
  }

  // CSRF state 검증
  const stateCookie = request.cookies.get('oauth-state')?.value
  if (!stateCookie || stateCookie !== stateParam) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_state_mismatch`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_not_configured`)
  }

  try {
    // 1. 액세스 토큰 교환
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${url.origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${url.origin}/login?error=token_exchange_failed`)
    }

    const tokenData = await tokenRes.json() as { access_token: string }

    // 2. 사용자 정보 조회
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!userRes.ok) {
      return NextResponse.redirect(`${url.origin}/login?error=user_info_failed`)
    }

    const googleUser = await userRes.json() as {
      id: string
      email: string
      name?: string
      picture?: string
    }

    if (!googleUser.email) {
      return NextResponse.redirect(`${url.origin}/login?error=no_email`)
    }

    // 3. Payload Users에서 같은 이메일 찾기
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: googleUser.email } },
      limit: 1,
    })

    let userId: string | number
    let userPassword: string

    if (existing.totalDocs > 0) {
      // 기존 회원 → googleId 업데이트
      const user = existing.docs[0] as any
      userId = user.id
      // 임시 비밀번호 생성 (로그인용)
      userPassword = generateTempPassword()
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          googleId: googleUser.id,
          name: user.name || googleUser.name,
          password: userPassword,
        },
      })
    } else {
      // 신규 회원 자동 생성
      userPassword = generateTempPassword()
      const created = await payload.create({
        collection: 'users',
        data: {
          email: googleUser.email,
          password: userPassword,
          name: googleUser.name || '',
          role: 'user',
          googleId: googleUser.id,
          mustResetPassword: false,
        },
      })
      userId = created.id
    }

    // 4. Payload 로그인 (JWT 발급)
    const loginRes = await fetch(`${url.origin}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: googleUser.email, password: userPassword }),
    })

    if (!loginRes.ok) {
      return NextResponse.redirect(`${url.origin}/login?error=login_failed`)
    }

    // 로그인 성공 → 쿠키 설정
    const setCookieHeader = loginRes.headers.get('set-cookie')
    const response = NextResponse.redirect(`${url.origin}/`)
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    }
    response.cookies.delete('oauth-state')
    return response
  } catch {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_failed`)
  }
}

function generateTempPassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
  let result = ''
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
