import { NextRequest, NextResponse } from 'next/server'
import { jwtSign, getFieldsToSign } from 'payload'
import { generatePayloadCookie } from 'payload/shared'
import { getPayloadClient } from '@/lib/payload'

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

  const stateCookie = request.cookies.get('oauth-state')?.value
  if (!stateCookie || stateCookie !== stateParam) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_state_mismatch`)
  }

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_not_configured`)
  }

  try {
    // 1. 액세스 토큰 교환
    const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state: stateParam || '',
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${url.origin}/login?error=token_exchange_failed`)
    }

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string }
    if (tokenData.error || !tokenData.access_token) {
      return NextResponse.redirect(`${url.origin}/login?error=token_exchange_failed`)
    }

    // 2. 사용자 정보 조회
    const userRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!userRes.ok) {
      return NextResponse.redirect(`${url.origin}/login?error=user_info_failed`)
    }

    const userData = await userRes.json() as {
      response?: { id?: string; email?: string; name?: string; nickname?: string }
    }
    const naverUser = userData.response
    if (!naverUser?.email) {
      return NextResponse.redirect(`${url.origin}/login?error=no_email`)
    }

    // 3. Payload Users에서 이메일 매칭
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: naverUser.email } },
      limit: 1,
    })

    let user: any
    if (existing.totalDocs > 0) {
      const found = existing.docs[0] as any
      const updateData: Record<string, unknown> = {}
      if (!found.naverId) updateData.naverId = naverUser.id
      if (!found.name && (naverUser.name || naverUser.nickname)) updateData.name = naverUser.name || naverUser.nickname
      if (found.mustResetPassword) updateData.mustResetPassword = false

      if (Object.keys(updateData).length > 0) {
        user = await payload.update({ collection: 'users', id: found.id, data: updateData })
      } else {
        user = found
      }
    } else {
      const tempPassword = Array.from({ length: 24 }, () =>
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'.charAt(
          Math.floor(Math.random() * 70),
        ),
      ).join('')
      user = await payload.create({
        collection: 'users',
        data: {
          email: naverUser.email,
          password: tempPassword,
          name: naverUser.name || naverUser.nickname || '',
          role: 'user',
          naverId: naverUser.id,
          mustResetPassword: false,
        },
      })
    }

    // 4. JWT 직접 발급 (Payload 내부 헬퍼 사용, 비번 검증 우회)
    // useSessions: false → sessions DB 저장 불필요, JWT signature만으로 인증
    const collectionConfig = payload.collections['users'].config as any

    const fieldsToSignArgs: Record<string, unknown> = {
      collectionConfig,
      email: naverUser.email,
      user,
    }

    const fieldsToSign = getFieldsToSign(fieldsToSignArgs as any)
    const { token } = await jwtSign({
      fieldsToSign,
      secret: payload.secret,
      tokenExpiration: collectionConfig.auth.tokenExpiration,
    })

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
    response.cookies.set({
      name: cookieObj.name,
      value: cookieObj.value,
      httpOnly: true,
      path: cookieObj.path || '/',
      sameSite: (cookieObj.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none') || 'lax',
      secure: true,
      ...(cookieObj.domain ? { domain: cookieObj.domain } : {}),
      ...(cookieObj.expires ? { expires: new Date(cookieObj.expires) } : {}),
    })
    response.cookies.delete('oauth-state')
    return response
  } catch (err) {
    console.error('[NAVER_CALLBACK] 실패:', (err as Error)?.message, (err as Error)?.stack)
    return NextResponse.redirect(`${url.origin}/login?error=oauth_failed`)
  }
}
