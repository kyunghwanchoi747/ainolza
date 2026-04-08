import { NextRequest, NextResponse } from 'next/server'
import { jwtSign, getFieldsToSign } from 'payload'
import { generatePayloadCookie } from 'payload/shared'
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

    // 3. Payload Users에서 같은 이메일 찾기 (없으면 생성)
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: googleUser.email } },
      limit: 1,
    })

    let user: any
    if (existing.totalDocs > 0) {
      // 기존 회원 → googleId만 갱신, password는 절대 건드리지 않음
      const found = existing.docs[0] as any
      const updateData: Record<string, unknown> = {}
      if (!found.googleId) updateData.googleId = googleUser.id
      if (!found.name && googleUser.name) updateData.name = googleUser.name

      if (Object.keys(updateData).length > 0) {
        user = await payload.update({
          collection: 'users',
          id: found.id,
          data: updateData,
        })
      } else {
        user = found
      }
    } else {
      // 신규 회원 자동 생성 (랜덤 비번 부여, mustResetPassword=false)
      const tempPassword = generateTempPassword()
      user = await payload.create({
        collection: 'users',
        data: {
          email: googleUser.email,
          password: tempPassword,
          name: googleUser.name || '',
          role: 'user',
          googleId: googleUser.id,
          mustResetPassword: false,
        },
      })
    }

    // 4. JWT 직접 발급 (Payload 내부 헬퍼 사용, 비번 검증 우회)
    const collectionConfig = payload.collections['users'].config as any
    const useSessions = collectionConfig.auth?.useSessions !== false

    let sid: string | undefined
    if (useSessions) {
      // sessions 필드는 access.update가 false로 잠겨있어 payload.update로는 못 바꿈.
      // payload.db.updateOne으로 ORM/field-access 우회해서 직접 갱신.
      sid = crypto.randomUUID()
      const now = new Date()
      const expiresAt = new Date(
        now.getTime() + (collectionConfig.auth.tokenExpiration ?? 7200) * 1000,
      )
      const newSession = { id: sid, createdAt: now, expiresAt }
      const existingSessions = Array.isArray(user.sessions) ? user.sessions : []
      const validSessions = existingSessions.filter((s: any) => {
        const exp = s.expiresAt instanceof Date ? s.expiresAt : new Date(s.expiresAt)
        return exp > now
      })
      validSessions.push(newSession)

      // updatedAt 자동 갱신 방지를 위해 null (Payload의 addSessionToUser와 동일 패턴)
      const updateData = { ...user, sessions: validSessions, updatedAt: null }
      await (payload as any).db.updateOne({
        id: user.id,
        collection: 'users',
        data: updateData,
        returning: false,
      })
    }

    const fieldsToSignArgs: Record<string, unknown> = {
      collectionConfig,
      email: googleUser.email,
      user,
    }
    if (sid) fieldsToSignArgs.sid = sid

    const fieldsToSign = getFieldsToSign(fieldsToSignArgs as any)
    const { token } = await jwtSign({
      fieldsToSign,
      secret: payload.secret,
      tokenExpiration: collectionConfig.auth.tokenExpiration,
    })

    // Payload 표준 쿠키 객체 (returnCookieAsObject: true)
    const cookieObj = generatePayloadCookie({
      collectionAuthConfig: collectionConfig.auth,
      cookiePrefix: payload.config.cookiePrefix || 'payload',
      returnCookieAsObject: true,
      token,
    }) as {
      name: string
      value: string
      domain?: string
      expires?: string
      httpOnly?: boolean
      path?: string
      sameSite?: 'Lax' | 'None' | 'Strict'
      secure?: boolean
    }

    const response = NextResponse.redirect(`${url.origin}/`)
    // NextResponse.cookies.set으로 설정 (raw header 설정은 Workers에서 무시될 수 있음)
    response.cookies.set({
      name: cookieObj.name,
      value: cookieObj.value,
      httpOnly: true,
      path: cookieObj.path || '/',
      sameSite: (cookieObj.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none') || 'lax',
      secure: true, // ainolza.kr은 항상 HTTPS
      ...(cookieObj.domain ? { domain: cookieObj.domain } : {}),
      ...(cookieObj.expires ? { expires: new Date(cookieObj.expires) } : {}),
    })
    response.cookies.delete('oauth-state')
    return response
  } catch (err) {
    const e = err as Error
    console.error('[GOOGLE_CALLBACK] 실패:', e?.message, e?.stack)
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
