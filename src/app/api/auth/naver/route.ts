import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.NAVER_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'NAVER_CLIENT_ID not configured' }, { status: 500 })
  }

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/naver/callback`
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })

  const response = NextResponse.redirect(`https://nid.naver.com/oauth2.0/authorize?${params.toString()}`)
  response.cookies.set('oauth-state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  })
  return response
}
