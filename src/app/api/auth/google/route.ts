import { NextRequest, NextResponse } from 'next/server'

// Google OAuth 시작 - 사용자를 Google 로그인 페이지로 리다이렉트
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 })
  }

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/google/callback`

  // CSRF 방지용 state
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  const response = NextResponse.redirect(googleAuthUrl)
  // state를 쿠키에 저장 (콜백에서 검증)
  response.cookies.set('oauth-state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600, // 10분
  })
  return response
}
