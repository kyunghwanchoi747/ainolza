import { NextRequest, NextResponse } from 'next/server'

// Kakao OAuth 시작 - 사용자를 카카오 로그인 페이지로 리다이렉트
export async function GET(request: NextRequest) {
  const clientId = process.env.KAKAO_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'KAKAO_CLIENT_ID not configured' }, { status: 500 })
  }

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/kakao/callback`

  // CSRF 방지용 state
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'account_email profile_nickname',
    state,
  })

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`

  const response = NextResponse.redirect(kakaoAuthUrl)
  response.cookies.set('oauth-state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  })
  return response
}
